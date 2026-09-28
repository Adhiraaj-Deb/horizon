"use client";

import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Menu, Sparkles, ChevronRight } from "lucide-react";

const NAV_LINKS = [
  { name: "Home", href: "/", desc: "Mission Overview & Intro" },
  { name: "Universe", href: "/universe", desc: "13.8B Year Cosmic Timeline" },
  { name: "System", href: "/system", desc: "Interactive Solar System" },
  { name: "Singularity", href: "/singularity", desc: "General Relativity Black Hole" },
  { name: "Horizon", href: "/horizon", desc: "Cosmic Horizon & Telescopes" },
  { name: "Events", href: "/events", desc: "Live Astronomical Phenomena" },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (isHome) {
      const threshold = window.innerHeight * 7;
      if (latest < threshold) {
        setHidden(true);
      } else {
        setHidden(latest > previous);
      }
    } else {
      if (latest < 50) {
        setHidden(false);
      } else {
        setHidden(latest > previous && latest > 150);
      }
    }
  });

  return (
    <>
      <motion.nav
        variants={{ visible: { y: 0, opacity: 1 }, hidden: { y: "-120%", opacity: 0 } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-10 pt-5 flex justify-center pointer-events-none"
      >
        <div className="w-full max-w-5xl pointer-events-auto relative glass-card glass-card-glow rounded-2xl px-6 py-3.5 flex justify-between items-center overflow-hidden scanlines">
          {/* Ambient accent glow behind logo */}
          <div
            className="ambient-spot w-40 h-40 -left-10 -top-10 opacity-[0.04]"
            style={{ background: "white" }}
          />

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 relative z-10 group"
          >
            <span className="font-bebas text-2xl tracking-widest text-white mt-1">
              HORIZON
            </span>
          </Link>

          {/* Center Navigation Links (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link, idx) => {
              const isActive = pathname === link.href;
              return (
                <div key={link.href} className="flex items-center gap-6">
                  {idx > 0 && <div className="w-[1px] h-3 bg-white/20" />}
                  <Link
                    href={link.href}
                    className={`font-grotesk text-[10px] uppercase tracking-[0.45em] transition-colors duration-300 ${
                      isActive ? "text-cyan-400 font-semibold" : "text-white/40 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Live indicator dot (desktop) */}
          <div className="hidden md:flex items-center gap-2 relative z-10">
            <motion.div
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-cyan-400"
            />
            <span className="font-grotesk text-[10px] uppercase tracking-[0.3em] text-white/20">
              Live
            </span>
          </div>

          {/* Mobile Hamburger toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative z-10 p-2 text-white/70 hover:text-white transition-colors glass-card rounded-xl border border-white/10"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-cyan-400" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* MOBILE NAVIGATION SIDEBAR / DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[105] bg-black/80 backdrop-blur-md pointer-events-auto"
            />

            {/* Sidebar Drawer */}
            <motion.aside
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] z-[110] bg-black/95 border-l border-white/10 backdrop-blur-2xl p-6 flex flex-col justify-between overflow-y-auto pointer-events-auto shadow-2xl"
            >
              {/* Top Header */}
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="font-bebas text-2xl tracking-widest text-white">
                      HORIZON SPACE
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nav Links */}
                <div className="py-6 flex flex-col gap-2">
                  <span className="text-[10px] uppercase font-orbitron tracking-[0.3em] text-white/30 px-3 mb-2 block">
                    Navigation Routes
                  </span>

                  {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                          isActive
                            ? "bg-cyan-500/15 border-cyan-400/40 text-white"
                            : "bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <div className="flex flex-col">
                          <span
                            className={`font-bebas text-2xl tracking-wider ${
                              isActive ? "text-cyan-300" : "text-white"
                            }`}
                          >
                            {link.name}
                          </span>
                          <span className="text-[10px] text-white/40 tracking-wider">
                            {link.desc}
                          </span>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 ${
                            isActive ? "text-cyan-400" : "text-white/20"
                          }`}
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Info */}
              <div className="pt-6 border-t border-white/10 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-orbitron text-[10px] uppercase tracking-[0.25em] text-white/60">
                    Interactive Astrophysics Exhibit
                  </span>
                </div>
                <p className="text-[10px] text-white/30 leading-relaxed font-grotesk">
                  Explore curved spacetime, 13.8B years of cosmic history, and real astrophysical phenomena.
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
