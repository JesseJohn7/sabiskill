"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// ── Verified badge SVG ────────────────────────────────────────────────────────
const VerifiedIcon = () => (
  <svg className="mt-0.5" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z"
      fill="#2196F3"
    />
  </svg>
);

// ── Avatar data ───────────────────────────────────────────────────────────────
interface AvatarUser {
  name: string;
  handle: string;
  image: string;
}

const avatarUsers: AvatarUser[] = [
  {
    name: "Richard Nelson",
    handle: "@richard",
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
  },
  {
    name: "Avery Johnson",
    handle: "@averywrites",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
  },
  {
    name: "Jordan Lee",
    handle: "@jordantalks",
    image: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/userImage/userImage1.png",
  },
  {
    name: "Noah Patel",
    handle: "@noahpatel",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
  },
  {
    name: "Oliver Brooks",
    handle: "@oliverbrooks",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
  },
];

// ── Single avatar with tooltip ────────────────────────────────────────────────
interface AvatarCardProps {
  user: AvatarUser;
  isLast?: boolean;
  index: number;
}

const AvatarCard: React.FC<AvatarCardProps> = ({ user, isLast = false, index }) => {
  return (
    <motion.div
      className="group relative"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.08, duration: 0.35, type: "spring", stiffness: 200 }}
    >
      {/* Tooltip */}
      <div className="absolute pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 -top-16 right-0 transition-all duration-300 pl-4 pr-10 py-2 rounded-lg text-nowrap bg-white border border-gray-200 shadow-lg z-50">
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <p className="font-medium text-gray-900 text-sm">{user.name}</p>
            <VerifiedIcon />
          </div>
          <span className="text-xs text-slate-500">{user.handle}</span>
        </div>
        {/* Tooltip arrow */}
        <div className="size-3 border-r border-b border-gray-200 bg-white rotate-45 absolute right-4 -bottom-[7px]" />
      </div>

      {/* Avatar image */}
      <img
        src={user.image}
        alt={user.name}
        className={[
          "size-11 rounded-full border-2 border-white object-cover",
          "transition-all duration-300 group-hover:-translate-y-1",
          !isLast ? "group-hover:-translate-x-1" : "",
        ].join(" ")}
      />
    </motion.div>
  );
};

// ── Hero component ────────────────────────────────────────────────────────────
const Hero: React.FC = () => {
  const words = ["Learn", "Sabi", "Koyi", "Kọ ẹkọ", "ịmụta"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center pt-17.5 md:pt-17.5">
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center gap-6 px-6 py-4 md:py-20">

        {/* ── Avatar stack with tooltips ── */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex -space-x-4">
            {avatarUsers.map((user, index) => (
              <AvatarCard
                key={user.handle}
                user={user}
                isLast={index === avatarUsers.length - 1}
                index={index}
              />
            ))}
          </div>

          <motion.span
            className="text-white/80 text-sm ml-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            270+ users learning
          </motion.span>
        </motion.div>

        {/* ── Headline ── */}
        <h1 className="font-extrabold text-[2.8rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] leading-[1.08] text-white/95 tracking-tight">
          Come{" "}
          <span
            className="inline-block relative overflow-hidden align-bottom text-left"
            style={{ width: "auto", transition: "width 0.3s" }}
          >
            <span className="invisible absolute left-0 top-0 whitespace-nowrap">
              {words[currentWordIndex]}
            </span>
            <span
              className="block text-left"
              style={{
                opacity: isAnimating ? 0 : 1,
                transform: isAnimating ? "translateY(-20px)" : "none",
                transition: "opacity 0.3s, transform 0.3s",
              }}
            >
              {words[currentWordIndex]}
            </span>
          </span>
          <br />
          <span className="text-blue-400/90">for free, no wahala.</span>
        </h1>

        {/* ── Sub-copy ── */}
        <p className="max-w-2xl text-[0.95rem] md:text-[1.05rem] leading-[1.7] text-white/70">
          Nigeria's free learning platform built for you. Access quality courses,
          learn new skills, and grow your career. No subscription fees, no hidden
          costs, just pure knowledge.
        </p>

        {/* ── CTA ── */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
          <Link href="/signup">
            <button className="w-full font-medium text-base whitespace-nowrap leading-5.5 rounded-full px-8 py-4 md:px-10 md:py-3.75 text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 active:scale-95 cursor-pointer min-w-48 md:min-w-40">
              Start Learning
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;