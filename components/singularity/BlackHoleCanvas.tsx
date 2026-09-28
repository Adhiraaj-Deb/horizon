"use client";

import React, { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./BlackHoleShader";

export type QualitySetting = "low" | "medium" | "high" | "ultra";

export interface CameraPreset {
  distance: number;
  theta: number; // elevation in radians
  phi: number;   // azimuth in radians
}

export const CAMERA_PRESETS: Record<string, CameraPreset> = {
  oblique: { distance: 16.5, theta: 0.38, phi: 0.8 },     // Classic 22-degree Interstellar view
  equatorial: { distance: 15.0, theta: 0.05, phi: 0.5 },  // Edge-on view showing maximum Doppler asymmetry & warping
  polar: { distance: 18.0, theta: 1.35, phi: 0.0 },       // Top-down polar view showing circular disk geometry
};

interface BlackHoleCanvasProps {
  mass: number;
  spin: number;
  diskBrightness: number;
  dopplerEnabled: boolean;
  redshiftEnabled: boolean;
  showJets: boolean;
  showGuides: boolean;
  quality: QualitySetting;
  isPlaying: boolean;
  autoRotate: boolean;
  currentPreset?: string;
  onCameraChange?: (theta: number, phi: number, dist: number) => void;
}

export default function BlackHoleCanvas({
  mass,
  spin,
  diskBrightness,
  dopplerEnabled,
  redshiftEnabled,
  showJets,
  showGuides,
  quality,
  isPlaying,
  autoRotate,
  currentPreset,
}: BlackHoleCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const animFrameRef = useRef<number | null>(null);

  // Camera spherical coordinates state (smoothed via lerp in render loop)
  const cameraState = useRef({
    distance: 16.5,
    targetDistance: 16.5,
    theta: 0.38, // elevation angle
    targetTheta: 0.38,
    phi: 0.8,    // azimuth angle
    targetPhi: 0.8,
  });

  // Interaction tracking
  const pointerState = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    touchDist: 0,
  });

  // Quality parameters mapping
  const qualityConfig = {
    low: { steps: 55, dpr: 0.8, turb: 0.7 },
    medium: { steps: 85, dpr: 1.0, turb: 1.0 },
    high: { steps: 115, dpr: 1.25, turb: 1.0 },
    ultra: { steps: 150, dpr: Math.min(2.0, typeof window !== "undefined" ? window.devicePixelRatio : 1.5), turb: 1.2 },
  }[quality];

  // Set camera preset
  const applyPreset = useCallback((presetKey: string) => {
    const preset = CAMERA_PRESETS[presetKey];
    if (preset) {
      cameraState.current.targetDistance = preset.distance;
      cameraState.current.targetTheta = preset.theta;
      cameraState.current.targetPhi = preset.phi;
    }
  }, []);

  useEffect(() => {
    if (currentPreset) {
      applyPreset(currentPreset);
    }
  }, [currentPreset, applyPreset]);

  // Main Three.js Initialization
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Orthographic Camera for Fullscreen Shader Quad
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: false,
      alpha: false,
      stencil: false,
      depth: false,
    });
    renderer.setPixelRatio(qualityConfig.dpr);
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Shader Material with Uniforms
    const uniforms = {
      uResolution: { value: new THREE.Vector2(width * qualityConfig.dpr, height * qualityConfig.dpr) },
      uTime: { value: 0.0 },
      uCameraPos: { value: new THREE.Vector3(0, 5, 15) },
      uCameraMatrix: { value: new THREE.Matrix3() },
      uFov: { value: THREE.MathUtils.degToRad(62) },
      uMass: { value: 1.0 },
      uSpin: { value: spin },
      uDiskBrightness: { value: diskBrightness },
      uDopplerEnabled: { value: dopplerEnabled ? 1.0 : 0.0 },
      uRedshiftEnabled: { value: redshiftEnabled ? 1.0 : 0.0 },
      uShowJets: { value: showJets ? 1.0 : 0.0 },
      uShowGuides: { value: showGuides ? 1.0 : 0.0 },
      uMaxSteps: { value: qualityConfig.steps },
      uDiskTurbulence: { value: qualityConfig.turb },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthWrite: false,
      depthTest: false,
    });
    materialRef.current = material;

    // Full-screen plane geometry
    const geometry = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    // 4. Input Listeners: Pointer / Mouse / Touch
    const dom = renderer.domElement;

    const onPointerDown = (e: MouseEvent) => {
      pointerState.current.isDragging = true;
      pointerState.current.prevX = e.clientX;
      pointerState.current.prevY = e.clientY;
    };

    const onPointerMove = (e: MouseEvent) => {
      if (!pointerState.current.isDragging) return;
      const dx = e.clientX - pointerState.current.prevX;
      const dy = e.clientY - pointerState.current.prevY;
      pointerState.current.prevX = e.clientX;
      pointerState.current.prevY = e.clientY;

      cameraState.current.targetPhi -= dx * 0.006;
      cameraState.current.targetTheta += dy * 0.006;
      // Clamp elevation so camera doesn't flip over poles
      cameraState.current.targetTheta = Math.max(-1.52, Math.min(1.52, cameraState.current.targetTheta));
    };

    const onPointerUp = () => {
      pointerState.current.isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.012;
      cameraState.current.targetDistance = Math.max(
        8.5, // safe distance outside shadow
        Math.min(35.0, cameraState.current.targetDistance + zoomFactor)
      );
    };

    // Touch events for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        pointerState.current.isDragging = true;
        pointerState.current.prevX = e.touches[0].clientX;
        pointerState.current.prevY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pointerState.current.touchDist = Math.hypot(dx, dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && pointerState.current.isDragging) {
        const dx = e.touches[0].clientX - pointerState.current.prevX;
        const dy = e.touches[0].clientY - pointerState.current.prevY;
        pointerState.current.prevX = e.touches[0].clientX;
        pointerState.current.prevY = e.touches[0].clientY;

        cameraState.current.targetPhi -= dx * 0.007;
        cameraState.current.targetTheta += dy * 0.007;
        cameraState.current.targetTheta = Math.max(-1.52, Math.min(1.52, cameraState.current.targetTheta));
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const delta = (pointerState.current.touchDist - dist) * 0.04;
        pointerState.current.touchDist = dist;

        cameraState.current.targetDistance = Math.max(
          8.5,
          Math.min(35.0, cameraState.current.targetDistance + delta)
        );
      }
    };

    const onTouchEnd = () => {
      pointerState.current.isDragging = false;
    };

    dom.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    dom.addEventListener("wheel", onWheel, { passive: false });

    dom.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // 5. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newW = entry.contentRect.width;
        const newH = entry.contentRect.height;
        if (newW > 0 && newH > 0 && rendererRef.current && materialRef.current) {
          rendererRef.current.setSize(newW, newH);
          materialRef.current.uniforms.uResolution.value.set(
            newW * qualityConfig.dpr,
            newH * qualityConfig.dpr
          );
        }
      }
    });
    resizeObserver.observe(container);

    // 6. Animation / Render Loop
    let accumulatedTime = 0;

    const animate = () => {
      const delta = clockRef.current.getDelta();

      if (isPlaying) {
        accumulatedTime += delta;
      }

      // Auto-rotation around black hole
      if (autoRotate && !pointerState.current.isDragging) {
        cameraState.current.targetPhi += delta * 0.08;
      }

      // Smooth camera interpolation (inertial damping)
      const lerpSpeed = 0.08;
      cameraState.current.distance += (cameraState.current.targetDistance - cameraState.current.distance) * lerpSpeed;
      cameraState.current.theta += (cameraState.current.targetTheta - cameraState.current.theta) * lerpSpeed;
      cameraState.current.phi += (cameraState.current.targetPhi - cameraState.current.phi) * lerpSpeed;

      // Compute camera 3D Cartesian coordinates from spherical (distance, theta, phi)
      const dist = cameraState.current.distance;
      const th = cameraState.current.theta;
      const ph = cameraState.current.phi;

      const camX = dist * Math.cos(th) * Math.sin(ph);
      const camY = dist * Math.sin(th);
      const camZ = dist * Math.cos(th) * Math.cos(ph);

      const camPos = new THREE.Vector3(camX, camY, camZ);
      const targetPos = new THREE.Vector3(0, 0, 0);

      // Camera view matrix basis [Right, Up, Forward]
      const forward = new THREE.Vector3().subVectors(targetPos, camPos).normalize();
      const worldUp = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3().crossVectors(forward, worldUp).normalize();
      const up = new THREE.Vector3().crossVectors(right, forward).normalize();

      const camMatrix = new THREE.Matrix3();
      camMatrix.set(
        right.x, up.x, forward.x,
        right.y, up.y, forward.y,
        right.z, up.z, forward.z
      );

      // Update shader uniforms
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = accumulatedTime;
        materialRef.current.uniforms.uCameraPos.value.copy(camPos);
        materialRef.current.uniforms.uCameraMatrix.value.copy(camMatrix);
      }

      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, camera);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();

      dom.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      dom.removeEventListener("wheel", onWheel);

      dom.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [qualityConfig.dpr, qualityConfig.steps, qualityConfig.turb]);

  // Update dynamic uniforms on prop changes
  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uSpin.value = spin;
    materialRef.current.uniforms.uDiskBrightness.value = diskBrightness;
    materialRef.current.uniforms.uDopplerEnabled.value = dopplerEnabled ? 1.0 : 0.0;
    materialRef.current.uniforms.uRedshiftEnabled.value = redshiftEnabled ? 1.0 : 0.0;
    materialRef.current.uniforms.uShowJets.value = showJets ? 1.0 : 0.0;
    materialRef.current.uniforms.uShowGuides.value = showGuides ? 1.0 : 0.0;
    materialRef.current.uniforms.uMaxSteps.value = qualityConfig.steps;
    materialRef.current.uniforms.uDiskTurbulence.value = qualityConfig.turb;
  }, [
    spin,
    diskBrightness,
    dopplerEnabled,
    redshiftEnabled,
    showJets,
    showGuides,
    qualityConfig.steps,
    qualityConfig.turb,
  ]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
    />
  );
}
