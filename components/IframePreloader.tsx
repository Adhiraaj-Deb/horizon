"use client";

import { useEffect, useState } from "react";

export default function IframePreloader() {
    const [shouldLoad, setShouldLoad] = useState(false);

    // Delay the preload slightly so we don't block the main thread 
    // during the critical initial loading of the homepage frames.
    useEffect(() => {
        const timer = setTimeout(() => {
            setShouldLoad(true);
        }, 4000); // Wait 4 seconds after mount to start heavy preloading
        return () => clearTimeout(timer);
    }, []);

    if (!shouldLoad) return null;

    return (
        <div style={{ display: 'none', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
            {/* 
        By mounting these iframes invisibly on the root layout, 
        the browser aggressively downloads all their assets, WebGL contexts, 
        and scripts into the disk cache. When the user navigates to /system,
        the browser simply pulls from the cache, making it load almost instantly.
      */}
            <iframe
                src="https://eyes.nasa.gov/apps/solar-system/?embed=true"
                width="10"
                height="10"
                loading="eager"
            />
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d100000000!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sus!4v1715000000000!5m2!1sen!2sus&maptype=satellite"
                width="10"
                height="10"
                loading="eager"
            />
        </div>
    );
}
