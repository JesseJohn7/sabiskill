"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Hero: React.FC = () => {
  const words = ["Learn","Sabi","Koyi", "Kọ ẹkọ", "ịmụta"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sample users for avatars
  const sampleUsers = [
    { image: "/avatar1.jpg" },
    { image: "/avatar2.jpg" },
    { image: "/avatar3.jpg" },
    { image: "/avatar4.jpg" },
  ];

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
        {/* Avatars Section */}
        <motion.div 
          className="flex items-center justify-center gap-2 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex -space-x-2"> 
            {sampleUsers.map((user, index) => (
              <motion.img
                key={index} 
                src={user.image}
                alt={`User ${index + 1}`}
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              />
            ))}
          </div>
          <motion.span 
            className="text-white/80 text-sm ml-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            270+ users learning
          </motion.span>
        </motion.div>

        <h1 
          className="font-extrabold text-[2.8rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] leading-[1.08] text-white/95 tracking-tight"
          style={{ opacity: 1, transform: "none" }}
        >
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
                transition: "opacity 0.3s, transform 0.3s"
              }}
            >
              {words[currentWordIndex]}
            </span>
          </span>
          <br />
          <span className="text-blue-400/90">for free, no wahala.</span>
        </h1>

        <p 
          className="max-w-2xl text-[0.95rem] md:text-[1.05rem] leading-[1.7] text-white/70"
          style={{ opacity: 1, transform: "none" }}
        >
          Nigeria's free learning platform built for you. Access quality courses, 
          learn new skills, and grow your career. No subscription fees, no hidden costs, just pure knowledge.
        </p>

        <div 
          className="flex flex-col sm:flex-row items-center gap-3 mt-4"
          style={{ opacity: 1, transform: "none" }}
        >
        <Link href="/signup">
          <button className="w-full font-medium text-base md:text-base whitespace-nowrap leading-5.5 rounded-full px-8 py-4 md:px-10 md:py-3.75 text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 active:scale-95 cursor-pointer min-w-48 md:min-w-40">
            Start Learning
          </button>
        </Link>
        </div> 
      </div>
    </div>
  );
};

export default Hero;