"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Link from 'next/link';

export default function Navbar() {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        const threshold = window.innerHeight * 7;
        if (latest < threshold) {
            setHidden(true);
        } else {
            setHidden(latest > previous);
        }
    });

    return (
        <motion.nav
            variants={{ visible: { y: 0, opacity: 1 }, hidden: { y: "-120%", opacity: 0 } }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-10 pt-4"
        >
            <div className="relative glass-card glass-card-glow rounded-2xl px-6 py-3.5 flex justify-between items-center overflow-hidden scanlines">
                {/* Ambient accent glow behind logo */}
                <div className="ambient-spot w-40 h-40 -left-10 -top-10 opacity-[0.04]"
                    style={{ background: "white" }} />

                <Link href="/" className="flex items-center gap-3 relative z-10 group">
                    <span className="font-bebas text-2xl tracking-widest text-white mt-1">
                        HORIZON
                    </span>
                </Link>

                {/* Center Navigation Links (hidden on mobile) */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/" className="font-grotesk text-[10px] uppercase tracking-[0.45em] text-white/40 hover:text-white transition-colors duration-300">
                        Home
                    </Link>
                    <div className="w-[1px] h-3 bg-white/20" />
                    <Link href="/universe" className="font-grotesk text-[10px] uppercase tracking-[0.45em] text-white/40 hover:text-white transition-colors duration-300">
                        Universe
                    </Link>
                    <div className="w-[1px] h-3 bg-white/20" />
                    <Link href="/system" className="font-grotesk text-[10px] uppercase tracking-[0.45em] text-white/40 hover:text-white transition-colors duration-300">
                        System
                    </Link>
                    <div className="w-[1px] h-3 bg-white/20" />
                    <Link href="/singularity" className="font-grotesk text-[10px] uppercase tracking-[0.45em] text-white/40 hover:text-white transition-colors duration-300">
                        Singularity
                    </Link>
                    <div className="w-[1px] h-3 bg-white/20" />
                    <Link href="/horizon" className="font-grotesk text-[10px] uppercase tracking-[0.45em] text-white/40 hover:text-white transition-colors duration-300">
                        Horizon
                    </Link>
                    <div className="w-[1px] h-3 bg-white/20" />
                    <Link href="/events" className="font-grotesk text-[10px] uppercase tracking-[0.45em] text-white/40 hover:text-white transition-colors duration-300">
                        Events
                    </Link>
                </div>

                {/* Live indicator dot (desktop) */}
                <div className="hidden md:flex items-center gap-2 relative z-10">
                    <motion.div
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-1.5 h-1.5 rounded-full bg-white/40"
                    />
                    <span className="font-grotesk text-[10px] uppercase tracking-[0.3em] text-white/20">
                        Live
                    </span>
                </div>

                {/* Mobile Hamburger toggle for Events Sidebar */}
                <button
                    onClick={() => window.dispatchEvent(new Event('toggle-events-sidebar'))}
                    className="md:hidden relative z-10 w-8 h-8 flex flex-col justify-center items-center gap-1.5 text-white/60 hover:text-white transition-colors"
                    aria-label="Toggle Events Sidebar"
                >
                    <span className="w-5 h-[1px] bg-current" />
                    <span className="w-5 h-[1px] bg-current" />
                    <span className="w-5 h-[1px] bg-current" />
                </button>
            </div>
        </motion.nav>
    );
}
