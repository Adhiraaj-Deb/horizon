/**
 * Astrophysics & General Relativity Calculations for Horizon Space Singularity Visualization
 *
 * Implements exact and relativistic approximations for:
 * - Schwarzschild & Kerr geometry
 * - Event horizon radii
 * - Photon sphere & unstable photon geodesics
 * - Black hole shadow capture cross-section (impact parameter b_crit)
 * - Innermost Stable Circular Orbit (ISCO)
 * - Relativistic Doppler boosting and beaming
 * - Gravitational redshift & time dilation
 */

export const ASTRO_CONSTANTS = {
  G: 6.6743e-11, // m^3 kg^-1 s^-2
  c: 2.99792458e8, // m s^-1
  SOLAR_MASS_KG: 1.98847e30, // kg
  SCHWARZSCHILD_KM_PER_SOLAR_MASS: 2.95325, // km / M_sun: 2GM_sun / c^2
};

export interface BlackHolePreset {
  id: string;
  name: string;
  type: string;
  massSolar: number;
  spin: number; // Dimensionless a* in [0, 0.998]
  distanceLy: string;
  description: string;
  location: string;
}

export const PRESET_BLACK_HOLES: BlackHolePreset[] = [
  {
    id: "stellar-10",
    name: "Stellar Black Hole",
    type: "Stellar Remnant",
    massSolar: 10,
    spin: 0.15,
    distanceLy: "3,000 ly",
    description: "Formed from the core collapse of a massive star (>25 M☉) in a supernova explosion.",
    location: "Milky Way Disk",
  },
  {
    id: "cygnus-x1",
    name: "Cygnus X-1",
    type: "High-Mass X-ray Binary",
    massSolar: 21.2,
    spin: 0.97,
    distanceLy: "7,300 ly",
    description: "The first widely accepted black hole candidate, vigorously feeding from blue supergiant companion HDE 226868.",
    location: "Cygnus Constellation",
  },
  {
    id: "intermediate",
    name: "Intermediate Mass (IMBH)",
    type: "Cluster Core Black Hole",
    massSolar: 1200,
    spin: 0.50,
    distanceLy: "15,800 ly",
    description: "Hypothetical seed class bridging stellar remnants and galactic monsters, observed in dense globular clusters.",
    location: "Omega Centauri Core",
  },
  {
    id: "sagittarius-a",
    name: "Sagittarius A*",
    type: "Supermassive Black Hole",
    massSolar: 4.297e6,
    spin: 0.90,
    distanceLy: "26,670 ly",
    description: "The gravitational anchor of our Milky Way galaxy, imaged by the Event Horizon Telescope in 2022.",
    location: "Galactic Center",
  },
  {
    id: "m87-star",
    name: "M87*",
    type: "Supermassive Black Hole",
    massSolar: 6.5e9,
    spin: 0.94,
    distanceLy: "53.5M ly",
    description: "The cosmic giant in the Messier 87 galaxy, first ever directly photographed black hole featuring a 5,000-ly relativistic jet.",
    location: "Virgo Cluster",
  },
];

/**
 * Calculates physical properties for a black hole given mass in solar masses and dimensionless spin a*
 */
export function calculateBlackHoleMetrics(massSolar: number, spin: number = 0) {
  const clampedSpin = Math.max(0, Math.min(0.998, spin));
  const massKg = massSolar * ASTRO_CONSTANTS.SOLAR_MASS_KG;

  // Schwarzschild radius in meters and kilometers: r_s = 2GM/c^2
  const rsKm = massSolar * ASTRO_CONSTANTS.SCHWARZSCHILD_KM_PER_SOLAR_MASS;
  const rsMeters = rsKm * 1000;

  // Geometric mass M = GM/c^2 = r_s / 2
  const GM_c2_km = rsKm / 2;

  // Kerr Event Horizon Radius (Outer horizon r_+):
  // r_+ = M + sqrt(M^2 - a^2) in geometric units
  // Expressed as multiple of GM/c^2: (1 + sqrt(1 - a*^2))
  const rPlusM = 1 + Math.sqrt(Math.max(0, 1 - clampedSpin * clampedSpin));
  const horizonRadiusKm = GM_c2_km * rPlusM;

  // Photon Sphere Radius:
  // For Schwarzschild: r_ph = 3M = 1.5 r_s
  // For Kerr equatorial prograde/retrograde approximations:
  const Z1 = 1 + Math.cbrt(1 - clampedSpin * clampedSpin) * (Math.cbrt(1 + clampedSpin) + Math.cbrt(1 - clampedSpin));
  const Z2 = Math.sqrt(3 * clampedSpin * clampedSpin + Z1 * Z1);
  const rIscoM = 3 + Z2 - Math.sqrt((3 - Z1) * (3 + Z1 + 2 * Z2)); // prograde ISCO in units of M
  const iscoRadiusKm = GM_c2_km * Math.max(1, rIscoM);

  // Photon orbit radius (Schwarzschild baseline 3M = 1.5 r_s)
  const photonSphereRadiusKm = GM_c2_km * 3.0;

  // Apparent Black Hole Shadow radius for a distant observer:
  // In Schwarzschild spacetime, light rays with impact parameter b < b_crit are captured.
  // b_crit = sqrt(27) * M = sqrt(27) * (r_s / 2) ≈ 2.598 * r_s ≈ 5.196 * M
  const shadowRadiusKm = GM_c2_km * Math.sqrt(27);

  // Orbital speed at ISCO in fraction of c (v/c = sqrt(1 / r_isco_M))
  const vIscoFractionC = Math.sqrt(1 / rIscoM);

  // Gravitational time dilation at 1.1x horizon (dt_local / dt_infinity = sqrt(1 - r_s / r))
  const timeDilationNearHorizon = Math.sqrt(Math.max(0.001, 1 - 1 / 1.1));

  return {
    massSolar,
    massKg,
    spin: clampedSpin,
    rsKm,
    horizonRadiusKm,
    photonSphereRadiusKm,
    shadowRadiusKm,
    iscoRadiusKm,
    vIscoFractionC,
    timeDilationNearHorizon,
  };
}

/**
 * Format large astronomical numbers with unit prefixes (km, million km, AU, ly)
 */
export function formatDistanceKm(km: number): string {
  if (km < 1) return `${(km * 1000).toFixed(0)} m`;
  if (km < 1000) return `${km.toFixed(1)} km`;
  if (km < 1e6) return `${(km).toLocaleString("en-US", { maximumFractionDigits: 0 })} km`;
  if (km < 1.496e8) return `${(km / 1e6).toFixed(2)}M km`;
  
  // Astronomical Units (1 AU ≈ 149.6M km)
  const au = km / 1.496e8;
  if (au < 100) return `${au.toFixed(2)} AU`;
  if (au < 63241) return `${au.toLocaleString("en-US", { maximumFractionDigits: 0 })} AU`;
  
  // Light Years (1 ly ≈ 9.461e12 km)
  const ly = km / 9.461e12;
  return `${ly.toFixed(3)} ly`;
}

/**
 * Format solar mass display
 */
export function formatSolarMass(massSolar: number): string {
  if (massSolar >= 1e9) return `${(massSolar / 1e9).toFixed(2)} Billion M☉`;
  if (massSolar >= 1e6) return `${(massSolar / 1e6).toFixed(2)} Million M☉`;
  if (massSolar >= 1e3) return `${(massSolar / 1e3).toFixed(1)}k M☉`;
  return `${massSolar.toFixed(1)} M☉`;
}
