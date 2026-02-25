"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
    totalFrames?: number;
    onComplete?: () => void;
}

export default function LoadingScreen({ totalFrames = 500, onComplete }: LoadingScreenProps) {
    const [progress, setProgress] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [exiting, setExiting] = useState(false);

    const handleProgress = useCallback((count: number) => {
        setProgress(Math.round((count / totalFrames) * 100));
    }, [totalFrames]);

    useEffect(() => {
        let loadedCount = 0;

        for (let i = 1; i <= totalFrames; i++) {
            const img = new Image();
            const paddedIndex = i.toString().padStart(4, "0");
            img.src = `/extracted_frames/frame_${paddedIndex}.webp`;

            const onDone = () => {
                loadedCount++;
                handleProgress(loadedCount);

                if (loadedCount >= totalFrames) {
                    /* Small delay so user sees 100% */
                    setTimeout(() => {
                        setExiting(true);
                        setTimeout(() => {
                            setLoaded(true);
                            onComplete?.();
                        }, 900);
                    }, 400);
                }
            };

            img.onload = onDone;
            img.onerror = onDone; /* Don't block on missing frames */
        }
    }, [totalFrames, handleProgress, onComplete]);

    if (loaded) return null;

    return (
        <AnimatePresence>
            {!loaded && (
                <motion.div
                    key="loader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    animate={exiting ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
                    style={{ cursor: "wait" }}
                >
                    {/* Subtle ambient glow */}
                    <div
                        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
                        style={{
                            background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
                            filter: "blur(60px)",
                        }}
                    />

                    {/* Brand */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="font-bebas text-[clamp(2rem,6vw,3.5rem)] text-liquid-metal tracking-[0.2em] mb-12 select-none"
                    >
                        SYNALPY
                    </motion.p>

                    {/* Progress bar track */}
                    <div className="relative w-48 h-[1px] bg-white/[0.08] overflow-hidden rounded-full">
                        <motion.div
                            className="absolute top-0 left-0 h-full rounded-full"
                            style={{
                                width: `${progress}%`,
                                background: "linear-gradient(to right, rgba(255,255,255,0.2), rgba(255,255,255,0.5))",
                            }}
                            transition={{ duration: 0.15, ease: "linear" }}
                        />
                    </div>

                    {/* Percentage */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="font-grotesk text-[11px] tracking-[0.4em] text-white/25 mt-6 tabular-nums"
                    >
                        {progress}%
                    </motion.p>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="font-grotesk text-[9px] uppercase tracking-[0.5em] text-white/10 mt-4"
                    >
                        Loading assets
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
