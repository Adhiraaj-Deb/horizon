import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                space: {
                    900: "#02040a",
                    800: "#0b1021",
                    700: "#162038",
                }
            },
            fontFamily: {
                orbitron: ['var(--font-orbitron)'],
                inter: ['var(--font-inter)'],
                bebas: ['var(--font-bebas)'],
                grotesk: ['var(--font-grotesk)'],
            },
            letterSpacing: {
                widest: '.25em',
                ultra: '.5em',
            },
            backgroundImage: {
                'liquid-silver': 'linear-gradient(135deg, #e8e8e8 0%, #ffffff 25%, #b0b0b0 50%, #ffffff 75%, #c8c8c8 100%)',
                'liquid-gold': 'linear-gradient(135deg, #b8872a 0%, #f5e078 25%, #a06010 50%, #f5e078 75%, #b8872a 100%)',
                'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
            },
            animation: {
                shimmer: 'shimmer 2.5s infinite',
                'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
                fadeUp: 'fadeUp 0.8s ease-out forwards',
                'scan': 'scan 4s linear infinite',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'glow-pulse': {
                    '0%, 100%': { textShadow: '0 0 10px rgba(255,255,255,0.4), 0 0 30px rgba(255,255,255,0.1)' },
                    '50%': { textShadow: '0 0 20px rgba(255,255,255,0.7), 0 0 60px rgba(255,255,255,0.2)' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scan: {
                    '0%': { backgroundPosition: '0 -100vh' },
                    '100%': { backgroundPosition: '0 100vh' },
                },
            },
        },
    },
    plugins: [],
};
export default config;
