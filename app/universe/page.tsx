"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const universeSections = [
    {
        title: "The Macro Scale",
        desc: "The observable universe is approximately 93 billion light-years in diameter. It contains over 2 trillion galaxies, each home to billions of stars and countless rogue planets adrift in the dark.",
        align: "left",
    },
    {
        title: "Dark Matter",
        desc: "Visible matter — stars, planets, dust, and you — makes up less than 5% of the universe. The rest is divided between dark energy driving cosmic expansion and dark matter acting as the invisible scaffold holding galaxies together.",
        align: "right",
    },
    {
        title: "Cosmic Web",
        desc: "Galaxies are not scattered randomly. They trace vast filaments, converging into massive superclusters. Between them lie immense cosmic voids, hundreds of millions of light-years across, containing almost nothing.",
        align: "left",
    }
];

export default function UniversePage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    return (
        <main className="relative min-h-screen bg-black overflow-hidden" ref={containerRef}>
            <Navbar />

            {/* Extreme Deep Parallax Background */}
            <motion.div
                className="fixed inset-0 pointer-events-none opacity-40 z-0"
                style={{ y: backgroundY }}
            >
                <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[150%] bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center object-cover mix-blend-screen" />
                <div className="absolute inset-0 bg-black/60" />
            </motion.div>

            {/* Content wrapper */}
            <div className="relative z-10 pt-48 pb-32 max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-64">

                {/* Hero Concept */}
                <motion.div
                    initial={{ opacity: 0, filter: "blur(20px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mt-32"
                >
                    <div className="inline-block mb-6 px-5 py-2 glass-card rounded-full border border-white/[0.05]">
                        <span className="font-grotesk text-[9px] uppercase tracking-[0.6em] text-white/30">
                            Expansion Concept
                        </span>
                    </div>
                    <h1 className="font-bebas text-[clamp(4rem,15vw,10rem)] text-liquid-metal leading-[0.8] tracking-widest uppercase mb-12">
                        The<br />Universe
                    </h1>
                    <div className="w-1px h-48 bg-gradient-to-b from-white/20 to-transparent mx-auto" />
                </motion.div>

                {/* Floating Sections */}
                {universeSections.map((sec, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 80, filter: "blur(10px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className={`w-full flex ${sec.align === "left" ? "justify-start" : "justify-end"}`}
                    >
                        <div className="max-w-[500px]">
                            <h2 className="font-bebas text-[3rem] text-liquid-metal tracking-wider mb-6 leading-none">
                                {sec.title}
                            </h2>
                            <p className="font-grotesk text-[15px] leading-[1.8] text-white/50">
                                {sec.desc}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <Footer />
        </main>
    );
}
