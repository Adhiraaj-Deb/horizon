"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import { APIProvider } from '@vis.gl/react-google-maps';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'gmp-map-3d': any;
        }
    }
}

type ViewMode = "system" | "earth";

type Target = {
    id: string; // The NASA hash route
    name: string;
    type: string;
    desc: string;
};

const CELESTIAL_TARGETS: Target[] = [
    { id: "sol", name: "The Sun", type: "Yellow Dwarf Star", desc: "A hot ball of glowing gases at the heart of our solar system. Its gravity holds everything together, keeping planets, asteroids and comets in orbit." },
    { id: "earth", name: "Earth", type: "Terrestrial Planet", desc: "Our home. The only world known to harbor life, protected by a delicate magnetic field and suspended in an infinite, hostile void." },
    { id: "mars", name: "Mars", type: "Terrestrial Planet", desc: "A dusty, cold desert world with a very thin atmosphere. Evidence suggests Mars was billions of years ago a wetter, warmer world." },
    { id: "jupiter", name: "Jupiter", type: "Gas Giant", desc: "More than twice as massive as all other planets combined. Its Great Red Spot is a centuries-old storm larger than Earth itself." },
    { id: "saturn", name: "Saturn", type: "Gas Giant", desc: "Adorned with a dazzling, complex system of icy rings. It revolves slowly, a quiet giant in the deep dark." },
    { id: "sc_voyager_1", name: "Voyager 1", type: "Space Probe", desc: "The farthest human-made object in existence. Launched in 1977, it has crossed the heliopause and now drifts silently through interstellar space." },
];

export default function SystemPage() {
    const [view, setView] = useState<ViewMode>("system");
    const [loading, setLoading] = useState(true);
    const [activeTarget, setActiveTarget] = useState<Target | null>(null);

    // Use a ref to change the iframe src hash directly without forcing a React re-render of the iframe component
    const systemIframeRef = useRef<HTMLIFrameElement>(null);

    const handleToggle = (mode: ViewMode) => {
        if (view === mode) return;
        setLoading(true);
        setView(mode);
        setActiveTarget(null); // Clear target when switching views
        setTimeout(() => setLoading(false), 1500);
    };

    const handleTargetSelect = (target: Target) => {
        setActiveTarget(target);
        if (systemIframeRef.current) {
            // Change the hash to force the NASA engine to fly to the target
            systemIframeRef.current.src = `https://eyes.nasa.gov/apps/solar-system/?embed=true#/${target.id}`;
        }
    };

    return (
        <main className="relative w-screen h-screen bg-black overflow-hidden select-none">
            <Navbar />

            {/* Embedded Iframe Renderers */}
            <div className="absolute inset-0 z-0 bg-black">
                <AnimatePresence mode="wait">
                    {view === "system" ? (
                        <motion.iframe
                            ref={systemIframeRef}
                            key="system"
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                            src="https://eyes.nasa.gov/apps/solar-system/?embed=true"
                            className="w-full h-full border-none outline-none"
                            onLoad={() => setLoading(false)}
                        />
                    ) : (
                        <motion.div
                            key="earth"
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full h-full"
                        >
                            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""} version="alpha" libraries={["maps3d"]}>
                                <div className="w-full h-full relative overflow-hidden bg-black">
                                    <gmp-map-3d
                                        center="40.7580,-73.9855,800"
                                        tilt="65"
                                        heading="12"
                                        style={{ width: '100%', height: '100%', outline: 'none' }}
                                    />
                                </div>
                            </APIProvider>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Loading Overlay Transition */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-xl flex items-center justify-center pointer-events-none"
                    >
                        <div className="flex flex-col items-center gap-6">
                            <motion.div
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                className="w-2 h-2 rounded-full bg-white"
                            />
                            <p className="font-grotesk text-[10px] uppercase tracking-[0.5em] text-white/50">
                                Calibrating Telemetry
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cinematic Overlays */}
            <div className="absolute inset-0 pointer-events-none z-[10] shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] mix-blend-multiply" />
            <div className="absolute inset-0 pointer-events-none z-[10] scanlines opacity-50" />

            {/* CUSTOM OVERLAY UI - Only visible in Solar System view */}
            <AnimatePresence>
                {view === "system" && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none z-[40]"
                    >

                        {/* RIGHT SIDE: Target Selection Menu */}
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto">
                            <p className="font-grotesk text-[9px] uppercase tracking-[0.4em] text-white/30 text-right mb-2">Targets</p>
                            {CELESTIAL_TARGETS.map(target => (
                                <button
                                    key={target.id}
                                    onClick={() => handleTargetSelect(target)}
                                    className={`text-right px-4 py-2 rounded-md transition-all duration-300 ${activeTarget?.id === target.id ? 'bg-white/10 border-r-2 border-white text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    <span className="font-bebas text-xl tracking-widest">{target.name}</span>
                                </button>
                            ))}
                        </div>

                        {/* LEFT SIDE: Info Sidebar */}
                        <AnimatePresence>
                            {activeTarget && (
                                <motion.div
                                    initial={{ x: "-100%", opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: "-100%", opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                    className="absolute left-0 top-0 bottom-0 w-[400px] bg-black/40 backdrop-blur-2xl border-r border-white/10 px-10 py-32 pointer-events-auto flex flex-col"
                                >
                                    <button
                                        onClick={() => setActiveTarget(null)}
                                        className="absolute top-32 right-8 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                                    >
                                        ✕
                                    </button>

                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                                    >
                                        <p className="font-grotesk text-[10px] uppercase tracking-[0.5em] text-white/40 mb-4 h-4">{activeTarget.type}</p>
                                        <h2 className="font-bebas text-[4.5rem] leading-[0.8] text-liquid-metal tracking-wider mb-8">{activeTarget.name}</h2>
                                        <div className="w-12 h-[1px] bg-white/20 mb-8" />
                                        <p className="font-grotesk text-sm leading-[1.8] text-white/60">
                                            {activeTarget.desc}
                                        </p>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mission Control HUD UI */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[50] pointer-events-auto">
                <div className="glass-card glass-card-glow rounded-full p-2 flex items-center gap-2">
                    <button
                        onClick={() => handleToggle("system")}
                        className={`relative px-8 py-3 rounded-full transition-all duration-500 overflow-hidden ${view === "system" ? "text-white" : "text-white/40 hover:text-white/70"}`}
                    >
                        {view === "system" && (
                            <motion.div layoutId="active-pill" className="absolute inset-0 bg-white/10 rounded-full" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                        )}
                        <span className="relative z-10 font-grotesk text-[10px] uppercase tracking-[0.4em]">Solar System</span>
                    </button>
                    <div className="w-[1px] h-4 bg-white/20" />
                    <button
                        onClick={() => handleToggle("earth")}
                        className={`relative px-8 py-3 rounded-full transition-all duration-500 overflow-hidden ${view === "earth" ? "text-white" : "text-white/40 hover:text-white/70"}`}
                    >
                        {view === "earth" && (
                            <motion.div layoutId="active-pill" className="absolute inset-0 bg-white/10 rounded-full" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                        )}
                        <span className="relative z-10 font-grotesk text-[10px] uppercase tracking-[0.4em]">Earth Satellite</span>
                    </button>
                </div>
            </div>

        </main>
    );
}
