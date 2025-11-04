"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaLinkedin,
  FaGithub,
  FaEnvelope,
} from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socials = [
    {
      icon: FaFacebook,
      href: "https://www.facebook.com/share/p/1Bq9rtNdVj/",
      label: "Facebook",
      color: "#1877F2",
    },
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/reel/DIjJtp5Nlt8/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
      label: "Instagram",
      color: "#E1306C",
    },
    {
      icon: FaLinkedin,
      href: "https://www.linkedin.com/posts/syedminamurrehman_rahguzar-activity-7312020818287349760-yK7D?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAADkNvvQBRyZLJeVeoet1-wMJd_hFCBhA9V8",
      label: "LinkedIn",
      color: "#0077B5",
    },
    {
      icon: FaGithub,
      href: "https://github.com/minamrahman727/rahguzar",
      label: "GitHub",
      color: "#171515",
    },
    {
      icon: FaEnvelope,
      href: "mailto:minamrahman727@gmail.com?subject=Route%20Suggestion%20for%20Rahguzar&body=Dear%20Rahguzar%20Team%2C%0A%0AI'd%20like%20to%20suggest%20a%20new%20route%20or%20contribute%20content%20to%20the%20Rahguzar%20project.%0A%0A%2A%2ARoute%20Name%3A%2A%2A%20%5BYour%20Proposed%20Route%20Name%20Here%2C%20e.g.%2C%20Keamari%20Road%20of%20Old%20Karachi%5D%0A%0A%2A%2AContribution%20Details%3A%2A%2A%0A1.%20%2A%2AStarting%20Point%3A%2A%2A%20%0A2.%20%2A%2AEnding%20Point%3A%2A%2A%20%0A3.%20%2A%2AKey%20Stops%2FLandmarks%3A%2A%2A%20%0A4.%20%2A%2ADescription%3A%2A%2A%20%5BProvide%20a%20detailed%20description%20of%20the%20route's%20significance%2C%20history%2C%20or%20points%20of%20interest.%5D%0A5.%20%2A%2AAdditional%20Information%3A%2A%2A%20%5BAny%20links%2C%20images%2C%20or%20notes%20you%20have.%5D%0A%0AThank%20you!%0A%5BYour%20Name%2FAlias%5D",
      label: "Email",
      color: "#EA4335",
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="relative overflow-hidden text-white py-12 mt-16 
        bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-800 
        shadow-[0_-1px_20px_rgba(0,0,0,0.4)]"
    >
      {/* ✨ Frosted Glass Overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-md border-t border-white/10" />

      {/* 🌐 Social Icons */}
      <div className="relative flex justify-center flex-wrap gap-8 mb-8">
        {socials.map(({ icon: Icon, href, label, color }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{
              scale: 1.2,
              rotate: [0, 8, -8, 0],
            }}
            className="group"
          >
            <Link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="relative flex items-center justify-center w-14 h-14 rounded-full
                bg-white/10 backdrop-blur-lg border border-white/20
                hover:border-white/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]
                transition-all duration-300"
            >
              {/* Soft Glow Background */}
              <motion.div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 blur-lg transition-all duration-500"
                style={{
                  background: `radial-gradient(circle, ${color}55, transparent 70%)`,
                }}
              />
              <Icon className="text-2xl text-gray-200 group-hover:text-white transition-all duration-300" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* 🧠 Footer Text */}
      <div className="relative text-center space-y-2 px-4">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-300"
        >
          Data & Information by{" "}
          <Link
            href="https://cheeltech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:text-cyan-300 transition-colors duration-300"
          >
            Cheeltech
          </Link>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-gray-400"
        >
          © {currentYear}{" "}
          <Link
            href="https://smrehman.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-cyan-300 hover:text-cyan-200 transition-colors duration-300"
          >
            Syed Minam Ur Rehman
          </Link>{" "}
          — All Rights Reserved.
        </motion.p>
      </div>

      {/* 🌠 Bottom Glow Line */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 right-0 h-[2px] 
          bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 opacity-80"
      />
    </motion.footer>
  );
}
