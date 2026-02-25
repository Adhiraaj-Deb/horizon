"use client";

import { useEffect, useRef } from "react";

export default function FrameScrollCanvas() {
    const containerRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const framesRef = useRef<HTMLImageElement[]>([]);

    // Animation state
    const targetFrameIndex = useRef<number>(0);
    const currentFrameIndex = useRef<number>(0);
    const lastDrawnFrame = useRef<number>(-1);

    // Rendering variables
    const isReady = useRef<boolean>(false);
    const rafId = useRef<number | null>(null);

    useEffect(() => {
        const totalFrames = 500;
        let loadedCount = 0;

        for (let i = 1; i <= totalFrames; i++) {
            const img = new Image();
            const paddedIndex = i.toString().padStart(4, "0");
            img.src = `/extracted_frames/frame_${paddedIndex}.webp`;

            img.onload = () => {
                loadedCount++;
                if (loadedCount === 1) {
                    isReady.current = true;
                    // Initial draw
                    drawFrameRef(0);
                    startAnimationLoop();
                }
            };

            framesRef.current.push(img);
        }

        const resizeCanvas = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;

            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;

            ctx.scale(dpr, dpr);

            // Force redraw on resize
            if (isReady.current && lastDrawnFrame.current >= 0) {
                drawFrameRef(lastDrawnFrame.current);
            }
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        const drawFrameRef = (index: number) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const img = framesRef.current[index];
            if (!img || !img.complete || img.naturalWidth === 0) return;

            lastDrawnFrame.current = index;

            const canvasWidth = window.innerWidth;
            const canvasHeight = window.innerHeight;

            const imgRatio = img.width / img.height;
            const canvasRatio = canvasWidth / canvasHeight;

            let drawWidth = canvasWidth;
            let drawHeight = canvasHeight;
            let offsetX = 0;
            let offsetY = 0;

            if (canvasRatio > imgRatio) {
                drawHeight = canvasWidth / imgRatio;
                offsetY = (canvasHeight - drawHeight) / 2;
            } else {
                drawWidth = canvasHeight * imgRatio;
                offsetX = (canvasWidth - drawWidth) / 2;
            }

            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        // Render loop for smooth interpolation
        const renderLoop = () => {
            if (!isReady.current) {
                rafId.current = requestAnimationFrame(renderLoop);
                return;
            }

            // LERP interpolation
            currentFrameIndex.current += (targetFrameIndex.current - currentFrameIndex.current) * 0.08;

            const frameToDraw = Math.round(currentFrameIndex.current);

            // Only draw if frame index actually changed
            if (frameToDraw !== lastDrawnFrame.current) {
                drawFrameRef(frameToDraw);
            }

            rafId.current = requestAnimationFrame(renderLoop);
        };

        const startAnimationLoop = () => {
            if (rafId.current === null) {
                rafId.current = requestAnimationFrame(renderLoop);
            }
        };

        const handleScroll = () => {
            if (!containerRef.current) return;

            const { top, height } = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            const maxScroll = height - windowHeight;
            const scrolled = -top;

            let progress = scrolled / maxScroll;
            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;

            // Float target for LERP, clamping safely
            targetFrameIndex.current = Math.max(0, Math.min(progress * (totalFrames - 1), totalFrames - 1));
        };

        // Decoupled scroll listener
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("scroll", handleScroll);
            if (rafId.current !== null) {
                cancelAnimationFrame(rafId.current);
                rafId.current = null;
            }
        };
    }, []);

    return (
        <section ref={containerRef} className="absolute inset-0 bg-black z-0">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
            </div>
        </section>
    );
}
