"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from 'next/link';

const links = [
    { name: "Home", href: "/" },
    { name: "Universe", href: "/universe" },
    { name: "System", href: "/system" },
    { name: "Singularity", href: "/singularity" },
    { name: "Horizon", href: "/horizon" },
    { name: "Events", href: "/events" },
];

export default function Footer() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: false, margin: "-8%" });
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
    const bgGlow = useTransform(scrollYProgress, [0, 1], ["rgba(255,255,255,0.0)", "rgba(255,255,255,0.05)"]);

    return (
        <footer ref={ref} className="relative z-20 bg-black overflow-hidden pt-32 pb-16 px-6">
            {/* ... other code skipped conceptually via slicing below ... */}

            {/* Skip replacing the whole thing, just target the map */}
            {/* Scanlines overlay */}
            <div className="scanlines absolute inset-0 pointer-events-none" />

            {/* Large radial glow that brightens as footer enters viewport */}
            <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-64 pointer-events-none"
                style={{ background: bgGlow, filter: "blur(100px)" }}
            />

            {/* Animated top border */}
            <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={inView ? { scaleX: 1, opacity: 1 } : { scaleX: 0 }}
                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-0 left-0 right-0 h-[1px] origin-left"
                style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.2) 70%, transparent)" }}
            />

            <div className="max-w-5xl mx-auto flex flex-col items-center gap-12 text-center relative z-10">

                {/* Big brand wordmark */}
                <motion.div
                    initial={{ opacity: 0, y: 30, filter: "blur(14px)" }}
                    animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                    transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="font-bebas text-[clamp(4rem,14vw,9rem)] text-liquid-metal leading-none tracking-[0.1em]"
                >
                    HORIZON
                </motion.div>

                {/* Glow separator */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 1.1, delay: 0.35 }}
                    className="glow-line w-28 opacity-50"
                />

                {/* Tagline */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="font-grotesk text-[11px] uppercase tracking-[0.55em] text-white/20 -mt-6"
                >
                    Exploring the frontier — one pixel at a time.
                </motion.p>

                {/* Nav links as glass chips */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.9, delay: 0.6 }}
                    className="flex flex-wrap justify-center gap-3"
                >
                    {links.map((l) => (
                        <Link key={l.name} href={l.href}>
                            <motion.div
                                className="glass-card glass-card-glow rounded-full px-5 py-2 cursor-pointer"
                                whileHover={{ scale: 1.06, backgroundColor: "rgba(255,255,255,0.06)" }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <span className="font-grotesk text-[10px] uppercase tracking-[0.4em] text-white/25">
                                    {l.name}
                                </span>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>

                {/* Three small ambient dots */}
                <div className="flex gap-4 -mt-4">
                    {[0, 0.4, 0.8].map((d) => (
                        <motion.div
                            key={d}
                            className="w-1 h-1 rounded-full bg-white/15"
                            animate={{ opacity: [0.15, 0.5, 0.15] }}
                            transition={{ duration: 2.5, delay: d, repeat: Infinity, ease: "easeInOut" }}
                        />
                    ))}
                </div>

                {/* Copyright */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 1, delay: 0.9 }}
                    className="font-grotesk text-[10px] text-white/10 tracking-widest mt-2"
                >
                    © 2026 Synalpy — All Rights Reserved
                </motion.p>
            </div>
        </footer>
    );
}
