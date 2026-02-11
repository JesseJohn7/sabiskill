"use client";

import React from "react";
import { motion } from "framer-motion";
import { PlayCircle, CheckCircle, Trophy } from "lucide-react";

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <PlayCircle className="w-8 h-8 text-blue-400" />,
      title: "1. Pick a Skill Track",
      description:
        "Choose a learning track that matches your goals  from frontend development to design, AI, or marketing.",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-blue-400" />,
      title: "2. Watch & Practice",
      description:
        "Learn through curated YouTube playlists and real projects. Mark each lesson as 'done' when you complete it.",
    },
    {
      icon: <Trophy className="w-8 h-8 text-blue-400" />,
      title: "3. Build & Level Up",
      description:
        "Finish your track, build portfolio projects, and unlock new skills — all at your own pace.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-black py-16 px-4 md:px-6 lg:px-8">
      <motion.div
        className="max-w-6xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="text-xs md:text-sm tracking-widest text-blue-400 mb-2">
          HOW IT WORKS
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
          Simple Steps to Start Learning
        </h2>
        <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
          Getting started with Sabi Skill is easy. Just pick a track, learn at
          your pace, and grow your skills through guided practice.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.6,
              delay: index * 0.2,
              ease: "easeOut",
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">{step.icon}</div>
              <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;