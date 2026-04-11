"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { createClient } from "@/app/lib/supabase/client";

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
  new?: boolean;
}

const communities: Community[] = [
  {
    id: "codespace",
    name: "Codespace",
    description:
      "Your collaborative coding environment — build projects, get code reviews, and level up with a community of developers.",
    members: 1100,
    category: "Technology",
    logoSrc: "/codespace.png",
    color: "text-violet-600",
    gradient: "from-violet-500/10 to-purple-500/10",
    joinLink:
      "https://docs.google.com/forms/d/e/1FAIpQLSeu4dmCuFnYSdqATlOOaFoO5ILtFRHIjuTJev2HsbZ3_M8XwQ/viewform?pli=1",
  },
  {
    id: "superteam",
    name: "Superteam",
    description:
      "Superteam is a global community of builders, designers, and thinkers who come together to create amazing things.",
    members: 3104,
    logoSrc: "/superteam.jpeg",
    category: "Technology",
    icon: Palette,
    color: "text-pink-600",
    gradient: "from-pink-500/10 to-rose-500/10",
    joinLink: "https://superteam.fun",
  },
  {
    id: "gdg",
    name: "Google Developer Groups",
    description:
      "Google Developer Groups (GDG) are for developers who are interested in Google technologies. Join a GDG to learn about new Google products, share your knowledge with other developers, and get involved in the Google developer community.",
    members: 2257,
    logoSrc: "/gdg.png",
    category: "Technology",
    icon: FlaskConical,
    color: "text-emerald-600",
    gradient: "from-emerald-500/10 to-teal-500/10",
    joinLink: "https://developers.google.com/community",
  },
  {
    id: "shecodeafrica",
    name: "shecodeafrica",
    description:
      "SheCodeAfrica is a community of women in tech who are passionate about coding and technology. Join us to learn, grow, and connect with other women in tech.",
    members: 5603,
    logoSrc: "/she.png",
    category: "Technology",
    icon: Globe,
    color: "text-sky-600",
    gradient: "from-sky-500/10 to-blue-500/10",
    joinLink: "https://shecodeafrica.org/community",
  },
  {
  id: "web3afrika",
  name: "Web3 Afrika",
  description:
    "Africa's leading Web3 community — connecting builders, founders, and innovators across the continent driving the blockchain revolution.",
  members: 0,
  category: "Web3",
  icon: () => (
    <img
      src="/web3Africa.png"
      alt="Web3 Afrika"
      className="w-6 h-6 object-contain"
    />
  ),
  color: "text-green-600",
  gradient: "from-green-500/10 to-emerald-500/10",
  joinLink: "https://discord.com/invite/YMJ49PDTym",
},
  /* {
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
  }, */
];

/* const categories = [
  "All",
  "Technology",
  "Design",
  "STEM",
  "Languages",
  "Arts",
  "General",
]; */

function formatMembers(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();
}

const CommunityTab: React.FC = () => {
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState("All");
  const [loadingJoins, setLoadingJoins] = useState(true);

  // ── Load joined communities from Supabase on mount ──────────────────
  useEffect(() => {
    const loadJoins = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoadingJoins(false);
          return;
        }

        const { data, error } = await supabase
          .from("community_joins")
          .select("community_id")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error loading community joins:", error.message);
        } else if (data) {
          setJoined(new Set(data.map((row) => row.community_id)));
        }
      } catch (err) {
        console.error("Failed to load community joins:", err);
      } finally {
        setLoadingJoins(false);
      }
    };

    loadJoins();
  }, []);

  const filteredCommunities =
    activeCategory === "All"
      ? communities
      : communities.filter((c) => c.category === activeCategory);

  const handleJoin = async (community: Community) => {
    // 1. Optimistic update
    setJoined((prev) => new Set(prev).add(community.id));

    // 2. Open the link
    window.open(community.joinLink, "_blank", "noopener,noreferrer");

    // 3. Persist to Supabase
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase.from("community_joins").upsert(
        {
          user_id: user.id,
          community_id: community.id,
          joined_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,community_id",
          ignoreDuplicates: true, // don't overwrite existing rows
        }
      );

      if (error) {
        console.error("Error saving community join:", error.message);
        // Roll back optimistic update if it failed
        setJoined((prev) => {
          const next = new Set(prev);
          next.delete(community.id);
          return next;
        });
      }
    } catch (err) {
      console.error("Failed to save community join:", err);
      // Roll back
      setJoined((prev) => {
        const next = new Set(prev);
        next.delete(community.id);
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
        <div className="max-w-5xl mx-auto">

          {/* ── Header ── */}
          <div className="mb-8 sm:mb-10">
            <span className="text-xs sm:text-sm font-semibold text-blue-500 dark:text-blue-400 tracking-widest uppercase">
              Communities
            </span>
            <h1 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight leading-tight">
              Find your people.
            </h1>
            <p className="mt-2 text-sm sm:text-base lg:text-lg text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              Join communities of learners who share your interests. Click{" "}
              <span>Get Started</span> to jump into the conversation.
            </p>
          </div>

          {/* ── Category Filter ── */}
         {/*  <div className="mb-6 sm:mb-8">
            <div className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold
                    transition-all duration-200 whitespace-nowrap
                    ${
                      activeCategory === cat
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                        : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div> */}

          {/* ── Cards Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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
                  <div className="flex flex-col flex-1 p-4 sm:p-5 gap-3 sm:gap-4">
                    {/* Icon + badges row */}
                    <div className="flex items-start justify-between">
                      <div
                        className={`p-2 rounded-xl bg-gradient-to-br ${community.gradient} border border-white shadow-sm flex items-center justify-center`}
                      >
                        {community.logoSrc ? (
                          <img
                            src={community.logoSrc}
                            alt={community.name}
                            className="w-5 h-5 object-contain"
                          />
                        ) : Icon ? (
                          <Icon
                            className={`w-5 h-5 ${community.color}`}
                            strokeWidth={2}
                          />
                        ) : null}
                      </div>
                      {community.new && (
                        <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                    </div>

                    {/* Text content */}
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1 tracking-tight">
                        {community.name}
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                        {community.description}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50 gap-2">
                      <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm min-w-0">
                        <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="font-semibold text-slate-600">
                          {formatMembers(community.members)}
                        </span>
                        <span className="text-slate-400 hidden xs:inline">
                          members
                        </span>
                      </div>

                      {isJoined ? (
                        <button
                          disabled
                          className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2
                            rounded-xl text-xs sm:text-sm font-semibold flex-shrink-0
                            bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          Joined
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoin(community)}
                          disabled={loadingJoins}
                          className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2
                            rounded-xl text-xs sm:text-sm font-semibold flex-shrink-0
                            bg-blue-600 text-white hover:bg-blue-700 active:scale-95
                            shadow-sm shadow-blue-600/20 transition-all duration-200 group
                            disabled:opacity-50 disabled:cursor-wait"
                        >
                          Get Started
                          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Empty state ── */}
          {filteredCommunities.length === 0 && (
            <div className="text-center py-16 sm:py-20 text-slate-400">
              <Users className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-sm sm:text-base">
                No communities in this category yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityTab;