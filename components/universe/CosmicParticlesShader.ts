import * as THREE from "three";

/**
 * GLSL Vertex & Fragment Shaders for the 13.8-Billion-Year Cosmic Particle System.
 * Transitions smoothly from Quantum Seeds -> Metric Expansion -> Inflation -> 
 * Nucleosynthesis -> CMB -> Dark Ages -> First Stars -> Galaxies -> Cosmic Web -> Milky Way.
 */

export const CosmicParticlesVertexShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uBaseSize;

  attribute vec3 aInitPos;
  attribute vec3 aInflationPos;
  attribute vec3 aFilamentPos;
  attribute vec3 aGalaxyPos;
  attribute vec3 aMilkyWayPos;
  attribute vec3 aBaseColor;
  attribute float aPhase;
  attribute float aScale;
  attribute float aType; // 0: general plasma, 1: star seed, 2: galaxy node, 3: cosmic dust

  varying vec3 vColor;
  varying float vAlpha;
  varying float vType;
  varying float vDist;

  // Simplex-style pseudo noise
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  void main() {
    float p = uProgress;
    float t = uTime;
    vType = aType;

    vec3 pos = aInitPos;
    vec3 color = aBaseColor;
    float alpha = 1.0;
    float pSize = uBaseSize * aScale;

    // ========================================================
    // 1. OPENING & QUANTUM FOAM (0.0 -> 0.05)
    // ========================================================
    if (p < 0.05) {
      float factor = p / 0.05;
      // Gentle vacuum fluctuations
      vec3 jitter = vec3(
        sin(t * 1.5 + aInitPos.x * 0.5),
        cos(t * 1.8 + aInitPos.y * 0.5),
        sin(t * 2.1 + aInitPos.z * 0.5)
      ) * 0.5;
      pos = aInitPos + jitter;
      color = mix(vec3(0.25, 0.35, 0.7), vec3(1.0, 0.8, 0.4), factor);
      alpha = mix(0.1, 0.65, factor);
      pSize *= mix(0.7, 1.1, factor);
    }
    // ========================================================
    // 2. THE EARLY UNIVERSE & EXPANSION (0.05 -> 0.12)
    // Non-central metric expansion: space dilates uniformly everywhere!
    // ========================================================
    else if (p < 0.12) {
      float subP = (p - 0.05) / 0.07;
      // Metric scale factor: distances between particles increase everywhere
      float scaleFactor = 1.0 + subP * 1.3;
      // High-energy thermal agitation
      vec3 thermalJitter = vec3(
        sin(t * 5.0 + aPhase * 6.28),
        cos(t * 4.5 + aPhase * 6.28),
        sin(t * 5.5 + aPhase * 6.28)
      ) * (0.8 - subP * 0.4);
      pos = aInitPos * scaleFactor + thermalJitter;
      // Cooling from brilliant white-amber plasma to hot orange/magenta
      color = mix(vec3(1.0, 0.9, 0.65), vec3(0.95, 0.45, 0.25), subP);
      alpha = mix(0.75, 0.6, subP);
      pSize *= mix(1.2, 0.95, subP);
    }
    // ========================================================
    // 3. COSMIC INFLATION (0.12 -> 0.17)
    // Rapid exponential stretching of the metric coordinate grid
    // ========================================================
    else if (p < 0.17) {
      float subP = (p - 0.12) / 0.05;
      float inflationCurve = pow(subP, 2.2);
      // Metric coordinate stretch
      pos = mix(aInitPos * 2.5, aInflationPos * 1.8, inflationCurve);
      // Microscopic quantum fluctuations stretched across space
      vec3 ripple = normalize(pos + 0.001) * sin(length(pos) * 1.5 - t * 4.0) * (0.8 - subP * 0.5);
      pos += ripple;
      color = mix(vec3(0.95, 0.45, 0.2), vec3(0.3, 0.7, 1.0), inflationCurve);
      alpha = mix(0.9, 0.6, inflationCurve);
      pSize *= mix(1.5, 0.9, inflationCurve);
    }
    // ========================================================
    // 4. PARTICLE ERA & NUCLEOSYNTHESIS (0.17 -> 0.28)
    // Quarks, gluons binding into protons/neutrons, then H & He
    // ========================================================
    else if (p < 0.28) {
      float subP = (p - 0.17) / 0.11;
      // Coalescing into small fundamental particle clusters
      vec3 clusterPos = mix(aInflationPos * 1.8, aFilamentPos * 0.7, subP);
      // Orbiting interactions
      float angle = t * 2.0 + aPhase * 6.28;
      vec3 spinOffset = vec3(cos(angle), sin(angle), cos(angle * 1.3)) * (1.2 * (1.0 - subP * 0.5));
      pos = clusterPos + spinOffset;
      // Nucleosynthesis tint: Hydrogen (golden amber) and Helium (cyan/blue)
      vec3 hColor = vec3(0.95, 0.65, 0.25);
      vec3 heColor = vec3(0.2, 0.75, 0.95);
      color = mix(mix(hColor, heColor, aPhase), vec3(0.9, 0.4, 0.7), sin(subP * 3.1415) * 0.4);
      alpha = mix(0.7, 0.85, subP);
      pSize *= 1.1;
    }
    // ========================================================
    // 5. RECOMBINATION & THE CMB (0.28 -> 0.34)
    // Opaque glowing fog dissolves -> universe turns transparent
    // ========================================================
    else if (p < 0.34) {
      float subP = (p - 0.28) / 0.06;
      pos = mix(aFilamentPos * 0.7, aFilamentPos, subP);
      // Clearing effect: opaque fog disperses into subtle CMB anisotropy pattern
      vec3 cmbColor = mix(vec3(0.85, 0.35, 0.2), vec3(0.15, 0.35, 0.8), aPhase);
      color = mix(vec3(0.9, 0.7, 0.5), cmbColor, subP);
      // Bright glow drops as universe clears
      alpha = mix(0.85, 0.35, subP);
      pSize *= mix(1.3, 0.8, subP);
    }
    // ========================================================
    // 6. THE COSMIC DARK AGES (0.34 -> 0.41)
    // Deep darkness, subtle gravitational amplification of density
    // ========================================================
    else if (p < 0.41) {
      float subP = (p - 0.34) / 0.07;
      // Gravity pulls gas toward filament scaffolding
      pos = mix(aFilamentPos, aFilamentPos * 1.1, subP);
      // Dim, cold neutral hydrogen
      color = vec3(0.12, 0.16, 0.28);
      alpha = mix(0.35, 0.15, subP);
      pSize *= 0.65;
    }
    // ========================================================
    // 7. THE FIRST STARS (0.41 -> 0.51)
    // Ignition of pristine massive Population III blue stars!
    // ========================================================
    else if (p < 0.51) {
      float subP = (p - 0.41) / 0.10;
      pos = mix(aFilamentPos * 1.1, aGalaxyPos * 0.85, subP);
      // Progressive star ignition staggered by aPhase
      float ignitionThreshold = smoothstep(0.0, 1.0, (subP - aPhase * 0.5) / 0.5);
      vec3 coldGasColor = vec3(0.15, 0.2, 0.35);
      vec3 hotStarColor = mix(vec3(0.4, 0.75, 1.0), vec3(1.0, 1.0, 1.0), step(0.7, aPhase));
      color = mix(coldGasColor, hotStarColor, ignitionThreshold);
      alpha = mix(0.2, 0.95, ignitionThreshold);
      pSize *= mix(0.7, 1.8, ignitionThreshold);
    }
    // ========================================================
    // 8. FIRST GALAXIES (0.51 -> 0.60)
    // Stars coalesce into spinning proto-galaxies
    // ========================================================
    else if (p < 0.60) {
      float subP = (p - 0.51) / 0.09;
      // Differential galactic rotation
      float distFromCenter = length(aGalaxyPos.xy);
      float rotSpeed = (15.0 / (distFromCenter + 3.0)) * (t * 0.3);
      float c = cos(rotSpeed);
      float s = sin(rotSpeed);
      vec3 rotatedGal = vec3(
        aGalaxyPos.x * c - aGalaxyPos.y * s,
        aGalaxyPos.x * s + aGalaxyPos.y * c,
        aGalaxyPos.z
      );
      pos = mix(aGalaxyPos * 0.85, rotatedGal, subP);
      // Diverse galactic hues: young blue arms, golden-white galactic cores
      vec3 coreColor = vec3(1.0, 0.9, 0.7);
      vec3 armColor = vec3(0.35, 0.65, 0.95);
      color = mix(armColor, coreColor, smoothstep(12.0, 2.0, distFromCenter));
      alpha = 0.85;
      pSize *= 1.1;
    }
    // ========================================================
    // 9. THE COSMIC WEB (0.60 -> 0.68)
    // Trillions of galaxies strung along vast dark matter filaments
    // ========================================================
    else if (p < 0.68) {
      float subP = (p - 0.60) / 0.08;
      // Camera zooms out: filament structure revealed
      pos = mix(aGalaxyPos, aFilamentPos * 1.6, subP);
      // Soft luminescence of billions of galaxies tracing the web
      vec3 webColor = mix(vec3(0.4, 0.55, 0.95), vec3(0.75, 0.45, 0.9), aPhase);
      color = mix(color, webColor, subP);
      alpha = mix(0.85, 0.7, subP);
      pSize *= mix(1.1, 0.85, subP);
    }
    // ========================================================
    // 10. STELLAR ALCHEMY & THE MILKY WAY (0.68 -> 0.78)
    // Chemical enrichment & zooming into our barred spiral home
    // ========================================================
    else if (p < 0.78) {
      float subP = (p - 0.68) / 0.10;
      // Morphing into the Milky Way barred spiral structure
      float rDist = length(aMilkyWayPos.xy);
      float mwRot = (12.0 / (rDist + 2.0)) * (t * 0.25);
      float mc = cos(mwRot);
      float ms = sin(mwRot);
      vec3 rotatedMW = vec3(
        aMilkyWayPos.x * mc - aMilkyWayPos.y * ms,
        aMilkyWayPos.x * ms + aMilkyWayPos.y * mc,
        aMilkyWayPos.z
      );
      pos = mix(aFilamentPos * 1.6, rotatedMW, subP);
      // Stellar enrichment: pink nebulae (starburst HII), warm bulge, cyan stars
      vec3 dustColor = vec3(0.95, 0.35, 0.65); // H-alpha & heavy elements
      vec3 starColor = vec3(0.4, 0.8, 1.0);
      vec3 bulgeColor = vec3(1.0, 0.95, 0.8);
      color = mix(mix(dustColor, starColor, aPhase), bulgeColor, smoothstep(8.0, 1.5, rDist));
      alpha = 0.8;
      pSize *= mix(0.9, 1.3, subP);
    }
    // ========================================================
    // 11. SOLAR SYSTEM TO EARTH (0.78 -> 0.93)
    // Particles act as background galactic stellar field & solar nebula dust
    // ========================================================
    else if (p < 0.93) {
      float subP = (p - 0.78) / 0.15;
      // Protoplanetary disk dust swirl + deep interstellar field
      float dist = length(pos.xy);
      float dustRot = (8.0 / (dist + 1.0)) * (t * 0.15);
      vec3 dustField = vec3(
        aMilkyWayPos.x * cos(dustRot) - aMilkyWayPos.y * sin(dustRot),
        aMilkyWayPos.x * sin(dustRot) + aMilkyWayPos.y * cos(dustRot),
        aMilkyWayPos.z * 0.4
      );
      pos = mix(aMilkyWayPos, dustField, smoothstep(0.0, 0.5, subP));
      // Warm golden sunlight & deep blue/green cosmic background
      color = mix(vec3(0.9, 0.7, 0.4), vec3(0.3, 0.6, 0.9), aPhase);
      alpha = mix(0.7, 0.5, subP);
      pSize *= 0.85;
    }
    // ========================================================
    // 12. TODAY & THE FUTURE (0.93 -> 1.0)
    // Reverse dolly to cosmic web, serene horizon ahead
    // ========================================================
    else {
      float subP = (p - 0.93) / 0.07;
      // Pulling back to cosmic web with cosmic acceleration
      float cosmicExpansion = 1.0 + subP * 0.4;
      pos = mix(aMilkyWayPos, aFilamentPos * 1.5, subP) * cosmicExpansion;
      // Fading gently into deep serene cosmic horizon
      color = mix(vec3(0.4, 0.6, 0.95), vec3(0.3, 0.2, 0.6), subP);
      alpha = mix(0.5, 0.35, subP);
      pSize *= mix(0.85, 0.7, subP);
    }

    // Attenuate particles near center during solar system & Earth phase
    // so the protoplanetary accretion disk, planets, and Sun are crisply visible
    if (p > 0.75 && p < 0.94) {
      float centerDist = length(pos.xz);
      alpha *= smoothstep(1.5, 14.0, centerDist);
    }

    vColor = color;
    vAlpha = alpha;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vDist = max(0.1, -mvPosition.z);
    
    // Attenuation by distance with minimum visible size
    gl_PointSize = clamp((pSize * uPixelRatio * 320.0) / vDist, 2.0, 60.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const CosmicParticlesFragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vType;
  varying float vDist;

  void main() {
    // Distance from center of point
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);

    if (dist > 0.5) discard;

    // Smooth Gaussian-like soft star glow
    float glow = exp(-dist * dist * 10.0);
    float core = smoothstep(0.18, 0.0, dist) * 1.5;

    vec3 finalColor = vColor * (glow + core);
    float finalAlpha = vAlpha * clamp(glow * 0.6 + core * 0.4, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

/**
 * Procedural generator for cosmic particle buffers across the 13.8 billion year history.
 */
export function generateCosmicParticleGeometry(count: number = 75000): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();

  const initPos = new Float32Array(count * 3);
  const inflationPos = new Float32Array(count * 3);
  const filamentPos = new Float32Array(count * 3);
  const galaxyPos = new Float32Array(count * 3);
  const milkyWayPos = new Float32Array(count * 3);
  const baseColor = new Float32Array(count * 3);
  const phase = new Float32Array(count);
  const scale = new Float32Array(count);
  const type = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const rndPhase = Math.random();
    phase[i] = rndPhase;
    scale[i] = 0.5 + Math.random() * 1.2;
    type[i] = Math.floor(Math.random() * 4);

    // 1. Initial State: Homogeneous isotropic 3D field immersing the camera
    // Non-central: fills the entire field of view uniformly without an edge
    initPos[i3] = (Math.random() - 0.5) * 80.0;
    initPos[i3 + 1] = (Math.random() - 0.5) * 60.0;
    initPos[i3 + 2] = (Math.random() - 0.5) * 60.0 + 20.0;

    // 2. Inflation State: Metric dilation with quantum ripples
    const rScale = 1.8 + Math.random() * 0.4;
    inflationPos[i3] = initPos[i3] * rScale + Math.sin(initPos[i3 + 1] * 0.2) * 2.0;
    inflationPos[i3 + 1] = initPos[i3 + 1] * rScale + Math.cos(initPos[i3] * 0.2) * 2.0;
    inflationPos[i3 + 2] = initPos[i3 + 2] * rScale;

    // 3. Cosmic Web Filament Structure (Voronoi/Cylinder networks)
    // Particles cluster along interconnected spline-like lines
    const filamentIndex = Math.floor(Math.random() * 12);
    const filamentAngle = (filamentIndex / 12) * Math.PI * 2;
    const tFil = (Math.random() - 0.5) * 60.0;
    const radialSpread = Math.pow(Math.random(), 2.0) * 4.0;
    const spreadAngle = Math.random() * Math.PI * 2;

    filamentPos[i3] = Math.cos(filamentAngle) * tFil + Math.cos(spreadAngle) * radialSpread;
    filamentPos[i3 + 1] = (Math.sin(filamentAngle * 1.7) * 15.0) + (Math.random() - 0.5) * 8.0;
    filamentPos[i3 + 2] = Math.sin(filamentAngle) * tFil + Math.sin(spreadAngle) * radialSpread;

    // 4. Galaxy Clusters / Proto-Galaxies
    // Grouped into multiple rotating discs and irregular clusters
    const clusterId = Math.floor(Math.random() * 7);
    const clusterCenters = [
      [0, 0, 0],
      [14, 6, -10],
      [-16, -4, 12],
      [8, -12, -8],
      [-10, 10, -15],
      [18, -8, 14],
      [-12, -14, -6],
    ];
    const center = clusterCenters[clusterId];
    const galR = Math.pow(Math.random(), 1.5) * 9.0;
    const galTheta = Math.random() * Math.PI * 2;
    const galZ = (Math.random() - 0.5) * (3.0 - galR * 0.2); // flat disk profile

    galaxyPos[i3] = center[0] + galR * Math.cos(galTheta);
    galaxyPos[i3 + 1] = center[1] + galZ;
    galaxyPos[i3 + 2] = center[2] + galR * Math.sin(galTheta);

    // 5. Milky Way Barred Spiral Galaxy
    // Accurate 2-arm logarithmic spiral + central bar + spherical halo
    const isHalo = Math.random() < 0.15;
    if (isHalo) {
      const haloR = Math.cbrt(Math.random()) * 22.0;
      const hTheta = Math.random() * Math.PI * 2;
      const hPhi = Math.acos(2 * Math.random() - 1);
      milkyWayPos[i3] = haloR * Math.sin(hPhi) * Math.cos(hTheta);
      milkyWayPos[i3 + 1] = haloR * Math.sin(hPhi) * Math.sin(hTheta) * 0.6;
      milkyWayPos[i3 + 2] = haloR * Math.cos(hPhi);
    } else {
      const arm = Math.random() < 0.5 ? 0 : Math.PI;
      const rLog = Math.pow(Math.random(), 1.2) * 16.0;
      // Logarithmic spiral: theta = ln(r/a) / b
      const spiralTheta = arm + Math.log(Math.max(rLog, 0.4) + 1.0) * 2.8 + (Math.random() - 0.5) * 0.6;
      const diskThickness = Math.max(0.1, 1.2 - rLog * 0.06);
      milkyWayPos[i3] = rLog * Math.cos(spiralTheta) + (Math.random() - 0.5) * 0.8;
      milkyWayPos[i3 + 1] = (Math.random() - 0.5) * diskThickness;
      milkyWayPos[i3 + 2] = rLog * Math.sin(spiralTheta) + (Math.random() - 0.5) * 0.8;
    }

    // Base colors
    baseColor[i3] = 0.5 + Math.random() * 0.5;
    baseColor[i3 + 1] = 0.6 + Math.random() * 0.4;
    baseColor[i3 + 2] = 0.8 + Math.random() * 0.2;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(initPos, 3));
  geometry.setAttribute("aInitPos", new THREE.BufferAttribute(initPos, 3));
  geometry.setAttribute("aInflationPos", new THREE.BufferAttribute(inflationPos, 3));
  geometry.setAttribute("aFilamentPos", new THREE.BufferAttribute(filamentPos, 3));
  geometry.setAttribute("aGalaxyPos", new THREE.BufferAttribute(galaxyPos, 3));
  geometry.setAttribute("aMilkyWayPos", new THREE.BufferAttribute(milkyWayPos, 3));
  geometry.setAttribute("aBaseColor", new THREE.BufferAttribute(baseColor, 3));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scale, 1));
  geometry.setAttribute("aType", new THREE.BufferAttribute(type, 1));
  geometry.computeBoundingSphere();

  return geometry;
}
