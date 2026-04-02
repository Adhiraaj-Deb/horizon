"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";


type EventType = "meteor" | "supermoon" | "planet-parade" | "eclipse" | "opposition" | "colored-moon" | "mission" | "comet" | "galaxy" | "phenomenon" | "conjunction";

type SpaceEvent = {
    id: string;
    name: string;
    date: Date;
    endDate?: Date; // for multi-day events
    type: EventType;
    description: string;
    details: string;
    peakRate?: string; // meteors per hour
    visibility?: string;
    visibleRegions?: string;
    invisibleRegions?: string;
    visibilityTimeframe?: string;
    nakedEyeVisibility?: string;
    nasaTarget?: string;
    instrument?: string; // telescope/binoculars needed
    magnitude?: string; // apparent magnitude
};


// ─── Comprehensive authoritative event data ──────────────────────────────────
const EVENTS: SpaceEvent[] = [

    // ── 2026: Q1 ────────────────────────────────────────────────────────────
    {
        id: "pink-moon-apr-26",
        name: "Pink Moon",
        date: new Date("2026-04-13"),
        type: "colored-moon",
        description: "April Full Pink Moon",
        details: "April's full moon is traditionally called the Pink Moon, named after the pink wildflower phlox — not because the moon appears pink. At perigee, it rises visibly larger than average. A beautiful naked-eye spectacle.",
        visibility: "Worldwide, dusk to dawn",
        visibleRegions: "Worldwide (except polar regions during continuous daylight)",
        invisibleRegions: "Parts of Antarctic during polar summer",
        visibilityTimeframe: "From moonrise to moonset (entire night)",
        nakedEyeVisibility: "Yes",
        magnitude: "-12.7",
        nasaTarget: "earth",
    },
    {
        id: "lyrids-26",
        name: "Lyrid Meteor Shower",
        date: new Date("2026-04-22"),
        type: "meteor",
        description: "Lyrid Meteor Shower Peak",
        details: "One of the oldest known meteor showers, observed for over 2,700 years. Originates from the dust trail of Comet Thatcher (C/1861 G1). The moon is a thin waxing crescent, providing nearly perfect dark skies.",
        peakRate: "10–20 meteors/hr",
        visibility: "Northern Hemisphere (best), also partially visible from Southern Hemisphere",
        visibleRegions: "Northern Hemisphere",
        invisibleRegions: "Antarctica and the far southern latitudes",
        visibilityTimeframe: "After midnight until dawn",
        nakedEyeVisibility: "Yes",
        nasaTarget: "earth",
    },
    {
        id: "predawn-planet-parade-may-26",
        name: "Pre-Dawn Planet Parade",
        date: new Date("2026-05-04"),
        type: "planet-parade",
        description: "Five-Planet Pre-Dawn Alignment",
        details: "Mars, Jupiter, Saturn, Uranus, and Neptune line up in the pre-dawn sky, visible low on the eastern horizon before sunrise. Saturn and Mars are particularly striking to the naked eye. Binoculars enhance Uranus and Neptune.",
        visibility: "Eastern horizon, 45–60 min before sunrise",
        visibleRegions: "Worldwide (both hemispheres)",
        invisibleRegions: "None specifically — timing varies by location",
        visibilityTimeframe: "45–60 minutes before sunrise",
        nakedEyeVisibility: "Partially — Mars, Jupiter, Saturn: Yes. Uranus and Neptune: binoculars recommended",
        nasaTarget: "saturn",
    },
    {
        id: "eta-aquariids-26",
        name: "Eta Aquariid Shower",
        date: new Date("2026-05-05"),
        type: "meteor",
        description: "Eta Aquariid Meteor Shower Peak",
        details: "Debris from famous Halley's Comet. At peak, southern hemisphere observers can see up to 50 meteors per hour burning up at 66 km/s — extremely fast and bright. Northern viewers see a lower rate of ~10–20/hr.",
        peakRate: "20–50 meteors/hr",
        visibility: "Best from Southern Hemisphere; also visible from Northern Hemisphere at a lower rate",
        visibleRegions: "Southern Hemisphere and equatorial regions",
        invisibleRegions: "Far Northern latitudes (less than 10 meteors/hr from Canada or Northern Europe)",
        visibilityTimeframe: "Pre-dawn hours (approx. 2:00 AM – 5:00 AM local time)",
        nakedEyeVisibility: "Yes",
        nasaTarget: "earth",
    },
    {
        id: "whirlpool-galaxy-jun-26",
        name: "Whirlpool Galaxy (M51) at Best",
        date: new Date("2026-05-20"),
        type: "galaxy",
        description: "Whirlpool Galaxy — Prime Viewing Window",
        details: "Messier 51 (M51), the Whirlpool Galaxy in Canes Venatici, is one of the most photogenic and visually striking galaxies in the night sky. Located only 23 million light-years away, it is interacting with a companion galaxy NGC 5195. Spring through early summer brings M51 to its highest point in the sky for Northern Hemisphere observers.",
        visibility: "Northern Hemisphere skies, high in the northeast after dark",
        visibleRegions: "Northern Hemisphere and mid-latitudes of Southern Hemisphere",
        invisibleRegions: "Extreme southern latitudes (below ~60°S)",
        visibilityTimeframe: "Dark evening skies through midnight",
        nakedEyeVisibility: "No — telescope (4-inch aperture or larger) or strong binoculars required",
        instrument: "Telescope (100mm+ aperture) or large binoculars",
        magnitude: "+8.4",
        nasaTarget: "earth",
    },
    {
        id: "comet-c2026-ai",
        name: "Comet C/2026 A1 (ATLAS)",
        date: new Date("2026-06-10"),
        type: "comet",
        description: "Comet C/2026 A1 — Perihelion Approach",
        details: "Comet C/2026 A1, discovered by the ATLAS survey, makes its closest approach to the Sun (perihelion) with a predicted magnitude that could reach naked-eye visibility from dark skies. Comets are notoriously unpredictable in brightness, but this one is expected to display a visible coma and a tail extending several degrees. Best viewed in the evening sky in the constellation Taurus.",
        visibility: "Low in the western sky after sunset, then climbing higher by July",
        visibleRegions: "Northern Hemisphere (best), some visibility from tropics",
        invisibleRegions: "Deep Southern Hemisphere through June",
        visibilityTimeframe: "Evening sky, 60–90 minutes after sunset",
        nakedEyeVisibility: "Possibly — depends on actual brightness at perihelion. Binoculars greatly enhance the view",
        instrument: "Binoculars or small telescope for best results",
        magnitude: "~5–7 (estimated; subject to change)",
        nasaTarget: "sol",
    },
    {
        id: "saturn-opposition-26",
        name: "Saturn at Opposition",
        date: new Date("2026-06-15"),
        type: "opposition",
        description: "Saturn at Opposition — Rings Edge-On",
        details: "Saturn reaches opposition, rising at sunset and remaining visible all night. In 2026, Saturn's rings are nearly edge-on as seen from Earth — a rare geometry that happens roughly every 15 years. The planet will appear noticeably flattened. Even a small telescope reveals the thin ring line and the Cassini Division.",
        visibility: "Rises at sunset, visible all night",
        visibleRegions: "Worldwide",
        invisibleRegions: "None",
        visibilityTimeframe: "Sunset to sunrise (all night)",
        nakedEyeVisibility: "Yes — a bright creamy-yellow star. Rings visible with a small telescope",
        instrument: "Small telescope (60mm+) reveals ring edge",
        magnitude: "+0.4",
        nasaTarget: "saturn",
    },
    {
        id: "june-solstice-26",
        name: "Summer Solstice",
        date: new Date("2026-06-21"),
        type: "phenomenon",
        description: "June Solstice — Longest Day on Earth",
        details: "The June solstice marks the moment the Sun reaches its northernmost point in the sky, directly overhead at the Tropic of Cancer. This is the longest day of the year in the Northern Hemisphere and the shortest in the Southern Hemisphere. Ancient megalithic sites like Stonehenge align precisely with the rising Sun on this date.",
        visibility: "Worldwide (daytime event)",
        visibleRegions: "Worldwide",
        invisibleRegions: "None",
        visibilityTimeframe: "The entire day",
        nakedEyeVisibility: "Yes — observe by watching sunrise and sunset positions",
        nasaTarget: "sol",
    },

    // ── 2026: Q3 ────────────────────────────────────────────────────────────
    {
        id: "perseids-26",
        name: "Perseid Meteor Shower",
        date: new Date("2026-08-12"),
        type: "meteor",
        description: "Perseid Meteor Shower — Exceptional Year",
        details: "2026 is an exceptional year for the Perseids. The new moon phase guarantees perfectly dark skies — the ideal condition. Meteors originate from the debris trail of Comet Swift-Tuttle, burning up at 59 km/s. Bright fireballs are frequent. One of the most spectacular annual showers, especially for Northern Hemisphere observers.",
        peakRate: "50–100 meteors/hr (or more during outburst years)",
        visibility: "Northern Hemisphere (best); also visible from mid-Southern Hemisphere",
        visibleRegions: "Northern Hemisphere, best above 40°N",
        invisibleRegions: "Southern Hemisphere below ~30°S sees very few Perseids",
        visibilityTimeframe: "Midnight to dawn (peak rate). Some from 10 PM onward",
        nakedEyeVisibility: "Yes",
        nasaTarget: "earth",
    },
    {
        id: "solar-eclipse-aug-26",
        name: "Total Solar Eclipse",
        date: new Date("2026-08-12"),
        type: "eclipse",
        description: "Total Solar Eclipse — Path Through Europe",
        details: "Path of totality cuts through Greenland, Iceland, the Faroe Islands, and across Spain into the Mediterranean and North Africa. A rare opportunity for European observers to witness totality. Within the path, day turns to night for up to 2 minutes. Viewers outside the path see a striking partial eclipse. A generation-defining astronomical event.",
        visibility: "Totality: Greenland, Iceland, Faroe Islands, Spain (Seville, Valencia, Palma). Partial across most of Europe, NW Africa and NE Atlantic.",
        visibleRegions: "Totality: Greenland, Iceland, Faroe Is., Spain. Partial: Most of Europe, NW Africa, North America",
        invisibleRegions: "Asia, Oceania, South America, Antarctica",
        visibilityTimeframe: "Daytime — exact local times depend on path crossing",
        nakedEyeVisibility: "Yes (only with certified eclipse glasses for partial phases; brief totality is naked eye)",
        nasaTarget: "sol",
    },
    {
        id: "artemis-2",
        name: "Artemis II — Crewed Lunar Flyby",
        date: new Date("2026-04-09"),
        type: "mission",
        description: "First Crewed Mission to the Moon Since Apollo 17",
        details: "NASA's Artemis II is the first crewed test flight of the Orion spacecraft and Space Launch System (SLS) around the Moon since Apollo 17 in 1972. A crew of four astronauts — including Jeremy Hansen (the first Canadian astronaut to fly to the Moon) — will travel on a free-return trajectory around the Moon, reaching distances of approximately 8,889 km beyond its far side, a record for crewed spaceflight. The mission lasts approximately 10 days.",
        visibility: "Visible from Earth during launch (Florida, USA) and lunar approach phase",
        visibleRegions: "Launch visible from south-eastern USA and the Caribbean. Lunar pass visible via NASA livestream globally",
        visibilityTimeframe: "Approximately 10-day mission duration starting from launch",
        nakedEyeVisibility: "Partially — Orion capsule visible from Earth with binoculars in low Earth orbit before translunar injection",
        instrument: "Binoculars (low Earth orbit phase only)",
        nasaTarget: "earth",
    },
    {
        id: "draconids-26",
        name: "Draconid Meteor Shower",
        date: new Date("2026-10-08"),
        type: "meteor",
        description: "Draconid Meteor Shower — Evening Shower",
        details: "Unlike most meteor showers, Draconids are best viewed in the evening rather than pre-dawn. The shower radiates from the head of the constellation Draco. Activity varies significantly year to year — some years produce only 5–10 meteors/hr, while outburst years can produce hundreds. Linked to Comet 21P/Giacobini-Zinner.",
        peakRate: "Variable: 5–20 meteors/hr (outburst years: hundreds)",
        visibility: "Northern Hemisphere, evening hours",
        visibleRegions: "Northern Hemisphere (primarily)",
        invisibleRegions: "Southern Hemisphere (Draco barely rises above horizon)",
        visibilityTimeframe: "Evening, 7 PM – midnight (best before midnight)",
        nakedEyeVisibility: "Yes",
        nasaTarget: "earth",
    },
    {
        id: "orionids-26",
        name: "Orionid Meteor Shower",
        date: new Date("2026-10-21"),
        type: "meteor",
        description: "Orionid Meteor Shower Peak",
        details: "Fast and bright meteors from Halley's Comet debris, burning up at 66 km/s. Frequently produce fireballs and persistent trains. The waxing gibbous moon interferes in the early evening but skies darken after it sets around midnight. Best viewed in the pre-dawn hours.",
        peakRate: "10–20 meteors/hr",
        visibility: "Both hemispheres, pre-dawn hours",
        visibleRegions: "Worldwide (both hemispheres)",
        invisibleRegions: "None",
        visibilityTimeframe: "After midnight until dawn",
        nakedEyeVisibility: "Yes",
        nasaTarget: "earth",
    },
    {
        id: "beaver-supermoon-nov-26",
        name: "Beaver Supermoon",
        date: new Date("2026-11-24"),
        type: "supermoon",
        description: "Full Beaver Supermoon — November",
        details: "November's full moon rises near perigee, making it a Supermoon. It appears up to 14% larger and 30% brighter than a typical full moon at apogee. The Beaver Moon gets its name from when Indigenous peoples traditionally set traps before beaver ponds froze. Also marks the start of peak winter stargazing season.",
        visibility: "Worldwide, dusk to dawn",
        visibleRegions: "Worldwide",
        invisibleRegions: "None",
        visibilityTimeframe: "Moonrise to moonset (entire night)",
        nakedEyeVisibility: "Yes",
        nasaTarget: "earth",
    },
    {
        id: "leonids-26",
        name: "Leonid Meteor Shower",
        date: new Date("2026-11-17"),
        type: "meteor",
        description: "Leonid Meteor Shower Peak",
        details: "The Leonids are famous for producing spectacular storms of thousands of meteors per hour in certain years (notably 1833, 1966, and 1999). While most years produce a modest 10–15/hr, the shower is characterized by extremely fast meteors (70 km/s) and spectacular fireballs. Debris from Comet Tempel-Tuttle.",
        peakRate: "10–15 meteors/hr (storm years possible: 1000+/hr)",
        visibility: "Best: Northern Hemisphere",
        visibleRegions: "Northern Hemisphere and equatorial regions",
        invisibleRegions: "Deep Southern Hemisphere sees fewer meteors",
        visibilityTimeframe: "Midnight to dawn",
        nakedEyeVisibility: "Yes",
        nasaTarget: "earth",
    },
    {
        id: "geminids-26",
        name: "Geminid Meteor Shower",
        date: new Date("2026-12-13"),
        type: "meteor",
        description: "Geminid Meteor Shower — Best Shower of 2026",
        details: "The most prolific meteor shower of the year, active both between evening and dawn. Unusually, it originates not from a comet but from the asteroid 3200 Phaethon. Meteors are multicolored (white, yellow, blue, green) and relatively slow (35 km/s). The waxing crescent moon sets before midnight, giving ideal dark skies for the peak.",
        peakRate: "50–120 meteors/hr",
        visibility: "Both hemispheres, all night — peaks after midnight",
        visibleRegions: "Worldwide (best in Northern Hemisphere)",
        invisibleRegions: "Antarctica (continuous polar daylight)",
        visibilityTimeframe: "9 PM local time to dawn",
        nakedEyeVisibility: "Yes",
        nasaTarget: "earth",
    },
    {
        id: "cold-supermoon-dec-26",
        name: "Cold Supermoon",
        date: new Date("2026-12-24"),
        type: "supermoon",
        description: "Christmas Eve Full Cold Supermoon",
        details: "A rare and spectacular Christmas Eve Supermoon. December's Cold Moon reaches near perigee — its closest point to Earth — dominating the winter solstice sky at maximum brightness. A beautiful naked-eye spectacle for holiday-season observers worldwide.",
        visibility: "Worldwide, dusk to dawn",
        visibleRegions: "Worldwide",
        invisibleRegions: "None",
        visibilityTimeframe: "Moonrise (shortly after sunset) to dawn",
        nakedEyeVisibility: "Yes",
        nasaTarget: "earth",
    },
    {
        id: "ursids-26",
        name: "Ursid Meteor Shower",
        date: new Date("2026-12-22"),
        type: "meteor",
        description: "Ursid Meteor Shower — Winter Solstice Shower",
        details: "The Ursids peak near the winter solstice, radiating from Ursa Minor. Often overlooked due to cold winter conditions in the North, they reward patient observers with 5–10 meteors/hr — occasionally producing outbursts of 50+/hr. Linked to Comet 8P/Tuttle. Best from Northern Hemisphere, high northern latitudes have all-night visibility.",
        peakRate: "5–10 meteors/hr (outburst years: 50+/hr)",
        visibility: "Northern Hemisphere (circumpolar for Arctic regions)",
        visibleRegions: "Northern Hemisphere, especially high latitudes",
        invisibleRegions: "Southern Hemisphere (radiant never rises)",
        visibilityTimeframe: "All night from high northern latitudes",
        nakedEyeVisibility: "Yes",
        nasaTarget: "earth",
    },

    // ── 2026: Q1 Other ──────────────────────────────────────────────────────
    {
        id: "wolf-supermoon-jan-26",
        name: "Wolf Supermoon",
        date: new Date("2026-01-03"),
        type: "supermoon",
        description: "Full Wolf Supermoon — January",
        details: "January's full moon rises as a Supermoon, appearing up to 14% larger and 30% brighter than a typical full moon at apogee. The Wolf Moon name comes from Indigenous traditions of hearing wolves howl on cold winter nights.",
        visibility: "Worldwide, all night",
        visibleRegions: "Worldwide",
        invisibleRegions: "None",
        visibilityTimeframe: "Dusk to dawn (all night)",
        nakedEyeVisibility: "Yes",
        nasaTarget: "earth",
    },
    {
        id: "blood-moon-mar-26",
        name: "Total Lunar Eclipse (Blood Moon)",
        date: new Date("2026-03-03"),
        type: "eclipse",
        description: "Blood Moon — Total Lunar Eclipse",
        details: "The Moon passes completely into Earth's umbral shadow, turning a deep copper-red — the Blood Moon effect caused by all of Earth's sunrises and sunsets reflecting onto the lunar surface simultaneously. Totality lasts approximately 58 minutes.",
        visibility: "Western North America, Oceania, Eastern Asia, Pacific",
        visibleRegions: "Western North America, Hawaii, New Zealand, Australia, Japan, Eastern Asia",
        invisibleRegions: "Europe, Africa, Western Asia, Eastern South America",
        visibilityTimeframe: "Night hours — specific times depend on time zone",
        nakedEyeVisibility: "Yes",
        nasaTarget: "earth",
    },
    {
        id: "planet-parade-feb-26",
        name: "Six-Planet Grand Parade",
        date: new Date("2026-02-28"),
        type: "planet-parade",
        description: "Six Planets Align After Sunset",
        details: "Mercury, Venus, Neptune, Saturn, Uranus, and Jupiter align in a sweeping arc across the evening sky after sunset — one of the most spectacular naked-eye events of the decade. Four planets are visible without optical aid, while Uranus and Neptune require binoculars. A once-in-many-years alignment visible all over the world.",
        visibility: "Evening sky, 30–45 minutes after sunset",
        visibleRegions: "Worldwide (clear southern horizon needed)",
        invisibleRegions: "None specifically — polar regions may have difficulty depending on season",
        visibilityTimeframe: "30–45 minutes after sunset (before planets sink below horizon)",
        nakedEyeVisibility: "Mercury, Venus, Saturn, Jupiter: Yes. Uranus, Neptune: binoculars only",
        nasaTarget: "saturn",
    },

    // ── 2027 Events ─────────────────────────────────────────────────────────
    {
        id: "andromeda-galaxy-best-27",
        name: "Andromeda Galaxy at Best",
        date: new Date("2027-09-25"),
        type: "galaxy",
        description: "Andromeda Galaxy — Prime Autumn Viewing",
        details: "The Andromeda Galaxy (M31) is the farthest object visible to the naked eye — at 2.537 million light-years away. In autumn, it rides high in the night sky and is best seen from dark locations. Under dark skies, it appears as a faint oval smudge 6× the full moon's diameter. A small telescope reveals its two satellite galaxies: M32 and M110.",
        visibility: "Northern Hemisphere, high overhead in autumn; also visible from Southern Hemisphere",
        visibleRegions: "Northern Hemisphere and mid-latitudes of Southern Hemisphere",
        invisibleRegions: "Antarctica and far southern latitudes",
        visibilityTimeframe: "From astronomical darkness through midnight",
        nakedEyeVisibility: "Yes — from dark sites (Magnitude 3.4). From cities, binoculars or telescope needed",
        instrument: "Naked eye (dark skies) or binoculars (suburban/urban)",
        magnitude: "3.4",
        nasaTarget: "earth",
    },
    {
        id: "total-lunar-eclipse-jun-27",
        name: "Total Lunar Eclipse",
        date: new Date("2027-06-26"),
        type: "eclipse",
        description: "Total Lunar Eclipse — Visible from Americas & Europe",
        details: "A total lunar eclipse visible from the Americas and Europe brings the Blood Moon spectacle to billions of observers. The Moon spends over an hour in totality, glowing deep red-copper as Earth's atmosphere bends sunlight around the planet.",
        visibility: "Americas, Europe, western Africa",
        visibleRegions: "North America, South America, Europe, Western Africa",
        invisibleRegions: "Asia, Oceania (Moon below horizon at totality)",
        visibilityTimeframe: "Evening through night",
        nakedEyeVisibility: "Yes",
        nasaTarget: "earth",
    },
    {
        id: "solar-eclipse-aug-27",
        name: "Total Solar Eclipse",
        date: new Date("2027-08-02"),
        type: "eclipse",
        description: "Total Solar Eclipse — Longest of the 21st Century",
        details: "The total solar eclipse of August 2, 2027 is the longest of the entire 21st century, with totality lasting up to 6 minutes and 22 seconds. The path of totality sweeps across Gibraltar, Morocco, Algeria, Libya, Egypt, Saudi Arabia, Yemen, and Somalia — crossing some of the world's driest and most reliably sunny skies, offering exceptional viewing conditions.",
        visibility: "Totality path: Gibraltar, Morocco, Algeria, Libya, Egypt, Saudi Arabia, Yemen, Somalia. Partial: Europe, Middle East, South/SE Asia",
        visibleRegions: "Totality: N. Africa, Arabian Peninsula. Partial: Wider region from W. Europe to India",
        invisibleRegions: "Americas, Oceania, Antarctica",
        visibilityTimeframe: "Daytime — exact local times depend on location on the path",
        nakedEyeVisibility: "Yes (ONLY with certified eclipse glasses for partial phases; totality is naked eye)",
        nasaTarget: "sol",
    },
    {
        id: "perseids-27",
        name: "Perseid Meteor Shower 2027",
        date: new Date("2027-08-13"),
        type: "meteor",
        description: "Perseid Meteor Shower Peak — 2027",
        details: "The annual Perseid meteor shower peaks around August 11–13 every year. In 2027, the moon phase will determine viewing conditions. The Perseids are fast, bright, and frequently produce spectacular fireballs from Comet Swift-Tuttle debris. A perennial favourite for summer stargazing.",
        peakRate: "50–100+ meteors/hr (conditions-dependent)",
        visibility: "Northern Hemisphere (best after midnight)",
        visibleRegions: "Northern Hemisphere",
        invisibleRegions: "Southern Hemisphere below ~30°S",
        visibilityTimeframe: "Midnight to dawn",
        nakedEyeVisibility: "Yes",
        nasaTarget: "earth",
    },
    {
        id: "venus-mercury-conjunction-mar-26",
        name: "Venus–Mercury Conjunction",
        date: new Date("2026-03-22"),
        type: "conjunction",
        description: "Venus and Mercury in Tight Conjunction",
        details: "Venus and Mercury appear only 0.1° apart in the western sky just after sunset — so close they could both fit within the field of view of a telescope eyepiece or binoculars at the same time. Venus blazes brilliantly while Mercury, often elusive, rides along beside it, making it easy to spot.",
        visibility: "Low in the western sky, 30–45 minutes after sunset",
        visibleRegions: "Worldwide (clear unobstructed western horizon required)",
        invisibleRegions: "None specifically",
        visibilityTimeframe: "30–45 minutes after sunset until they set",
        nakedEyeVisibility: "Yes — both visible to naked eye; binoculars show both in same field of view",
        nasaTarget: "sol",
    },
    {
        id: "jupiter-opposition-26",
        name: "Jupiter at Opposition",
        date: new Date("2026-09-26"),
        type: "opposition",
        description: "Jupiter at Opposition — Largest & Brightest",
        details: "Jupiter reaches opposition, rising at sunset and remaining visible all night. It is closest to Earth, appearing at its largest and brightest in the night sky. Even binoculars reveal its four Galilean moons (Io, Europa, Ganymede, Callisto). A telescope shows cloud bands and the Great Red Spot. The brightest non-Moon object in the night sky.",
        visibility: "Rises at sunset, visible all night in the eastern sky",
        visibleRegions: "Worldwide",
        invisibleRegions: "None",
        visibilityTimeframe: "Sunset to sunrise (all night)",
        nakedEyeVisibility: "Yes — magnitude -2.9, the brightest point of light in the night sky",
        instrument: "Binoculars reveal moons; telescope reveals cloud bands",
        magnitude: "-2.9",
        nasaTarget: "jupiter",
    },
    {
        id: "december-solstice-26",
        name: "Winter Solstice",
        date: new Date("2026-12-21"),
        type: "phenomenon",
        description: "December Solstice — Longest Night",
        details: "The December solstice marks the moment the Sun reaches its southernmost point, directly overhead at the Tropic of Capricorn. This is the shortest day (longest night) of the year in the Northern Hemisphere, and the longest day in the Southern Hemisphere. Ancient alignments from Stonehenge to Newgrange mark this date.",
        visibility: "Worldwide (daytime / astronomical phenomenon)",
        visibleRegions: "Worldwide",
        invisibleRegions: "None",
        visibilityTimeframe: "The entire day — sunset/sunrise positions mark the solstice",
        nakedEyeVisibility: "Yes — observe the Sun's southernmost rise and set positions",
        nasaTarget: "sol",
    },
];


const TYPE_CONFIG: Record<EventType, { label: string; color: string; glow: string }> = {
    "meteor":        { label: "Meteor Shower",   color: "text-amber-300/80",   glow: "rgba(251,191,36,0.15)" },
    "supermoon":     { label: "Supermoon",        color: "text-blue-300/80",    glow: "rgba(147,197,253,0.15)" },
    "planet-parade": { label: "Planet Parade",   color: "text-purple-300/80",  glow: "rgba(216,180,254,0.15)" },
    "eclipse":       { label: "Eclipse",          color: "text-red-400/80",     glow: "rgba(248,113,113,0.15)" },
    "opposition":    { label: "Opposition",       color: "text-green-300/80",   glow: "rgba(134,239,172,0.15)" },
    "colored-moon":  { label: "Colored Moon",     color: "text-orange-300/80",  glow: "rgba(253,186,116,0.15)" },
    "mission":       { label: "Space Mission",    color: "text-cyan-300/80",    glow: "rgba(103,232,249,0.15)" },
    "comet":         { label: "Comet",            color: "text-teal-300/80",    glow: "rgba(94,234,212,0.15)" },
    "galaxy":        { label: "Deep Sky Object",  color: "text-violet-300/80",  glow: "rgba(196,181,253,0.15)" },
    "phenomenon":    { label: "Phenomenon",        color: "text-yellow-200/80",  glow: "rgba(254,240,138,0.15)" },
    "conjunction":   { label: "Conjunction",      color: "text-pink-300/80",   glow: "rgba(249,168,212,0.15)" },
};

function getDaysUntil(date: Date): number {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function getUpcomingEvents(): SpaceEvent[] {
    return EVENTS
        .filter(e => getDaysUntil(e.date) >= -3) // include events from past 3 days (ongoing)
        .sort((a, b) => a.date.getTime() - b.date.getTime());
}

function getYearRange(): string {
    const now = new Date();
    const maxYear = Math.max(...EVENTS.map(e => e.date.getFullYear()));
    return now.getFullYear() === maxYear
        ? String(now.getFullYear())
        : `${now.getFullYear()} — ${maxYear}`;
}

export default function EventsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<SpaceEvent | null>(null);
    const [iframeKey, setIframeKey] = useState("default");
    const [now, setNow] = useState(new Date());

    const upcoming = getUpcomingEvents();
    const nextEvent = upcoming[0] ?? null;

    // Tick clock every minute for live countdown
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60_000);
        return () => clearInterval(interval);
    }, []);

    // Listen for mobile hamburger menu clicks from Navbar
    useEffect(() => {
        const handleToggleSidebar = () => setSidebarOpen(v => !v);
        window.addEventListener("toggle-events-sidebar", handleToggleSidebar);
        return () => window.removeEventListener("toggle-events-sidebar", handleToggleSidebar);
    }, []);

    const handleEventClick = (event: SpaceEvent) => {
        setSelectedEvent(event === selectedEvent ? null : event);
        if (event.nasaTarget) {
            setIframeKey(`${event.nasaTarget}-${Date.now()}`);
        }
    };

    return (
        <main className="relative w-screen h-screen bg-black overflow-hidden select-none">
            <Navbar />

            {/* ── Background: NASA Eyes embeds ───────────────────────────── */}
            <div className="absolute inset-0 z-0 bg-black">
                <AnimatePresence mode="wait">
                    {selectedEvent?.type === "meteor" ? (
                        /* For meteor showers: show NASA meteor data mashup + Eyes side by side */
                        <motion.div
                            key="meteor-view"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.2 }}
                            className="w-full h-full flex"
                        >
                            {/* NASA Eyes on one side */}
                            <iframe
                                key={`solar-${iframeKey}`}
                                src={`https://eyes.nasa.gov/apps/solar-system/?embed=true&time=${encodeURIComponent(selectedEvent.date.toISOString().replace('Z', '+00:00'))}&rate=0#/earth`}
                                className="absolute border-none"
                                style={{ left: '-350px', width: 'calc(65% + 350px)', height: '100%' }}
                            />
                            {/* NASA Meteor live data / Fireball dashboard on the other */}
                            <iframe
                                src="https://eyes.nasa.gov/apps/meteor/?embed=true"
                                className={`absolute right-0 h-full border-none transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${sidebarOpen ? 'w-[calc(45%-170px)]' : 'w-[45%]'
                                    }`}
                                onError={() => { }}
                            />
                        </motion.div>
                    ) : (
                        <motion.iframe
                            key={`solar-${iframeKey}`}
                            initial={{ opacity: 0, scale: 1.04 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                            src={selectedEvent?.nasaTarget
                                ? `https://eyes.nasa.gov/apps/solar-system/?embed=true&time=${encodeURIComponent(selectedEvent.date.toISOString().replace('Z', '+00:00'))}&rate=0#/${selectedEvent.nasaTarget}`
                                : "https://eyes.nasa.gov/apps/solar-system/?embed=true"
                            }
                            className="absolute h-full border-none transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                            style={{
                                left: sidebarOpen ? '-200px' : '0px',
                                width: sidebarOpen ? 'calc(100% + 200px)' : '100%',
                            }}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Cinematic overlays */}
            <div className="absolute inset-0 pointer-events-none z-[10] shadow-[inset_0_0_180px_rgba(0,0,0,0.85)]" />
            <div className="absolute inset-0 pointer-events-none z-[10] scanlines opacity-30" />


            {/* ── Bottom Left: Page Title + Next Event ──────────────────── */}
            <div className="absolute bottom-10 left-8 z-[40] pointer-events-none">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-grotesk text-[9px] uppercase tracking-[0.55em] text-white/25 mb-2"
                >
                    Celestial Calendar — {new Date().getFullYear()}
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.8 }}
                    className="font-bebas text-[3.4rem] leading-[0.85] text-liquid-metal tracking-wider mb-5"
                >
                    Space Events
                </motion.h1>

                {/* Thin separator */}
                <div className="w-10 h-[1px] bg-white/15 mb-5" />

                {/* Next Event pill — compact and clean */}
                {nextEvent && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-1 h-1 rounded-full bg-white/40 animate-pulse" />
                        <div>
                            <span className={`font-grotesk text-[9px] uppercase tracking-[0.35em] ${TYPE_CONFIG[nextEvent.type].color}`}>
                                Next —&nbsp;
                            </span>
                            <span className="font-grotesk text-[9px] uppercase tracking-[0.35em] text-white/50">
                                {nextEvent.name}
                            </span>
                            <p className="font-grotesk text-[9px] text-white/25 mt-0.5">
                                {formatDate(nextEvent.date)}&nbsp;&nbsp;·&nbsp;&nbsp;
                                {getDaysUntil(nextEvent.date) <= 0 ? "Happening now" : `${getDaysUntil(nextEvent.date)} days away`}
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* ── Sidebar toggle button ─────────────────────────────────── */}
            <div className="absolute top-24 left-0 right-0 z-[60] flex justify-center px-4 md:px-10 pointer-events-none">
                <div className="w-full max-w-6xl flex justify-start pointer-events-auto">
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        onClick={() => setSidebarOpen(v => !v)}
                        className="glass-card glass-card-glow rounded-full px-5 py-2.5 hidden md:flex items-center gap-3 text-white/60 hover:text-white transition-colors"
                    >
                        <span className="font-grotesk text-[9px] uppercase tracking-[0.4em]">
                            {sidebarOpen ? "Hide Events" : "Show Events"}
                        </span>
                        <motion.div
                            animate={{ rotate: sidebarOpen ? 180 : 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="text-xs"
                        >
                            ›
                        </motion.div>
                    </motion.button>
                </div>
            </div>

            {/* ── RIGHT SIDEBAR ──────────────────────────────────────────── */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 220, damping: 28 }}
                        className="absolute right-0 top-0 bottom-0 w-[340px] z-[50] bg-black/50 backdrop-blur-2xl border-l border-white/8 flex flex-col"
                    >
                        {/* Sidebar header */}
                        <div className="px-7 pt-28 pb-5 border-b border-white/8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-grotesk text-[9px] uppercase tracking-[0.45em] text-white/30">
                                        {getYearRange()}
                                    </p>
                                    <h2 className="font-bebas text-2xl tracking-widest text-white mt-0.5">
                                        Upcoming Events
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors text-xs"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Event list */}
                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
                            {upcoming.map((event, i) => {
                                const cfg = TYPE_CONFIG[event.type];
                                const daysUntil = getDaysUntil(event.date);
                                const isActive = daysUntil <= 0 && daysUntil >= -3;
                                const isSelected = selectedEvent?.id === event.id;

                                return (
                                    <motion.button
                                        key={event.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        onClick={() => handleEventClick(event)}
                                        className={`w-full text-left rounded-xl p-4 transition-all duration-300 border ${isSelected
                                            ? "bg-white/8 border-white/20"
                                            : "bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10"
                                            }`}
                                        style={isSelected ? { boxShadow: `0 0 30px ${cfg.glow}` } : {}}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {isActive && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[8px] font-grotesk uppercase tracking-widest">
                                                            <span className="w-1 h-1 rounded-full bg-red-400 animate-pulse" />
                                                            Live
                                                        </span>
                                                    )}
                                                    <span className={`font-grotesk text-[9px] uppercase tracking-wider ${cfg.color}`}>
                                                        {cfg.label}
                                                    </span>
                                                </div>
                                                <p className="font-bebas text-lg tracking-wide text-white leading-tight truncate">
                                                    {event.name}
                                                </p>
                                                <p className="font-grotesk text-[10px] text-white/40 mt-0.5">
                                                    {formatDate(event.date)}
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="font-grotesk text-[10px] text-white/30">
                                                    {daysUntil <= 0 ? "Now" : `${daysUntil}d`}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Expanded detail */}
                                        <AnimatePresence>
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-3 pt-3 border-t border-white/8 space-y-2">
                                                        <p className="font-grotesk text-[11px] leading-[1.7] text-white/55">
                                                            {event.details}
                                                        </p>
                                                        {event.peakRate && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-grotesk text-[9px] uppercase tracking-wider text-white/30">Rate</span>
                                                                <span className={`font-grotesk text-[10px] ${cfg.color}`}>{event.peakRate}</span>
                                                            </div>
                                                        )}
                                                        {event.visibility && (
                                                            <div className="flex items-start gap-2">
                                                                <span className="font-grotesk text-[9px] uppercase tracking-wider text-white/30 mt-0.5">Visible</span>
                                                                <span className="font-grotesk text-[10px] text-white/50 flex-1">{event.visibility}</span>
                                                            </div>
                                                        )}
                                                        {event.visibleRegions && (
                                                            <div className="flex items-start gap-2">
                                                                <span className="font-grotesk text-[9px] uppercase tracking-wider text-white/30 mt-0.5">Regions</span>
                                                                <span className="font-grotesk text-[10px] text-white/50 flex-1">{event.visibleRegions}</span>
                                                            </div>
                                                        )}
                                                        {event.invisibleRegions && (
                                                            <div className="flex items-start gap-2">
                                                                <span className="font-grotesk text-[9px] uppercase tracking-wider text-white/30 mt-0.5">Cannot See</span>
                                                                <span className="font-grotesk text-[10px] text-white/50 flex-1">{event.invisibleRegions}</span>
                                                            </div>
                                                        )}
                                                        {event.visibilityTimeframe && (
                                                            <div className="flex items-start gap-2">
                                                                <span className="font-grotesk text-[9px] uppercase tracking-wider text-white/30 mt-0.5">Timeframe</span>
                                                                <span className="font-grotesk text-[10px] text-white/50 flex-1">{event.visibilityTimeframe}</span>
                                                            </div>
                                                        )}
                                                        {event.nakedEyeVisibility && (
                                                            <div className="flex items-start gap-2">
                                                                <span className="font-grotesk text-[9px] uppercase tracking-wider text-white/30 mt-0.5">Naked Eye</span>
                                                                <span className="font-grotesk text-[10px] text-white/50 flex-1">{event.nakedEyeVisibility}</span>
                                                            </div>
                                                        )}
                                                        {event.instrument && (
                                                            <div className="flex items-start gap-2">
                                                                <span className="font-grotesk text-[9px] uppercase tracking-wider text-white/30 mt-0.5">Equipment</span>
                                                                <span className="font-grotesk text-[10px] text-white/50 flex-1">{event.instrument}</span>
                                                            </div>
                                                        )}
                                                        {event.magnitude && (
                                                            <div className="flex items-start gap-2">
                                                                <span className="font-grotesk text-[9px] uppercase tracking-wider text-white/30 mt-0.5">Magnitude</span>
                                                                <span className={`font-grotesk text-[10px] flex-1 ${cfg.color}`}>{event.magnitude}</span>
                                                            </div>
                                                        )}
                                                        <p className="font-grotesk text-[9px] uppercase tracking-wider text-white/20 pt-1">
                                                            ↑ Camera flew to target in viewer
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Sidebar footer */}
                        <div className="px-7 py-4 border-t border-white/8">
                            <p className="font-grotesk text-[9px] text-white/20 leading-relaxed">
                                Event data sourced from NASA, Sky & Telescope, and the International Meteor Organization. Times shown in your local timezone.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
