"use client";

import React, { useState } from "react";
import {
  Users,
  BookOpen,
  Palette,
  FlaskConical,
  Globe,
  Music,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  icon?: React.ElementType;
  logoSrc?: string;
  color: string;
  gradient: string;
  joinLink: string;
  trending?: boolean;
  new?: boolean;
}

const communities: Community[] = [
  {
    id: "codespace",
    name: "Codespace",
    description:
      "Your collaborative coding environment — build projects, get code reviews, and level up with a community of developers.",
    members: 4821,
    category: "Technology",
    logoSrc: "/codespace.png",
    color: "text-violet-600",
    gradient: "from-violet-500/10 to-purple-500/10",
    joinLink: "https://docs.google.com/forms/d/e/1FAIpQLSeu4dmCuFnYSdqATlOOaFoO5ILtFRHIjuTJev2HsbZ3_M8XwQ/viewform?pli=1",
    trending: true,
  },
  {
    id: "design",
    name: "Creative Design",
    description:
      "UI/UX designers sharing feedback, design systems, Figma tips, and portfolio critiques.",
    members: 3104,
    category: "Design",
    icon: Palette,
    color: "text-pink-600",
    gradient: "from-pink-500/10 to-rose-500/10",
    joinLink: "https://discord.gg/your-design-link",
    new: true,
  },
  {
    id: "science",
    name: "Science & Research",
    description:
      "Discuss papers, lab work, and breakthroughs across biology, chemistry, physics, and more.",
    members: 2257,
    category: "STEM",
    icon: FlaskConical,
    color: "text-emerald-600",
    gradient: "from-emerald-500/10 to-teal-500/10",
    joinLink: "https://discord.gg/your-science-link",
  },
  {
    id: "languages",
    name: "World Languages",
    description:
      "Practice speaking, find language exchange partners, and explore cultures from every corner of the world.",
    members: 5603,
    category: "Languages",
    icon: Globe,
    color: "text-sky-600",
    gradient: "from-sky-500/10 to-blue-500/10",
    joinLink: "https://discord.gg/your-languages-link",
    trending: true,
  },
  {
    id: "literature",
    name: "Book Club",
    description:
      "Monthly reads, author spotlights, literary analysis, and a safe space for every kind of reader.",
    members: 1892,
    category: "Arts",
    icon: BookOpen,
    color: "text-amber-600",
    gradient: "from-amber-500/10 to-yellow-500/10",
    joinLink: "https://discord.gg/your-books-link",
  },
  {
    id: "music",
    name: "Music Makers",
    description:
      "Share your productions, get mixing feedback, and connect with musicians across every genre.",
    members: 2438,
    category: "Arts",
    icon: Music,
    color: "text-orange-600",
    gradient: "from-orange-500/10 to-red-500/10",
    joinLink: "https://discord.gg/your-music-link",
    new: true,
  },
  {
    id: "ai",
    name: "AI & Machine Learning",
    description:
      "Dive into neural networks, LLMs, prompt engineering, and the cutting edge of AI research.",
    members: 6114,
    category: "Technology",
    icon: Cpu,
    color: "text-blue-600",
    gradient: "from-blue-500/10 to-indigo-500/10",
    joinLink: "https://discord.gg/your-ai-link",
    trending: true,
  },
  {
    id: "general",
    name: "General Study",
    description:
      "A welcoming space for all learners — share study tips, accountability check-ins, and motivation.",
    members: 8921,
    category: "General",
    icon: Users,
    color: "text-slate-600",
    gradient: "from-slate-400/10 to-gray-400/10",
    joinLink: "https://discord.gg/your-general-link",
  },
];

const categories = ["All", "Technology", "Design", "STEM", "Languages", "Arts", "General"];

function formatMembers(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();
}

const CommunityTab: React.FC = () => {
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCommunities =
    activeCategory === "All"
      ? communities
      : communities.filter((c) => c.category === activeCategory);

  const handleJoin = (community: Community) => {
    setJoined((prev) => new Set(prev).add(community.id));
    window.open(community.joinLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white px-4 py-8 sm:px-6 lg:px-10">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-semibold text-blue-500 tracking-wide uppercase">
            Communities
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
          Find your people.
        </h1>
        <p className="text-slate-500 text-base sm:text-lg max-w-xl leading-relaxed">
          Join communities of learners who share your interests. Click{" "}
          <span className="font-semibold text-blue-600">Get Started</span> to
          jump into the conversation.
        </p>
      </div>

      {/* Category Filter */}
      <div className="max-w-5xl mx-auto mb-8 overflow-x-auto scrollbar-none">
        <div className="flex gap-2 w-max pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap
                ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCommunities.map((community) => {
          const Icon = community.icon;
          const isJoined = joined.has(community.id);

          return (
            <div
              key={community.id}
              className="relative bg-white rounded-2xl border border-slate-100 shadow-sm
                hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden
                flex flex-col"
            >
              {/* Top gradient accent bar */}
              <div
                className={`h-1.5 w-full bg-gradient-to-r ${community.gradient.replace(
                  "/10",
                  ""
                )} opacity-80`}
              />

              {/* Card Body */}
              <div className="flex flex-col flex-1 p-5 gap-4">
                {/* Icon + badges row */}
                <div className="flex items-start justify-between">
                  <div
                    className={`p-2.5 rounded-xl bg-gradient-to-br ${community.gradient} border border-white shadow-sm flex items-center justify-center`}
                  >
                    {community.logoSrc ? (
                      <img
                        src={community.logoSrc}
                        alt={community.name}
                        className="w-5 h-5 object-contain"
                      />
                    ) : Icon ? (
                      <Icon className={`w-5 h-5 ${community.color}`} strokeWidth={2} />
                    ) : null}
                  </div>
                  <div className="flex gap-1.5">
                    {community.trending && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
                        <TrendingUp className="w-3 h-3" /> Hot
                      </span>
                    )}
                    {community.new && (
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                </div>

                {/* Text content */}
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-base mb-1 tracking-tight">
                    {community.name}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {community.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-600">
                      {formatMembers(community.members)}
                    </span>
                    <span className="text-slate-400">members</span>
                  </div>

                  {isJoined ? (
                    <button
                      disabled
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
                        bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Joined
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoin(community)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
                        bg-blue-600 text-white hover:bg-blue-700 active:scale-95
                        shadow-sm shadow-blue-600/20 transition-all duration-200 group"
                    >
                      Get Started
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredCommunities.length === 0 && (
        <div className="max-w-5xl mx-auto text-center py-20 text-slate-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No communities in this category yet.</p>
        </div>
      )}
    </div>
  );
};

export default CommunityTab;