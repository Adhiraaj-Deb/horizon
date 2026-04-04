"use client";

import { useEffect, useRef } from "react";

// We must tell Cesium where its static assets live BEFORE importing anything from cesium
// This has to be set at module-evaluation time (not inside useEffect)
if (typeof window !== "undefined") {
    (window as any).CESIUM_BASE_URL = "/cesium/";
}

export default function CesiumGlobe() {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current || viewerRef.current) return;

        let viewer: any = null;

        async function initCesium() {
            // Dynamically import cesium so it's only evaluated client-side
            const Cesium = await import("cesium");
            // Load Cesium's widgets CSS dynamically to avoid TS module-resolution errors
            await import(/* webpackIgnore: true */ "/cesium/Widgets/widgets.css" as any)
                .catch(() => {
                    // Fallback: inject via link tag if dynamic import fails
                    if (!document.querySelector('link[href*="cesium/Widgets"]')) {
                        const link = document.createElement("link");
                        link.rel = "stylesheet";
                        link.href = "/cesium/Widgets/widgets.css";
                        document.head.appendChild(link);
                    }
                });

            // Set the Ion token
            Cesium.Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_TOKEN ?? "";

            // Initialise the viewer with all built-in buttons hidden — Horizon's own UI takes over
            viewer = new Cesium.Viewer(containerRef.current!, {
                // Terrain: real 3D elevation (mountains, ocean trenches)
                terrain: Cesium.Terrain.fromWorldTerrain(),

                // Hide all default Cesium toolbar UI
                animation: false,         // No play/pause clock widget
                baseLayerPicker: false,   // No layer picker
                fullscreenButton: false,  // No fullscreen button
                geocoder: false,          // No search bar
                homeButton: false,        // No home button
                infoBox: false,           // No click-info popup
                sceneModePicker: false,   // No 2D/3D toggle
                selectionIndicator: false,// No green selection ring
                timeline: false,          // No timeline scrubber
                navigationHelpButton: false, // No help button
                navigationInstructionsInitiallyVisible: false,
            });

            // Store ref for cleanup
            viewerRef.current = viewer;

            // Enable lighting from the sun so the night-side of Earth is dark (cinematic)
            viewer.scene.globe.enableLighting = true;

            // Add OSM 3D Buildings — every building on Earth rendered in 3D
            try {
                const buildingsTileset = await Cesium.Cesium3DTileset.fromIonAssetId(96188);
                viewer.scene.primitives.add(buildingsTileset);
            } catch (e) {
                // Buildings may not load if token is not yet approved — globe still works
                console.warn("OSM Buildings failed to load:", e);
            }

            // Start camera looking at Earth from a beautiful "from space" angle
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(78.9629, 20.5937, 18_000_000),
                orientation: {
                    heading: Cesium.Math.toRadians(0),
                    pitch: Cesium.Math.toRadians(-90),
                    roll: 0,
                },
                duration: 0, // Instant - no intro flight animation
            });
        }

        initCesium().catch(console.error);

        return () => {
            if (viewerRef.current && !viewerRef.current.isDestroyed()) {
                viewerRef.current.destroy();
                viewerRef.current = null;
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full h-full"
            style={{ background: "#000" }}
        />
    );
}
