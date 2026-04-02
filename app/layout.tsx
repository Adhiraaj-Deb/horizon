import type { Metadata } from "next";
import { Inter, Orbitron, Bebas_Neue, Space_Grotesk } from "next/font/google";
import "./globals.css";
import IframePreloader from "@/components/IframePreloader";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });

export const metadata: Metadata = {
    title: "The Event Horizon | HORIZON",
    description: "An interactive journey through the cosmos.",
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
                {/* Silently pre-cache NASA Eyes assets from every page so /events loads instantly */}
                <IframePreloader />
            </body>
        </html>
    );
}
