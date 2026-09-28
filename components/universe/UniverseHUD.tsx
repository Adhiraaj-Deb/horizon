"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronDown, Sparkles, AlertCircle, ArrowUp } from "lucide-react";
import { COSMIC_EPOCHS, CosmicEpoch } from "./timelineData";

interface UniverseHUDProps {
  progress: number;
  activeEpoch: CosmicEpoch;
  onJumpToEpoch: (epochId: string) => void;
}

export default function UniverseHUD({
  progress,
  activeEpoch,
  onJumpToEpoch,
}: UniverseHUDProps) {
  const isOpening = progress < 0.04;
  const progressPercent = Math.round(progress * 100);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden select-none font-grotesk">
      {/* Top Ambient Vignette */}
      <div className="absolute top-0 left-0 right-0 h-32 md:h-40 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10" />

      {/* 1. TOP STATUS BAR */}
      <header className="absolute top-0 left-0 right-0 z-30 pt-16 sm:pt-20 px-4 sm:px-8 md:px-12 flex justify-between items-start">
        {/* Left: Cosmic Clock & Timeline Telemetry */}
        <div className="pointer-events-auto flex flex-col gap-1 sm:gap-1.5">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 glass-card rounded-full border border-white/10 backdrop-blur-md">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-mono text-[11px] sm:text-xs text-white/90 font-medium">
              {activeEpoch.timeLabel}
            </span>
            <span className="text-white/20 hidden xs:inline">|</span>
            <span className="font-orbitron text-[8px] sm:text-[9px] uppercase tracking-wider text-white/60 hidden sm:inline">
              {activeEpoch.lookbackTime || "Deep Time"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 px-1">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: activeEpoch.themeColor }}
            />
            <span className="font-orbitron text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/50">
              Cosmic Timeline • {progressPercent}%
            </span>
          </div>
        </div>

        {/* Right: Quick Epoch Milestone Selector (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 pointer-events-auto">
          <div className="glass-card glass-card-glow rounded-2xl p-1.5 border border-white/10 flex items-center gap-1 backdrop-blur-xl">
            {COSMIC_EPOCHS.filter((_, i) => i % 2 === 0).map((ep) => {
              const isActive = activeEpoch.id === ep.id;
              return (
                <button
                  key={ep.id}
                  onClick={() => onJumpToEpoch(ep.id)}
                  title={ep.name}
                  className={`px-2.5 py-1 rounded-xl text-[10px] tracking-wider uppercase transition-all duration-300 ${
                    isActive
                      ? "bg-white text-black font-semibold shadow-lg scale-105"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {ep.shortName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile: Compact Active Epoch Pill */}
        <div className="lg:hidden pointer-events-auto">
          <div className="px-2.5 py-1 glass-card rounded-full border border-white/10 text-[9px] sm:text-[10px] font-mono text-cyan-300">
            {activeEpoch.shortName}
          </div>
        </div>
      </header>

      {/* 2. CENTER: OPENING HERO OVERLAY (Only at scroll start) */}
      <AnimatePresence>
        {isOpening && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6 text-center z-20"
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 glass-card rounded-full border border-white/10 mb-4 sm:mb-6 backdrop-blur-md">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 animate-spin" />
              <span className="font-orbitron text-[8px] sm:text-[9px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/70">
                Scientific Interactive Journey
              </span>
            </div>

            <h1 className="font-bebas text-5xl sm:text-8xl md:text-9xl text-liquid-metal tracking-widest leading-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)] mb-3 sm:mb-4">
              THE UNIVERSE
            </h1>

            <p className="font-grotesk text-[10px] sm:text-sm md:text-base text-white/60 tracking-[0.25em] sm:tracking-[0.3em] uppercase max-w-xl mb-8 sm:mb-12">
              13.8 Billion Years of Cosmic Evolution
            </p>

            {/* Scroll Indicator */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="flex flex-col items-center gap-1.5 sm:gap-2 text-white/40"
            >
              <span className="font-orbitron text-[8px] sm:text-[9px] uppercase tracking-[0.25em]">
                Scroll To Explore
              </span>
              <ChevronDown className="w-4 h-4 text-cyan-400" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. DYNAMIC EPOCH NARRATIVE CARD (Bottom-Left) */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:left-8 md:left-12 sm:bottom-7 z-30 pointer-events-auto max-w-sm sm:max-w-md md:max-w-lg">
        <AnimatePresence mode="wait">
          {!isOpening && (
            <motion.div
              key={activeEpoch.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full glass-card glass-card-glow rounded-xl sm:rounded-3xl p-2.5 sm:p-5 md:p-6 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col gap-1 sm:gap-2.5 bg-black/70 sm:bg-black/40"
            >
              {/* Badge & Epoch Subtitle */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: activeEpoch.themeColor }}
                  />
                  <span className="font-orbitron text-[8px] sm:text-[9px] uppercase tracking-wider text-white/50 truncate">
                    {activeEpoch.subtitle}
                  </span>
                </div>
                <span className="font-mono text-[9px] sm:text-[11px] text-cyan-400/90 font-medium shrink-0">
                  {activeEpoch.timeLabel}
                </span>
              </div>

              {/* Epoch Main Title */}
              <h2 className="font-bebas text-lg sm:text-2xl md:text-3xl text-white tracking-wider leading-none">
                {activeEpoch.title}
              </h2>

              {/* Epoch Summary */}
              <p className="font-grotesk text-[10px] sm:text-xs md:text-sm text-white/70 leading-snug line-clamp-2 sm:line-clamp-none">
                {activeEpoch.summary}
              </p>

              {/* Secondary Scientific Detail Bullet (Tablet/Desktop only) */}
              {activeEpoch.details && activeEpoch.details.length > 0 && (
                <div className="hidden sm:flex pt-1.5 border-t border-white/5 flex-col gap-1">
                  <p className="text-[11px] text-white/45 leading-normal">
                    • {activeEpoch.details[0]}
                  </p>
                </div>
              )}

              {/* Scientific Note (Tablet/Desktop only) */}
              {activeEpoch.scientificNote && (
                <div className="hidden sm:flex mt-0.5 p-2 rounded-xl bg-white/[0.03] border border-white/10 items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400/90 shrink-0 mt-0.5" />
                  <p className="font-grotesk text-[10px] text-amber-200/70 leading-tight">
                    <strong className="text-amber-300/90 font-medium">Note: </strong>
                    {activeEpoch.scientificNote}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. RIGHT SIDE: VERTICAL TIMELINE SCRUBBER (Desktop) */}
      <div className="hidden md:flex absolute right-8 md:right-12 bottom-7 flex-col items-end gap-3 pointer-events-auto z-30">
        {/* Milestone scrubber dots */}
        <div className="glass-card rounded-2xl p-2.5 border border-white/10 backdrop-blur-xl flex flex-col gap-2">
          {COSMIC_EPOCHS.map((ep) => {
            const isPassed = progress >= ep.range[0];
            const isCurrent = activeEpoch.id === ep.id;
            return (
              <button
                key={ep.id}
                onClick={() => onJumpToEpoch(ep.id)}
                className="group flex items-center gap-3 relative py-0.5"
                title={`${ep.name} (${ep.timeLabel})`}
              >
                <span
                  className={`font-orbitron text-[9px] uppercase tracking-wider transition-all duration-200 opacity-0 group-hover:opacity-100 whitespace-nowrap ${
                    isCurrent ? "text-cyan-300 opacity-100 font-semibold" : "text-white/40"
                  }`}
                >
                  {ep.shortName}
                </span>
                <div
                  className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                    isCurrent
                      ? "bg-cyan-400 border-white scale-125 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                      : isPassed
                      ? "bg-white/40 border-transparent"
                      : "bg-white/10 border-white/20"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Quick jump to Top button */}
        {progress > 0.1 && (
          <button
            onClick={() => onJumpToEpoch("opening")}
            className="p-2 glass-card rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all"
            title="Return to the Beginning (t = 0)"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 5. BOTTOM SCROLL TRACK PROGRESS BAR */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
