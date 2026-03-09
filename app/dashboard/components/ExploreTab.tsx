"use client";

import React, { useState } from "react";
import type { CourseProgressDetail } from "../components/UseCourseProgress";
import {
  Play,
  Clock,
  Lock,
  CheckCircle2,
  ChevronRight,
  Star,
  ArrowLeft,
  Users,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  Send,
} from "lucide-react";

// ── Lesson type for playlist courses ──────────────────────────────────────
export interface Lesson {
  id: string;           // YouTube video ID
  title: string;
  duration: string;     // e.g. "45:12"
  startSeconds?: number; // for timestamp-based chapters in a single video
}

// ⚠️ These IDs must match the keys in VideoPlayer's COURSES object exactly
export const ALL_COURSES = [
  {
    id: "web-dev",
    title: "Complete Web Development",
    description: "HTML, CSS, JavaScript & beyond — build real-world projects from scratch.",
    longDescription:
      "This comprehensive course takes you from absolute beginner to confident web developer. You'll master HTML structure, CSS styling, responsive design, and modern JavaScript — then build real-world projects including a personal portfolio, a landing page, and a dynamic web app.",
    thumbnail: "https://i.ytimg.com/vi/HGTJBPNC-Gw/maxresdefault.jpg",
    videoId: "HGTJBPNC-Gw",
    lessons: 37,
    level: "Beginner",
    tag: "Most Popular",
    duration: "18h 30m",
    students: 42800,
    rating: 4.8,
    reviewCount: 3241,
    instructor: "Sarah Kim",
    topics: [
      "HTML5 Fundamentals & Semantic Markup",
      "CSS3, Flexbox & CSS Grid",
      "Responsive & Mobile-First Design",
      "JavaScript ES6+ Essentials",
      "DOM Manipulation & Events",
      "Fetch API & Working with APIs",
      "Git & Version Control",
      "Deploying Your First Website",
    ],
    playlist: null as Lesson[] | null,
  },
  {
    id: "ui-ux",
    title: "UI/UX Design Fundamentals",
    description: "Learn the principles of great design and build beautiful user experiences.",
    longDescription:
      "Discover the art and science behind great digital products. Learn how to conduct user research, create wireframes and prototypes, and apply proven design principles to build interfaces people love. No prior design experience required.",
    thumbnail: "https://i.ytimg.com/vi/c9Wg6Cb_YlU/maxresdefault.jpg",
    videoId: "c9Wg6Cb_YlU",
    lessons: 4,
    level: "Beginner",
    tag: "Quick Start",
    duration: "2h 15m",
    students: 18400,
    rating: 4.6,
    reviewCount: 876,
    instructor: "Marcus Lee",
    topics: [
      "Design Thinking & Process",
      "User Research & Personas",
      "Wireframing & Prototyping",
      "Color Theory & Typography",
    ],
    playlist: null as Lesson[] | null,
  },
  {
    id: "javascript",
    title: "JavaScript Full Course",
    description: "Deep dive into modern JavaScript — ES6+, async, DOM, and more.",
    longDescription:
      "Go beyond the basics with a thorough exploration of modern JavaScript. This course covers closures, prototypes, async/await, the event loop, and how to write clean, professional-grade code. Perfect for developers who already know the basics.",
    thumbnail: "https://i.ytimg.com/vi/EfAl9bwzVZk/maxresdefault.jpg",
    videoId: "EfAl9bwzVZk",
    lessons: 28,
    level: "Intermediate",
    tag: "Trending",
    duration: "14h 45m",
    students: 31200,
    rating: 4.9,
    reviewCount: 2108,
    instructor: "James Okafor",
    topics: [
      "ES6+ Syntax & Features",
      "Closures & Scope",
      "Asynchronous JavaScript & Promises",
      "Async/Await & Error Handling",
      "The Event Loop Explained",
      "Working with APIs & Fetch",
      "JavaScript Design Patterns",
      "Testing with Jest",
    ],
    playlist: null as Lesson[] | null,
  },
  // ─── React JS — Dave Gray 9-hour Complete Tutorial (23 chapters) ─────────
  {
    id: "react-js",
    title: "React JS Full Course",
    description: "Master React from scratch — components, hooks, routing, Redux & real projects.",
    longDescription:
      "Dave Gray's complete 9-hour React JS course takes you from zero to confident React developer. Across 23 clearly structured chapters you'll learn JSX, functional components, useState & useEffect hooks, controlled inputs, CRUD with a REST API, React Router, custom hooks, Context API, and Redux — finishing with a full build-and-deploy walkthrough.",
    thumbnail: "https://i.ytimg.com/vi/CgkZ7MvWUAA/maxresdefault.jpg",
    videoId: "CgkZ7MvWUAA",
    lessons: 23,
    level: "Beginner",
    tag: "New",
    duration: "9h 00m",
    students: 34700,
    rating: 4.9,
    reviewCount: 2314,
    instructor: "Dave Gray",
    topics: [
      "Start Here — React Setup & Overview",
      "App & JSX — Writing Your First React Code",
      "Functional Components",
      "Applying CSS Styles",
      "Click Events",
      "useState Hook — Managing State",
      "Lists & Keys",
      "Props & Prop Drilling",
      "Controlled Component Inputs",
      "Project Challenge",
      "useEffect Hook",
      "JSON Server",
      "Fetch API Data",
      "CRUD Operations",
      "Fetch Data Challenge",
      "React Router",
      "Router Hooks & Links",
      "Flexbox Components",
      "Axios API Requests",
      "Custom Hooks",
      "Context API & useContext Hook",
      "Easy Peasy Redux",
      "Build & Deploy Your React Apps",
    ],
    playlist: [
      { id: "CgkZ7MvWUAA", title: "Intro",                              duration: "2:00",  startSeconds: 0     },
      { id: "CgkZ7MvWUAA", title: "Ch 1 — Start Here",                  duration: "18:00", startSeconds: 120   },
      { id: "CgkZ7MvWUAA", title: "Ch 2 — App & JSX",                   duration: "22:00", startSeconds: 1200  },
      { id: "CgkZ7MvWUAA", title: "Ch 3 — Functional Components",       duration: "20:00", startSeconds: 2520  },
      { id: "CgkZ7MvWUAA", title: "Ch 4 — Applying CSS Styles",         duration: "18:00", startSeconds: 3720  },
      { id: "CgkZ7MvWUAA", title: "Ch 5 — Click Events",                duration: "20:00", startSeconds: 4800  },
      { id: "CgkZ7MvWUAA", title: "Ch 6 — useState Hook",               duration: "24:00", startSeconds: 6000  },
      { id: "CgkZ7MvWUAA", title: "Ch 7 — Lists & Keys",                duration: "18:00", startSeconds: 7440  },
      { id: "CgkZ7MvWUAA", title: "Ch 8 — Props & Prop Drilling",       duration: "22:00", startSeconds: 8520  },
      { id: "CgkZ7MvWUAA", title: "Ch 9 — Controlled Component Inputs", duration: "20:00", startSeconds: 9840  },
      { id: "CgkZ7MvWUAA", title: "Ch 10 — Project Challenge",          duration: "25:00", startSeconds: 11040 },
      { id: "CgkZ7MvWUAA", title: "Ch 11 — useEffect Hook",             duration: "24:00", startSeconds: 12540 },
      { id: "CgkZ7MvWUAA", title: "Ch 12 — JSON Server",                duration: "18:00", startSeconds: 13980 },
      { id: "CgkZ7MvWUAA", title: "Ch 13 — Fetch API Data",             duration: "22:00", startSeconds: 15060 },
      { id: "CgkZ7MvWUAA", title: "Ch 14 — CRUD Operations",            duration: "26:00", startSeconds: 16380 },
      { id: "CgkZ7MvWUAA", title: "Ch 15 — Fetch Data Challenge",       duration: "20:00", startSeconds: 17940 },
      { id: "CgkZ7MvWUAA", title: "Ch 16 — React Router",               duration: "24:00", startSeconds: 19140 },
      { id: "CgkZ7MvWUAA", title: "Ch 17 — Router Hooks & Links",       duration: "22:00", startSeconds: 20580 },
      { id: "CgkZ7MvWUAA", title: "Ch 18 — Flexbox Components",         duration: "18:00", startSeconds: 21900 },
      { id: "CgkZ7MvWUAA", title: "Ch 19 — Axios API Requests",         duration: "20:00", startSeconds: 22980 },
      { id: "CgkZ7MvWUAA", title: "Ch 20 — Custom Hooks",               duration: "22:00", startSeconds: 24180 },
      { id: "CgkZ7MvWUAA", title: "Ch 21 — Context API & useContext",   duration: "24:00", startSeconds: 25500 },
      { id: "CgkZ7MvWUAA", title: "Ch 22 — Easy Peasy Redux",           duration: "26:00", startSeconds: 26940 },
      { id: "CgkZ7MvWUAA", title: "Ch 23 — Build & Deploy",             duration: "20:00", startSeconds: 28500 },
    ] as Lesson[],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "crypto",
    title: "Cryptocurrency & Blockchain",
    description: "Understand crypto, wallets, DeFi, NFTs, and the future of finance.",
    longDescription:
      "Get a solid, no-hype understanding of blockchain technology and the crypto ecosystem. Learn how Bitcoin and Ethereum work under the hood, explore DeFi protocols and NFTs, and understand how to evaluate projects and manage risk in a volatile market.",
    thumbnail: "https://i.ytimg.com/vi/amAq-WHAFs8/maxresdefault.jpg",
    videoId: "amAq-WHAFs8",
    lessons: 11,
    level: "Beginner",
    tag: null,
    duration: "5h 20m",
    students: 9700,
    rating: 4.4,
    reviewCount: 512,
    instructor: "Priya Sharma",
    topics: [
      "How Blockchain Works",
      "Bitcoin & Ethereum Explained",
      "Crypto Wallets & Security",
      "DeFi & Yield Farming",
      "NFTs & Digital Ownership",
      "Evaluating Crypto Projects",
    ],
    playlist: null as Lesson[] | null,
  },
  // ─── Solidity & Web3 Development ─────────────────────────────────────────
  {
    id: "solidity-web3",
    title: "Solidity & Web3 Development",
    description: "Build real Web3 apps — smart contracts, DeFi, NFTs, and full-stack dApps with Solidity & React.",
    longDescription:
      "Learn Solidity from scratch and build four real-world Web3 projects: a Zillow-style real estate escrow app, an Amazon clone, a Discord clone with NFT gating, and a Ticketmaster clone — all using Solidity, Hardhat, Ethers.js, and React.",
    thumbnail: "https://i.ytimg.com/vi/jcgfQEbptdo/maxresdefault.jpg",
    videoId: "jcgfQEbptdo",
    lessons: 53,
    level: "Intermediate",
    tag: "New",
    duration: "11h 30m",
    students: 12400,
    rating: 4.8,
    reviewCount: 743,
    instructor: "Dapp University",
    topics: [
      "Your First Smart Contract",
      "Variables, Data Types & Arrays",
      "Mappings, Conditionals & Loops",
      "Inheritance & Full Contract",
      "Real Estate Escrow dApp (Zillow Clone)",
      "Amazon Web3 Clone with Solidity",
      "Discord Clone with NFT Gating",
      "Ticketmaster Clone — Events & Tickets",
    ],
    playlist: [
      { id: "jcgfQEbptdo", title: "Your First Contract",        duration: "15:40", startSeconds: 103   },
      { id: "jcgfQEbptdo", title: "Variables & Data Types",     duration: "13:16", startSeconds: 1043  },
      { id: "jcgfQEbptdo", title: "Arrays",                     duration: "8:28",  startSeconds: 1839  },
      { id: "jcgfQEbptdo", title: "Mappings",                   duration: "12:09", startSeconds: 2347  },
      { id: "jcgfQEbptdo", title: "Conditionals & Loops",       duration: "11:26", startSeconds: 3076  },
      { id: "jcgfQEbptdo", title: "Full Contract",              duration: "23:30", startSeconds: 3762  },
      { id: "jcgfQEbptdo", title: "Inheritance",                duration: "13:01", startSeconds: 5172  },
      // — Real Estate App —
      { id: "jcgfQEbptdo", title: "RE: Overview",               duration: "4:39",  startSeconds: 5953  },
      { id: "jcgfQEbptdo", title: "RE: Create Project",         duration: "9:28",  startSeconds: 6232  },
      { id: "jcgfQEbptdo", title: "RE: Escrow Contract",        duration: "22:04", startSeconds: 6800  },
      { id: "jcgfQEbptdo", title: "RE: List Property",          duration: "18:56", startSeconds: 8124  },
      { id: "jcgfQEbptdo", title: "RE: Earnest Deposit",        duration: "6:17",  startSeconds: 9260  },
      { id: "jcgfQEbptdo", title: "RE: Finish Contract",        duration: "16:15", startSeconds: 9637  },
      { id: "jcgfQEbptdo", title: "RE: Deploy Contracts",       duration: "11:10", startSeconds: 10612 },
      { id: "jcgfQEbptdo", title: "RE: Create Front End",       duration: "5:19",  startSeconds: 11282 },
      { id: "jcgfQEbptdo", title: "RE: Connect to Blockchain",  duration: "7:18",  startSeconds: 11600 },
      { id: "jcgfQEbptdo", title: "RE: Navbar",                 duration: "4:44",  startSeconds: 12038 },
      { id: "jcgfQEbptdo", title: "RE: Search Bar",             duration: "4:29",  startSeconds: 12323 },
      { id: "jcgfQEbptdo", title: "RE: List Properties",        duration: "11:56", startSeconds: 12592 },
      { id: "jcgfQEbptdo", title: "RE: Buy Property",           duration: "32:16", startSeconds: 13308 },
      // — Amazon Clone —
      { id: "jcgfQEbptdo", title: "AZ: Overview",               duration: "2:14",  startSeconds: 15244 },
      { id: "jcgfQEbptdo", title: "AZ: Project Setup",          duration: "6:26",  startSeconds: 15378 },
      { id: "jcgfQEbptdo", title: "AZ: Create Contract",        duration: "20:35", startSeconds: 15764 },
      { id: "jcgfQEbptdo", title: "AZ: List Products",          duration: "31:57", startSeconds: 17000 },
      { id: "jcgfQEbptdo", title: "AZ: Buy Products",           duration: "21:48", startSeconds: 18916 },
      { id: "jcgfQEbptdo", title: "AZ: Deployment",             duration: "9:21",  startSeconds: 20224 },
      { id: "jcgfQEbptdo", title: "AZ: Create Front End",       duration: "9:49",  startSeconds: 20785 },
      { id: "jcgfQEbptdo", title: "AZ: Navbar",                 duration: "13:40", startSeconds: 21374 },
      { id: "jcgfQEbptdo", title: "AZ: List Products UI",       duration: "21:44", startSeconds: 22254 },
      { id: "jcgfQEbptdo", title: "AZ: Product Details",        duration: "10:51", startSeconds: 23558 },
      { id: "jcgfQEbptdo", title: "AZ: Buy Products UI",        duration: "6:51",  startSeconds: 24209 },
      // — Discord Clone —
      { id: "jcgfQEbptdo", title: "DC: Overview",               duration: "2:22",  startSeconds: 24627 },
      { id: "jcgfQEbptdo", title: "DC: Setup",                  duration: "2:54",  startSeconds: 24769 },
      { id: "jcgfQEbptdo", title: "DC: Contracts",              duration: "24:19", startSeconds: 24943 },
      { id: "jcgfQEbptdo", title: "DC: Create Channel",         duration: "20:52", startSeconds: 26402 },
      { id: "jcgfQEbptdo", title: "DC: Mint NFTs",              duration: "8:40",  startSeconds: 27654 },
      { id: "jcgfQEbptdo", title: "DC: Withdraw Ether",         duration: "3:07",  startSeconds: 28174 },
      { id: "jcgfQEbptdo", title: "DC: Deployment",             duration: "9:11",  startSeconds: 28361 },
      { id: "jcgfQEbptdo", title: "DC: Front End",              duration: "3:39",  startSeconds: 28912 },
      { id: "jcgfQEbptdo", title: "DC: Navbar",                 duration: "26:33", startSeconds: 29131 },
      { id: "jcgfQEbptdo", title: "DC: Channels",               duration: "15:07", startSeconds: 30724 },
      { id: "jcgfQEbptdo", title: "DC: Chatting",               duration: "27:20", startSeconds: 31631 },
      // — Ticketmaster Clone —
      { id: "jcgfQEbptdo", title: "TM: Project Overview",       duration: "3:06",  startSeconds: 33271 },
      { id: "jcgfQEbptdo", title: "TM: Project Setup",          duration: "2:45",  startSeconds: 33457 },
      { id: "jcgfQEbptdo", title: "TM: Create Smart Contract",  duration: "4:33",  startSeconds: 33622 },
      { id: "jcgfQEbptdo", title: "TM: Events",                 duration: "42:28", startSeconds: 33895 },
      { id: "jcgfQEbptdo", title: "TM: Buy Tickets",            duration: "22:22", startSeconds: 36443 },
      { id: "jcgfQEbptdo", title: "TM: Withdraw Ether",         duration: "6:44",  startSeconds: 37785 },
      { id: "jcgfQEbptdo", title: "TM: Deploy Contracts",       duration: "9:06",  startSeconds: 38189 },
      { id: "jcgfQEbptdo", title: "TM: Create Front End",       duration: "23:55", startSeconds: 38735 },
      { id: "jcgfQEbptdo", title: "TM: Load Contracts",         duration: "8:07",  startSeconds: 40170 },
      { id: "jcgfQEbptdo", title: "TM: List Events",            duration: "9:58",  startSeconds: 40657 },
      { id: "jcgfQEbptdo", title: "TM: Buy Tickets UI",         duration: "rest",  startSeconds: 41255 },
    ] as Lesson[],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "public-speak",
    title: "Public Speaking Mastery",
    description: "Overcome fear and speak confidently in front of any audience.",
    longDescription:
      "Whether you're presenting to your team or speaking on a stage, this course gives you the tools to communicate with power and presence. Learn breathing techniques, storytelling frameworks, and how to handle nerves so you can speak with confidence every time.",
    thumbnail: "https://i.ytimg.com/vi/w82a1FT5o88/maxresdefault.jpg",
    videoId: "w82a1FT5o88",
    lessons: 15,
    level: "All Levels",
    tag: null,
    duration: "7h 10m",
    students: 14300,
    rating: 4.7,
    reviewCount: 934,
    instructor: "Elena Vasquez",
    topics: [
      "Understanding & Overcoming Fear",
      "Voice, Tone & Pacing",
      "Structuring a Compelling Talk",
      "Storytelling for Speakers",
      "Body Language & Stage Presence",
      "Handling Q&A with Confidence",
      "Virtual Presentation Skills",
    ],
    playlist: null as Lesson[] | null,
  },
  {
    id: "personal-dev",
    title: "Personal Development & Growth",
    description: "Build habits, mindset, and systems to reach your full potential.",
    longDescription:
      "Transform your life by understanding the science of habits, motivation, and peak performance. This course blends psychology, neuroscience, and practical frameworks to help you set meaningful goals, build lasting habits, and develop a resilient, growth-oriented mindset.",
    thumbnail: "https://i.ytimg.com/vi/75d_29QWELk/maxresdefault.jpg",
    videoId: "75d_29QWELk",
    lessons: 10,
    level: "All Levels",
    tag: null,
    duration: "4h 50m",
    students: 22100,
    rating: 4.5,
    reviewCount: 1467,
    instructor: "David Chen",
    topics: [
      "The Science of Habits",
      "Goal Setting That Works",
      "Building a Growth Mindset",
      "Time Management & Deep Work",
      "Emotional Intelligence",
      "Resilience & Stress Management",
    ],
    playlist: null as Lesson[] | null,
  },
];

// Sample reviews per course
const COURSE_REVIEWS: Record<
  string,
  { name: string; rating: number; date: string; comment: string }[]
> = {
  "web-dev": [
    { name: "Alex T.", rating: 5, date: "Jan 2025", comment: "Best web dev course I've taken. The projects really helped it click." },
    { name: "Mia R.", rating: 5, date: "Dec 2024", comment: "Sarah explains everything so clearly. Worth every minute." },
    { name: "Carlos M.", rating: 4, date: "Nov 2024", comment: "Great content, though some sections could be trimmed a bit." },
  ],
  "ui-ux": [
    { name: "Nina P.", rating: 5, date: "Jan 2025", comment: "Exactly what I needed to get started with design. Super concise." },
    { name: "Tom K.", rating: 4, date: "Dec 2024", comment: "Short but dense with useful info. Would love a longer version." },
  ],
  javascript: [
    { name: "Sam W.", rating: 5, date: "Feb 2025", comment: "Finally understood closures! James is an incredible teacher." },
    { name: "Rina B.", rating: 5, date: "Jan 2025", comment: "The async section alone is worth taking this course." },
    { name: "Leo H.", rating: 5, date: "Dec 2024", comment: "My JavaScript skills jumped significantly after completing this." },
  ],
  "react-js": [
    { name: "Aryan S.", rating: 5, date: "Feb 2025", comment: "Dave Gray is the best React teacher. Every chapter builds perfectly on the last." },
    { name: "Priya M.", rating: 5, date: "Jan 2025", comment: "The CRUD and React Router chapters alone are worth it. Crystal clear." },
    { name: "Rohan K.", rating: 4, date: "Jan 2025", comment: "Covered everything I needed to land my first React role." },
    { name: "Sneha D.", rating: 5, date: "Dec 2024", comment: "9 hours went by so fast. Clearest React course I've found." },
  ],
  crypto: [
    { name: "Jake F.", rating: 4, date: "Jan 2025", comment: "Good no-nonsense introduction. No hype, just solid info." },
    { name: "Diane L.", rating: 5, date: "Dec 2024", comment: "Finally understand DeFi thanks to this course." },
  ],
  "solidity-web3": [
    { name: "Dev K.", rating: 5, date: "Feb 2025", comment: "Built my first dApp after completing just the first section. Incredible course." },
    { name: "Luca M.", rating: 5, date: "Jan 2025", comment: "The Zillow clone project is worth the entire course alone. So well explained." },
    { name: "Aisha B.", rating: 4, date: "Jan 2025", comment: "Dense but thorough. Needed to pause often but learned a ton about Solidity." },
  ],
  "public-speak": [
    { name: "Omar S.", rating: 5, date: "Feb 2025", comment: "I gave my first big presentation after this. Felt amazing." },
    { name: "Chloe M.", rating: 4, date: "Jan 2025", comment: "The breathing techniques alone changed how I approach speaking." },
  ],
  "personal-dev": [
    { name: "Yuki A.", rating: 5, date: "Jan 2025", comment: "Practical, science-backed, and genuinely motivating." },
    { name: "Ben T.", rating: 4, date: "Dec 2024", comment: "Great foundation for anyone wanting to level up their life." },
    { name: "Fiona G.", rating: 5, date: "Nov 2024", comment: "Changed the way I think about habits and goals completely." },
  ],
};

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-red-100 text-red-700",
  "All Levels": "bg-blue-100 text-blue-700",
};

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const sz = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`${sz} ${s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-slate-300 fill-slate-300"}`} />
      ))}
    </div>
  );
}

// ─── Embedded Video Player ────────────────────────────────────────────────────
interface VideoPlayerProps {
  videoId: string;
  title: string;
  autoPlay?: boolean;
  startSeconds?: number;
}
function VideoPlayer({ videoId, title, autoPlay = false, startSeconds = 0 }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(autoPlay);

  if (!playing) {
    return (
      <div className="relative w-full aspect-video bg-slate-900 rounded-t-2xl overflow-hidden group">
        <img src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`} alt={title} className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        <button onClick={() => setPlaying(true)} className="absolute inset-0 flex flex-col items-center justify-center gap-3 group" aria-label="Play preview">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 flex items-center justify-center shadow-2xl group-hover:scale-110 group-active:scale-95 transition-transform duration-200 ring-4 ring-white/30">
            <Play className="w-7 h-7 sm:w-9 sm:h-9 text-blue-600 fill-current ml-1" />
          </div>
          <span className="text-white text-xs sm:text-sm font-semibold bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full">Watch Preview</span>
        </button>
      </div>
    );
  }

  const startParam = startSeconds && startSeconds > 0 ? `&start=${startSeconds}` : "";
  return (
    <div className="relative w-full aspect-video bg-black rounded-t-2xl overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1${startParam}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen className="w-full h-full"
      />
    </div>
  );
}

// ─── Review Form ──────────────────────────────────────────────────────────────
interface ReviewFormProps {
  courseId: string;
  onSubmit: (courseId: string, review: { name: string; rating: number; comment: string }) => void;
}
function ReviewForm({ courseId, onSubmit }: ReviewFormProps) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || !rating || !comment.trim()) return;
    onSubmit(courseId, { name: name.trim(), rating, comment: comment.trim() });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        <p className="font-bold text-slate-800">Thanks for your review!</p>
        <p className="text-xs text-slate-500">Your feedback helps others decide.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="font-bold text-slate-800 text-sm">Leave a Review</p>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button key={s} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(s)}>
            <Star className={`w-7 h-7 transition-colors ${s <= (hoverRating || rating) ? "text-amber-400 fill-amber-400" : "text-slate-300 fill-slate-300"}`} />
          </button>
        ))}
        {rating > 0 && <span className="ml-2 text-xs font-semibold text-slate-600">{["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}</span>}
      </div>
      <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)}
        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      <textarea placeholder="Share your experience with this course..." value={comment} onChange={(e) => setComment(e.target.value)} rows={3}
        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
      <button onClick={handleSubmit} disabled={!name.trim() || !rating || !comment.trim()}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-95">
        <Send className="w-4 h-4" /> Submit Review
      </button>
    </div>
  );
}

// ─── Course Detail View ───────────────────────────────────────────────────────
export interface CourseDetailProps {
  course: (typeof ALL_COURSES)[0];
  status: "completed" | "active" | "locked" | "available";
  reviews: { name: string; rating: number; date: string; comment: string }[];
  onBack: () => void;
  onStart: (courseId: string) => void;
  onReviewSubmit: (courseId: string, review: { name: string; rating: number; comment: string }) => void;
  backLabel?: string;
  autoPlayVideo?: boolean;
}

export function CourseDetail({
  course, status, reviews, onBack, onStart, onReviewSubmit,
  backLabel = "Back to Explore", autoPlayVideo = false,
}: CourseDetailProps) {
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const activeVideoId = activeLesson?.id ?? course.videoId;
  const activeVideoTitle = activeLesson?.title ?? course.title;
  const activeStartSeconds = activeLesson?.startSeconds ?? 0;

  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const isActive = status === "active";
  const avgRating = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : course.rating;
  const hasPlaylist = course.playlist && course.playlist.length > 0;

  React.useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  const handleLessonClick = (lesson: Lesson) => {
    setActiveLesson(lesson);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-300 hover:text-white text-sm font-semibold mb-6 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{backLabel}
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Left info */}
            <div className="lg:col-span-3 space-y-4">
              {course.tag && (
                <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                  <Star className="w-2.5 h-2.5 fill-current" /> {course.tag}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">{course.title}</h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{course.longDescription}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <StarRating rating={avgRating} size="sm" />
                  <span className="font-bold text-amber-400">{avgRating.toFixed(1)}</span>
                  <span className="text-slate-400">({reviews.length + course.reviewCount} ratings)</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-slate-300">
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {course.students.toLocaleString()} students</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {course.duration}</span>
                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {course.lessons} lessons</span>
                <span className="flex items-center gap-1.5"><Award className="w-4 h-4" /> {course.level}</span>
              </div>
              <p className="text-slate-400 text-xs">Instructor: <span className="text-white font-semibold">{course.instructor}</span></p>
            </div>

            {/* Right: video + CTA */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                <VideoPlayer
                  videoId={activeVideoId}
                  title={activeVideoTitle}
                  autoPlay={autoPlayVideo || !!activeLesson}
                  startSeconds={activeStartSeconds}
                />
                {activeLesson && (
                  <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                    <p className="text-[10px] text-slate-500 font-semibold truncate">Now playing: {activeVideoTitle}</p>
                  </div>
                )}
                <div className="p-5 space-y-4">
                  {isLocked ? (
                    <>
                      <button disabled className="w-full bg-slate-100 text-slate-400 font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                        <Lock className="w-4 h-4" /> Locked
                      </button>
                      <p className="text-xs text-center text-slate-500">Finish your active track to unlock this course.</p>
                    </>
                  ) : isCompleted ? (
                    <button onClick={() => onStart(course.id)} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all active:scale-95">
                      <CheckCircle2 className="w-4 h-4" /> Review Course
                    </button>
                  ) : (
                    <button onClick={() => onStart(course.id)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg">
                      <Play className="w-4 h-4 fill-current" /> {isActive ? "Continue Learning" : "Start Course — It's Free"}
                    </button>
                  )}
                  <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 justify-center">
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Full lifetime access</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Certificate of completion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* What you'll learn */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-black text-slate-900">What you'll learn</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {course.topics.map((t, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Course content */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <button onClick={() => setTopicsOpen((p) => !p)} className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <p className="font-black text-slate-900 text-sm sm:text-base">Course Content</p>
                <p className="text-xs text-slate-500">{course.lessons} lessons · {course.duration} total</p>
              </div>
            </div>
            {topicsOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {topicsOpen && (
            <div className="border-t border-slate-100 divide-y divide-slate-100">
              {hasPlaylist
                ? course.playlist!.map((lesson, i) => {
                    const isThisActive = activeLesson
                      ? activeLesson.startSeconds === lesson.startSeconds
                      : false;
                    return (
                      <button
                        key={`${lesson.id}-${lesson.startSeconds ?? i}`}
                        onClick={() => !isLocked && handleLessonClick(lesson)}
                        disabled={isLocked}
                        className={`w-full flex items-center gap-4 px-6 py-3 text-left transition-colors
                          ${isLocked ? "cursor-not-allowed opacity-50" : "hover:bg-blue-50 cursor-pointer"}
                          ${isThisActive ? "bg-blue-50 border-l-2 border-blue-500" : ""}`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black
                          ${isThisActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                          {isThisActive
                            ? <Play className="w-3 h-3 fill-current" />
                            : i + 1}
                        </div>
                        <span className={`text-sm flex-1 font-medium ${isThisActive ? "text-blue-700" : "text-slate-700"}`}>
                          {lesson.title}
                        </span>
                        <span className="text-xs text-slate-400 font-medium tabular-nums flex-shrink-0">{lesson.duration}</span>
                      </button>
                    );
                  })
                : course.topics.map((t, i) => (
                    <div key={i} className="flex items-center gap-4 px-6 py-3">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Play className="w-3 h-3 text-slate-500 fill-current" />
                      </div>
                      <span className="text-sm text-slate-700 flex-1">{t}</span>
                      <span className="text-xs text-slate-400 font-medium tabular-nums">
                        {String(Math.floor((i * 37 + 12) % 45) + 5)}:{String(Math.floor((i * 13 + 7) % 59)).padStart(2, "0")}
                      </span>
                    </div>
                  ))
              }
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">Student Reviews</h2>
            <div className="flex items-center gap-2">
              <StarRating rating={avgRating} size="sm" />
              <span className="font-bold text-slate-800 text-sm">{avgRating.toFixed(1)}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reviews.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black text-xs">{r.name[0]}</div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">{r.name}</p>
                      <p className="text-[10px] text-slate-400">{r.date}</p>
                    </div>
                  </div>
                  <StarRating rating={r.rating} size="sm" />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <ReviewForm courseId={course.id} onSubmit={onReviewSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ExploreTab ──────────────────────────────────────────────────────────
interface ExploreTabProps {
  activeCourseId?: string | null;
  completedCourseIds?: string[];
  onCourseSelect?: (courseId: string) => void;
  onNavigate?: (tab: string) => void;
  progressMap?: Record<string, CourseProgressDetail>;
}

const ExploreTab: React.FC<ExploreTabProps> = ({
  activeCourseId = null,
  completedCourseIds = [],
  onCourseSelect,
  onNavigate,
  progressMap = {},
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [autoPlayOnOpen, setAutoPlayOnOpen] = useState(false);
  const [extraReviews, setExtraReviews] = useState<Record<string, { name: string; rating: number; date: string; comment: string }[]>>({});

  const getStatus = (id: string): "completed" | "active" | "locked" | "available" => {
    if (completedCourseIds.includes(id)) return "completed";
    if (id === activeCourseId) return "active";
    if (activeCourseId && !completedCourseIds.includes(activeCourseId) && id !== activeCourseId) return "locked";
    return "available";
  };

  const handleCardClick = (id: string) => { setAutoPlayOnOpen(false); setSelectedCourseId(id); };
  const handleStartFromGrid = (courseId: string) => {
    if (getStatus(courseId) === "locked") return;
    setAutoPlayOnOpen(true); setSelectedCourseId(courseId);
  };
  const handleStartFromDetail = (courseId: string) => {
    if (getStatus(courseId) === "locked") return;
    if (onCourseSelect) onCourseSelect(courseId);
    setSelectedCourseId(null);
    if (onNavigate) onNavigate("home");
  };
  const handleReviewSubmit = (courseId: string, review: { name: string; rating: number; comment: string }) => {
    setExtraReviews((prev) => ({ ...prev, [courseId]: [{ ...review, date: "Just now" }, ...(prev[courseId] || [])] }));
  };

  if (selectedCourseId) {
    const course = ALL_COURSES.find((c) => c.id === selectedCourseId)!;
    const baseReviews = COURSE_REVIEWS[selectedCourseId] || [];
    const userReviews = extraReviews[selectedCourseId] || [];
    return (
      <CourseDetail
        course={course} status={getStatus(selectedCourseId)}
        reviews={[...userReviews, ...baseReviews]}
        onBack={() => setSelectedCourseId(null)} onStart={handleStartFromDetail}
        onReviewSubmit={handleReviewSubmit} backLabel="Back to Explore" autoPlayVideo={autoPlayOnOpen}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <div className="max-w-5xl mx-auto mb-4 sm:mb-6 md:mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-2xl lg:text-4xl font-black text-black leading-tight">Explore Tracks</h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
            {activeCourseId && !completedCourseIds.includes(activeCourseId)
              ? "Finish your active course to unlock other tracks."
              : "Pick one track to start — complete it before unlocking the next."}
          </p>
        </div>
      </div>

      {activeCourseId && !completedCourseIds.includes(activeCourseId) && (() => {
        const active = ALL_COURSES.find((c) => c.id === activeCourseId);
        return active ? (
          <div className="max-w-7xl mx-auto mb-5 sm:mb-6">
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
              <p className="text-xs sm:text-sm text-blue-700 font-semibold">
                You're currently on <span className="font-black">{active.title}</span>. Complete it to unlock other tracks.
              </p>
              <button onClick={() => handleCardClick(activeCourseId)} className="ml-auto flex-shrink-0 flex items-center gap-1 bg-blue-600 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
                Continue <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : null;
      })()}

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {ALL_COURSES.map((c) => {
            const status = getStatus(c.id);
            const isLocked = status === "locked";
            const isCompleted = status === "completed";
            const isActive = status === "active";
            const progress = isCompleted ? 100 : (progressMap[c.id]?.progressPct ?? 0);

            return (
              <div key={c.id} onClick={() => handleCardClick(c.id)}
                className={`group bg-white rounded-xl sm:rounded-2xl border shadow-sm transition-all overflow-hidden flex flex-col cursor-pointer
                  ${isLocked ? "border-slate-200 opacity-60"
                    : isCompleted ? "border-emerald-200 hover:border-emerald-300 hover:shadow-xl"
                    : isActive ? "border-blue-300 hover:shadow-xl ring-2 ring-blue-400 ring-offset-1"
                    : "border-slate-200 hover:border-blue-200 hover:shadow-xl"}`}
              >
                <div className="relative overflow-hidden">
                  <div className="aspect-video">
                    <img src={c.thumbnail} alt={c.title} className={`w-full h-full object-cover transition-transform duration-500 ${!isLocked ? "group-hover:scale-105" : ""}`} />
                  </div>
                  {!isLocked && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 shadow-xl">
                        <Play className="w-5 h-5 text-blue-600 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}
                  {isLocked && (
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2">
                      <Lock className="w-6 h-6 text-white" />
                      <span className="text-white text-[10px] font-bold text-center px-2">Finish active track first</span>
                    </div>
                  )}
                  {isCompleted && (
                    <div className="absolute inset-0 bg-emerald-900/20 flex items-center justify-center">
                      <div className="bg-white rounded-full p-1.5 shadow-lg"><CheckCircle2 className="w-7 h-7 text-emerald-500" /></div>
                    </div>
                  )}
                  {isActive && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded-full flex items-center gap-1 shadow">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />In Progress
                    </div>
                  )}
                  {c.tag && !isLocked && !isCompleted && !isActive && (
                    <div className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-[9px] font-black uppercase px-2 py-1 rounded-full shadow flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-current" />{c.tag}
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg shadow-md">
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isCompleted ? "bg-emerald-500" : isActive ? "bg-blue-500" : "bg-slate-300"}`} />
                    <span className="text-[10px] sm:text-xs font-bold text-slate-700">{progress}%</span>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg flex items-center gap-1">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                    <span className="text-[10px] sm:text-xs font-semibold text-white">{c.lessons} lessons</span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex flex-col flex-1 space-y-3">
                  <div className="space-y-1.5">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${LEVEL_COLORS[c.level] || "bg-slate-100 text-slate-600"}`}>{c.level}</span>
                    <h3 className="font-black text-sm sm:text-base text-slate-800 line-clamp-1">{c.title}</h3>
                    <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed">{c.description}</p>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <StarRating rating={c.rating} size="sm" />
                      <span className="text-[10px] font-bold text-amber-500">{c.rating}</span>
                      <span className="text-[10px] text-slate-400">({c.reviewCount.toLocaleString()})</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] sm:text-xs">
                      <span className="text-slate-600 font-semibold">{isCompleted ? "Completed" : isActive ? "In progress" : "Not started"}</span>
                      <span className="text-slate-500 font-bold">{progress}% complete</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${isCompleted ? "bg-emerald-500" : isActive ? "bg-blue-500" : "bg-slate-300"}`} style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <div className="mt-auto pt-1">
                    {isLocked ? (
                      <button onClick={(e) => { e.stopPropagation(); handleCardClick(c.id); }}
                        className="w-full bg-slate-100 text-slate-500 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
                        <Play className="w-3.5 h-3.5" /> Preview Course
                      </button>
                    ) : isCompleted ? (
                      <button onClick={(e) => { e.stopPropagation(); handleStartFromGrid(c.id); }}
                        className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Review Course
                      </button>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); handleStartFromGrid(c.id); }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 text-xs">
                        <Play className="w-3.5 h-3.5 fill-current" /> {isActive ? "Continue" : "Get Started"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { VideoPlayer };
export default ExploreTab;