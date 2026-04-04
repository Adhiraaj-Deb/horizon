"use client";

import { useEffect, useRef, useState } from "react";

// Initialize global config before script executes
if (typeof window !== "undefined") {
    (window as any).CESIUM_BASE_URL = "/cesium/";
}

export default function CesiumGlobe() {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<any>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (!containerRef.current || viewerRef.current) return;

        let script: HTMLScriptElement | null = null;
        let link: HTMLLinkElement | null = null;

        const loadCesium = async () => {
            try {
                // 1. Load CSS natively
                if (!document.querySelector('link[href*="cesium/Widgets/widgets.css"]')) {
                    link = document.createElement("link");
                    link.rel = "stylesheet";
                    link.href = "/cesium/Widgets/widgets.css";
                    document.head.appendChild(link);
                }

                // 2. Load the Cesium engine script natively (bypasses Next.js Webpack completely)
                await new Promise<void>((resolve, reject) => {
                    if ((window as any).Cesium) {
                        resolve();
                        return;
                    }
                    script = document.createElement("script");
                    script.src = "/cesium/Cesium.js";
                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error("Failed to load Cesium engine script."));
                    document.body.appendChild(script);
                });

                const Cesium = (window as any).Cesium;
                
                if (!Cesium || !Cesium.Viewer) {
                    throw new Error("Cesium object not found on window.");
                }

                // Hardcoding the frontend token since Vercel builds lack the local .env file.
                // Note: Cesium tokens are public by design; you restrict them to your domain on the Cesium dashboard.
                Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMDZmY2Y4MS00ZGI2LTQyMDYtYTI0OC0wMTc0MGQzMTdkMmUiLCJpZCI6NDEzNjExLCJpYXQiOjE3NzUyODY3MjZ9.1SFEy2mNkAcqeyS6DAOO5BfDC115kF82WTUGFUj8ieY";

                // Initialize Viewer
                const viewer = new Cesium.Viewer(containerRef.current!, {
                    terrain: Cesium.Terrain.fromWorldTerrain(),
                    animation: false,
                    baseLayerPicker: false,
                    fullscreenButton: false,
                    geocoder: false,
                    homeButton: false,
                    infoBox: false,
                    sceneModePicker: false,
                    selectionIndicator: false,
                    timeline: false,
                    navigationHelpButton: false,
                    navigationInstructionsInitiallyVisible: false,
                });

                viewerRef.current = viewer;

                // Configure aesthetics
                try {
                    viewer.scene.globe.enableLighting = true;
                } catch(e) {}

                // Buildings
                try {
                    const buildingsTileset = await Cesium.Cesium3DTileset.fromIonAssetId(96188);
                    viewer.scene.primitives.add(buildingsTileset);
                } catch (e) {
                    console.warn("OSM Buildings failed to load:", e);
                }

                // Initial Camera Position
                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(78.9629, 20.5937, 18_000_000),
                    orientation: {
                        heading: Cesium.Math.toRadians(0),
                        pitch: Cesium.Math.toRadians(-90),
                        roll: 0,
                    },
                    duration: 0,
                });

            } catch (err: any) {
                console.error("Cesium Initialisation Error:", err);
                setErrorMsg(err.message || "Unknown error creating globe.");
            }
        };

        loadCesium();

        return () => {
            if (viewerRef.current && !viewerRef.current.isDestroyed()) {
                viewerRef.current.destroy();
                viewerRef.current = null;
            }
            // Cleanup script tags if component unmounts quickly
            if (script && document.body.contains(script)) document.body.removeChild(script);
            // We usually keep the CSS to avoid unstyled flashes later
        };
    }, []);

    if (errorMsg) {
        return (
            <div className="w-full h-full bg-black flex flex-col items-center justify-center p-8 text-center border border-red-500/30 rounded-xl">
                <p className="font-bebas text-2xl text-red-400 mb-2">TELEMETRY ERROR</p>
                <p className="font-grotesk text-sm text-white/50">{errorMsg}</p>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="w-full h-full"
            style={{ background: "#000" }}
        />
    );
}
