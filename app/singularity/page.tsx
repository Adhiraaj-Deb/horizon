"use client";

import Navbar from "@/components/Navbar";
import SingularityView from "@/components/singularity/SingularityView";

export default function SingularityPage() {
  return (
    <main className="relative bg-black min-h-screen w-full overflow-hidden">
      <Navbar />
      <SingularityView />
    </main>
  );
}
