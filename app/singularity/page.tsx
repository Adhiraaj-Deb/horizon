"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SingularityPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll progress to mutate the singularity dot
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

    // Map scroll to dot scale, glow, and rotation
    const dotScale = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [1, 2, 8, 40]);
    const blurAmount = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], ["blur(2px)", "blur(10px)", "blur(40px)", "blur(100px)"]);
    const glowOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [0.4, 1, 0]);

    // Text appearance sequence
    const text1Opacity = useTransform(scrollYProgress, [0.05, 0.15, 0.25], [0, 1, 0]);
    const text2Opacity = useTransform(scrollYProgress, [0.35, 0.45, 0.55], [0, 1, 0]);
    const text3Opacity = useTransform(scrollYProgress, [0.65, 0.75, 0.85], [0, 1, 0]);

    return (
        <main className="relative bg-black" ref={containerRef}>
            <Navbar />

            {/* The Anomaly (Sticky to center of screen) */}
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
                <motion.div
                    className="bg-white rounded-full mix-blend-screen"
                    style={{
                        width: 8,
                        height: 8,
                        scale: dotScale,
                        filter: blurAmount,
                        opacity: glowOpacity,
                    }}
                />
                {/* Core absolute white dot */}
                <motion.div
                    className="absolute bg-white rounded-full shadow-[0_0_20px_#fff]"
                    style={{
                        width: 4,
                        height: 4,
                        opacity: useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.8, 0]),
                    }}
                />
            </div>

            {/* Scrollable Container */}
            <div className="relative z-20 h-[500vh] pointer-events-none">
                {/* Sequence 1 */}
                <motion.div
                    className="fixed inset-0 flex items-center justify-center"
                    style={{ opacity: text1Opacity }}
                >
                    <div className="text-center max-w-xl px-6 mix-blend-difference">
                        <h2 className="font-bebas text-[5rem] text-white tracking-widest leading-none mb-6">
                            Infinite Density
                        </h2>
                        <p className="font-grotesk text-lg text-white/80 tracking-wide uppercase">
                            Matter crushed beyond physical limits
                        </p>
                    </div>
                </motion.div>

                {/* Sequence 2 */}
                <motion.div
                    className="fixed inset-0 flex items-center justify-center"
                    style={{ opacity: text2Opacity }}
                >
                    <div className="text-center max-w-xl px-6 mix-blend-difference">
                        <h2 className="font-bebas text-[7rem] text-white tracking-widest leading-none mb-6">
                            Physics Break
                        </h2>
                        <p className="font-grotesk text-lg text-white/80 tracking-wide uppercase">
                            Einstein's equations fail here
                        </p>
                    </div>
                </motion.div>

                {/* Sequence 3 */}
                <motion.div
                    className="fixed inset-0 flex items-center justify-center"
                    style={{ opacity: text3Opacity }}
                >
                    <div className="text-center max-w-2xl px-6 mix-blend-difference">
                        <h2 className="font-bebas text-[9rem] text-white tracking-widest leading-[0.85] mb-6">
                            The End of Time
                        </h2>
                        <p className="font-grotesk text-lg text-white/80 tracking-wide uppercase">
                            No space. No duration. Only the point.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Footer anchor space so the scroll reaches the end gracefully */}
            <div className="relative z-30 bg-transparent h-[100vh]" />
            <Footer />
        </main>
    );
}
