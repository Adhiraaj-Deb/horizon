import type { Metadata } from "next";
import { Inter, Orbitron, Bebas_Neue, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });

export const metadata: Metadata = {
    title: "The Event Horizon | Synalpy",
    description: "A cinematic exploration of space and the unknown.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${orbitron.variable} ${bebas.variable} ${grotesk.variable} font-grotesk antialiased`}>
                {children}
            </body>
        </html>
    );
}
