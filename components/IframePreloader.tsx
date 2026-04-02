"use client";

import { useEffect, useState } from "react";

/**
 * IframePreloader
 *
 * Mounted globally in the root layout so it runs on EVERY page of the site.
 *
 * Strategy:
 *   1. Wait 5 seconds after the page mounts (gives the visible page time to
 *      fully render and settle without competing for bandwidth/CPU).
 *   2. Silently render a 1×1px hidden iframe pointing at NASA Eyes on the
 *      Solar System.  The browser downloads all of NASA's JavaScript bundle,
 *      WebGL shaders, planet textures, satellite meshes, and star-field data
 *      straight into the browser's HTTP disk cache.
 *   3. When the user later navigates to /events, the browser fetches every
 *      asset from cache instead of the network — near-instant load.
 *
 * The iframe is display:none / 1×1px so it never affects layout or UX.
 * The `loading="eager"` attribute tells the browser to start downloading
 * immediately (not lazily) once the component mounts.
 */
export default function IframePreloader() {
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        // 5 second grace period — the visible page loads first, then we cache NASA
        const timer = setTimeout(() => setShouldLoad(true), 5000);
        return () => clearTimeout(timer);
    }, []);

    if (!shouldLoad) return null;

    return (
        <div
            aria-hidden="true"
            style={{
                position: "fixed",
                bottom: 0,
                right: 0,
                width: 1,
                height: 1,
                overflow: "hidden",
                opacity: 0,
                pointerEvents: "none",
                zIndex: -1,
            }}
        >
            {/*
                NASA Eyes on the Solar System — this is the heavy iframe used on /events.
                Loading it here (invisibly, on every page) pre-warms the browser cache
                so the /events page loads near-instantly for the user.
            */}
            <iframe
                src="https://eyes.nasa.gov/apps/solar-system/?embed=true"
                width="1"
                height="1"
                loading="eager"
                title="NASA Eyes Preloader"
                sandbox="allow-scripts allow-same-origin"
            />
        </div>
    );
}
