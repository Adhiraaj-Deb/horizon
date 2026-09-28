"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Info,
  Sliders,
  Maximize2,
  Minimize2,
  Compass,
  X,
  Layers,
  Sparkles,
} from "lucide-react";
import BlackHoleCanvas, { QualitySetting } from "./BlackHoleCanvas";
import {
  PRESET_BLACK_HOLES,
  calculateBlackHoleMetrics,
  formatDistanceKm,
  formatSolarMass,
} from "./physics";

export default function SingularityView() {
  // Astrophysics parameters
  const [selectedPresetId, setSelectedPresetId] = useState<string>("stellar-10");
  const [massSolar, setMassSolar] = useState<number>(10);
  const [spin, setSpin] = useState<number>(0.15);
  const [diskBrightness, setDiskBrightness] = useState<number>(1.2);
  const [dopplerEnabled, setDopplerEnabled] = useState<boolean>(true);
  const [redshiftEnabled, setRedshiftEnabled] = useState<boolean>(true);
  const [showJets, setShowJets] = useState<boolean>(false);
  const [showGuides, setShowGuides] = useState<boolean>(false);

  // Visualization / Engine controls
  const [quality, setQuality] = useState<QualitySetting>("high");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [currentCameraPreset, setCurrentCameraPreset] = useState<string>("oblique");

  // UI state
  const [uiVisible, setUiVisible] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"controls" | "theory">("controls");
  const [theoryTopic, setTheoryTopic] = useState<string>("shadow");
  const [showTheoryModal, setShowTheoryModal] = useState<boolean>(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<"controls" | "telemetry">("controls");

  // Dynamic calculations from GR physics
  const metrics = useMemo(() => {
    return calculateBlackHoleMetrics(massSolar, spin);
  }, [massSolar, spin]);

  // Handle Preset selection
  const handleSelectPreset = (presetId: string) => {
    const preset = PRESET_BLACK_HOLES.find((p) => p.id === presetId);
    if (preset) {
      setSelectedPresetId(preset.id);
      setMassSolar(preset.massSolar);
      setSpin(preset.spin);
      if (preset.id === "m87-star") {
        setShowJets(true);
      }
    }
  };

  // Dynamic UI filter based on brightness to keep text readable against bright white accretion disk
  const invertAmount = Math.min(100, Math.max(0, (diskBrightness - 1.2) / 1.8 * 100));
  const uiFilterStyle = {
    filter: `invert(${invertAmount}%) hue-rotate(${invertAmount * 1.8}deg)`
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none font-grotesk">
      {/* 3D WebGL Relativistic Raymarching Engine */}
      <BlackHoleCanvas
        mass={1.0} // dimensionless simulation mass
        spin={spin}
        diskBrightness={diskBrightness}
        dopplerEnabled={dopplerEnabled}
        redshiftEnabled={redshiftEnabled}
        showJets={showJets}
        showGuides={showGuides}
        quality={quality}
        isPlaying={isPlaying}
        autoRotate={autoRotate}
        currentPreset={currentCameraPreset}
      />

      {/* Top Ambient Vignette & Scanlines */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/70 via-transparent to-black/60 z-10" />

      {/* Dynamic UI Wrapper for Auto-Dark Mode based on Brightness */}
      <div 
        className="absolute inset-0 pointer-events-none z-20 transition-all duration-300"
        style={uiFilterStyle}
      >
        {/* Top Bar Header & Branding */}
        <header className="absolute top-20 left-0 right-0 px-6 md:px-12 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 glass-card rounded-full border border-white/10 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-orbitron text-[9px] uppercase tracking-[0.35em] text-white/70">
              General Relativity Simulator
            </span>
          </div>
          <h1 className="font-bebas text-4xl md:text-6xl text-white tracking-widest leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            SINGULARITY
          </h1>
          <p className="font-grotesk text-xs text-white/40 tracking-[0.25em] uppercase">
            Curved Spacetime Null Geodesics
          </p>
        </div>

        {/* Global HUD Controls */}
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
          {/* Mobile Settings Button (visible on mobile / <lg screens) */}
          <button
            onClick={() => setMobileSettingsOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 glass-card rounded-xl text-xs uppercase tracking-wider text-cyan-300 hover:text-white border border-cyan-400/30 bg-cyan-500/10 transition-all shadow-lg"
            title="Black Hole Settings"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-orbitron text-[10px] font-semibold">Controls</span>
          </button>

          {/* Quick Preset Selector (Desktop Only) */}
          <div className="hidden lg:flex items-center gap-1.5 glass-card glass-card-glow rounded-xl p-1 border border-white/10">
            {PRESET_BLACK_HOLES.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] tracking-wider uppercase transition-all duration-200 ${
                  selectedPresetId === preset.id
                    ? "bg-white text-black font-semibold shadow-lg"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Theory / Dossier Button */}
          <button
            onClick={() => setShowTheoryModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 glass-card rounded-xl text-xs uppercase tracking-wider text-white/80 hover:text-white hover:border-white/30 transition-all border border-white/10"
          >
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Physics Dossier</span>
          </button>

          {/* Toggle HUD Visibility */}
          <button
            onClick={() => setUiVisible(!uiVisible)}
            className="p-2 glass-card rounded-xl text-white/60 hover:text-white hover:border-white/30 transition-all border border-white/10"
            title={uiVisible ? "Hide HUD" : "Show HUD"}
          >
            {uiVisible ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Interactive Floating HUD Layer */}
      <AnimatePresence>
        {uiVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 pointer-events-none z-20"
          >
            {/* LEFT SIDE: Real-Time General Relativity Telemetry (Desktop Only) */}
            <div className="hidden lg:flex absolute left-6 md:left-12 top-48 bottom-28 w-80 max-w-[calc(100vw-3rem)] flex-col pointer-events-auto">
              <div className="glass-card glass-card-glow rounded-2xl p-5 border border-white/10 backdrop-blur-xl flex flex-col gap-4 overflow-y-auto max-h-full">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <span className="font-orbitron text-[11px] uppercase tracking-wider text-white font-semibold">
                      Spacetime Telemetry
                    </span>
                  </div>
                  <span className="font-grotesk text-[10px] text-white/30 uppercase">
                    G = c = 1
                  </span>
                </div>

                {/* Target Identity */}
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 block mb-1">
                    Cosmic Target
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-bebas text-2xl text-white tracking-wider">
                      {PRESET_BLACK_HOLES.find((p) => p.id === selectedPresetId)?.name || "Custom Black Hole"}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">
                      {PRESET_BLACK_HOLES.find((p) => p.id === selectedPresetId)?.location || "Deep Space"}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed mt-1">
                    {PRESET_BLACK_HOLES.find((p) => p.id === selectedPresetId)?.description}
                  </p>
                </div>

                {/* Real-time GR Metric Readouts */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Mass */}
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[9px] uppercase tracking-wider text-white/40 block">
                      Black Hole Mass (M)
                    </span>
                    <span className="font-mono text-sm text-white font-semibold mt-0.5 block">
                      {formatSolarMass(massSolar)}
                    </span>
                  </div>

                  {/* Dimensionless Spin */}
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[9px] uppercase tracking-wider text-white/40 block">
                      Kerr Spin (a*)
                    </span>
                    <span className="font-mono text-sm text-cyan-400 font-semibold mt-0.5 block">
                      {spin.toFixed(3)}
                    </span>
                  </div>

                  {/* Schwarzschild Radius */}
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-wider text-white/40">
                        r_s (2GM/c²)
                      </span>
                    </div>
                    <span className="font-mono text-sm text-white font-semibold mt-0.5 block">
                      {formatDistanceKm(metrics.rsKm)}
                    </span>
                  </div>

                  {/* Kerr Event Horizon */}
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[9px] uppercase tracking-wider text-white/40 block">
                      Horizon (r₊)
                    </span>
                    <span className="font-mono text-sm text-purple-300 font-semibold mt-0.5 block">
                      {formatDistanceKm(metrics.horizonRadiusKm)}
                    </span>
                  </div>

                  {/* Photon Sphere */}
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[9px] uppercase tracking-wider text-white/40 block">
                      Photon Sphere (r_ph)
                    </span>
                    <span className="font-mono text-sm text-cyan-300 font-semibold mt-0.5 block">
                      {formatDistanceKm(metrics.photonSphereRadiusKm)}
                    </span>
                  </div>

                  {/* Shadow Radius */}
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[9px] uppercase tracking-wider text-white/40 block">
                      Apparent Shadow (b_crit)
                    </span>
                    <span className="font-mono text-sm text-amber-300 font-semibold mt-0.5 block">
                      {formatDistanceKm(metrics.shadowRadiusKm)}
                    </span>
                  </div>

                  {/* ISCO Radius */}
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[9px] uppercase tracking-wider text-white/40 block">
                      ISCO Orbit (r_isco)
                    </span>
                    <span className="font-mono text-sm text-orange-400 font-semibold mt-0.5 block">
                      {formatDistanceKm(metrics.iscoRadiusKm)}
                    </span>
                  </div>

                  {/* Orbital Velocity at ISCO */}
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[9px] uppercase tracking-wider text-white/40 block">
                      v_orbit at ISCO
                    </span>
                    <span className="font-mono text-sm text-emerald-400 font-semibold mt-0.5 block">
                      {(metrics.vIscoFractionC * 100).toFixed(1)}% c
                    </span>
                  </div>
                </div>

                {/* Physics Notice Callout */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-white/60 leading-relaxed">
                  <span className="text-white font-medium block mb-1">
                    Optical Shadow Distinction:
                  </span>
                  Notice that the black hole shadow radius (~{formatDistanceKm(metrics.shadowRadiusKm)}) is ~2.6× larger than the physical event horizon due to gravitational light bending.
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Interactive Scientific Parameters & Controls (Desktop Only) */}
            <div className="hidden lg:flex absolute right-6 md:right-12 top-48 bottom-28 w-84 max-w-[calc(100vw-3rem)] flex-col pointer-events-auto">
              <div className="glass-card glass-card-glow rounded-2xl p-5 border border-white/10 backdrop-blur-xl flex flex-col gap-4 overflow-y-auto max-h-full">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <span className="font-orbitron text-[11px] uppercase tracking-wider text-white font-semibold">
                      Simulation Controls
                    </span>
                  </div>
                  <span className="font-grotesk text-[10px] text-white/40 uppercase">
                    Interactive
                  </span>
                </div>

                {/* Mass Slider (Logarithmic scaling) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Mass (M☉)</span>
                    <span className="font-mono text-white">{formatSolarMass(massSolar)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10000000"
                    step="1"
                    value={massSolar}
                    onChange={(e) => {
                      setMassSolar(parseFloat(e.target.value));
                      setSelectedPresetId("custom");
                    }}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                  />
                  <div className="flex justify-between text-[9px] text-white/30 font-mono">
                    <span>1 M☉ (Stellar)</span>
                    <span>10⁷ M☉ (Supermassive)</span>
                  </div>
                </div>

                {/* Spin Parameter Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Kerr Spin (a*)</span>
                    <span className="font-mono text-cyan-400">{spin.toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.998"
                    step="0.005"
                    value={spin}
                    onChange={(e) => {
                      setSpin(parseFloat(e.target.value));
                      setSelectedPresetId("custom");
                    }}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                  />
                  <div className="flex justify-between text-[9px] text-white/30 font-mono">
                    <span>0 (Schwarzschild)</span>
                    <span>0.998 (Extreme Kerr)</span>
                  </div>
                </div>

                {/* Accretion Disk Brightness */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Accretion Disk Intensity</span>
                    <span className="font-mono text-white">{(diskBrightness * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3.0"
                    step="0.1"
                    value={diskBrightness}
                    onChange={(e) => setDiskBrightness(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                  />
                </div>

                <div className="h-[1px] bg-white/10" />

                {/* Relativistic Physics Toggles */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-white/40 block">
                    General Relativity Physics
                  </span>

                  {/* Relativistic Doppler Beaming */}
                  <label className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors">
                    <div>
                      <span className="text-xs text-white block">Doppler Beaming</span>
                      <span className="text-[10px] text-white/40 block">
                        Blueshift & boost on approaching side
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={dopplerEnabled}
                      onChange={(e) => setDopplerEnabled(e.target.checked)}
                      className="accent-cyan-400 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  {/* Gravitational Redshift */}
                  <label className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors">
                    <div>
                      <span className="text-xs text-white block">Gravitational Redshift</span>
                      <span className="text-[10px] text-white/40 block">
                        Energy loss climbing out of gravity well
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={redshiftEnabled}
                      onChange={(e) => setRedshiftEnabled(e.target.checked)}
                      className="accent-cyan-400 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  {/* Relativistic Jets */}
                  <label className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors">
                    <div>
                      <span className="text-xs text-white block">Relativistic Jets</span>
                      <span className="text-[10px] text-white/40 block">
                        Blandford-Znajek polar plasma outflow
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={showJets}
                      onChange={(e) => setShowJets(e.target.checked)}
                      className="accent-cyan-400 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  {/* Educational Guides */}
                  <label className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors">
                    <div>
                      <span className="text-xs text-white block">Guide Overlays</span>
                      <span className="text-[10px] text-white/40 block">
                        Photon sphere, ISCO, & horizon rings
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={showGuides}
                      onChange={(e) => setShowGuides(e.target.checked)}
                      className="accent-cyan-400 w-4 h-4 cursor-pointer"
                    />
                  </label>
                </div>

                <div className="h-[1px] bg-white/10" />

                {/* Camera Presets */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-white/40 block">
                    Camera Viewing Angles
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => setCurrentCameraPreset("oblique")}
                      className={`px-2 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all ${
                        currentCameraPreset === "oblique"
                          ? "bg-white text-black font-semibold"
                          : "bg-white/[0.04] text-white/60 hover:text-white"
                      }`}
                    >
                      Oblique (22°)
                    </button>
                    <button
                      onClick={() => setCurrentCameraPreset("equatorial")}
                      className={`px-2 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all ${
                        currentCameraPreset === "equatorial"
                          ? "bg-white text-black font-semibold"
                          : "bg-white/[0.04] text-white/60 hover:text-white"
                      }`}
                    >
                      Edge-On
                    </button>
                    <button
                      onClick={() => setCurrentCameraPreset("polar")}
                      className={`px-2 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all ${
                        currentCameraPreset === "polar"
                          ? "bg-white text-black font-semibold"
                          : "bg-white/[0.04] text-white/60 hover:text-white"
                      }`}
                    >
                      Polar
                    </button>
                  </div>
                </div>

                {/* Quality Selector */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-white/40 block">
                    Shader Quality / Geodesic Steps
                  </span>
                  <div className="grid grid-cols-4 gap-1">
                    {(["low", "medium", "high", "ultra"] as QualitySetting[]).map((q) => (
                      <button
                        key={q}
                        onClick={() => setQuality(q)}
                        className={`py-1 rounded-lg text-[9px] uppercase tracking-wider transition-all ${
                          quality === q
                            ? "bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/20"
                            : "bg-white/[0.04] text-white/50 hover:text-white"
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM BAR: Interaction Controls & Tips */}
            <div className="absolute bottom-6 left-0 right-0 px-6 md:px-12 flex justify-between items-center pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-2 glass-card rounded-xl p-1.5 border border-white/10">
                {/* Play / Pause Animation */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  title={isPlaying ? "Pause Simulation" : "Resume Simulation"}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                {/* Auto Rotate Toggle */}
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] tracking-wider uppercase transition-colors flex items-center gap-1.5 ${
                    autoRotate ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                  }`}
                  title="Toggle Auto-Orbit"
                >
                  <RotateCcw className={`w-3 h-3 ${autoRotate ? "animate-spin" : ""}`} />
                  <span className="hidden sm:inline">Auto-Orbit</span>
                </button>

                {/* Reset Camera */}
                <button
                  onClick={() => setCurrentCameraPreset("oblique")}
                  className="px-3 py-1.5 rounded-lg text-[11px] tracking-wider uppercase text-white/60 hover:text-white transition-colors"
                >
                  Reset View
                </button>
              </div>

              {/* Interaction Hint */}
              <div className="hidden md:flex items-center gap-4 text-xs text-white/30 tracking-wider">
                <span>Drag: Orbit</span>
                <span>•</span>
                <span>Scroll: Zoom</span>
                <span>•</span>
                <span>Observe Gravitational Lensing</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDUCATIONAL PHYSICS DOSSIER MODAL */}
      <AnimatePresence>
        {showTheoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-2xl pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[85vh] glass-card glass-card-glow rounded-3xl border border-white/15 overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bebas text-2xl text-white tracking-widest">
                      Black Hole Physics Dossier
                    </h2>
                    <p className="text-xs text-white/40 tracking-wider uppercase">
                      Curated Theoretical Foundations of General Relativity
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTheoryModal(false)}
                  className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 text-white/80 leading-relaxed text-sm">
                {/* 1. Singularity */}
                <section className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-orbitron text-xs text-cyan-400 uppercase tracking-widest">01</span>
                    <h3 className="font-bebas text-xl text-white tracking-wider">The Singularity</h3>
                  </div>
                  <p>
                    In classical General Relativity, a gravitational singularity represents a point or ring where the spacetime curvature invariant diverges to infinity, indicating infinite tidal forces and density.
                  </p>
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-white/70">
                    <strong className="text-white block mb-1">Scientific Distinction:</strong>
                    Physicists widely consider the singularity a limitation of classical General Relativity rather than an experimentally verified physical object. When spacetime curvature reaches the Planck length ($\ell_P \approx 1.6 \times 10^{-35}$ m), quantum gravitational effects are expected to supersede classical equations and smooth out infinite densities.
                  </div>
                </section>

                {/* 2. Event Horizon */}
                <section className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-orbitron text-xs text-cyan-400 uppercase tracking-widest">02</span>
                    <h3 className="font-bebas text-xl text-white tracking-wider">The Event Horizon</h3>
                  </div>
                  <p>
                    The event horizon is a null hypersurface acting as a one-way causal boundary. For a non-rotating Schwarzschild black hole, its radius is given exactly by:
                  </p>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-cyan-300 text-center text-sm">
                    r_s = 2GM / c²
                  </div>
                  <p>
                    Photons emitted inside this boundary cannot escape to an outside observer because all future-pointing light cones tilt inward toward the center. The event horizon is not a physical surface; an infalling observer would pass through it without encountering any material barrier, experiencing only local tidal forces.
                  </p>
                </section>

                {/* 3. Photon Sphere & Null Geodesics */}
                <section className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-orbitron text-xs text-cyan-400 uppercase tracking-widest">03</span>
                    <h3 className="font-bebas text-xl text-white tracking-wider">Photon Sphere & Unstable Orbits</h3>
                  </div>
                  <p>
                    At r_ph = 3GM/c² = 1.5 r_s in Schwarzschild geometry, gravitational acceleration is so intense that photons can follow circular orbits around the black hole.
                  </p>
                  <p>
                    Crucially, these orbits are unstable: the slightest perturbation causes a photon to either plunge into the event horizon or escape toward infinity. The photon sphere is not a solid glowing shell, but an optical threshold where light rays can execute multiple revolutions before escaping.
                  </p>
                </section>

                {/* 4. Black Hole Shadow */}
                <section className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-orbitron text-xs text-cyan-400 uppercase tracking-widest">04</span>
                    <h3 className="font-bebas text-xl text-white tracking-wider">The Black Hole Shadow</h3>
                  </div>
                  <p>
                    A common misconception is that the black hole's visual silhouette equals its event horizon. In reality, photons with an impact parameter b &lt; b_crit are captured by the black hole.
                  </p>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-amber-300 text-center text-sm">
                    {"b_crit = √27 · (GM/c²) ≈ 2.598 r_s"}
                  </div>
                  <p>
                    Consequently, for a distant observer, the apparent dark shadow has an angular radius ~2.6 times larger than the physical event horizon. The boundary of this shadow is bordered by the infinitely thin, bright photon ring composed of rays that skimmed the photon sphere.
                  </p>
                </section>

                {/* 5. Accretion Disk & ISCO */}
                <section className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-orbitron text-xs text-cyan-400 uppercase tracking-widest">05</span>
                    <h3 className="font-bebas text-xl text-white tracking-wider">Accretion Disk & ISCO</h3>
                  </div>
                  <p>
                    Matter falling toward a black hole forms a flattened, rapidly rotating accretion disk due to conservation of angular momentum. Viscous shear between orbiting gas rings converts gravitational potential energy into intense thermal radiation.
                  </p>
                  <p>
                    The disk terminates at the <strong>Innermost Stable Circular Orbit (ISCO)</strong>:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-white/70">
                    <li>For Schwarzschild (a* = 0): r_isco = 6GM/c² = 3 r_s</li>
                    <li>For maximum prograde Kerr (a* → 1): r_isco → GM/c² = 0.5 r_s</li>
                  </ul>
                  <p>
                    Inside the ISCO, circular orbits cannot exist. Matter plunges rapidly into the event horizon without emitting significant additional radiation.
                  </p>
                </section>

                {/* 6. Gravitational Lensing & Warped Disk Image */}
                <section className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-orbitron text-xs text-cyan-400 uppercase tracking-widest">06</span>
                    <h3 className="font-bebas text-xl text-white tracking-wider">Gravitational Lensing</h3>
                  </div>
                  <p>
                    General Relativity dictates that mass curves spacetime, deflecting light rays. Photons emitted from the far side of the accretion disk travel over and under the black hole, bending sharply toward the observer.
                  </p>
                  <p>
                    This generates the iconic optical appearance where the top of the accretion disk appears raised above the shadow, and a secondary lensed crescent appears underneath the shadow, wrapping the disk in three dimensions.
                  </p>
                </section>

                {/* 7. Relativistic Doppler Beaming & Gravitational Redshift */}
                <section className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-orbitron text-xs text-cyan-400 uppercase tracking-widest">07</span>
                    <h3 className="font-bebas text-xl text-white tracking-wider">Doppler Beaming & Gravitational Redshift</h3>
                  </div>
                  <p>
                    Gas near the ISCO orbits at relativistic speeds (v &gt; 0.4c). Due to special relativistic Lorentz transformation, radiation emitted in the direction of motion is concentrated into a forward beam with enhanced intensity:
                  </p>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-cyan-300 text-center text-sm">
                    {"δ = 1 / [γ(1 - β cos θ)],    I_obs ∝ δ⁴"}
                  </div>
                  <p>
                    As a result, the side of the disk rotating toward the observer appears substantially brighter and shifted to higher frequencies (bluer), while the receding side appears dimmer and redder. Simultaneously, general relativistic gravitational time dilation redshifts all photons emerging from deep within the potential well:
                  </p>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-purple-300 text-center text-sm">
                    {"1 + z = 1 / √(1 - 2GM/rc²)"}
                  </div>
                </section>

                {/* 8. Relativistic Jets */}
                <section className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-orbitron text-xs text-cyan-400 uppercase tracking-widest">08</span>
                    <h3 className="font-bebas text-xl text-white tracking-wider">Relativistic Jets</h3>
                  </div>
                  <p>
                    In accreting systems with magnetic fields threading a rotating Kerr black hole, the <strong>Blandford-Znajek mechanism</strong> can tap the black hole's rotational energy from its ergosphere, launching collimated relativistic plasma jets at &gt;99% the speed of light along the spin axis (as observed in M87*). Not all black holes feature jets; their presence requires substantial accretion and magnetic coupling.
                  </p>
                </section>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex justify-end">
                <button
                  onClick={() => setShowTheoryModal(false)}
                  className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-white/90 transition-colors"
                >
                  Close Dossier
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE BLACK HOLE SETTINGS & TELEMETRY MODAL */}
      <AnimatePresence>
        {mobileSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-2xl pointer-events-auto"
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg max-h-[85vh] glass-card glass-card-glow rounded-t-3xl sm:rounded-3xl border border-white/15 overflow-hidden flex flex-col shadow-2xl bg-black/95"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <h2 className="font-orbitron text-xs uppercase tracking-wider text-white font-semibold">
                    Simulation Settings
                  </h2>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setMobileTab("controls")}
                    className={`px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider transition-all ${
                      mobileTab === "controls"
                        ? "bg-white text-black font-semibold shadow-md"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    Controls
                  </button>
                  <button
                    onClick={() => setMobileTab("telemetry")}
                    className={`px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider transition-all ${
                      mobileTab === "telemetry"
                        ? "bg-white text-black font-semibold shadow-md"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    Telemetry
                  </button>
                </div>

                <button
                  onClick={() => setMobileSettingsOpen(false)}
                  className="p-1.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 text-white text-xs">
                {mobileTab === "controls" ? (
                  <>
                    {/* Presets */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-white/40 block">
                        Cosmic Target Presets
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {PRESET_BLACK_HOLES.map((preset) => (
                          <button
                            key={preset.id}
                            onClick={() => handleSelectPreset(preset.id)}
                            className={`p-2.5 rounded-xl text-left border transition-all ${
                              selectedPresetId === preset.id
                                ? "bg-white text-black font-semibold border-white shadow-lg"
                                : "bg-white/[0.03] text-white/70 border-white/5 hover:bg-white/10"
                            }`}
                          >
                            <span className="block font-bebas text-base tracking-wider leading-none">
                              {preset.name}
                            </span>
                            <span className={`text-[9px] block font-mono mt-0.5 ${
                              selectedPresetId === preset.id ? "text-black/60" : "text-cyan-400"
                            }`}>
                              {preset.location}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mass Slider */}
                    <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Black Hole Mass (M☉)</span>
                        <span className="font-mono text-white font-semibold">
                          {formatSolarMass(massSolar)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10000000"
                        step="1"
                        value={massSolar}
                        onChange={(e) => {
                          setMassSolar(parseFloat(e.target.value));
                          setSelectedPresetId("custom");
                        }}
                        className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                      />
                      <div className="flex justify-between text-[9px] text-white/30 font-mono">
                        <span>1 M☉ (Stellar)</span>
                        <span>10⁷ M☉ (Supermassive)</span>
                      </div>
                    </div>

                    {/* Kerr Spin Slider */}
                    <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Kerr Dimensionless Spin (a*)</span>
                        <span className="font-mono text-cyan-400 font-semibold">{spin.toFixed(3)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="0.998"
                        step="0.005"
                        value={spin}
                        onChange={(e) => {
                          setSpin(parseFloat(e.target.value));
                          setSelectedPresetId("custom");
                        }}
                        className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                      />
                      <div className="flex justify-between text-[9px] text-white/30 font-mono">
                        <span>0 (Schwarzschild)</span>
                        <span>0.998 (Extreme Kerr)</span>
                      </div>
                    </div>

                    {/* Accretion Disk Brightness */}
                    <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Accretion Disk Intensity</span>
                        <span className="font-mono text-white font-semibold">
                          {(diskBrightness * 100).toFixed(0)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="3.0"
                        step="0.05"
                        value={diskBrightness}
                        onChange={(e) => setDiskBrightness(parseFloat(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                      />
                      <div className="flex justify-between text-[9px] text-white/30 font-mono">
                        <span>0% (Quiescent)</span>
                        <span>300% (High Eddington)</span>
                      </div>
                    </div>

                    {/* GR Toggles */}
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-wider text-white/40 block">
                        Relativity Effects
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04]">
                          <span className="text-xs text-white">Doppler Beaming</span>
                          <input
                            type="checkbox"
                            checked={dopplerEnabled}
                            onChange={(e) => setDopplerEnabled(e.target.checked)}
                            className="accent-cyan-400 w-4 h-4 cursor-pointer"
                          />
                        </label>
                        <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04]">
                          <span className="text-xs text-white">Gravitational Redshift</span>
                          <input
                            type="checkbox"
                            checked={redshiftEnabled}
                            onChange={(e) => setRedshiftEnabled(e.target.checked)}
                            className="accent-cyan-400 w-4 h-4 cursor-pointer"
                          />
                        </label>
                        <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04]">
                          <span className="text-xs text-white">Relativistic Jets</span>
                          <input
                            type="checkbox"
                            checked={showJets}
                            onChange={(e) => setShowJets(e.target.checked)}
                            className="accent-cyan-400 w-4 h-4 cursor-pointer"
                          />
                        </label>
                        <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04]">
                          <span className="text-xs text-white">Guide Overlays</span>
                          <input
                            type="checkbox"
                            checked={showGuides}
                            onChange={(e) => setShowGuides(e.target.checked)}
                            className="accent-cyan-400 w-4 h-4 cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Camera Presets */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-white/40 block">
                        Viewing Angles
                      </span>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          onClick={() => setCurrentCameraPreset("oblique")}
                          className={`px-2 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all ${
                            currentCameraPreset === "oblique"
                              ? "bg-white text-black font-semibold"
                              : "bg-white/[0.04] text-white/60 hover:text-white"
                          }`}
                        >
                          Oblique
                        </button>
                        <button
                          onClick={() => setCurrentCameraPreset("equatorial")}
                          className={`px-2 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all ${
                            currentCameraPreset === "equatorial"
                              ? "bg-white text-black font-semibold"
                              : "bg-white/[0.04] text-white/60 hover:text-white"
                          }`}
                        >
                          Edge-On
                        </button>
                        <button
                          onClick={() => setCurrentCameraPreset("polar")}
                          className={`px-2 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all ${
                            currentCameraPreset === "polar"
                              ? "bg-white text-black font-semibold"
                              : "bg-white/[0.04] text-white/60 hover:text-white"
                          }`}
                        >
                          Polar
                        </button>
                      </div>
                    </div>

                    {/* Quality */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-white/40 block">
                        Shader Quality
                      </span>
                      <div className="grid grid-cols-4 gap-1">
                        {(["low", "med", "high", "ultra"] as QualitySetting[]).map((q) => (
                          <button
                            key={q}
                            onClick={() => setQuality(q)}
                            className={`px-2 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all ${
                              quality === q
                                ? "bg-cyan-400 text-black font-semibold"
                                : "bg-white/[0.04] text-white/60 hover:text-white"
                            }`}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Telemetry Tab Content */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5">
                      <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 block mb-1">
                        Cosmic Target Identity
                      </span>
                      <div className="flex items-baseline justify-between">
                        <span className="font-bebas text-2xl text-white tracking-wider">
                          {PRESET_BLACK_HOLES.find((p) => p.id === selectedPresetId)?.name || "Custom Target"}
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400">
                          {PRESET_BLACK_HOLES.find((p) => p.id === selectedPresetId)?.location || "Deep Space"}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/60 leading-relaxed mt-1">
                        {PRESET_BLACK_HOLES.find((p) => p.id === selectedPresetId)?.description}
                      </p>
                    </div>

                    {/* Readouts Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-[9px] uppercase tracking-wider text-white/40 block">
                          Mass (M)
                        </span>
                        <span className="font-mono text-sm text-white font-semibold mt-0.5 block">
                          {formatSolarMass(massSolar)}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-[9px] uppercase tracking-wider text-white/40 block">
                          Kerr Spin (a*)
                        </span>
                        <span className="font-mono text-sm text-cyan-400 font-semibold mt-0.5 block">
                          {spin.toFixed(3)}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-[9px] uppercase tracking-wider text-white/40 block">
                          r_s (2GM/c²)
                        </span>
                        <span className="font-mono text-sm text-white font-semibold mt-0.5 block">
                          {formatDistanceKm(metrics.rsKm)}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-[9px] uppercase tracking-wider text-white/40 block">
                          Horizon (r₊)
                        </span>
                        <span className="font-mono text-sm text-purple-300 font-semibold mt-0.5 block">
                          {formatDistanceKm(metrics.horizonRadiusKm)}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-[9px] uppercase tracking-wider text-white/40 block">
                          Photon Sphere (r_ph)
                        </span>
                        <span className="font-mono text-sm text-cyan-300 font-semibold mt-0.5 block">
                          {formatDistanceKm(metrics.photonSphereRadiusKm)}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-[9px] uppercase tracking-wider text-white/40 block">
                          ISCO (r_isco)
                        </span>
                        <span className="font-mono text-sm text-amber-300 font-semibold mt-0.5 block">
                          {formatDistanceKm(metrics.iscoRadiusKm)}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-[11px] text-white/70 leading-relaxed">
                      <span className="text-cyan-300 font-medium block mb-1">
                        Relativistic Speed at ISCO:
                      </span>
                      Gas orbits the inner disk edge at <strong>{(metrics.vIscoFractionC * 100).toFixed(1)}% the speed of light</strong>.
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/10 bg-white/[0.02]">
                <button
                  onClick={() => setMobileSettingsOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-cyan-400 text-black font-semibold text-xs tracking-wider uppercase hover:bg-cyan-300 transition-colors shadow-lg"
                >
                  Apply & Return to Simulation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
