# 🌌 HORIZON: Interactive Astrophysics Exhibit

![Horizon Overview](https://img.shields.io/badge/Status-Active-brightgreen) ![Tech Stack](https://img.shields.io/badge/Tech-Next.js%20%7C%20Three.js%20%7C%20WebGL-blue)

## 📖 What is HORIZON?
**HORIZON** is a highly immersive, interactive web-based astrophysics exhibit. It is designed to bring the profound concepts of space, time, and cosmic evolution directly into your web browser using real-time 3D rendering, custom GLSL shaders, and cinematic web design. 

The primary goal of HORIZON is both educational and inspirational: to visualize the immense scale of the cosmos, the mind-bending curvature of spacetime around black holes, and the 13.8-billion-year timeline of our universe in a way that is accessible, scientifically grounded, and visually breathtaking.

---

## 🚀 What Does It Show? (Core Modules)

HORIZON is divided into several interactive modules, each exploring a different facet of astrophysics:

*   **The Universe Timeline (`/universe`)**
    A 13.8-billion-year continuous, scrollable cosmic timeline. It utilizes a custom 100,000-particle WebGL shader to transition you smoothly from the Big Bang (t=0), through the formation of the Cosmic Web, the Milky Way, the birth of our Solar System, the formation of Planet Earth, all the way into the theoretical far future (Heat Death / Cosmic Horizon).
    
*   **The Singularity (`/singularity`)**
    A real-time General Relativity simulator. Powered by custom WebGL raymarching shaders, it simulates a Schwarzschild/Kerr black hole. It visualizes the warping of spacetime, gravitational lensing of background stars, the photon sphere, and the glowing accretion disk.

*   **Solar System (`/system`)**
    An interactive, accurately scaled 3D simulation of our Solar System, allowing users to explore the planets, their orbits, and planetary data.

*   **Cosmic Horizon (`/horizon`)**
    Explores the limits of the observable universe, telescopes, and the scale of the cosmos.

*   **Astronomical Events (`/events`)**
    A dedicated module for tracking real-world live and historical astrophysical phenomena.

---

## 🎯 What is the Point of HORIZON?
The universe is unimaginably vast and governed by physical laws that are often difficult to intuitively grasp through text alone. **HORIZON bridges the gap between complex astrophysical theories and interactive visual storytelling.** 

Whether it is understanding how gravity bends light or grasping the sheer amount of time it took for the Earth to form from a swirling cloud of cosmic dust, HORIZON is built for students, space enthusiasts, and anyone curious about the cosmos. It proves that the modern web is a powerful, capable medium for high-performance scientific visualization.

---

## 🛠️ Technology Stack

HORIZON achieves its high-performance 3D visuals and smooth UI using modern web technologies:
*   **Core Framework**: [Next.js](https://nextjs.org/) (React) & TypeScript
*   **3D Engine**: [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) (R3F)
*   **Graphics/Shaders**: Custom GLSL (Raymarching, GPGPU Particle Systems)
*   **UI Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)

---

## 💻 Running Locally

If you want to run the HORIZON exhibit on your local machine:

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser to start exploring the cosmos.
