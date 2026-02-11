"use client";

import React from "react";
import {
  BookOpen,
  Map,
  Clock,
  Wrench,
  Users,
  ShieldCheck,
} from "lucide-react";

const Features: React.FC = () => {
  const features = [
    {
      icon: <BookOpen className="w-6 h-6 text-blue-400" />,
      title: "100% Free Courses",
      description:
        "Access all courses and learning materials for free — no hidden fees or subscriptions.",
    },
    {
      icon: <Map className="w-6 h-6 text-blue-400" />,
      title: "Personalized Roadmaps",
      description:
        "Follow clear, structured paths built to guide you toward your learning goals.",
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-400" />,
      title: "Learn At Your Pace",
      description:
        "No deadlines, no pressure. Learn on your schedule, anytime and anywhere.",
    },
    {
      icon: <Wrench className="w-6 h-6 text-blue-400" />,
      title: "Practical Skills",
      description:
        "Hands-on projects that help you apply what you learn in real-world situations.",
    },
    {
      icon: <Users className="w-6 h-6 text-blue-400" />,
      title: "Community Support",
      description:
        "Join a supportive community of learners sharing ideas, help, and opportunities.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
      title: "Quality Content",
      description:
        "Learn from carefully selected experts with up-to-date, reliable resources.",
    },
  ];

  return (
    <div id="features" className="bg-black py-10 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center mb-10">
        <p className="text-xs md:text-sm tracking-widest text-blue-400 mb-2">
          FEATURES
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
          Everything you need to succeed
        </h2>
        <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto">
          All the tools and resources you need to start learning and building
          your future — completely free.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-blue-500/50 hover:scale-105 transition-all duration-300"
          >
            <div className="mb-3">{feature.icon}</div>
            <h3 className="text-base md:text-lg font-semibold text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;