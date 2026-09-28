/**
 * GLSL Shader Pipeline for Relativistic Black Hole Raymarching
 *
 * Implements:
 * 1. Curved null-geodesic numerical raymarching in Schwarzschild & Kerr spacetime
 * 2. Distinction between Event Horizon (r_s = 2M), Photon Sphere (r_ph = 3M),
 *    and Black Hole Shadow (impact parameter b_crit = sqrt(27) * M ≈ 5.196 M)
 * 3. Thin Keplerian accretion disk with Shakura-Sunyaev / Novikov-Thorne temperature profile
 * 4. Gravitational lensing of the disk (producing top and bottom warped images)
 * 5. Relativistic Doppler beaming and boosting: delta = 1 / [gamma * (1 - beta * cos(theta))]
 * 6. Gravitational redshift: g = sqrt(1 - 2M/r)
 * 7. Procedural gravitationally lensed celestial starfield
 * 8. Optional collimated relativistic jets via Blandford-Znajek mechanism
 * 9. Optional educational guide rings (Photon sphere, Event Horizon, ISCO)
 */

export const vertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uCameraPos;
uniform mat3 uCameraMatrix; // [Right, Up, Forward]
uniform float uFov;

// Scientific parameters
uniform float uMass;           // Geometric mass (default 1.0)
uniform float uSpin;           // Dimensionless Kerr spin a* in [0, 0.998]
uniform float uDiskBrightness; // Accretion disk brightness
uniform float uDopplerEnabled; // 1.0 = on, 0.0 = off
uniform float uRedshiftEnabled;// 1.0 = on, 0.0 = off
uniform float uShowJets;       // 1.0 = show relativistic jets, 0.0 = hide
uniform float uShowGuides;     // 1.0 = show photon sphere / ISCO guides, 0.0 = hide
uniform int uMaxSteps;         // Raymarch steps (quality: 50 - 160)
uniform float uDiskTurbulence; // Noise octave depth

#define PI 3.14159265358979323846
#define TWO_PI 6.28318530717958647692

// ============================================================
// NOISE & PROCEDURAL UTILITIES
// ============================================================

// Hash function
float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// 2D Simplex/Perlin-style noise for accretion disk turbulence
float noise2d(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Multi-octave fractal noise
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.55;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 4; ++i) {
    v += a * noise2d(p);
    p = rot * p * 2.1 + shift;
    a *= 0.48;
  }
  return v;
}

// ============================================================
// PHYSICALLY MOTIVATED BLACKBODY COLOR PALETTE
// ============================================================

// Approximates blackbody radiation emission temperature (in Kelvin) to RGB
vec3 blackbodyColor(float tempK) {
  tempK = clamp(tempK, 1000.0, 45000.0);
  float t = tempK / 100.0;
  vec3 col;
  
  // Red
  if (t <= 66.0) {
    col.r = 1.0;
  } else {
    col.r = clamp(pow((t - 60.0) / 40.0, -0.1332) * 1.29, 0.0, 1.0);
  }
  
  // Green
  if (t <= 66.0) {
    col.g = clamp(99.47 * log(t) - 161.12, 0.0, 255.0) / 255.0;
  } else {
    col.g = clamp(288.12 * pow(t - 60.0, -0.0755), 0.0, 255.0) / 255.0;
  }
  
  // Blue
  if (t >= 66.0) {
    col.b = 1.0;
  } else if (t <= 19.0) {
    col.b = 0.0;
  } else {
    col.b = clamp(138.51 * log(t - 10.0) - 305.04, 0.0, 255.0) / 255.0;
  }
  
  return col;
}

// ============================================================
// PROCEDURAL BACKGROUND CELESTIAL ENVIRONMENT & STARFIELD
// ============================================================

vec3 sampleCelestialBackground(vec3 dir) {
  // Normalize direction
  dir = normalize(dir);
  
  // Subtle galactic milky way band along the equatorial/oblique plane
  float galacticPlane = exp(-pow(dir.y * 3.5, 2.0));
  float galacticDust = fbm(vec2(atan(dir.z, dir.x) * 2.0, dir.y * 5.0));
  vec3 nebulaGlow = vec3(0.04, 0.06, 0.12) * galacticPlane * (0.6 + 0.4 * galacticDust);
  nebulaGlow += vec3(0.08, 0.04, 0.02) * pow(galacticPlane, 3.0) * galacticDust;

  // Starfield grid sampling across celestial sphere
  vec3 stars = vec3(0.0);
  vec3 p = dir * 160.0;
  vec3 ip = floor(p);
  vec3 fp = fract(p) - 0.5;

  float h = hash13(ip);
  if (h > 0.88) { // Star exists in this grid cell
    float dist = length(fp);
    float starBrightness = pow((h - 0.88) / 0.12, 2.5) * 1.6;
    float starSize = mix(0.08, 0.03, (h - 0.88) / 0.12);
    
    // Core glow
    float glow = exp(-dist / starSize);
    
    // Star color depending on stellar spectral type (O, B, A, G, M)
    vec3 starColor;
    float spectralH = fract(h * 37.1);
    if (spectralH < 0.25) starColor = vec3(0.7, 0.85, 1.0); // O/B Blue giant
    else if (spectralH < 0.65) starColor = vec3(1.0, 0.98, 0.92); // A/F White star
    else if (spectralH < 0.85) starColor = vec3(1.0, 0.85, 0.6); // G/K Yellow/orange
    else starColor = vec3(1.0, 0.5, 0.35); // M Red dwarf

    stars += starColor * glow * starBrightness;
  }

  // Add occasional bright landmark star
  vec3 p2 = dir * 45.0;
  vec3 ip2 = floor(p2);
  vec3 fp2 = fract(p2) - 0.5;
  float h2 = hash13(ip2 + 42.1);
  if (h2 > 0.982) {
    float dist2 = length(fp2);
    float glow2 = exp(-dist2 / 0.06) * 3.5;
    // Cross diffraction spike
    float spike = (exp(-abs(fp2.x) / 0.008) * exp(-abs(fp2.y) / 0.15) +
                   exp(-abs(fp2.y) / 0.008) * exp(-abs(fp2.x) / 0.15)) * 0.4;
    stars += vec3(0.85, 0.95, 1.0) * (glow2 + spike);
  }

  return nebulaGlow + stars;
}

// ============================================================
// RELATIVISTIC ACCRETION DISK EMISSION & DOPPLER BEAMING
// ============================================================

// Calculates disk emission at point p with ray direction rayDir
vec4 sampleAccretionDisk(vec3 hitPos, vec3 rayDir, float M, float a, float rIsco, float rOut) {
  float r = length(hitPos.xz);
  if (r < rIsco || r > rOut) return vec4(0.0);

  // Normalized radius inside disk
  float u = (r - rIsco) / (rOut - rIsco);

  // Physical orbital velocity in thin accretion disk:
  // v_phi = sqrt(M / r), Keplerian prograde motion
  float beta = sqrt(M / r); // v/c
  beta = min(beta, 0.75);   // relativistic velocity cap

  // Direction of gas motion: counter-clockwise in xz plane
  // tangent vector = normalize(cross(vec3(0, 1, 0), hitPos)) = (-hitPos.z, 0, hitPos.x) / r
  vec3 vGasDir = vec3(-hitPos.z, 0.0, hitPos.x) / r;

  // Relativistic Doppler factor:
  // delta = 1 / [gamma * (1 - beta * cos(theta))]
  // where cos(theta) is the angle between gas velocity and ray propagation toward observer (-rayDir)
  float cosTheta = dot(vGasDir, -rayDir);
  float gamma = 1.0 / sqrt(max(0.01, 1.0 - beta * beta));
  float dopplerFactor = 1.0 / (gamma * (1.0 - beta * cosTheta));
  
  if (uDopplerEnabled < 0.5) {
    dopplerFactor = 1.0;
  }

  // Gravitational redshift factor: g = sqrt(1 - 2M/r)
  float gravRedshift = sqrt(max(0.01, 1.0 - (2.0 * M) / r));
  if (uRedshiftEnabled < 0.5) {
    gravRedshift = 1.0;
  }

  // Effective observed temperature shift:
  // T_obs = T_emit * delta * g
  // Shakura-Sunyaev inner boundary profile: T(r) ~ (r_isco / r)^(3/4) * [1 - sqrt(r_isco / r)]^(1/4)
  float innerTorqueFree = pow(max(0.001, 1.0 - sqrt(rIsco / r)), 0.25);
  float baseTempK = 38000.0 * pow(rIsco / r, 0.75) * innerTorqueFree + 4000.0 * (1.0 - u);
  float observedTempK = baseTempK * dopplerFactor * gravRedshift;

  // Get blackbody spectral color
  vec3 diskColor = blackbodyColor(observedTempK);

  // Relativistic Doppler Beaming intensity boosting:
  // Relativistic invariance dictates I_nu / nu^3 is Lorentz invariant,
  // integrated bolometric intensity scales as delta^4 (or delta^3.5 for optically thick disk)
  float dopplerBoost = pow(clamp(dopplerFactor, 0.15, 6.0), 3.2);

  // Procedural gas turbulence & spiral density waves
  float phi = atan(hitPos.z, hitPos.x);
  // Differential Keplerian angular velocity omega = sqrt(M / r^3)
  float omega = sqrt(M / (r * r * r));
  float shearedAngle = phi - omega * uTime * 2.5 + 3.0 * log(r / rIsco);
  
  vec2 noiseCoord = vec2(shearedAngle * 3.0, r * 1.2);
  float turb = fbm(noiseCoord);
  float gasDensity = 0.55 + 0.45 * turb;

  // Fine filamentary streamers
  float fineStreamers = sin(shearedAngle * 12.0 + fbm(noiseCoord * 2.5) * 6.0) * 0.5 + 0.5;
  gasDensity *= (0.8 + 0.3 * fineStreamers);

  // Radial density profile: strong near ISCO, fading smoothly at outer boundary
  float radialEnvelope = sin(u * PI) * pow(1.0 - u, 0.35);

  // Final intensity
  float intensity = radialEnvelope * gasDensity * dopplerBoost * uDiskBrightness;

  // Extra incandescent boost near hot inner ISCO boundary
  float innerEdgeGlow = exp(-(r - rIsco) * 1.5) * 2.0;
  intensity += innerEdgeGlow * dopplerBoost * uDiskBrightness * 0.6;

  // Return RGBA with premultiplied optical depth
  float alpha = clamp(intensity * 1.4, 0.0, 0.95);
  return vec4(diskColor * intensity * 1.6, alpha);
}

// ============================================================
// RELATIVISTIC JETS (BLANDFORD-ZNAJEK MECHANISM)
// ============================================================

vec4 sampleRelativisticJets(vec3 p, vec3 rayDir) {
  if (uShowJets < 0.5) return vec4(0.0);

  // Jets extend along the black hole's rotational axis (y-axis)
  float y = abs(p.y);
  if (y < 2.5 || y > 32.0) return vec4(0.0);

  // Collimation profile: r_jet(y) opens narrowly with z
  float jetRadius = 0.35 + 0.075 * pow(y, 1.2);
  float rDist = length(p.xz);

  if (rDist < jetRadius * 2.2) {
    // Helical magnetic field twist
    float helix = sin(p.y * 1.2 - atan(p.z, p.x) * 2.0 + uTime * 6.0);
    float coreFactor = exp(-pow(rDist / jetRadius, 2.0));
    float longitudinalFade = exp(-y * 0.08);

    // Relativistic Doppler boosting of the forward/receding jet lobes
    float jetSpeedBeta = 0.85; // highly relativistic bulk Lorentz factor
    float jetSign = (p.y > 0.0) ? 1.0 : -1.0;
    vec3 jetVelocity = vec3(0.0, jetSign * jetSpeedBeta, 0.0);
    float cosTheta = dot(jetVelocity, -rayDir) / jetSpeedBeta;
    float gammaJet = 1.0 / sqrt(1.0 - jetSpeedBeta * jetSpeedBeta);
    float jetDoppler = 1.0 / (gammaJet * (1.0 - jetSpeedBeta * cosTheta));
    float jetBoost = pow(clamp(jetDoppler, 0.2, 4.0), 2.5);

    // Jet synchrotron color: luminous electric cyan/purple core with knot shocks
    vec3 jetColor = mix(vec3(0.3, 0.7, 1.0), vec3(0.9, 0.4, 1.0), helix * 0.5 + 0.5);
    float intensity = coreFactor * longitudinalFade * jetBoost * 0.22 * (0.8 + 0.3 * helix);

    return vec4(jetColor * intensity * 2.5, clamp(intensity * 1.2, 0.0, 0.85));
  }

  return vec4(0.0);
}

// ============================================================
// EDUCATIONAL OVERLAYS (PHOTON SPHERE, EVENT HORIZON, ISCO)
// ============================================================

vec3 sampleEducationalGuides(vec3 p, float r, float rHorizon, float rPhoton, float rIsco) {
  if (uShowGuides < 0.5) return vec3(0.0);

  vec3 guideCol = vec3(0.0);

  // 1. Photon Sphere: r ≈ 3.0 M (cyan guide)
  float dPhoton = abs(r - rPhoton);
  if (dPhoton < 0.06) {
    float alpha = exp(-pow(dPhoton / 0.03, 2.0));
    guideCol += vec3(0.1, 0.8, 1.0) * alpha * 0.7;
  }

  // 2. ISCO Ring in equatorial plane: r ≈ rIsco, y ≈ 0 (gold guide)
  float dIsco = abs(r - rIsco);
  float dPlane = abs(p.y);
  if (dIsco < 0.08 && dPlane < 0.12) {
    float alpha = exp(-pow(dIsco / 0.04, 2.0)) * exp(-pow(dPlane / 0.06, 2.0));
    guideCol += vec3(1.0, 0.75, 0.1) * alpha * 0.9;
  }

  // 3. Event horizon boundary: r ≈ rHorizon (violet/magenta guide)
  float dHorizon = abs(r - rHorizon);
  if (dHorizon < 0.06) {
    float alpha = exp(-pow(dHorizon / 0.03, 2.0));
    guideCol += vec3(0.9, 0.15, 0.9) * alpha * 0.7;
  }

  return guideCol;
}

// ============================================================
// MAIN RAYMARCHING WITH SCHWARZSCHILD / KERR GEODESIC INTEGRATION
// ============================================================

void main() {
  // Screen UV coordinates centered at (0, 0)
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);

  // Initial Camera Ray setup
  // uCameraMatrix has columns [Right, Up, Forward]
  vec3 rayDir = normalize(uCameraMatrix * vec3(uv * tan(uFov * 0.5), 1.0));
  vec3 rayPos = uCameraPos;

  // Normalized Geometric Units:
  // M = 1.0, G = c = 1.0
  float M = uMass;
  float a = clamp(uSpin, 0.0, 0.998);

  // Event horizon outer radius in Kerr geometry:
  // r_+ = M + sqrt(M^2 - a^2)
  float rHorizon = M * (1.0 + sqrt(max(0.001, 1.0 - a * a)));

  // Photon sphere radius (Schwarzschild baseline 3M = 1.5 r_s)
  float rPhoton = 3.0 * M;

  // ISCO radius (equatorial prograde Kerr approximation)
  float Z1 = 1.0 + pow(max(0.001, 1.0 - a * a), 1.0/3.0) * 
             (pow(1.0 + a, 1.0/3.0) + pow(max(0.001, 1.0 - a), 1.0/3.0));
  float Z2 = sqrt(3.0 * a * a + Z1 * Z1);
  float rIsco = M * clamp(3.0 + Z2 - sqrt(max(0.0, (3.0 - Z1) * (3.0 + Z1 + 2.0 * Z2))), 1.25, 6.0);
  float rDiskOut = 24.0 * M;

  // Radiance accumulation
  vec3 accumulatedColor = vec3(0.0);
  float accumulatedAlpha = 0.0;
  bool capturedByHorizon = false;

  // Raymarching Geodesic Loop
  float r = length(rayPos);
  float maxWorldRadius = 45.0 * M;

  for (int step = 0; step < 160; ++step) {
    if (step >= uMaxSteps) break;

    r = length(rayPos);

    // 1. EVENT HORIZON TEST:
    // If ray enters r <= rHorizon, it has crossed the event horizon.
    // Inside the horizon, all future-directed light cones point to the singularity.
    // The photon is permanently trapped and cannot escape to outside observers.
    if (r <= rHorizon) {
      capturedByHorizon = true;
      break;
    }

    // 2. ESCAPE TO INFINITY TEST:
    // If ray is far away and propagating outwards, it escapes to the celestial background.
    if (r > maxWorldRadius && dot(rayPos, rayDir) > 0.0) {
      break;
    }

    // Adaptive step size:
    // Large steps far away, fine sub-steps near the intense gravitational curvature (r < 8M)
    float dt = (r < 7.0 * M) ? (0.038 * r) : (0.12 * r);
    dt = clamp(dt, 0.02, 1.4);

    // 3. CURVED-SPACETIME NULL-GEODESIC DEFLECTION:
    // Conserved specific angular momentum L = r x v
    vec3 L = cross(rayPos, rayDir);
    float L2 = dot(L, L);

    // General Relativity acceleration for light in Schwarzschild metric:
    // d^2 x / d lambda^2 = - (3M / 2r^5) * L^2 * x
    vec3 accel = - (1.5 * M * L2 / pow(r, 5.0)) * rayPos;

    // Lense-Thirring frame dragging for rotating Kerr black hole:
    // Spin vector S points along the +y rotational axis
    if (a > 0.01) {
      vec3 spinAxis = vec3(0.0, 1.0, 0.0);
      vec3 frameDrag = (2.0 * M * a / pow(r, 3.0)) * cross(spinAxis, rayDir);
      accel += frameDrag;
    }

    // Update velocity and position
    vec3 prevPos = rayPos;
    vec3 nextDir = normalize(rayDir + accel * dt);
    vec3 nextPos = rayPos + nextDir * dt;

    // 4. ACCRETION DISK INTERSECTION (plane y = 0):
    // Check if step crossed equatorial plane y = 0
    if ((prevPos.y * nextPos.y) <= 0.0 && abs(nextPos.y - prevPos.y) > 0.0001) {
      float tIntersect = -prevPos.y / (nextPos.y - prevPos.y);
      vec3 hitPos = mix(prevPos, nextPos, clamp(tIntersect, 0.0, 1.0));
      
      vec4 diskSample = sampleAccretionDisk(hitPos, rayDir, M, a, rIsco, rDiskOut);
      if (diskSample.a > 0.001) {
        // Front-to-back alpha blending
        accumulatedColor += (1.0 - accumulatedAlpha) * diskSample.rgb;
        accumulatedAlpha += (1.0 - accumulatedAlpha) * diskSample.a;
        if (accumulatedAlpha > 0.98) break;
      }
    }

    // 5. SAMPLE RELATIVISTIC JETS:
    vec4 jetSample = sampleRelativisticJets(nextPos, nextDir);
    if (jetSample.a > 0.001) {
      accumulatedColor += (1.0 - accumulatedAlpha) * jetSample.rgb;
      accumulatedAlpha += (1.0 - accumulatedAlpha) * jetSample.a;
    }

    // 6. SAMPLE OPTIONAL EDUCATIONAL GUIDES:
    vec3 guideCol = sampleEducationalGuides(nextPos, r, rHorizon, rPhoton, rIsco);
    if (length(guideCol) > 0.01) {
      accumulatedColor += (1.0 - accumulatedAlpha) * guideCol;
    }

    // Step forward
    rayPos = nextPos;
    rayDir = nextDir;
  }

  // 7. BACKGROUND CELESTIAL ENVIRONMENT:
  // If the ray was NOT captured by the event horizon, it reached infinity!
  // Sample the gravitationally lensed celestial background using the deflected final ray direction.
  if (!capturedByHorizon) {
    vec3 backgroundStars = sampleCelestialBackground(rayDir);
    accumulatedColor += (1.0 - accumulatedAlpha) * backgroundStars;
  } else {
    // True black hole shadow: The region within the apparent photon capture boundary
    // Inside the shadow, no photons from the background can reach the observer.
    // Event horizon is pitch-black.
    accumulatedColor += (1.0 - accumulatedAlpha) * vec3(0.0);
  }

  // Tone-mapping and subtle cinematic contrast
  // ACES Filmic Tone Mapping Curve
  vec3 x = accumulatedColor;
  vec3 mapped = (x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14);
  mapped = clamp(mapped, 0.0, 1.0);

  // Gamma correction (gamma = 2.2)
  mapped = pow(mapped, vec3(1.0 / 2.2));

  gl_FragColor = vec4(mapped, 1.0);
}
`;
