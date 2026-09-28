export interface CosmicEpoch {
  id: string;
  name: string;
  shortName: string;
  timeLabel: string;
  lookbackTime?: string;
  range: [number, number]; // [startProgress, endProgress]
  title: string;
  subtitle: string;
  summary: string;
  details: string[];
  scientificNote?: string;
  camera: {
    position: [number, number, number];
    lookAt: [number, number, number];
    fov: number;
  };
  mobileCamera?: {
    position: [number, number, number];
    lookAt: [number, number, number];
    fov: number;
  };
  themeColor: string; // Tailwind-friendly or hex
}

export const COSMIC_EPOCHS: CosmicEpoch[] = [
  {
    id: "opening",
    name: "The Void & Quantum Seeds",
    shortName: "Opening",
    timeLabel: "t = 0",
    lookbackTime: "13.8 Billion Years Ago",
    range: [0.0, 0.05],
    title: "THE UNIVERSE",
    subtitle: "13.8 BILLION YEARS OF COSMIC EVOLUTION",
    summary: "Before structure, light, or matter, spacetime begins its relentless expansion. Scroll to journey through the cosmos.",
    details: [
      "The observable universe was compressed into an unimaginably hot, dense state.",
      "Spacetime itself came into existence, not expanding into pre-existing space, but expanding from within."
    ],
    camera: {
      position: [0, 0, 50],
      lookAt: [0, 0, 0],
      fov: 60,
    },
    mobileCamera: {
      position: [0, 0, 75],
      lookAt: [0, 0, 0],
      fov: 70,
    },
    themeColor: "#818cf8",
  },
  {
    id: "early-universe",
    name: "The Early Universe",
    shortName: "Planck Era",
    timeLabel: "t ≈ 10⁻⁴³ s",
    lookbackTime: "13.8 Billion Years Ago",
    range: [0.05, 0.12],
    title: "THE EARLY UNIVERSE",
    subtitle: "AN EXTREMELY HOT, DENSE STATE",
    summary: "Space expands everywhere simultaneously. There is no central explosion into empty space; rather, every point in the universe moves away from every other point.",
    details: [
      "Temperature exceeds 10³² Kelvin, where all fundamental forces were potentially unified.",
      "Energy density is so immense that matter and antimatter spontaneously materialize and annihilate in equal measure."
    ],
    scientificNote: "Cosmological expansion is the stretching of spacetime itself, not an explosion of matter through empty space.",
    camera: {
      position: [0, 0, 35],
      lookAt: [0, 0, 0],
      fov: 55,
    },
    mobileCamera: {
      position: [0, 0, 50],
      lookAt: [0, 0, 0],
      fov: 65,
    },
    themeColor: "#fbbf24",
  },
  {
    id: "inflation",
    name: "Cosmic Inflation",
    shortName: "Inflation",
    timeLabel: "t ≈ 10⁻³⁶ to 10⁻³² s",
    lookbackTime: "13.8 Billion Years Ago",
    range: [0.12, 0.17],
    title: "COSMIC INFLATION",
    subtitle: "EXPONENTIAL METRIC EXPANSION",
    summary: "Spacetime expands exponentially by an enormous factor in a fraction of a second, smoothing out geometric curvature and stretching subatomic quantum fluctuations across vast cosmological distances.",
    details: [
      "Inflation expanded space by a factor of at least 10²⁶ in a tiny fraction of a microsecond.",
      "Microscopic quantum variations were magnified into macroscopic density variations—the seeds of all galaxies."
    ],
    scientificNote: "Inflation is a specific hypothesis for an early period of super-rapid expansion, distinct from normal Hubble expansion.",
    camera: {
      position: [0, 0, 45],
      lookAt: [0, 0, 0],
      fov: 65,
    },
    mobileCamera: {
      position: [0, 0, 65],
      lookAt: [0, 0, 0],
      fov: 75,
    },
    themeColor: "#38bdf8",
  },
  {
    id: "particles",
    name: "The Particle Era",
    shortName: "Quarks & Leptons",
    timeLabel: "t ≈ 10⁻⁶ s",
    lookbackTime: "13.8 Billion Years Ago",
    range: [0.17, 0.23],
    title: "THE PARTICLE ERA",
    subtitle: "QUARK-GLUON PLASMA TO BARYONS",
    summary: "As temperatures plunge below trillions of degrees, the free quark-gluon soup condenses. Quarks permanently bind in triplets through the strong nuclear force to assemble the first protons and neutrons.",
    details: [
      "A slight asymmetry in matter vs. antimatter (one extra matter particle per billion) leaves behind the material universe we observe.",
      "High-energy photons continually scatter off charged leptons, keeping the cosmos fully ionized."
    ],
    scientificNote: "These visuals depict scientific principles of subatomic confinement rather than literal microscopic photography.",
    camera: {
      position: [5, 2, 30],
      lookAt: [0, 0, 0],
      fov: 50,
    },
    mobileCamera: {
      position: [0, 0, 45],
      lookAt: [0, 0, 0],
      fov: 65,
    },
    themeColor: "#f43f5e",
  },
  {
    id: "nucleosynthesis",
    name: "Primordial Nucleosynthesis",
    shortName: "First Nuclei",
    timeLabel: "t ≈ 3 to 20 minutes",
    lookbackTime: "13.8 Billion Years Ago",
    range: [0.23, 0.28],
    title: "PRIMORDIAL NUCLEOSYNTHESIS",
    subtitle: "FORGING THE FIRST NUCLEI",
    summary: "For approximately seventeen minutes, temperature and pressure mirror the interior of a star. Protons and neutrons fuse into the universe's primordial elements: mostly hydrogen and helium.",
    details: [
      "The result was roughly 75% Hydrogen-1, 24% Helium-4, with traces of Deuterium, Helium-3, and Lithium-7.",
      "Expansion cooled the cosmos too quickly for heavier elements like Carbon or Oxygen to form; those required stars."
    ],
    scientificNote: "Heavy elements (iron, carbon, gold) were not produced during the Big Bang, but forged much later in stellar cores.",
    camera: {
      position: [0, 4, 25],
      lookAt: [0, 0, 0],
      fov: 50,
    },
    mobileCamera: {
      position: [0, 0, 40],
      lookAt: [0, 0, 0],
      fov: 65,
    },
    themeColor: "#f97316",
  },
  {
    id: "recombination",
    name: "Recombination & CMB",
    shortName: "First Atoms / CMB",
    timeLabel: "t ≈ 380,000 years",
    lookbackTime: "13.8 Billion Years Ago",
    range: [0.28, 0.34],
    title: "RECOMBINATION & THE CMB",
    subtitle: "THE UNIVERSE BECOMES TRANSPARENT",
    summary: "Temperatures fall to ~3,000 K, allowing atomic nuclei to capture free electrons to form neutral atoms. Photons decouple and stream freely through space: the Cosmic Microwave Background is born.",
    details: [
      "Before recombination, light was continually trapped by Thomson scattering off free electrons.",
      "The CMB represents the oldest observable electromagnetic radiation in existence, redshifted today into microwave frequencies."
    ],
    scientificNote: "The Cosmic Microwave Background is not the Big Bang itself; it is the relic light emitted when the cosmos cleared.",
    camera: {
      position: [0, 0, 32],
      lookAt: [0, 0, 0],
      fov: 52,
    },
    mobileCamera: {
      position: [0, 0, 48],
      lookAt: [0, 0, 0],
      fov: 66,
    },
    themeColor: "#a855f7",
  },
  {
    id: "dark-ages",
    name: "The Cosmic Dark Ages",
    shortName: "Dark Ages",
    timeLabel: "t ≈ 380,000 to 150 Myr",
    lookbackTime: "13.6 Billion Years Ago",
    range: [0.34, 0.41],
    title: "THE COSMIC DARK AGES",
    subtitle: "A MILLION CENTURIES OF SILENCE",
    summary: "With no stars or luminous objects yet born, neutral gas drifts in profound darkness. Invisible dark matter halos act as gravitational attractors, steadily gathering primordial hydrogen into denser knots.",
    details: [
      "The universe was filled with cold neutral hydrogen emitting only faint 21-centimeter radio waves.",
      "Tiny density ripples gradually grew under gravity, setting the stage for the first stellar collapse."
    ],
    scientificNote: "Dark matter cannot be directly observed with light; its presence is detected through gravitational effects on normal matter.",
    camera: {
      position: [0, -2, 40],
      lookAt: [0, 0, 0],
      fov: 48,
    },
    mobileCamera: {
      position: [0, 0, 55],
      lookAt: [0, 0, 0],
      fov: 62,
    },
    themeColor: "#475569",
  },
  {
    id: "first-stars",
    name: "Cosmic Dawn (First Stars)",
    shortName: "First Stars",
    timeLabel: "t ≈ 100 to 250 Myr",
    lookbackTime: "13.5 Billion Years Ago",
    range: [0.41, 0.51],
    title: "THE FIRST STARS",
    subtitle: "COSMIC DAWN & REIONIZATION",
    summary: "In the hearts of dark matter filaments, primordial gas collapses under its own weight. Pressure ignites the first Population III stars—colossal, pristine blue giants hundreds of times more massive than our Sun.",
    details: [
      "Their intense ultraviolet radiation began reionizing the intergalactic neutral hydrogen gas.",
      "Living fast and dying young, their supernova deaths seeded the cosmos with its very first heavy elements."
    ],
    scientificNote: "Because early gas had zero metallicity, the first stars could not cool easily and thus grew to gargantuan masses.",
    camera: {
      position: [8, 3, 20],
      lookAt: [0, 0, 0],
      fov: 45,
    },
    mobileCamera: {
      position: [0, 0, 32],
      lookAt: [0, 0, 0],
      fov: 58,
    },
    themeColor: "#60a5fa",
  },
  {
    id: "first-galaxies",
    name: "Proto-Galaxies",
    shortName: "First Galaxies",
    timeLabel: "t ≈ 500 Myr to 1 Gyr",
    lookbackTime: "13.0 Billion Years Ago",
    range: [0.51, 0.60],
    title: "FIRST GALAXIES",
    subtitle: "GRAVITATIONAL HIERARCHY",
    summary: "Thousands of stellar clusters fall into gravitational wells, merging into chaotic proto-galaxies. Over cosmic time, conservation of angular momentum spins many into elegant disk and spiral morphologies.",
    details: [
      "Supermassive black hole seeds at galactic centers gorged on gas, powering luminous quasars visible across the cosmos.",
      "Collisions and mergers shaped diverse galaxies: spirals, giant ellipticals, and irregular dwarfs."
    ],
    camera: {
      position: [12, 8, 35],
      lookAt: [0, 0, 0],
      fov: 50,
    },
    mobileCamera: {
      position: [0, 5, 50],
      lookAt: [0, 0, 0],
      fov: 65,
    },
    themeColor: "#22d3ee",
  },
  {
    id: "cosmic-web",
    name: "The Cosmic Web",
    shortName: "Cosmic Web",
    timeLabel: "t ≈ 2 to 5 Gyr",
    lookbackTime: "10.0 Billion Years Ago",
    range: [0.60, 0.68],
    title: "THE COSMIC WEB",
    subtitle: "THE UNIVERSE'S LARGEST STRUCTURE",
    summary: "Pulling back to the largest conceivable scale reveals a colossal sponge-like network: trillions of galaxies aligned along vast dark matter filaments, converging into superclusters bounded by immense empty voids.",
    details: [
      "Cosmic voids can span over 300 million light-years across with virtually no galaxies inside.",
      "Galaxies continually stream along filaments toward massive gravitational intersections like the Great Attractor."
    ],
    scientificNote: "The cosmic web is dynamically shaped by the gravitational scaffolding of cold dark matter and cosmic expansion.",
    camera: {
      position: [0, 20, 60],
      lookAt: [0, 0, 0],
      fov: 60,
    },
    mobileCamera: {
      position: [0, 25, 80],
      lookAt: [0, 0, 0],
      fov: 72,
    },
    themeColor: "#818cf8",
  },
  {
    id: "heavy-elements",
    name: "Stellar Alchemy",
    shortName: "Stellar Alchemy",
    timeLabel: "t ≈ 5 to 9 Gyr",
    lookbackTime: "8.0 Billion Years Ago",
    range: [0.68, 0.73],
    title: "STELLAR ALCHEMY",
    subtitle: "CHEMICAL ENRICHMENT",
    summary: "Successive generations of stars live, fuse elements in their cores, and return chemically enriched material to space via stellar winds, supernovae, and kilonova neutron star mergers.",
    details: [
      "Stellar cores forge carbon, oxygen, neon, and silicon up to iron.",
      "Cataclysmic supernovae and colliding neutron stars synthesize heavier elements like copper, gold, platinum, and uranium."
    ],
    scientificNote: "We are literally stardust: nearly every atom in your body heavier than hydrogen was forged in a star.",
    camera: {
      position: [5, -4, 25],
      lookAt: [0, 0, 0],
      fov: 48,
    },
    mobileCamera: {
      position: [0, 0, 38],
      lookAt: [0, 0, 0],
      fov: 62,
    },
    themeColor: "#ec4899",
  },
  {
    id: "milky-way",
    name: "Our Home: The Milky Way",
    shortName: "Milky Way",
    timeLabel: "t ≈ 9.2 Gyr (4.6 Ga)",
    lookbackTime: "4.6 Billion Years Ago",
    range: [0.73, 0.78],
    title: "THE MILKY WAY",
    subtitle: "A BARRED SPIRAL IN DEEP TIME",
    summary: "Diving toward our local galactic neighborhood reveals a barred spiral galaxy 100,000 light-years in diameter, containing over 100 billion stars, winding spiral arms, and dark dust lanes.",
    details: [
      "Our solar system resides in the Orion-Cygnus Arm, orbiting the galactic core roughly once every 230 million years.",
      "At the galactic center sits Sagittarius A*, a supermassive black hole of 4.3 million solar masses."
    ],
    camera: {
      position: [0, 15, 25],
      lookAt: [0, 0, 0],
      fov: 45,
    },
    mobileCamera: {
      position: [0, 20, 38],
      lookAt: [0, 0, 0],
      fov: 60,
    },
    themeColor: "#06b6d4",
  },
  {
    id: "solar-system-formation",
    name: "Solar System Formation",
    shortName: "Solar Nebula",
    timeLabel: "t ≈ 9.2 Gyr (4.6 Ga)",
    lookbackTime: "4.6 Billion Years Ago",
    range: [0.78, 0.88],
    title: "BIRTH OF THE SOLAR SYSTEM",
    subtitle: "COLLAPSING PROTO-STELLAR DISK",
    summary: "A nearby shockwave triggers the collapse of a giant molecular cloud. Angular momentum flattens the cloud into a swirling protoplanetary accretion disk centered around a newborn infant Sun.",
    details: [
      "In the inner disk, refractory metals and rock condense into planetesimals and rocky protoplanets.",
      "Beyond the frost line, volatile hydrogen and helium gases accumulate into the gas giants Jupiter and Saturn."
    ],
    scientificNote: "Planets are visualized in cinematic scale for narrative clarity. Display is not to physical spatial scale.",
    camera: {
      position: [0, 18, 30],
      lookAt: [0, 0, 0],
      fov: 45,
    },
    mobileCamera: {
      position: [0, 24, 42],
      lookAt: [0, 0, 0],
      fov: 60,
    },
    themeColor: "#f59e0b",
  },
  {
    id: "earth",
    name: "Planet Earth",
    shortName: "Planet Earth",
    timeLabel: "t ≈ 9.26 Gyr (4.54 Ga)",
    lookbackTime: "4.54 Billion Years Ago",
    range: [0.88, 0.93],
    title: "PLANET EARTH",
    subtitle: "MAGMA TO A BLUE MARBLE",
    summary: "Accretion of planetesimals and radioactive decay generate extreme heat, creating molten magma oceans. Over hundreds of millions of years, the crust solidifies, volcanic outgassing creates an atmosphere, and water condenses into oceans.",
    details: [
      "A Mars-sized impactor (Theia) collides with proto-Earth, expelling debris that coalesced to form the Moon.",
      "In hydrothermal vents or tidal pools, complex organic geochemistry set the stage for life."
    ],
    scientificNote: "The exact biochemical pathway of abiogenesis remains an open, intensely studied frontier in science.",
    camera: {
      position: [3, 1, 10],
      lookAt: [0, 0, 0],
      fov: 38,
    },
    mobileCamera: {
      position: [0, 1, 16],
      lookAt: [0, 0, 0],
      fov: 50,
    },
    themeColor: "#10b981",
  },
  {
    id: "today",
    name: "The Present Day",
    shortName: "Today",
    timeLabel: "t = 13.8 Billion Years",
    lookbackTime: "Present Day",
    range: [0.93, 0.97],
    title: "TODAY",
    subtitle: "~13.8 BILLION YEARS OF EVOLUTION",
    summary: "Camera pulls back from Earth through the Solar System and Milky Way back to the cosmic web. The universe continues to expand, propelled at an accelerating rate by mysterious dark energy.",
    details: [
      "We live in an epoch where galaxies are still actively forming stars, but peak star formation occurred 10 billion years ago.",
      "The observable universe currently measures approximately 93 billion light-years in diameter."
    ],
    camera: {
      position: [0, 10, 45],
      lookAt: [0, 0, 0],
      fov: 55,
    },
    mobileCamera: {
      position: [0, 15, 60],
      lookAt: [0, 0, 0],
      fov: 68,
    },
    themeColor: "#6366f1",
  },
  {
    id: "future",
    name: "The Horizon Ahead",
    shortName: "The Future",
    timeLabel: "t > 100 Billion Years",
    lookbackTime: "Far Future",
    range: [0.97, 1.0],
    title: "THE HORIZON AHEAD",
    subtitle: "AN EVER-EXPANDING COSMOS",
    summary: "Over tens of billions of years, cosmic expansion will push distant galaxies beyond our cosmological horizon. Over trillions of years, stellar fuel will exhaust into stellar remnants, cooling into the long cosmic twilight.",
    details: [
      "The ultimate fate of the universe—Heat Death, Big Rip, or Big Crunch—hinges on the fundamental equation of state of dark energy.",
      "13.8 billion years is only the opening chapter of the cosmos. Keep exploring."
    ],
    scientificNote: "Distant future cosmological projections represent current theoretical extrapolations rather than settled facts.",
    camera: {
      position: [0, 0, 60],
      lookAt: [0, 0, 0],
      fov: 65,
    },
    mobileCamera: {
      position: [0, 0, 80],
      lookAt: [0, 0, 0],
      fov: 75,
    },
    themeColor: "#9333ea",
  },
];
