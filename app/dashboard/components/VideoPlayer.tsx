"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, Lock, Check, Play, Clock, ArrowRight } from "lucide-react";
import Confetti from "react-confetti";

interface Video {
  id: number;
  title: string;
  videoId: string;
  timestamp: number;
  duration: string;
  completed: boolean;
  emoji?: string;
}

interface CourseConfig {
  title: string;
  subtitle: string;
  playlist: Video[];
}

interface VideoPlayerProps {
  courseId: string;
  onBack: () => void;
  onComplete?: (courseId: string) => void;
  /** Called every time a lesson is marked done — saves to Supabase via hook */
  onLessonComplete?: (courseId: string, lessonIndex: number, totalLessons: number) => void;
  /** 0-based lesson index to resume from (from saved progress) */
  initialLesson?: number;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const COURSES: Record<string, CourseConfig> = {

  "web-dev": {
    title: "Complete Web Development",
    subtitle: "HTML & CSS Full Course",
    playlist: [
      { id: 1,  title: "Introduction to HTML",  videoId: "HGTJBPNC-Gw", timestamp: 0,     duration: "1:56",  completed: false, emoji: "🌎" },
      { id: 2,  title: "Hyperlinks",            videoId: "HGTJBPNC-Gw", timestamp: 667,   duration: "4:08",  completed: false, emoji: "👈" },
      { id: 3,  title: "Images",                videoId: "HGTJBPNC-Gw", timestamp: 915,   duration: "6:18",  completed: false, emoji: "🖼️" },
      { id: 4,  title: "Audio",                 videoId: "HGTJBPNC-Gw", timestamp: 1293,  duration: "5:16",  completed: false, emoji: "🔊" },
      { id: 5,  title: "Video",                 videoId: "HGTJBPNC-Gw", timestamp: 1609,  duration: "4:31",  completed: false, emoji: "🎥" },
      { id: 6,  title: "Favicons",              videoId: "HGTJBPNC-Gw", timestamp: 1880,  duration: "2:59",  completed: false, emoji: "🗿" },
      { id: 7,  title: "Text Formatting",       videoId: "HGTJBPNC-Gw", timestamp: 2059,  duration: "3:51",  completed: false, emoji: "💬" },
      { id: 8,  title: "Span & Div",            videoId: "HGTJBPNC-Gw", timestamp: 2290,  duration: "4:47",  completed: false, emoji: "🏁" },
      { id: 9,  title: "Lists",                 videoId: "HGTJBPNC-Gw", timestamp: 2577,  duration: "6:34",  completed: false, emoji: "📄" },
      { id: 10, title: "Tables",                videoId: "HGTJBPNC-Gw", timestamp: 2971,  duration: "4:42",  completed: false, emoji: "📊" },
      { id: 11, title: "Buttons",               videoId: "HGTJBPNC-Gw", timestamp: 3253,  duration: "5:15",  completed: false, emoji: "🔘" },
      { id: 12, title: "Forms",                 videoId: "HGTJBPNC-Gw", timestamp: 3568,  duration: "17:54", completed: false, emoji: "📝" },
      { id: 13, title: "Headers & Footers",     videoId: "HGTJBPNC-Gw", timestamp: 4642,  duration: "5:48",  completed: false, emoji: "🤯" },
      { id: 14, title: "Introduction to CSS",   videoId: "HGTJBPNC-Gw", timestamp: 4990,  duration: "8:00",  completed: false, emoji: "🎨" },
      { id: 15, title: "Colors",                videoId: "HGTJBPNC-Gw", timestamp: 5470,  duration: "4:12",  completed: false, emoji: "🖌️" },
      { id: 16, title: "Fonts",                 videoId: "HGTJBPNC-Gw", timestamp: 5722,  duration: "7:20",  completed: false, emoji: "🔤" },
      { id: 17, title: "Borders",               videoId: "HGTJBPNC-Gw", timestamp: 6162,  duration: "4:27",  completed: false, emoji: "🖼" },
      { id: 18, title: "Shadows",               videoId: "HGTJBPNC-Gw", timestamp: 6429,  duration: "3:18",  completed: false, emoji: "👥" },
      { id: 19, title: "Margins",               videoId: "HGTJBPNC-Gw", timestamp: 6627,  duration: "5:14",  completed: false, emoji: "↔️" },
      { id: 20, title: "Float",                 videoId: "HGTJBPNC-Gw", timestamp: 6941,  duration: "4:27",  completed: false, emoji: "🎈" },
      { id: 21, title: "Overflow",              videoId: "HGTJBPNC-Gw", timestamp: 7208,  duration: "3:23",  completed: false, emoji: "🌊" },
      { id: 22, title: "Display Property",      videoId: "HGTJBPNC-Gw", timestamp: 7411,  duration: "4:12",  completed: false, emoji: "🧱" },
      { id: 23, title: "Height and Width",      videoId: "HGTJBPNC-Gw", timestamp: 7663,  duration: "6:54",  completed: false, emoji: "📏" },
      { id: 24, title: "Positions",             videoId: "HGTJBPNC-Gw", timestamp: 8077,  duration: "6:23",  completed: false, emoji: "🎯" },
      { id: 25, title: "Background Images",     videoId: "HGTJBPNC-Gw", timestamp: 8460,  duration: "3:15",  completed: false, emoji: "🏙️" },
      { id: 26, title: "Combinators",           videoId: "HGTJBPNC-Gw", timestamp: 8655,  duration: "4:57",  completed: false, emoji: "➕" },
      { id: 27, title: "Pseudo-classes",        videoId: "HGTJBPNC-Gw", timestamp: 8952,  duration: "7:38",  completed: false, emoji: "☟" },
      { id: 28, title: "Pseudo-elements",       videoId: "HGTJBPNC-Gw", timestamp: 9410,  duration: "5:56",  completed: false, emoji: "✔" },
      { id: 29, title: "Pagination",            videoId: "HGTJBPNC-Gw", timestamp: 9766,  duration: "8:58",  completed: false, emoji: "🕮" },
      { id: 30, title: "Dropdown Menus",        videoId: "HGTJBPNC-Gw", timestamp: 10304, duration: "6:35",  completed: false, emoji: "🔻" },
      { id: 31, title: "Navigation Bar",        videoId: "HGTJBPNC-Gw", timestamp: 10699, duration: "6:27",  completed: false, emoji: "🧭" },
      { id: 32, title: "Website Layout",        videoId: "HGTJBPNC-Gw", timestamp: 11086, duration: "9:27",  completed: false, emoji: "🗺️" },
      { id: 33, title: "Image Gallery",         videoId: "HGTJBPNC-Gw", timestamp: 11653, duration: "5:37",  completed: false, emoji: "📷" },
      { id: 34, title: "Icons",                 videoId: "HGTJBPNC-Gw", timestamp: 11990, duration: "8:33",  completed: false, emoji: "🐤" },
      { id: 35, title: "Flexbox",               videoId: "HGTJBPNC-Gw", timestamp: 12503, duration: "10:00", completed: false, emoji: "💪" },
      { id: 36, title: "Transformations",       videoId: "HGTJBPNC-Gw", timestamp: 13103, duration: "9:00",  completed: false, emoji: "🔄" },
      { id: 37, title: "Animations",            videoId: "HGTJBPNC-Gw", timestamp: 13643, duration: "8:37",  completed: false, emoji: "🎬" },
    ],
  },

  "ui-ux": {
    title: "UI/UX Design Fundamentals",
    subtitle: "Full Design Course",
    playlist: [
      { id: 1, title: "Introduction", videoId: "c9Wg6Cb_YlU", timestamp: 0,    duration: "1:27",  completed: false, emoji: "👋" },
      { id: 2, title: "Wireframing",  videoId: "c9Wg6Cb_YlU", timestamp: 87,   duration: "29:31", completed: false, emoji: "✏️" },
      { id: 3, title: "UI Layout",    videoId: "c9Wg6Cb_YlU", timestamp: 1858, duration: "35:40", completed: false, emoji: "🖥️" },
      { id: 4, title: "Mockup",       videoId: "c9Wg6Cb_YlU", timestamp: 3998, duration: "rest",  completed: false, emoji: "🎨" },
    ],
  },

  "javascript": {
    title: "JavaScript Full Course",
    subtitle: "From Beginner to Advanced",
    playlist: [
      { id: 1,  title: "Quick Start",                       videoId: "EfAl9bwzVZk", timestamp: 0,     duration: "7:43",    completed: false, emoji: "🚀" },
      { id: 2,  title: "Link JavaScript to HTML",           videoId: "EfAl9bwzVZk", timestamp: 463,   duration: "7:33",    completed: false, emoji: "🔗" },
      { id: 3,  title: "Strings",                           videoId: "EfAl9bwzVZk", timestamp: 916,   duration: "6:58",    completed: false, emoji: "📝" },
      { id: 4,  title: "Numbers",                           videoId: "EfAl9bwzVZk", timestamp: 1334,  duration: "5:40",    completed: false, emoji: "🔢" },
      { id: 5,  title: "Math Methods",                      videoId: "EfAl9bwzVZk", timestamp: 1674,  duration: "5:03",    completed: false, emoji: "➗" },
      { id: 6,  title: "Code Challenge",                    videoId: "EfAl9bwzVZk", timestamp: 1977,  duration: "7:07",    completed: false, emoji: "🏆" },
      { id: 7,  title: "If Statements",                     videoId: "EfAl9bwzVZk", timestamp: 2404,  duration: "6:06",    completed: false, emoji: "❓" },
      { id: 8,  title: "Switch Statements",                 videoId: "EfAl9bwzVZk", timestamp: 2770,  duration: "3:29",    completed: false, emoji: "🔀" },
      { id: 9,  title: "Ternary Operators",                 videoId: "EfAl9bwzVZk", timestamp: 2979,  duration: "4:59",    completed: false, emoji: "⚡" },
      { id: 10, title: "User Input",                        videoId: "EfAl9bwzVZk", timestamp: 3278,  duration: "9:59",    completed: false, emoji: "⌨️" },
      { id: 11, title: "Your First Game",                   videoId: "EfAl9bwzVZk", timestamp: 3877,  duration: "15:48",   completed: false, emoji: "🎮" },
      { id: 12, title: "Loops",                             videoId: "EfAl9bwzVZk", timestamp: 4825,  duration: "15:54",   completed: false, emoji: "🔄" },
      { id: 13, title: "Functions",                         videoId: "EfAl9bwzVZk", timestamp: 5779,  duration: "11:50",   completed: false, emoji: "🧩" },
      { id: 14, title: "Scope - var, let, const",           videoId: "EfAl9bwzVZk", timestamp: 6489,  duration: "17:19",   completed: false, emoji: "🔭" },
      { id: 15, title: "Arrays",                            videoId: "EfAl9bwzVZk", timestamp: 7528,  duration: "28:19",   completed: false, emoji: "📦" },
      { id: 16, title: "Refactor the Game with Arrays",     videoId: "EfAl9bwzVZk", timestamp: 9227,  duration: "18:05",   completed: false, emoji: "🎲" },
      { id: 17, title: "Objects",                           videoId: "EfAl9bwzVZk", timestamp: 10312, duration: "22:51",   completed: false, emoji: "🗂️" },
      { id: 18, title: "Classes",                           videoId: "EfAl9bwzVZk", timestamp: 11683, duration: "30:51",   completed: false, emoji: "🏗️" },
      { id: 19, title: "JSON",                              videoId: "EfAl9bwzVZk", timestamp: 13534, duration: "6:45",    completed: false, emoji: "📋" },
      { id: 20, title: "Handling Errors",                   videoId: "EfAl9bwzVZk", timestamp: 13939, duration: "14:35",   completed: false, emoji: "🚨" },
      { id: 21, title: "Document Object Model (DOM)",       videoId: "EfAl9bwzVZk", timestamp: 14814, duration: "35:12",   completed: false, emoji: "🌐" },
      { id: 22, title: "Event Listeners",                   videoId: "EfAl9bwzVZk", timestamp: 16926, duration: "39:01",   completed: false, emoji: "👂" },
      { id: 23, title: "Web Storage API",                   videoId: "EfAl9bwzVZk", timestamp: 19267, duration: "18:33",   completed: false, emoji: "💾" },
      { id: 24, title: "Modules",                           videoId: "EfAl9bwzVZk", timestamp: 20380, duration: "16:47",   completed: false, emoji: "📦" },
      { id: 25, title: "Higher Order Functions",            videoId: "EfAl9bwzVZk", timestamp: 21387, duration: "10:17",   completed: false, emoji: "🧠" },
      { id: 26, title: "Promises / Fetch / Async & Await",  videoId: "EfAl9bwzVZk", timestamp: 22004, duration: "1:04:34", completed: false, emoji: "⏳" },
      { id: 27, title: "Regular Expressions",               videoId: "EfAl9bwzVZk", timestamp: 25878, duration: "21:48",   completed: false, emoji: "🔍" },
      { id: 28, title: "Applying RegEx in JavaScript",      videoId: "EfAl9bwzVZk", timestamp: 27186, duration: "rest",    completed: false, emoji: "✅" },
    ],
  },

  // ─── React JS — Dave Gray 9-hour Complete Tutorial (24 lessons) ──────────
  "react-js": {
    title: "React JS Full Course",
    subtitle: "Dave Gray — Complete 9-Hour Tutorial",
    playlist: [
      { id: 1,  title: "Intro",                              videoId: "CgkZ7MvWUAA", timestamp: 0,     duration: "2:00",  completed: false, emoji: "👋" },
      { id: 2,  title: "Start Here",                         videoId: "CgkZ7MvWUAA", timestamp: 120,   duration: "18:00", completed: false, emoji: "🚀" },
      { id: 3,  title: "App & JSX",                          videoId: "CgkZ7MvWUAA", timestamp: 1200,  duration: "22:00", completed: false, emoji: "⚛️" },
      { id: 4,  title: "Functional Components",              videoId: "CgkZ7MvWUAA", timestamp: 2520,  duration: "20:00", completed: false, emoji: "🧩" },
      { id: 5,  title: "Applying CSS Styles",                videoId: "CgkZ7MvWUAA", timestamp: 3720,  duration: "18:00", completed: false, emoji: "🎨" },
      { id: 6,  title: "Click Events",                       videoId: "CgkZ7MvWUAA", timestamp: 4800,  duration: "20:00", completed: false, emoji: "🖱️" },
      { id: 7,  title: "useState Hook",                      videoId: "CgkZ7MvWUAA", timestamp: 6000,  duration: "24:00", completed: false, emoji: "🪝" },
      { id: 8,  title: "Lists & Keys",                       videoId: "CgkZ7MvWUAA", timestamp: 7440,  duration: "18:00", completed: false, emoji: "📋" },
      { id: 9,  title: "Props & Prop Drilling",              videoId: "CgkZ7MvWUAA", timestamp: 8520,  duration: "22:00", completed: false, emoji: "📦" },
      { id: 10, title: "Controlled Component Inputs",        videoId: "CgkZ7MvWUAA", timestamp: 9840,  duration: "20:00", completed: false, emoji: "✏️" },
      { id: 11, title: "Project Challenge",                  videoId: "CgkZ7MvWUAA", timestamp: 11040, duration: "25:00", completed: false, emoji: "🏆" },
      { id: 12, title: "useEffect Hook",                     videoId: "CgkZ7MvWUAA", timestamp: 12540, duration: "24:00", completed: false, emoji: "⚡" },
      { id: 13, title: "JSON Server",                        videoId: "CgkZ7MvWUAA", timestamp: 13980, duration: "18:00", completed: false, emoji: "🗄️" },
      { id: 14, title: "Fetch API Data",                     videoId: "CgkZ7MvWUAA", timestamp: 15060, duration: "22:00", completed: false, emoji: "🌐" },
      { id: 15, title: "CRUD Operations",                    videoId: "CgkZ7MvWUAA", timestamp: 16380, duration: "26:00", completed: false, emoji: "🔨" },
      { id: 16, title: "Fetch Data Challenge",               videoId: "CgkZ7MvWUAA", timestamp: 17940, duration: "20:00", completed: false, emoji: "💪" },
      { id: 17, title: "React Router",                       videoId: "CgkZ7MvWUAA", timestamp: 19140, duration: "24:00", completed: false, emoji: "🗺️" },
      { id: 18, title: "Router Hooks & Links",               videoId: "CgkZ7MvWUAA", timestamp: 20580, duration: "22:00", completed: false, emoji: "🔗" },
      { id: 19, title: "Flexbox Components",                 videoId: "CgkZ7MvWUAA", timestamp: 21900, duration: "18:00", completed: false, emoji: "💪" },
      { id: 20, title: "Axios API Requests",                 videoId: "CgkZ7MvWUAA", timestamp: 22980, duration: "20:00", completed: false, emoji: "📡" },
      { id: 21, title: "Custom Hooks",                       videoId: "CgkZ7MvWUAA", timestamp: 24180, duration: "22:00", completed: false, emoji: "🪝" },
      { id: 22, title: "Context API & useContext",           videoId: "CgkZ7MvWUAA", timestamp: 25500, duration: "24:00", completed: false, emoji: "🌍" },
      { id: 23, title: "Easy Peasy Redux",                   videoId: "CgkZ7MvWUAA", timestamp: 26940, duration: "26:00", completed: false, emoji: "🔄" },
      { id: 24, title: "Build & Deploy",                     videoId: "CgkZ7MvWUAA", timestamp: 28500, duration: "20:00", completed: false, emoji: "🚢" },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────

  "crypto": {
    title: "Cryptocurrency & Blockchain",
    subtitle: "Solana Developer Bootcamp",
    playlist: [
      { id: 1,  title: "Welcome to the Bootcamp",                    videoId: "amAq-WHAFs8", timestamp: 0,     duration: "3:06",    completed: false, emoji: "👋" },
      { id: 2,  title: "Blockchain Basics",                          videoId: "amAq-WHAFs8", timestamp: 186,   duration: "7:16",    completed: false, emoji: "⛓️" },
      { id: 3,  title: "Project 1 | Building a Favorites Program",   videoId: "amAq-WHAFs8", timestamp: 622,   duration: "27:20",   completed: false, emoji: "⭐" },
      { id: 4,  title: "Project 2 | Creating a Voting Application",  videoId: "amAq-WHAFs8", timestamp: 2262,  duration: "1:12:50", completed: false, emoji: "🗳️" },
      { id: 5,  title: "Project 3 | Integrating Blinks and Actions", videoId: "amAq-WHAFs8", timestamp: 6632,  duration: "41:13",   completed: false, emoji: "⚡" },
      { id: 6,  title: "Project 4 | Building a CRUD Application",    videoId: "amAq-WHAFs8", timestamp: 9105,  duration: "1:03:06", completed: false, emoji: "🔨" },
      { id: 7,  title: "Project 5 | Creating a Token",               videoId: "amAq-WHAFs8", timestamp: 12891, duration: "14:21",   completed: false, emoji: "🪙" },
      { id: 8,  title: "Project 6 | Creating a NFT",                 videoId: "amAq-WHAFs8", timestamp: 13752, duration: "36:10",   completed: false, emoji: "🎨" },
      { id: 9,  title: "Project 7 | Building a Swap Program",        videoId: "amAq-WHAFs8", timestamp: 15922, duration: "1:22:53", completed: false, emoji: "🔄" },
      { id: 10, title: "Project 8 | Creating a Token Vesting App",   videoId: "amAq-WHAFs8", timestamp: 20895, duration: "2:43:02", completed: false, emoji: "⏳" },
      { id: 11, title: "Project 9 | Building a Token Lottery",       videoId: "amAq-WHAFs8", timestamp: 30677, duration: "rest",    completed: false, emoji: "🎰" },
    ],
  },

  // ─── Solidity & Web3 Development — Dapp University ───────────────────────
  "solidity-web3": {
    title: "Solidity & Web3 Development",
    subtitle: "Smart Contracts + 4 Full dApp Projects",
    playlist: [
      // ── Solidity Basics ──
      { id: 1,  title: "Your First Contract",        videoId: "jcgfQEbptdo", timestamp: 103,   duration: "15:40", completed: false, emoji: "📄" },
      { id: 2,  title: "Variables & Data Types",     videoId: "jcgfQEbptdo", timestamp: 1043,  duration: "13:16", completed: false, emoji: "🔢" },
      { id: 3,  title: "Arrays",                     videoId: "jcgfQEbptdo", timestamp: 1839,  duration: "8:28",  completed: false, emoji: "📦" },
      { id: 4,  title: "Mappings",                   videoId: "jcgfQEbptdo", timestamp: 2347,  duration: "12:09", completed: false, emoji: "🗺️" },
      { id: 5,  title: "Conditionals & Loops",       videoId: "jcgfQEbptdo", timestamp: 3076,  duration: "11:26", completed: false, emoji: "🔄" },
      { id: 6,  title: "Full Contract",              videoId: "jcgfQEbptdo", timestamp: 3762,  duration: "23:30", completed: false, emoji: "✅" },
      { id: 7,  title: "Inheritance",                videoId: "jcgfQEbptdo", timestamp: 5172,  duration: "13:01", completed: false, emoji: "🧬" },
      // ── Real Estate App ──
      { id: 8,  title: "RE: Overview",               videoId: "jcgfQEbptdo", timestamp: 5953,  duration: "4:39",  completed: false, emoji: "🏠" },
      { id: 9,  title: "RE: Create Project",         videoId: "jcgfQEbptdo", timestamp: 6232,  duration: "9:28",  completed: false, emoji: "🔨" },
      { id: 10, title: "RE: Escrow Contract",        videoId: "jcgfQEbptdo", timestamp: 6800,  duration: "22:04", completed: false, emoji: "📜" },
      { id: 11, title: "RE: List Property",          videoId: "jcgfQEbptdo", timestamp: 8124,  duration: "18:56", completed: false, emoji: "🏡" },
      { id: 12, title: "RE: Earnest Deposit",        videoId: "jcgfQEbptdo", timestamp: 9260,  duration: "6:17",  completed: false, emoji: "💰" },
      { id: 13, title: "RE: Finish Contract",        videoId: "jcgfQEbptdo", timestamp: 9637,  duration: "16:15", completed: false, emoji: "🤝" },
      { id: 14, title: "RE: Deploy Contracts",       videoId: "jcgfQEbptdo", timestamp: 10612, duration: "11:10", completed: false, emoji: "🚀" },
      { id: 15, title: "RE: Create Front End",       videoId: "jcgfQEbptdo", timestamp: 11282, duration: "5:19",  completed: false, emoji: "💻" },
      { id: 16, title: "RE: Connect to Blockchain",  videoId: "jcgfQEbptdo", timestamp: 11600, duration: "7:18",  completed: false, emoji: "⛓️" },
      { id: 17, title: "RE: Navbar",                 videoId: "jcgfQEbptdo", timestamp: 12038, duration: "4:44",  completed: false, emoji: "🧭" },
      { id: 18, title: "RE: Search Bar",             videoId: "jcgfQEbptdo", timestamp: 12323, duration: "4:29",  completed: false, emoji: "🔍" },
      { id: 19, title: "RE: List Properties",        videoId: "jcgfQEbptdo", timestamp: 12592, duration: "11:56", completed: false, emoji: "📋" },
      { id: 20, title: "RE: Buy Property",           videoId: "jcgfQEbptdo", timestamp: 13308, duration: "32:16", completed: false, emoji: "🛒" },
      // ── Amazon Clone ──
      { id: 21, title: "AZ: Overview",               videoId: "jcgfQEbptdo", timestamp: 15244, duration: "2:14",  completed: false, emoji: "🛍️" },
      { id: 22, title: "AZ: Project Setup",          videoId: "jcgfQEbptdo", timestamp: 15378, duration: "6:26",  completed: false, emoji: "⚙️" },
      { id: 23, title: "AZ: Create Contract",        videoId: "jcgfQEbptdo", timestamp: 15764, duration: "20:35", completed: false, emoji: "📄" },
      { id: 24, title: "AZ: List Products",          videoId: "jcgfQEbptdo", timestamp: 17000, duration: "31:57", completed: false, emoji: "📦" },
      { id: 25, title: "AZ: Buy Products",           videoId: "jcgfQEbptdo", timestamp: 18916, duration: "21:48", completed: false, emoji: "💳" },
      { id: 26, title: "AZ: Deployment",             videoId: "jcgfQEbptdo", timestamp: 20224, duration: "9:21",  completed: false, emoji: "🚀" },
      { id: 27, title: "AZ: Create Front End",       videoId: "jcgfQEbptdo", timestamp: 20785, duration: "9:49",  completed: false, emoji: "🖥️" },
      { id: 28, title: "AZ: Navbar",                 videoId: "jcgfQEbptdo", timestamp: 21374, duration: "13:40", completed: false, emoji: "🧭" },
      { id: 29, title: "AZ: List Products UI",       videoId: "jcgfQEbptdo", timestamp: 22254, duration: "21:44", completed: false, emoji: "🗂️" },
      { id: 30, title: "AZ: Product Details",        videoId: "jcgfQEbptdo", timestamp: 23558, duration: "10:51", completed: false, emoji: "🔎" },
      { id: 31, title: "AZ: Buy Products UI",        videoId: "jcgfQEbptdo", timestamp: 24209, duration: "6:51",  completed: false, emoji: "🛒" },
      // ── Discord Clone ──
      { id: 32, title: "DC: Overview",               videoId: "jcgfQEbptdo", timestamp: 24627, duration: "2:22",  completed: false, emoji: "💬" },
      { id: 33, title: "DC: Setup",                  videoId: "jcgfQEbptdo", timestamp: 24769, duration: "2:54",  completed: false, emoji: "⚙️" },
      { id: 34, title: "DC: Contracts",              videoId: "jcgfQEbptdo", timestamp: 24943, duration: "24:19", completed: false, emoji: "📜" },
      { id: 35, title: "DC: Create Channel",         videoId: "jcgfQEbptdo", timestamp: 26402, duration: "20:52", completed: false, emoji: "📡" },
      { id: 36, title: "DC: Mint NFTs",              videoId: "jcgfQEbptdo", timestamp: 27654, duration: "8:40",  completed: false, emoji: "🎨" },
      { id: 37, title: "DC: Withdraw Ether",         videoId: "jcgfQEbptdo", timestamp: 28174, duration: "3:07",  completed: false, emoji: "💸" },
      { id: 38, title: "DC: Deployment",             videoId: "jcgfQEbptdo", timestamp: 28361, duration: "9:11",  completed: false, emoji: "🚀" },
      { id: 39, title: "DC: Front End",              videoId: "jcgfQEbptdo", timestamp: 28912, duration: "3:39",  completed: false, emoji: "💻" },
      { id: 40, title: "DC: Navbar",                 videoId: "jcgfQEbptdo", timestamp: 29131, duration: "26:33", completed: false, emoji: "🧭" },
      { id: 41, title: "DC: Channels",               videoId: "jcgfQEbptdo", timestamp: 30724, duration: "15:07", completed: false, emoji: "📺" },
      { id: 42, title: "DC: Chatting",               videoId: "jcgfQEbptdo", timestamp: 31631, duration: "27:20", completed: false, emoji: "💬" },
      // ── Ticketmaster Clone ──
      { id: 43, title: "TM: Project Overview",       videoId: "jcgfQEbptdo", timestamp: 33271, duration: "3:06",  completed: false, emoji: "🎫" },
      { id: 44, title: "TM: Project Setup",          videoId: "jcgfQEbptdo", timestamp: 33457, duration: "2:45",  completed: false, emoji: "⚙️" },
      { id: 45, title: "TM: Create Smart Contract",  videoId: "jcgfQEbptdo", timestamp: 33622, duration: "4:33",  completed: false, emoji: "📄" },
      { id: 46, title: "TM: Events",                 videoId: "jcgfQEbptdo", timestamp: 33895, duration: "42:28", completed: false, emoji: "🎭" },
      { id: 47, title: "TM: Buy Tickets",            videoId: "jcgfQEbptdo", timestamp: 36443, duration: "22:22", completed: false, emoji: "🎟️" },
      { id: 48, title: "TM: Withdraw Ether",         videoId: "jcgfQEbptdo", timestamp: 37785, duration: "6:44",  completed: false, emoji: "💸" },
      { id: 49, title: "TM: Deploy Contracts",       videoId: "jcgfQEbptdo", timestamp: 38189, duration: "9:06",  completed: false, emoji: "🚀" },
      { id: 50, title: "TM: Create Front End",       videoId: "jcgfQEbptdo", timestamp: 38735, duration: "23:55", completed: false, emoji: "🖥️" },
      { id: 51, title: "TM: Load Contracts",         videoId: "jcgfQEbptdo", timestamp: 40170, duration: "8:07",  completed: false, emoji: "⛓️" },
      { id: 52, title: "TM: List Events",            videoId: "jcgfQEbptdo", timestamp: 40657, duration: "9:58",  completed: false, emoji: "📋" },
      { id: 53, title: "TM: Buy Tickets UI",         videoId: "jcgfQEbptdo", timestamp: 41255, duration: "rest",  completed: false, emoji: "🛒" },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────

  "public-speak": { title: "Public Speaking Mastery",       subtitle: "Coming Soon", playlist: [] },
  "personal-dev": { title: "Personal Development & Growth", subtitle: "Coming Soon", playlist: [] },
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  courseId,
  onBack,
  onComplete,
  onLessonComplete,
  initialLesson = 0,
}) => {
  const course = COURSES[courseId];

  if (!course || course.playlist.length === 0) {
    return (
      <div className="bg-slate-50 flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8">
        <div className="text-5xl">🚧</div>
        <h2 className="text-xl font-bold text-slate-700">
          {course ? course.title : "Course Not Found"}
        </h2>
        <p className="text-slate-500 text-sm">
          {course ? "This course doesn't have video content yet. Check back soon!" : "We couldn't find that course."}
        </p>
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors font-semibold text-slate-700 text-sm">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      </div>
    );
  }

  // ── State ───────────────────────────────────────────────────────────────────
  const [playlist, setPlaylist] = useState<Video[]>(() =>
    course.playlist.map((v, i) => ({ ...v, completed: i < initialLesson }))
  );
  const [currentVideoIndex, setCurrentVideoIndex] = useState(initialLesson);
  const [showConfetti, setShowConfetti] = useState(false);

  const completeFiredRef = useRef(false);
  const savedLessonsRef = useRef<Set<number>>(new Set(
    Array.from({ length: initialLesson }, (_, i) => i)
  ));

  const refs = useRef({
    player:      null as any,
    interval:    null as ReturnType<typeof setInterval> | null,
    ytReady:     false,
    timestamps:  course.playlist.map((v) => v.timestamp),
    setPlaylist,
    setCurrentVideoIndex,
    setShowConfetti,
  });

  // ── Derived ─────────────────────────────────────────────────────────────────
  const currentVideo       = playlist[currentVideoIndex];
  const completedCount     = playlist.filter((v) => v.completed).length;
  const progressPercentage = Math.round((completedCount / playlist.length) * 100);
  const allCompleted       = playlist.every((v) => v.completed);

  // ── Fire onComplete once when all done ──────────────────────────────────────
  useEffect(() => {
    if (allCompleted && !completeFiredRef.current && onComplete) {
      completeFiredRef.current = true;
      onComplete(courseId);
    }
  }, [allCompleted, courseId, onComplete]);

  function stopPolling() {
    if (refs.current.interval) {
      clearInterval(refs.current.interval);
      refs.current.interval = null;
    }
  }

  function startPolling() {
    stopPolling();
    refs.current.interval = setInterval(() => {
      const player = refs.current.player;
      if (!player || typeof player.getCurrentTime !== "function") return;

      const currentTime: number = player.getCurrentTime();
      const timestamps = refs.current.timestamps;

      let activeIndex = 0;
      for (let i = 0; i < timestamps.length; i++) {
        if (currentTime >= timestamps[i]) activeIndex = i;
        else break;
      }

      refs.current.setCurrentVideoIndex(activeIndex);

      refs.current.setPlaylist((prev: Video[]) => {
        let changed = false;
        const updated = prev.map((video, i) => {
          if (i < activeIndex && !video.completed) {
            changed = true;
            return { ...video, completed: true };
          }
          return video;
        });

        if (changed) {
          updated.forEach((video, i) => {
            if (video.completed && !savedLessonsRef.current.has(i)) {
              savedLessonsRef.current.add(i);
              onLessonComplete?.(courseId, i, course.playlist.length);
            }
          });

          if (updated.every((v) => v.completed)) {
            refs.current.setShowConfetti(true);
            setTimeout(() => refs.current.setShowConfetti(false), 5000);
          }
        }
        return changed ? updated : prev;
      });
    }, 1000);
  }

  useEffect(() => {
    refs.current.timestamps = course.playlist.map((v) => v.timestamp);
    completeFiredRef.current = false;
    savedLessonsRef.current = new Set(Array.from({ length: initialLesson }, (_, i) => i));

    setPlaylist(course.playlist.map((v, i) => ({ ...v, completed: i < initialLesson })));
    setCurrentVideoIndex(initialLesson);
    stopPolling();

    const startTimestamp = course.playlist[initialLesson]?.timestamp ?? 0;

    function initPlayer() {
      if (refs.current.player?.loadVideoById) {
        refs.current.player.loadVideoById({
          videoId: course.playlist[0].videoId,
          startSeconds: startTimestamp,
        });
        startPolling();
      } else {
        refs.current.player = new window.YT.Player("yt-player", {
          videoId: course.playlist[0].videoId,
          playerVars: { start: startTimestamp, autoplay: 1, rel: 0, modestbranding: 1 },
          events: {
            onReady: () => startPolling(),
            onStateChange: (event: any) => {
              if (event.data === 1 || event.data === 3) startPolling();
              else stopPolling();
            },
          },
        });
      }
    }

    if (window.YT?.Player) {
      initPlayer();
    } else if (!refs.current.ytReady) {
      refs.current.ytReady = true;
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => stopPolling();
  }, [courseId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleVideoSelect = (index: number) => {
    if (index !== 0 && !playlist[index - 1].completed) return;
    refs.current.player?.seekTo(course.playlist[index].timestamp, true);
    setCurrentVideoIndex(index);
  };

  const handleMarkComplete = () => {
    setPlaylist((prev) => {
      const updated = [...prev];
      updated[currentVideoIndex] = { ...updated[currentVideoIndex], completed: true };

      if (!savedLessonsRef.current.has(currentVideoIndex)) {
        savedLessonsRef.current.add(currentVideoIndex);
        onLessonComplete?.(courseId, currentVideoIndex, course.playlist.length);
      }

      if (updated.every((v) => v.completed)) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
      return updated;
    });

    const next = currentVideoIndex + 1;
    if (next < course.playlist.length) {
      refs.current.player?.seekTo(course.playlist[next].timestamp, true);
      setCurrentVideoIndex(next);
    }
  };

  const handlePreviousVideo = () => {
    if (currentVideoIndex > 0) {
      const i = currentVideoIndex - 1;
      refs.current.player?.seekTo(course.playlist[i].timestamp, true);
      setCurrentVideoIndex(i);
    }
  };

  const handleNextVideo = () => {
    const i = currentVideoIndex + 1;
    if (i < course.playlist.length && currentVideo.completed) {
      refs.current.player?.seekTo(course.playlist[i].timestamp, true);
      setCurrentVideoIndex(i);
    }
  };

  const isVideoUnlocked = (index: number) => index === 0 || playlist[index - 1].completed;

  return (
    <div className="bg-slate-50">
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors whitespace-nowrap text-xs sm:text-sm font-semibold text-slate-700">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-slate-800 truncate">{course.title}</h1>
          <p className="text-xs text-slate-500">{course.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {allCompleted && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">🎉 Completed!</span>
          )}
          <span className="text-sm font-bold text-blue-600">{progressPercentage}%</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-4">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
            <div id="yt-player" className="w-full h-full" />
          </div>

          <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  {currentVideo.emoji && <span>{currentVideo.emoji}</span>}
                  {currentVideo.title}
                </h2>
                <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{currentVideo.duration}</span>
                  <span>Lesson {currentVideoIndex + 1} of {playlist.length}</span>
                </div>
              </div>

              {!currentVideo.completed ? (
                <button onClick={handleMarkComplete} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors shrink-0">
                  <Check className="w-4 h-4" /> Mark Complete
                </button>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium text-sm shrink-0">
                  <Check className="w-4 h-4" /> Completed
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2">
              <Play className="w-3 h-3 text-blue-400 shrink-0" />
              <span>Lessons auto-complete as you watch — progress is saved automatically</span>
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={handlePreviousVideo} disabled={currentVideoIndex === 0} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button onClick={handleNextVideo} disabled={currentVideoIndex === playlist.length - 1 || !currentVideo.completed} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors ml-auto">
                Next Lesson <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {allCompleted && (
            <div className="mt-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white text-center shadow-lg">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
              <p className="text-blue-100 mb-4">You've completed {course.title} with {playlist.length} lessons!</p>
              <button onClick={onBack} className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Back to Courses
              </button>
            </div>
          )}
        </div>

        {/* Playlist Sidebar */}
        <div className="w-full lg:w-80 xl:w-96">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Course Content</h3>
              <p className="text-xs text-slate-500 mt-1">{completedCount} of {playlist.length} lessons completed</p>
              <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
              </div>
            </div>

            <div className="overflow-y-auto max-h-[60vh] lg:max-h-[70vh]">
              {playlist.map((video, index) => {
                const isUnlocked = isVideoUnlocked(index);
                const isCurrent  = index === currentVideoIndex;
                return (
                  <button key={video.id} onClick={() => handleVideoSelect(index)} disabled={!isUnlocked}
                    className={`w-full p-3 sm:p-4 flex items-start gap-3 border-b border-slate-100 transition-all text-left
                      ${isCurrent  ? "bg-blue-50 border-l-4 border-l-blue-600" : ""}
                      ${isUnlocked ? "hover:bg-slate-50 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                  >
                    <div className="shrink-0 w-6 h-6 flex items-center justify-center mt-0.5">
                      {video.completed ? (
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ) : isUnlocked ? (
                        <div className="w-6 h-6 rounded-full border-2 border-blue-400 flex items-center justify-center">
                          <Play className="w-3 h-3 text-blue-400 ml-0.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center">
                          <Lock className="w-3 h-3 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isCurrent ? "text-blue-700" : "text-slate-700"}`}>
                        {video.emoji && <span className="mr-1">{video.emoji}</span>}{video.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />{video.duration}
                      </p>
                      {!isUnlocked && <p className="text-xs text-slate-400 mt-0.5">🔒 Complete previous lesson</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;