"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import BubbleAnimation from "./bubbles";

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative flex flex-col justify-center items-center text-center min-h-screen overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 text-white px-6 md:px-24 py-20"
    >
      {/* 🌌 Floating Blast Bubbles */}
      <BubbleAnimation bubbleCount={12} />

      {/* 🎇 Moving Light Overlays */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.07),_transparent_70%)]"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.06),_transparent_75%)]"
        animate={{ backgroundPosition: ["100% 100%", "0% 0%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ✨ Animated Glow Aura behind Logo */}
      <motion.div
        className="absolute w-[28rem] h-[28rem] bg-gradient-to-r from-cyan-400/25 to-blue-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 🚍 Logo */}
      <motion.div
        className="relative z-10 cursor-pointer"
        whileHover={{
          scale: 1.1,
          rotate: [0, 6, -6, 0],
          filter: "drop-shadow(0 0 25px rgba(0,200,255,0.6))",
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <Image
          src="/images/route.png"
          alt="RahGuzar Logo"
          width={150}
          height={150}
          className="rounded-full select-none"
          priority
        />
      </motion.div>

      {/* 🌠 Text Block with Glass Effect */}
      <motion.div
        className="relative z-10 mt-8 backdrop-blur-sm bg-white/5 px-6 md:px-12 py-6 rounded-2xl border border-white/10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
      >
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-white to-purple-200 drop-shadow-lg leading-tight md:leading-[1.15] overflow-visible"
          whileHover={{
            scale: 1.05,
            textShadow: "0 0 25px rgba(255,255,255,0.7)",
          }}
        >
          Navigate with Ease
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl italic font-medium text-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          whileHover={{ scale: 1.05, color: "#E5F2FF" }}
        >
          Jahan Manzil, Wahan Raasta!
        </motion.p>
      </motion.div>

      {/* 🧭 CTA Button */}
      <motion.div
        className="relative z-10 mt-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <motion.button
          className="relative font-semibold text-lg px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-700 shadow-lg overflow-hidden group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">Start Exploring</span>
          <motion.span
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-400/40 via-blue-500/40 to-purple-600/40 blur-xl"
            initial={{ scale: 0 }}
            whileHover={{ scale: 1.6, opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        </motion.button>
      </motion.div>

      {/* 📘 Learn More Link */}
      <motion.div
        className="mt-6 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <motion.a
          href="#"
          className="inline-flex items-center gap-2 text-sm md:text-base font-medium text-white/80 hover:text-white transition-all"
          whileHover={{ x: 6 }}
        >
          Learn More
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </motion.a>
      </motion.div>

      {/* ⬇ Scroll Hint */}
      <motion.div
        className="absolute bottom-10 flex flex-col items-center gap-2 text-white/70"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        <span className="text-xs tracking-widest">Scroll Down</span>
        <motion.div
          className="w-[2px] h-6 rounded-full bg-gradient-to-b from-white/80 to-transparent"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </motion.section>
  );
}
