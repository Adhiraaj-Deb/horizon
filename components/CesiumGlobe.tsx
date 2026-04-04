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
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (!containerRef.current || viewerRef.current) return;

        let viewer: any = null;

        async function initCesium() {
            try {
                // Dynamically import cesium 
                const CesiumModule = await import("cesium");
                
                // Webpack/NextJS dynamic imports sometimes wrap the module in `.default`
                const Cesium = CesiumModule.Viewer ? CesiumModule : (CesiumModule as any).default;

                if (!Cesium || !Cesium.Viewer) {
                    throw new Error("Cesium failed to load correctly from the module.");
                }

                // Load Cesium's widgets CSS dynamically
                await import(/* webpackIgnore: true */ "/cesium/Widgets/widgets.css" as any)
                    .catch(() => {
                        if (!document.querySelector('link[href*="cesium/Widgets"]')) {
                            const link = document.createElement("link");
                            link.rel = "stylesheet";
                            link.href = "/cesium/Widgets/widgets.css";
                            document.head.appendChild(link);
                        }
                    });

                Cesium.Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_TOKEN ?? "";

                viewer = new Cesium.Viewer(containerRef.current!, {
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

                // Lighting
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

                // Start camera looking at Earth
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
                console.error("Cesium init error:", err);
                setErrorMsg(err.message || "Failed to initialize the 3D globe.");
            }
        }

        initCesium();

        return () => {
            if (viewerRef.current && !viewerRef.current.isDestroyed()) {
                viewerRef.current.destroy();
                viewerRef.current = null;
            }
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
