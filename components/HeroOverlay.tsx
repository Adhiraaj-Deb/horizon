"use client";

import { useScroll, useTransform, motion } from "framer-motion";

const phrases = [
    { text: "Beyond Light.", label: "Speed of Light / 299,792 km/s", range: [0, 0.08, 0.13, 0.17] as const },
    { text: "Beyond Time.", label: "Event Horizon / Temporal Dilation", range: [0.17, 0.24, 0.28, 0.32] as const },
    { text: "Beyond Understanding.", label: "Singularity / Physics Undefined", range: [0.32, 0.39, 0.43, 0.47] as const },
    { text: "The Event Horizon.", label: "Synalpy — 2026", range: [0.47, 0.54, 0.65, 0.70] as const },
];

function PhraseLayer({ text, label, range }: { text: string; label: string; range: readonly [number, number, number, number] }) {
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [range[0], range[1], range[2], range[3]], [0, 1, 1, 0]);
    const y = useTransform(scrollYProgress, [range[0], range[3]], [50, -50]);
    const blur = useTransform(scrollYProgress, [range[0], range[1], range[2], range[3]], ["blur(20px)", "blur(0px)", "blur(0px)", "blur(20px)"]);
    const scale = useTransform(scrollYProgress, [range[0], range[1], range[2], range[3]], [0.88, 1, 1, 0.88]);

    const isTitle = text === "The Event Horizon.";

    return (
        <motion.div
            style={{ opacity, y, filter: blur, scale }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
        >
            {/* Top label chip */}
            <motion.div className="mb-7 px-4 py-1.5 glass-card glass-card-glow rounded-full">
                <span className="font-grotesk text-[9px] md:text-[10px] uppercase tracking-[0.45em] text-white/35">
                    {label}
                </span>
            </motion.div>

            {/* Main title */}
            <h1
                className={`text-liquid-metal font-bebas leading-none select-none
          ${isTitle
                        ? "text-[clamp(3.5rem,13vw,10rem)] tracking-[0.06em]"
                        : "text-[clamp(2.8rem,10vw,8rem)]  tracking-[0.05em]"
                    }`}
            >
                {text}
            </h1>

            {/* Glow separator for final card */}
            {isTitle && (
                <div className="mt-10 flex flex-col items-center gap-3">
                    <div className="glow-line w-24" />
                    <span className="font-grotesk text-[10px] uppercase tracking-[0.55em] text-white/20">
                        Scroll to explore
                    </span>
                </div>
            )}
        </motion.div>
    );
}

export default function HeroOverlay() {
    return (
        <div className="fixed inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
            {phrases.map((p) => (
                <PhraseLayer key={p.text} text={p.text} label={p.label} range={p.range} />
            ))}
        </div>
    );
}
