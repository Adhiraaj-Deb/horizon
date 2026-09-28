import * as THREE from "three";

/**
 * Creates the Protoplanetary Disk, Infant Sun, 8 Planets, and Earth Evolution Mesh.
 * Responds continuously to scroll progress `uProgress` between 0.78 and 0.96.
 */

export interface PlanetData {
  name: string;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number;
  color: number;
  emissive?: number;
  roughness?: number;
  hasRings?: boolean;
  classification: string;
  fact: string;
}

export const PLANETS: PlanetData[] = [
  {
    name: "Mercury",
    radius: 0.18,
    orbitRadius: 2.2,
    orbitSpeed: 4.1,
    color: 0x9ca3af,
    classification: "Terrestrial Planet",
    fact: "Heavily cratered, extreme temperature swings from -180°C to 430°C.",
  },
  {
    name: "Venus",
    radius: 0.32,
    orbitRadius: 3.2,
    orbitSpeed: 1.6,
    color: 0xfbbf24,
    classification: "Terrestrial Planet",
    fact: "Runaway greenhouse effect creates a 465°C surface with crushing sulfuric clouds.",
  },
  {
    name: "Earth",
    radius: 0.35,
    orbitRadius: 4.4,
    orbitSpeed: 1.0,
    color: 0x38bdf8,
    classification: "Living Terrestrial Planet",
    fact: "The only known world with stable liquid surface water, plate tectonics, and life.",
  },
  {
    name: "Mars",
    radius: 0.22,
    orbitRadius: 5.6,
    orbitSpeed: 0.53,
    color: 0xf87171,
    classification: "Terrestrial Planet",
    fact: "Home to Olympus Mons, the largest volcano in the Solar System.",
  },
  {
    name: "Jupiter",
    radius: 0.85,
    orbitRadius: 7.6,
    orbitSpeed: 0.25,
    color: 0xfb923c,
    classification: "Gas Giant",
    fact: "More massive than all other planets combined, with a Great Red Spot raging for centuries.",
  },
  {
    name: "Saturn",
    radius: 0.72,
    orbitRadius: 9.8,
    orbitSpeed: 0.18,
    color: 0xfef08a,
    hasRings: true,
    classification: "Ringed Gas Giant",
    fact: "Spectacular ring system spanning 282,000 km, composed mostly of water ice.",
  },
  {
    name: "Uranus",
    radius: 0.48,
    orbitRadius: 11.8,
    orbitSpeed: 0.12,
    color: 0x67e8f9,
    classification: "Ice Giant",
    fact: "Rotates on its side with an axial tilt of 98°, likely caused by an ancient collision.",
  },
  {
    name: "Neptune",
    radius: 0.46,
    orbitRadius: 13.8,
    orbitSpeed: 0.08,
    color: 0x60a5fa,
    classification: "Ice Giant",
    fact: "Features supersonic winds exceeding 2,100 km/h in its deep methane atmosphere.",
  },
];

export class SolarSystemController {
  public group: THREE.Group;
  public sunMesh: THREE.Mesh;
  public sunCorona: THREE.Mesh;
  public diskMesh: THREE.Mesh;
  public diskMaterial: THREE.ShaderMaterial;
  public planetMeshes: { mesh: THREE.Group; data: PlanetData; ringMesh?: THREE.Mesh }[] = [];
  public earthEvolutionMesh: THREE.Mesh;
  public earthMaterial: THREE.ShaderMaterial;
  public orbitLinesGroup: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.orbitLinesGroup = new THREE.Group();
    this.group.add(this.orbitLinesGroup);

    // ========================================================
    // 1. Central Sun & Coronal Glow
    // ========================================================
    const sunGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xfffbeb,
    });
    this.sunMesh = new THREE.Mesh(sunGeo, sunMat);
    this.group.add(this.sunMesh);

    // Sun Corona Halo
    const coronaGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const coronaMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: /* glsl */ `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vNormal;
        uniform float uTime;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 coronaColor = mix(vec3(1.0, 0.6, 0.1), vec3(1.0, 0.95, 0.6), sin(uTime * 3.0) * 0.2 + 0.8);
          gl_FragColor = vec4(coronaColor * intensity * 2.0, intensity * 0.8);
        }
      `,
    });
    this.sunCorona = new THREE.Mesh(coronaGeo, coronaMat);
    this.group.add(this.sunCorona);

    // ========================================================
    // 2. Protoplanetary Accretion Disk
    // ========================================================
    const diskGeo = new THREE.RingGeometry(1.5, 15.0, 64, 16);
    // Rotate ring to lie flat on XZ plane
    diskGeo.rotateX(-Math.PI / 2);

    this.diskMaterial = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uProgress: { value: 0.8 },
        uTime: { value: 0 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uProgress;
        uniform float uTime;
        varying vec3 vPosition;

        void main() {
          float r = length(vPosition.xz);
          float angle = atan(vPosition.z, vPosition.x);

          // Spiral density waves in the protoplanetary nebula
          float spiral = sin(r * 2.0 - angle * 3.0 + uTime * 1.5) * 0.5 + 0.5;

          // Planetary gap clearance as progress advances
          // Dust clears out where planets form
          float clearance = smoothstep(0.78, 0.87, uProgress);
          float gapEarth = abs(r - 4.4);
          float gapJupiter = abs(r - 7.6);
          float clearedDensity = smoothstep(0.4, 1.5, gapEarth) * smoothstep(0.6, 2.0, gapJupiter);

          // Radial falloff: inner hot bright zone to cold outer nebula
          float radialFalloff = smoothstep(1.5, 3.5, r) * (1.0 - smoothstep(11.0, 15.0, r));
          float alpha = radialFalloff * (0.8 - clearance * 0.75) * (0.7 + 0.3 * spiral) * mix(1.0, clearedDensity, clearance);

          // Color temperature: incandescent orange-yellow inside, dusty amber outside
          vec3 hotColor = vec3(1.0, 0.75, 0.3);
          vec3 coldDust = vec3(0.75, 0.45, 0.2);
          vec3 col = mix(hotColor, coldDust, smoothstep(2.0, 10.0, r));

          gl_FragColor = vec4(col, alpha);
        }
      `,
    });
    this.diskMesh = new THREE.Mesh(diskGeo, this.diskMaterial);
    this.group.add(this.diskMesh);

    // ========================================================
    // 3. The 8 Planets & Orbit Guides
    // ========================================================
    PLANETS.forEach((planet) => {
      const planetGroup = new THREE.Group();

      // Sphere mesh
      const geo = new THREE.SphereGeometry(planet.radius, 24, 24);
      const mat = new THREE.MeshStandardMaterial({
        color: planet.color,
        roughness: 0.6,
        metalness: 0.1,
      });
      const pMesh = new THREE.Mesh(geo, mat);
      planetGroup.add(pMesh);

      // Saturn Ring System
      let ringMesh: THREE.Mesh | undefined;
      if (planet.hasRings) {
        const rGeo = new THREE.RingGeometry(planet.radius * 1.4, planet.radius * 2.4, 32);
        rGeo.rotateX(Math.PI / 2.3);
        const rMat = new THREE.MeshBasicMaterial({
          color: 0xfef08a,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.75,
        });
        ringMesh = new THREE.Mesh(rGeo, rMat);
        planetGroup.add(ringMesh);
      }

      this.group.add(planetGroup);
      this.planetMeshes.push({ mesh: planetGroup, data: planet, ringMesh });

      // Subtle Orbit Path Ring
      const orbitGeo = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      const segments = 64;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * planet.orbitRadius, 0, Math.sin(theta) * planet.orbitRadius));
      }
      orbitGeo.setFromPoints(points);
      const orbitMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.08,
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      this.orbitLinesGroup.add(orbitLine);
    });

    // ========================================================
    // 4. Evolving Planet Earth Model (Hadean Magma -> Blue Marble)
    // ========================================================
    const earthGeo = new THREE.SphereGeometry(1.6, 48, 48);
    this.earthMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uProgress: { value: 0.9 },
        uTime: { value: 0 },
      },
      vertexShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uProgress;
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;

        // Pseudo noise for continents & magma cracks
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
            u.y
          );
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 4; i++) {
            v += a * noise(p);
            p *= 2.0;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          // Normalize normal
          vec3 n = normalize(vNormal);
          float light = max(0.0, dot(n, normalize(vec3(1.0, 0.4, 0.8))));

          // Continent / Ocean mask
          vec2 sphereCoord = vec2(vUv.x * 6.28, vUv.y * 3.14);
          float land = fbm(sphereCoord * 2.0 + vec2(uTime * 0.02, 0.0));

          // Evolution progress factor (0.88 -> 0.93)
          float earthStage = clamp((uProgress - 0.88) / 0.05, 0.0, 1.0);

          // 1. Hadean Stage (Molten Magma, glowing fissures)
          vec3 basalt = vec3(0.08, 0.08, 0.1);
          vec3 lava = vec3(1.0, 0.35, 0.05) * (1.5 + sin(uTime * 4.0 + land * 10.0) * 0.5);
          float cracks = smoothstep(0.48, 0.55, land);
          vec3 hadeanColor = mix(lava, basalt, cracks);

          // 2. Modern Blue Marble Stage (Oceans, Green/Brown Land, Clouds)
          vec3 deepOcean = vec3(0.04, 0.22, 0.55);
          vec3 landGreen = vec3(0.12, 0.42, 0.22);
          vec3 landMountain = vec3(0.45, 0.38, 0.28);
          vec3 modernSurface = land > 0.52 ? mix(landGreen, landMountain, (land - 0.52) * 3.0) : deepOcean;

          // Clouds layer
          float cloudMask = fbm(sphereCoord * 3.0 + vec2(uTime * 0.04, 0.0));
          vec3 clouds = vec3(1.0, 1.0, 1.0) * smoothstep(0.48, 0.7, cloudMask) * 0.85;

          vec3 modernEarth = mix(modernSurface, clouds, smoothstep(0.5, 0.7, cloudMask));

          // Atmosphere Rayleigh scattering rim
          float rim = pow(1.0 - max(0.0, dot(n, vec3(0.0, 0.0, 1.0))), 3.0);
          vec3 atmosphere = mix(vec3(0.8, 0.3, 0.1), vec3(0.2, 0.6, 1.0), earthStage) * rim * 1.5;

          // Composite Earth
          vec3 finalColor = mix(hadeanColor, modernEarth, earthStage) * (0.3 + 0.7 * light) + atmosphere;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
    this.earthEvolutionMesh = new THREE.Mesh(earthGeo, this.earthMaterial);
    // Placed in scene but visible predominantly during the Earth sequence
    this.earthEvolutionMesh.position.set(0, 0, 0);
    this.earthEvolutionMesh.visible = false;
    this.group.add(this.earthEvolutionMesh);
  }

  public update(progress: number, time: number): void {
    // Determine overall visibility of Solar System features
    // 0.78 is Solar System collapse, 0.88 is planet orbits, 0.93 pulls back
    const isSolarActive = progress >= 0.77 && progress <= 0.97;
    this.group.visible = isSolarActive;

    if (!isSolarActive) return;

    // Update Protoplanetary Disk Uniforms
    this.diskMaterial.uniforms.uProgress.value = progress;
    this.diskMaterial.uniforms.uTime.value = time;
    this.sunCorona.material = this.sunCorona.material; // trigger
    (this.sunCorona.material as THREE.ShaderMaterial).uniforms.uTime.value = time;

    // Protoplanetary disk fades out as planets solidify (around 0.88)
    const diskFade = 1.0 - THREE.MathUtils.smoothstep(progress, 0.86, 0.92);
    this.diskMesh.visible = diskFade > 0.01;

    // Earth Close-up sequence (0.88 to 0.93)
    const isEarthCloseup = progress >= 0.875 && progress <= 0.935;
    this.earthEvolutionMesh.visible = isEarthCloseup;
    if (isEarthCloseup) {
      this.earthMaterial.uniforms.uProgress.value = progress;
      this.earthMaterial.uniforms.uTime.value = time;
      this.earthEvolutionMesh.rotation.y = time * 0.15;
    }

    // Solar System planets orbital positions
    const planetsAlpha =
      THREE.MathUtils.smoothstep(progress, 0.81, 0.88) *
      (1.0 - THREE.MathUtils.smoothstep(progress, 0.94, 0.97));
    this.orbitLinesGroup.visible = planetsAlpha > 0.05 && !isEarthCloseup;

    this.planetMeshes.forEach((item) => {
      item.mesh.visible = planetsAlpha > 0.02 && !isEarthCloseup;
      if (item.mesh.visible) {
        // Orbital motion around the Sun
        const angle = time * item.data.orbitSpeed * 0.4 + item.data.orbitRadius;
        item.mesh.position.x = Math.cos(angle) * item.data.orbitRadius;
        item.mesh.position.z = Math.sin(angle) * item.data.orbitRadius;
        item.mesh.position.y = 0;
        item.mesh.rotation.y = time * 0.8;
      }
    });

    // Sun scale pulses gently
    const sunScale = 1.0 + Math.sin(time * 2.0) * 0.03;
    this.sunMesh.scale.setScalar(sunScale);
    this.sunCorona.scale.setScalar(sunScale);
  }

  public dispose(): void {
    this.sunMesh.geometry.dispose();
    (this.sunMesh.material as THREE.Material).dispose();
    this.sunCorona.geometry.dispose();
    (this.sunCorona.material as THREE.Material).dispose();
    this.diskMesh.geometry.dispose();
    this.diskMaterial.dispose();
    this.earthEvolutionMesh.geometry.dispose();
    this.earthMaterial.dispose();
    this.planetMeshes.forEach((p) => {
      p.mesh.children.forEach((c) => {
        if (c instanceof THREE.Mesh) {
          c.geometry.dispose();
          if (Array.isArray(c.material)) {
            c.material.forEach((m) => m.dispose());
          } else {
            c.material.dispose();
          }
        }
      });
    });
  }
}
