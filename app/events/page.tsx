"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

type EventType = "meteor" | "supermoon" | "planet-parade" | "eclipse" | "opposition" | "colored-moon";

type SpaceEvent = {
    id: string;
    name: string;
    date: Date;
    type: EventType;
    description: string;
    details: string;
    peakRate?: string; // meteors per hour
    visibility?: string;
    nasaTarget?: string; // NASA Eyes hash target to fly to
};

// ─── Hardcoded authoritative event data from NASA / Sky & Telescope ───────────
const EVENTS: SpaceEvent[] = [
    // 2026 Events (upcoming from Feb 2026)
    {
        id: "feb26-planet-parade",
        name: "Planet Parade",
        date: new Date("2026-02-28"),
        type: "planet-parade",
        description: "Six-Planet Grand Parade",
        details: "Mercury, Venus, Neptune, Saturn, Uranus & Jupiter align in a sweeping arc across the evening sky after sunset. Four are visible to the naked eye.",
        visibility: "Evening sky, 30 min after sunset",
        nasaTarget: "saturn",
    },
    {
        id: "lyrids-26",
        name: "Lyrid Meteor Shower",
        date: new Date("2026-04-22"),
        type: "meteor",
        description: "Lyrid Meteor Shower Peak",
        details: "One of the oldest known meteor showers. Origins from comet Thatcher dust trail. The waxing crescent moon sets early, providing ideal dark skies.",
        peakRate: "10–20 meteors/hr",
        visibility: "Northern Hemisphere, after midnight",
        nasaTarget: "earth",
    },
    {
        id: "eta-aquariids-26",
        name: "Eta Aquariid Shower",
        date: new Date("2026-05-05"),
        type: "meteor",
        description: "Eta Aquariid Meteor Shower Peak",
        details: "Debris from Halley's Comet. At peak, southern hemisphere observers can see up to 50 meteors/hr. Northern viewers see a lower rate.",
        peakRate: "20–50 meteors/hr",
        visibility: "Best from Southern Hemisphere",
        nasaTarget: "earth",
    },
    {
        id: "perseids-26",
        name: "Perseid Meteor Shower",
        date: new Date("2026-08-12"),
        type: "meteor",
        description: "Perseid Meteor Shower — Excellent Year",
        details: "2026 is an exceptional year for Perseids. The new moon phase guarantees perfectly dark skies. Debris from comet Swift-Tuttle. One of the most spectacular annual showers.",
        peakRate: "50–100 meteors/hr",
        visibility: "Northern Hemisphere, after midnight",
        nasaTarget: "earth",
    },
    {
        id: "supermoon-jan-26",
        name: "Wolf Supermoon",
        date: new Date("2026-01-03"),
        type: "supermoon",
        description: "Full Wolf Supermoon",
        details: "The January full moon rises as a Supermoon, appearing up to 14% larger and 30% brighter than a typical full moon. Known as the Wolf Moon.",
        visibility: "Worldwide, all night",
        nasaTarget: "earth",
    },
    {
        id: "supermoon-nov-26",
        name: "Beaver Supermoon",
        date: new Date("2026-11-24"),
        type: "supermoon",
        description: "Full Beaver Supermoon",
        details: "November's full moon reaches perigee, making it appear dramatically enlarged. The Beaver Moon marks the beginning of winter stargazing season.",
        visibility: "Worldwide, all night",
        nasaTarget: "earth",
    },
    {
        id: "supermoon-dec-26",
        name: "Cold Supermoon",
        date: new Date("2026-12-24"),
        type: "supermoon",
        description: "Full Cold Supermoon",
        details: "A rare Christmas Eve Supermoon. The December Cold Moon reaches its closest point to Earth, dominating the winter solstice sky.",
        visibility: "Worldwide, all night",
        nasaTarget: "earth",
    },
    {
        id: "orionids-26",
        name: "Orionid Meteor Shower",
        date: new Date("2026-10-21"),
        type: "meteor",
        description: "Orionid Meteor Shower Peak",
        details: "Fast and bright meteors from Halley's Comet debris. Often produce fireballs. A waxing gibbous moon interferes in the evening but skies darken after midnight.",
        peakRate: "10–20 meteors/hr",
        visibility: "Both hemispheres, after midnight",
        nasaTarget: "earth",
    },
    {
        id: "geminids-26",
        name: "Geminid Meteor Shower",
        date: new Date("2026-12-13"),
        type: "meteor",
        description: "Geminid Meteor Shower Peak",
        details: "The most prolific meteor shower of the year. Peculiarly, it originates not from a comet but from the asteroid 3200 Phaethon. The waxing crescent moon sets early providing ideal conditions.",
        peakRate: "50–75 meteors/hr",
        visibility: "Both hemispheres, all night",
        nasaTarget: "earth",
    },
    {
        id: "lunar-eclipse-mar-26",
        name: "Total Lunar Eclipse",
        date: new Date("2026-03-03"),
        type: "eclipse",
        description: "Blood Moon — Total Lunar Eclipse",
        details: "The Moon passes completely into Earth's shadow, turning a deep copper red — the Blood Moon effect. Visible in its entirety across western North America, Oceania, and Asia.",
        visibility: "Western N. America, Oceania, Asia",
        nasaTarget: "earth",
    },
    {
        id: "solar-eclipse-aug-26",
        name: "Total Solar Eclipse",
        date: new Date("2026-08-12"),
        type: "eclipse",
        description: "Total Solar Eclipse",
        details: "Path of totality cuts through Greenland, Iceland, and Spain. A rare opportunity for European observers. Viewers outside the path see a partial eclipse.",
        visibility: "Greenland, Iceland, Spain",
        nasaTarget: "sol",
    },
];

const TYPE_CONFIG: Record<EventType, { label: string; color: string; glow: string }> = {
    "meteor": { label: "Meteor Shower", color: "text-amber-300/80", glow: "rgba(251,191,36,0.15)" },
    "supermoon": { label: "Supermoon", color: "text-blue-300/80", glow: "rgba(147,197,253,0.15)" },
    "planet-parade": { label: "Planet Parade", color: "text-purple-300/80", glow: "rgba(216,180,254,0.15)" },
    "eclipse": { label: "Eclipse", color: "text-red-400/80", glow: "rgba(248,113,113,0.15)" },
    "opposition": { label: "Opposition", color: "text-green-300/80", glow: "rgba(134,239,172,0.15)" },
    "colored-moon": { label: "Colored Moon", color: "text-orange-300/80", glow: "rgba(253,186,116,0.15)" },
};

function getDaysUntil(date: Date): number {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function getUpcomingEvents(): SpaceEvent[] {
    const now = new Date();
    return EVENTS
        .filter(e => getDaysUntil(e.date) >= -1) // include ongoing events
        .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export default function EventsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<SpaceEvent | null>(null);
    const [iframeKey, setIframeKey] = useState("default");
    const [now, setNow] = useState(new Date());

    const upcoming = getUpcomingEvents();
    const nextEvent = upcoming[0] ?? null;

    // Tick clock every minute for live countdown
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60_000);
        return () => clearInterval(interval);
    }, []);

    const handleEventClick = (event: SpaceEvent) => {
        setSelectedEvent(event === selectedEvent ? null : event);
        if (event.nasaTarget) {
            setIframeKey(`${event.nasaTarget}-${Date.now()}`);
        }
    };

    return (
        <main className="relative w-screen h-screen bg-black overflow-hidden select-none">
            <Navbar />

            {/* ── Background: NASA Eyes embeds ───────────────────────────── */}
            <div className="absolute inset-0 z-0 bg-black">
                <AnimatePresence mode="wait">
                    {selectedEvent?.type === "meteor" ? (
                        /* For meteor showers: show NASA meteor data mashup + Eyes side by side */
                        <motion.div
                            key="meteor-view"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.2 }}
                            className="w-full h-full flex"
                        >
                            {/* NASA Eyes on one side */}
                            <iframe
                                key={`solar-${iframeKey}`}
                                src={`https://eyes.nasa.gov/apps/solar-system/?embed=true&time=${encodeURIComponent(selectedEvent.date.toISOString().replace('Z', '+00:00'))}&rate=0#/earth`}
                                className="absolute border-none"
                                style={{ left: '-350px', width: 'calc(65% + 350px)', height: '100%' }}
                            />
                            {/* NASA Meteor live data / Fireball dashboard on the other */}
                            <iframe
                                src="https://eyes.nasa.gov/apps/meteor/?embed=true"
                                className="absolute right-0 w-[45%] h-full border-none"
                                onError={() => { }}
                            />
                        </motion.div>
                    ) : (
                        <motion.iframe
                            key={`solar-${iframeKey}`}
                            initial={{ opacity: 0, scale: 1.04 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                            src={selectedEvent?.nasaTarget
                                ? `https://eyes.nasa.gov/apps/solar-system/?embed=true&time=${encodeURIComponent(selectedEvent.date.toISOString().replace('Z', '+00:00'))}&rate=0#/${selectedEvent.nasaTarget}`
                                : "https://eyes.nasa.gov/apps/solar-system/?embed=true"
                            }
                            className="absolute h-full border-none"
                            style={{ left: '-400px', width: 'calc(100% + 400px)' }}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Cinematic overlays */}
            <div className="absolute inset-0 pointer-events-none z-[10] shadow-[inset_0_0_180px_rgba(0,0,0,0.85)]" />
            <div className="absolute inset-0 pointer-events-none z-[10] scanlines opacity-30" />


            {/* ── Bottom Left: Page Title + Next Event ──────────────────── */}
            <div className="absolute bottom-10 left-8 z-[40] pointer-events-none">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-grotesk text-[9px] uppercase tracking-[0.55em] text-white/25 mb-2"
                >
                    Celestial Calendar — 2026
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.8 }}
                    className="font-bebas text-[3.4rem] leading-[0.85] text-liquid-metal tracking-wider mb-5"
                >
                    Space Events
                </motion.h1>

                {/* Thin separator */}
                <div className="w-10 h-[1px] bg-white/15 mb-5" />

                {/* Next Event pill — compact and clean */}
                {nextEvent && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-1 h-1 rounded-full bg-white/40 animate-pulse" />
                        <div>
                            <span className={`font-grotesk text-[9px] uppercase tracking-[0.35em] ${TYPE_CONFIG[nextEvent.type].color}`}>
                                Next —&nbsp;
                            </span>
                            <span className="font-grotesk text-[9px] uppercase tracking-[0.35em] text-white/50">
                                {nextEvent.name}
                            </span>
                            <p className="font-grotesk text-[9px] text-white/25 mt-0.5">
                                {formatDate(nextEvent.date)}&nbsp;&nbsp;·&nbsp;&nbsp;
                                {getDaysUntil(nextEvent.date) <= 0 ? "Happening now" : `${getDaysUntil(nextEvent.date)} days away`}
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* ── Sidebar toggle button ─────────────────────────────────── */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={() => setSidebarOpen(v => !v)}
                className="absolute top-24 right-6 z-[60] glass-card glass-card-glow rounded-full px-5 py-2.5 flex items-center gap-3 text-white/60 hover:text-white transition-colors"
            >
                <span className="font-grotesk text-[9px] uppercase tracking-[0.4em]">
                    {sidebarOpen ? "Hide Events" : "Show Events"}
                </span>
                <motion.div
                    animate={{ rotate: sidebarOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="text-xs"
                >
                    ›
                </motion.div>
            </motion.button>

            {/* ── RIGHT SIDEBAR ──────────────────────────────────────────── */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 220, damping: 28 }}
                        className="absolute right-0 top-0 bottom-0 w-[340px] z-[50] bg-black/50 backdrop-blur-2xl border-l border-white/8 flex flex-col"
                    >
                        {/* Sidebar header */}
                        <div className="px-7 pt-28 pb-5 border-b border-white/8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-grotesk text-[9px] uppercase tracking-[0.45em] text-white/30">
                                        2025 — 2026
                                    </p>
                                    <h2 className="font-bebas text-2xl tracking-widest text-white mt-0.5">
                                        Upcoming Events
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors text-xs"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Event list */}
                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
                            {upcoming.map((event, i) => {
                                const cfg = TYPE_CONFIG[event.type];
                                const daysUntil = getDaysUntil(event.date);
                                const isActive = daysUntil <= 0 && daysUntil >= -3;
                                const isSelected = selectedEvent?.id === event.id;

                                return (
                                    <motion.button
                                        key={event.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        onClick={() => handleEventClick(event)}
                                        className={`w-full text-left rounded-xl p-4 transition-all duration-300 border ${isSelected
                                            ? "bg-white/8 border-white/20"
                                            : "bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10"
                                            }`}
                                        style={isSelected ? { boxShadow: `0 0 30px ${cfg.glow}` } : {}}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {isActive && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[8px] font-grotesk uppercase tracking-widest">
                                                            <span className="w-1 h-1 rounded-full bg-red-400 animate-pulse" />
                                                            Live
                                                        </span>
                                                    )}
                                                    <span className={`font-grotesk text-[9px] uppercase tracking-wider ${cfg.color}`}>
                                                        {cfg.label}
                                                    </span>
                                                </div>
                                                <p className="font-bebas text-lg tracking-wide text-white leading-tight truncate">
                                                    {event.name}
                                                </p>
                                                <p className="font-grotesk text-[10px] text-white/40 mt-0.5">
                                                    {formatDate(event.date)}
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="font-grotesk text-[10px] text-white/30">
                                                    {daysUntil <= 0 ? "Now" : `${daysUntil}d`}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Expanded detail */}
                                        <AnimatePresence>
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-3 pt-3 border-t border-white/8 space-y-2">
                                                        <p className="font-grotesk text-[11px] leading-[1.7] text-white/55">
                                                            {event.details}
                                                        </p>
                                                        {event.peakRate && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-grotesk text-[9px] uppercase tracking-wider text-white/30">Rate</span>
                                                                <span className={`font-grotesk text-[10px] ${cfg.color}`}>{event.peakRate}</span>
                                                            </div>
                                                        )}
                                                        {event.visibility && (
                                                            <div className="flex items-start gap-2">
                                                                <span className="font-grotesk text-[9px] uppercase tracking-wider text-white/30 mt-0.5">Visible</span>
                                                                <span className="font-grotesk text-[10px] text-white/50 flex-1">{event.visibility}</span>
                                                            </div>
                                                        )}
                                                        <p className="font-grotesk text-[9px] uppercase tracking-wider text-white/20 pt-1">
                                                            ↑ Camera flew to target in viewer
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Sidebar footer */}
                        <div className="px-7 py-4 border-t border-white/8">
                            <p className="font-grotesk text-[9px] text-white/20 leading-relaxed">
                                Event data sourced from NASA, Sky & Telescope, and the International Meteor Organization. Times shown in your local timezone.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
