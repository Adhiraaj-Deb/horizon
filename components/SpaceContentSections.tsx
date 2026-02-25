"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const sections = [
    {
        index: "01",
        title: "The Singularity",
        desc: "At the heart of every black hole lies a point of infinite density. Here the known laws of physics collapse entirely — leaving only mystery where equations once held.",
        align: "left" as const,
    },
    {
        index: "02",
        title: "Time Dilation",
        desc: "Proximity to massive gravity wells warps spacetime so severely that time itself slows. One hour near the event horizon may equal seven years on Earth.",
        align: "right" as const,
    },
    {
        index: "03",
        title: "The Information Paradox",
        desc: "Does information survive beyond the event horizon? Hawking radiation suggests something escapes — but the nature of what emerges remains one of physics' deepest unsolved mysteries.",
        align: "left" as const,
    },
    {
        index: "04",
        title: "Interstellar Travel",
        desc: "Some theorists propose traversable wormholes — shortcuts through folded spacetime — could allow humanity to cross incomprehensible distances in an instant.",
        align: "right" as const,
    },
    {
        index: "05",
        title: "The Unknown",
        desc: "We stand at the threshold of human understanding. Beyond the event horizon there are no answers — only the infinite, terrifying, beautiful unknown.",
        align: "left" as const,
    },
];

/* ─── Single Section ─── */
function SpineSection({ sec, isLast }: { sec: typeof sections[0]; isLast: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: false, amount: 0.45 });

    const isLeft = sec.align === "left";

    return (
        <div
            ref={ref}
            className="relative grid items-center"
            style={{
                gridTemplateColumns: "1fr auto 1fr",
                minHeight: "50vh",
                paddingTop: "80px",
                paddingBottom: isLast ? "60px" : "80px",
            }}
        >
            {/* ─── Left column ─── */}
            <div className={`${isLeft ? "pr-12 md:pr-20" : ""}`}>
                {isLeft && (
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                        transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
                        className="text-right"
                    >
                        <h2 className="font-bebas text-[clamp(2.8rem,6vw,5rem)] text-liquid-metal leading-[0.92] tracking-wide mb-6">
                            {sec.title}
                        </h2>
                        <p className="font-grotesk text-[15px] leading-[1.72] text-white/55 max-w-[520px] ml-auto">
                            {sec.desc}
                        </p>
                    </motion.div>
                )}
            </div>

            {/* ─── Spine anchor ─── */}
            <div className="flex flex-col items-center justify-center relative z-10 w-16">
                <motion.span
                    initial={{ opacity: 0.2 }}
                    animate={isInView ? { opacity: 0.85 } : { opacity: 0.2 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="font-bebas text-[3.2rem] leading-none text-liquid-metal select-none"
                >
                    {sec.index}
                </motion.span>

                {/* Soft pulse dot on the spine */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
                    className="absolute w-2 h-2 rounded-full mt-20"
                    style={{ background: "rgba(255,255,255,0.25)" }}
                />
            </div>

            {/* ─── Right column ─── */}
            <div className={`${!isLeft ? "pl-12 md:pl-20" : ""}`}>
                {!isLeft && (
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                        transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
                        className="text-left"
                    >
                        <h2 className="font-bebas text-[clamp(2.8rem,6vw,5rem)] text-liquid-metal leading-[0.92] tracking-wide mb-6">
                            {sec.title}
                        </h2>
                        <p className="font-grotesk text-[15px] leading-[1.72] text-white/55 max-w-[520px]">
                            {sec.desc}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

/* ─── Main Component ─── */
export default function SpaceContentSections() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start end", "end start"] });

    /* Spine brightness tracks scroll */
    const spineOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 0.12, 0.12, 0]);

    return (
        <div ref={wrapRef} className="relative z-20 bg-black text-white w-full overflow-hidden">
            {/* ─── Deep background nebulae ─── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    className="absolute rounded-full"
                    style={{
                        width: 600,
                        height: 600,
                        top: "15%",
                        left: "-8%",
                        background: "radial-gradient(circle, rgba(40,50,120,0.08) 0%, transparent 70%)",
                        filter: "blur(80px)",
                    }}
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute rounded-full"
                    style={{
                        width: 500,
                        height: 500,
                        bottom: "10%",
                        right: "-5%",
                        background: "radial-gradient(circle, rgba(60,30,80,0.06) 0%, transparent 70%)",
                        filter: "blur(80px)",
                    }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 8 }}
                />
            </div>

            {/* ─── Central Gravitational Spine ─── */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] pointer-events-none">
                <motion.div
                    style={{ opacity: spineOpacity }}
                    className="w-full h-full"
                >
                    <div
                        className="w-full h-full"
                        style={{
                            background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.35) 15%, rgba(200,210,240,0.2) 50%, rgba(255,255,255,0.35) 85%, transparent 100%)",
                        }}
                    />
                </motion.div>
            </div>

            {/* ─── Content ─── */}
            <div className="max-w-6xl mx-auto px-6 md:px-16 py-48">
                {sections.map((sec, i) => (
                    <SpineSection key={sec.index} sec={sec} isLast={i === sections.length - 1} />
                ))}
            </div>

            {/* ─── End marker ─── */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 1.2 }}
                className="flex flex-col items-center gap-4 pb-32"
            >
                <div
                    className="w-32 h-[1px]"
                    style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)" }}
                />
                <p className="font-grotesk text-[9px] uppercase tracking-[0.6em] text-white/12">
                    End Transmission
                </p>
            </motion.div>
        </div>
    );
}
