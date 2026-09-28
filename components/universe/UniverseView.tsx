"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import UniverseCanvas from "./UniverseCanvas";
import UniverseHUD from "./UniverseHUD";
import { COSMIC_EPOCHS, CosmicEpoch } from "./timelineData";
import { Loader2 } from "lucide-react";

export default function UniverseView() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll targets & smoothed values
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);

  // Check when loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Native scroll listener: updates targetProgress
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const progress = Math.min(1.0, Math.max(0.0, window.scrollY / scrollHeight));
      targetProgressRef.current = progress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // RequestAnimationFrame smooth interpolation loop
  useEffect(() => {
    let animId: number;
    let lastReported = 0;

    const smoothLoop = () => {
      animId = requestAnimationFrame(smoothLoop);

      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      // Adaptive lerp factor
      const lerpFactor = Math.abs(diff) > 0.1 ? 0.08 : 0.06;
      currentProgressRef.current += diff * lerpFactor;

      // Update React state if delta exceeds threshold to avoid unneeded renders
      if (Math.abs(currentProgressRef.current - lastReported) > 0.0005) {
        lastReported = currentProgressRef.current;
        setCurrentProgress(lastReported);
      }
    };

    animId = requestAnimationFrame(smoothLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Derive active epoch reliably from currentProgress
  const activeEpoch = React.useMemo(() => {
    for (let i = 0; i < COSMIC_EPOCHS.length; i++) {
      if (
        currentProgress >= COSMIC_EPOCHS[i].range[0] &&
        (i === COSMIC_EPOCHS.length - 1 || currentProgress < COSMIC_EPOCHS[i + 1].range[0])
      ) {
        return COSMIC_EPOCHS[i];
      }
    }
    return COSMIC_EPOCHS[COSMIC_EPOCHS.length - 1];
  }, [currentProgress]);

  // Jump to specific milestone epoch
  const handleJumpToEpoch = (epochId: string) => {
    const found = COSMIC_EPOCHS.find((e) => e.id === epochId);
    if (!found) return;

    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetScrollY = found.range[0] * scrollHeight;

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const step = scrollHeight / COSMIC_EPOCHS.length;

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        window.scrollBy({ top: step * 0.5, behavior: "smooth" });
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        window.scrollBy({ top: -step * 0.5, behavior: "smooth" });
      } else if (e.key === "Home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (e.key === "End") {
        window.scrollTo({ top: scrollHeight, behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-black">
      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center gap-4 transition-opacity duration-700">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="font-orbitron text-xs tracking-[0.3em] uppercase text-white/60">
            Initializing The Universe...
          </p>
        </div>
      )}

      {/* 3D WebGL Continuous Canvas */}
      <UniverseCanvas progress={currentProgress} />

      {/* Interactive Cinematic HUD Overlay */}
      <UniverseHUD
        progress={currentProgress}
        activeEpoch={activeEpoch}
        onJumpToEpoch={handleJumpToEpoch}
      />

      {/* 
        Scrollable Track: 1400vh gives generous physical scroll travel 
        so each of the 16 cosmic epochs feels paced and unhurried.
      */}
      <div className="w-full h-[1400vh] pointer-events-none" />
    </div>
  );
}
