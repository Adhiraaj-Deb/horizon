"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function AstronautPointer() {
    const { scrollYProgress } = useScroll();

    // All hooks before early return
    const progressBarHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
    const y = useTransform(scrollYProgress, [0, 1], ["0vh", "82vh"]);
    const opacity = useTransform(scrollYProgress, [0, 0.04, 0.92, 1], [0, 1, 1, 0]);
    const rotate = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [-5, 10, -8, 12, -5]);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <motion.div
            className="fixed right-7 top-[9vh] z-50 hidden lg:flex flex-col items-center gap-2 pointer-events-none"
            style={{ y, opacity }}
        >
            {/* Track */}
            <div className="relative w-[1px] h-16 bg-white/[0.06] overflow-hidden rounded-full">
                <motion.div
                    className="absolute top-0 left-0 w-full bg-white/30 rounded-full"
                    style={{ height: progressBarHeight }}
                />
            </div>

            {/* Icon */}
            <motion.div style={{ rotate }} className="relative flex items-center justify-center">
                {/* Ring pulse */}
                <motion.div
                    className="absolute w-8 h-8 rounded-full border border-white/15"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute w-4 h-4 rounded-full border border-white/10"
                    animate={{ scale: [1, 2.2, 1], opacity: [0.2, 0, 0.2] }}
                    transition={{ duration: 3, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Glass dot center */}
                <div className="w-3 h-3 rounded-full glass-card border border-white/20 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white/50" />
                </div>
            </motion.div>

            {/* Bottom track */}
            <div className="w-[1px] h-10 bg-gradient-to-b from-white/[0.06] to-transparent" />

            {/* Label */}
            <p
                className="font-bebas text-[8px] tracking-[0.3em] text-white/15"
                style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
            >
                SCROLL
            </p>
        </motion.div>
    );
}
