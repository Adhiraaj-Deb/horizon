import Navbar from "@/components/Navbar";
import UniverseView from "@/components/universe/UniverseView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Universe | 13.8 Billion Years of Evolution | HORIZON",
  description:
    "A continuous, scroll-driven interactive scientific journey through 13.8 billion years of cosmic evolution from the early universe to the cosmic horizon.",
};

export default function UniversePage() {
  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden selection:bg-cyan-500/20 selection:text-cyan-200">
      <Navbar />
      <UniverseView />
    </main>
  );
}
