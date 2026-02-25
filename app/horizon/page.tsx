"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HorizonPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

    // Time state
    const [earthTime, setEarthTime] = useState(0);
    const [shipTime, setShipTime] = useState(0);

    // Hook scroll progress to a math state variable to animate numbers
    // This avoids expensive React state updates on every scroll frame by using framer motion's onChange Hook correctly inside a useEffect if needed, but since we want actual numbers, we can just use `useTransform` and standard React state in a requestAnimationFrame loop, or simplify with a direct effect mapping.

    useEffect(() => {
        let animationFrameId: number;

        const renderLoop = () => {
            const p = scrollYProgress.get();

            // Earth time ticks linearly based on scroll (simulating incredibly fast passage)
            // e.g. 0 to 80,000,000 years
            const maxEarthYears = 8000000;
            setEarthTime(Math.floor(p * maxEarthYears));

            // Ship time curves logarithmically (slowing down as it approaches the horizon)
            // e.g. 0 to 7 years. Uses a square root curve to simulate extreme dilation.
            const maxShipYears = 7;
            setShipTime(Math.floor(Math.sqrt(p) * maxShipYears * 365 * 24)); // in hours to show small increments

            animationFrameId = requestAnimationFrame(renderLoop);
        };

        renderLoop();
        return () => cancelAnimationFrame(animationFrameId);
    }, [scrollYProgress]);

    // Visual threshold sweep
    const thresholdScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const textOpacityFade = useTransform(scrollYProgress, [0.8, 1], [1, 0.1]);

    return (
        <main className="relative bg-black h-[400vh]" ref={containerRef}>
            <Navbar />

            {/* Split screen threshold layout */}
            <div className="fixed inset-0 pointer-events-none z-10 flex">

                {/* Left Side: The Observer (Earth) */}
                <div className="w-1/2 h-full flex flex-col justify-center items-end pr-12 md:pr-24 border-r border-white/10">
                    <motion.div style={{ opacity: textOpacityFade }} className="text-right">
                        <p className="font-grotesk text-[10px] uppercase tracking-[0.5em] text-white/30 mb-8">
                            Observer reference frame
                        </p>
                        <p className="font-bebas text-[5rem] text-liquid-metal tabular-nums leading-none tracking-widest">
                            {earthTime.toLocaleString()} <span className="text-[2rem] text-white/40">YRS</span>
                        </p>
                        <p className="font-grotesk text-sm text-white/50 mt-4 max-w-[300px] ml-auto">
                            From the outside, your fall seems to take an eternity. Centuries pass in blink of an eye.
                        </p>
                    </motion.div>
                </div>

                {/* Right Side: The Infalling Object (Ship) */}
                <div className="w-1/2 h-full flex flex-col justify-center items-start pl-12 md:pl-24 relative">

                    {/* Sweeping threshold gradient representing the event horizon approaching */}
                    <motion.div
                        className="absolute left-0 top-0 bottom-0 w-[40vw]"
                        style={{
                            background: "linear-gradient(to right, rgba(200,220,255,0.03), transparent)",
                            scaleY: thresholdScaleY,
                            originY: 0
                        }}
                    />

                    <motion.div style={{ opacity: textOpacityFade }}>
                        <p className="font-grotesk text-[10px] uppercase tracking-[0.5em] text-white/30 mb-8">
                            Infalling reference frame
                        </p>
                        <p className="font-bebas text-[5rem] text-liquid-metal tabular-nums leading-none tracking-widest">
                            {(shipTime / 24).toFixed(1)} <span className="text-[2rem] text-white/40">DAYS</span>
                        </p>
                        <p className="font-grotesk text-sm text-white/50 mt-4 max-w-[300px]">
                            For you, time flows normally. But you are approaching the threshold where spacetime trades places.
                        </p>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
