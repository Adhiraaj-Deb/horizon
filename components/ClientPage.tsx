"use client";

import { useState } from "react";
import FrameScrollCanvas from "@/components/FrameScrollCanvas";
import HeroOverlay from "@/components/HeroOverlay";
import SpaceContentSections from "@/components/SpaceContentSections";
import AstronautPointer from "@/components/AstronautPointer";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import IframePreloader from "@/components/IframePreloader";

export default function ClientPage() {
    const [assetsLoaded, setAssetsLoaded] = useState(false);

    return (
        <>
            <IframePreloader />
            <LoadingScreen onComplete={() => setAssetsLoaded(true)} />

            <main
                className="relative min-h-screen bg-black"
                style={{ overflow: assetsLoaded ? undefined : "hidden", height: assetsLoaded ? undefined : "100vh" }}
            >
                <Navbar />

                {/* Scrolling container for canvas + text layer */}
                <div className="relative w-full h-[800vh]">
                    <FrameScrollCanvas />
                    <HeroOverlay />
                </div>

                {/* Content sections below the scroll map */}
                <div className="relative z-20 bg-black">
                    <SpaceContentSections />
                    <AstronautPointer />
                    <Footer />
                </div>
            </main>
        </>
    );
}
