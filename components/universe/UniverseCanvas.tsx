"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  CosmicParticlesVertexShader,
  CosmicParticlesFragmentShader,
  generateCosmicParticleGeometry,
} from "./CosmicParticlesShader";
import { SolarSystemController } from "./SolarSystemMesh";
import { COSMIC_EPOCHS, CosmicEpoch } from "./timelineData";

interface UniverseCanvasProps {
  progress: number; // smoothly lerped 0.0 -> 1.0
  onProgressTick?: (currentProgress: number, activeEpoch: CosmicEpoch) => void;
}

export default function UniverseCanvas({ progress, onProgressTick }: UniverseCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect mobile or low power
    const isMobile = window.innerWidth < 768;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2.0);
    const particleCount = isMobile ? 35000 : 80000;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000002, 0.008);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 50);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      powerPreference: "high-performance",
      alpha: true,
      stencil: false,
      depth: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(pixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Lighting for 3D meshes (Solar System / Earth)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const sunLight = new THREE.PointLight(0xfff8eb, 2.5, 100);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // 1. Massive GPU Cosmic Particles
    const particleGeo = generateCosmicParticleGeometry(particleCount);
    const particleMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uProgress: { value: 0.0 },
        uTime: { value: 0.0 },
        uPixelRatio: { value: pixelRatio },
        uBaseSize: { value: isMobile ? 1.4 : 1.8 },
      },
      vertexShader: CosmicParticlesVertexShader,
      fragmentShader: CosmicParticlesFragmentShader,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    particlePoints.frustumCulled = false;
    scene.add(particlePoints);

    // 2. Solar System & Earth Evolution System
    const solarSystem = new SolarSystemController();
    scene.add(solarSystem.group);

    // Smooth camera vectors
    const targetCamPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3();
    const currentLookAt = new THREE.Vector3(0, 0, 0);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    // Helper: calculate camera parameters for any progress `p`
    const getCameraStateForProgress = (p: number, isPortrait: boolean) => {
      // Find current and next epoch for interpolation
      let idx = 0;
      for (let i = 0; i < COSMIC_EPOCHS.length; i++) {
        if (p >= COSMIC_EPOCHS[i].range[0] && p <= COSMIC_EPOCHS[i].range[1]) {
          idx = i;
          break;
        }
      }
      const current = COSMIC_EPOCHS[idx];
      const next = COSMIC_EPOCHS[Math.min(idx + 1, COSMIC_EPOCHS.length - 1)];

      const t = Math.min(
        1.0,
        Math.max(0.0, (p - current.range[0]) / Math.max(0.001, current.range[1] - current.range[0]))
      );

      // Smooth step ease for camera transitions
      const smoothT = t * t * (3.0 - 2.0 * t);

      const curCam = isPortrait && current.mobileCamera ? current.mobileCamera : current.camera;
      const nxtCam = isPortrait && next.mobileCamera ? next.mobileCamera : next.camera;

      const pos = [
        THREE.MathUtils.lerp(curCam.position[0], nxtCam.position[0], smoothT),
        THREE.MathUtils.lerp(curCam.position[1], nxtCam.position[1], smoothT),
        THREE.MathUtils.lerp(curCam.position[2], nxtCam.position[2], smoothT),
      ];

      const look = [
        THREE.MathUtils.lerp(curCam.lookAt[0], nxtCam.lookAt[0], smoothT),
        THREE.MathUtils.lerp(curCam.lookAt[1], nxtCam.lookAt[1], smoothT),
        THREE.MathUtils.lerp(curCam.lookAt[2], nxtCam.lookAt[2], smoothT),
      ];

      const fov = THREE.MathUtils.lerp(curCam.fov, nxtCam.fov, smoothT);

      return { pos, look, fov, epoch: current };
    };

    // Render loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const currentP = progressRef.current;
      const isPortrait = window.innerWidth < window.innerHeight;

      // Update particle uniforms
      particleMat.uniforms.uProgress.value = currentP;
      particleMat.uniforms.uTime.value = elapsedTime;

      // Update Solar System
      try {
        solarSystem.update(currentP, elapsedTime);
      } catch (err) {
        console.error("SolarSystem update error:", err);
      }

      // Compute camera target
      const camState = getCameraStateForProgress(currentP, isPortrait);
      targetCamPos.set(camState.pos[0], camState.pos[1], camState.pos[2]);
      targetLookAt.set(camState.look[0], camState.look[1], camState.look[2]);

      // Subtle cinematic drift
      const driftX = Math.sin(elapsedTime * 0.3) * 0.3;
      const driftY = Math.cos(elapsedTime * 0.25) * 0.25;

      camera.position.lerp(targetCamPos.clone().add(new THREE.Vector3(driftX, driftY, 0)), 0.06);
      currentLookAt.lerp(targetLookAt, 0.06);
      camera.lookAt(currentLookAt);

      if (Math.abs(camera.fov - camState.fov) > 0.05) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, camState.fov, 0.05);
        camera.updateProjectionMatrix();
      }

      // Notify parent of active epoch
      if (onProgressTick) {
        onProgressTick(currentP, camState.epoch);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Window resize handler
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 768 ? 1.5 : 2.0));
      particleMat.uniforms.uPixelRatio.value = renderer.getPixelRatio();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);

      particleGeo.dispose();
      particleMat.dispose();
      solarSystem.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onProgressTick]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black"
      style={{ touchAction: "none" }}
    />
  );
}
