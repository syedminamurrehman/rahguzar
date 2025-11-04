"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Plus, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/about", label: "About", angle: 140 },
    { href: "/routes", label: "Routes", angle: 180 },
    { href: "/getstarted", label: "Get Started", angle: 65 },
  ];

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg border-b border-white/10
                 bg-gradient-to-r from-blue-950/60 via-indigo-900/50 to-purple-900/50
                 shadow-[0_2px_20px_rgba(0,0,0,0.35)]"
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* 🌍 Logo + Brand */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/route.png"
            alt="RahGuzar Logo"
            width={45}
            height={45}
            className="rounded-full shadow-md hover:scale-105 transition-transform duration-300"
          />
          <span className="text-xl md:text-2xl font-bold text-white tracking-wide drop-shadow-lg">
            RahGuzar
          </span>
        </Link>

        {/* 🌐 Bubble Menu */}
        <div className="relative flex items-center justify-center">
          {/* 🔘 Main Floating Bubble */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
            className="relative w-12 h-12 rounded-full flex items-center justify-center
                       bg-gradient-to-br from-indigo-500 to-purple-600 text-white
                       shadow-[0_0_20px_rgba(147,51,234,0.6)]
                       hover:shadow-[0_0_25px_rgba(147,51,234,0.8)]
                       transition-all duration-300"
          >
            {isOpen ? <X size={24} /> : <Plus size={24} />}
            <motion.div
              className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0"
              whileHover={{ opacity: 0.6 }}
            />
          </motion.button>

          {/* 💫 Animated Floating Nav Bubbles */}
          <AnimatePresence>
            {isOpen &&
              navItems.map((item, i) => {
                const radius = 110; // distance from main bubble
                const radians = (item.angle * Math.PI) / 180;
                const x = Math.cos(radians) * radius;
                const y = Math.sin(radians) * radius;

                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      x,
                      y,
                      scale: 1,
                      transition: {
                        delay: i * 0.1,
                        type: "spring",
                        stiffness: 250,
                        damping: 18,
                      },
                    }}
                    exit={{
                      opacity: 0,
                      x: 0,
                      y: 0,
                      scale: 0,
                      transition: { duration: 0.3 },
                    }}
                    className="absolute right-0 bottom-0"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="relative flex items-center justify-center w-28 h-12 rounded-full
                                 bg-white/10 backdrop-blur-xl border border-white/20
                                 text-white font-semibold text-xs uppercase tracking-wide
                                 shadow-[0_0_15px_rgba(255,255,255,0.1)]
                                 hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]
                                 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600
                                 transition-all duration-300 hover:scale-110"
                    >
                      <span className="drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]">
                        {item.label}
                      </span>
                      {/* Neon highlight ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 blur-xl"
                        style={{
                          background:
                            "radial-gradient(circle, rgba(99,102,241,0.4), transparent 70%)",
                        }}
                      />
                    </Link>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>
      </div>

      {/* ✨ Underline Glow */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 right-0 h-[2px] 
                   bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 opacity-80"
      />
    </nav>
  );
}
