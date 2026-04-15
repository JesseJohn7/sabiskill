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
import { CertificateModal } from "./Certificatemodal";
import { CourseQuiz, hasPassedQuiz } from "../components/CourseQuiz";

// ── Lesson type for playlist courses ──────────────────────────────────────
export interface Lesson {
  id: string;
  title: string;
  duration: string;
  startSeconds?: number;
}

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
  {
    id: "python-ai",
    title: "Python for AI & Development",
    description: "Master Python from scratch — environments, OOP, APIs, Git, and real AI-ready projects.",
    longDescription:
      "A complete Python course built for the AI era. From installing Python and VS Code to virtual environments, data structures, OOP, Git, APIs, and modern tooling with Ruff and UV — everything you need to write professional Python code for AI and software development.",
    thumbnail: "https://i.ytimg.com/vi/ygXn5nV5qFc/maxresdefault.jpg",
    videoId: "ygXn5nV5qFc",
    lessons: 79,
    level: "Beginner",
    tag: "New",
    duration: "5h 11m",
    students: 0,
    rating: 4.9,
    reviewCount: 0,
    instructor: "Dave Gray",
    topics: [
      "Installing Python & VS Code Setup",
      "Python Syntax, Variables & Data Types",
      "Control Flow, Loops & Functions",
      "Lists, Dictionaries, Tuples & Sets",
      "Modules, Packages & Virtual Environments",
      "Working with APIs & External Data",
      "Object-Oriented Programming (OOP)",
      "Git, GitHub & Modern Tooling (Ruff, UV)",
    ],
    playlist: null as Lesson[] | null,
  },
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
  {
    id: "digital-marketing",
    title: "Digital Marketing Fundamentals",
    description: "Strategy, tactics, organic vs paid, B2B vs B2C — the complete marketing master plan.",
    longDescription:
      "Cut through the noise and learn digital marketing the right way. This course walks you through the 5-step marketing master plan — Model, Market, Message, Media, and Machine — then breaks down every major marketing distinction: organic vs paid, direct response vs brand awareness, search vs discovery, products vs services, and B2B vs B2C.",
    thumbnail: "https://i.ytimg.com/vi/CBUF5V4iNgU/maxresdefault.jpg",
    videoId: "CBUF5V4iNgU",
    lessons: 14,
    level: "Beginner",
    tag: "Quick Start",
    duration: "19m",
    students: 0,
    rating: 4.8,
    reviewCount: 0,
    instructor: "Adam Erhart",
    topics: [
      "Digital vs Traditional Marketing",
      "The 5-Step Marketing Master Plan",
      "Organic vs Paid Marketing",
      "Direct Response vs Brand Awareness",
      "Search vs Discovery Marketing",
      "Marketing Products vs Services",
      "B2B vs B2C Marketing",
    ],
    playlist: null as Lesson[] | null,
  },
  {
    id: "social-media-mgmt",
    title: "Social Media Management",
    description: "Land clients, set rates, build strategies, and manage social media like a pro.",
    longDescription:
      "A complete, no-fluff guide to becoming a professional social media manager. Covers everything from landing your first client and onboarding, to pricing strategies, contracts, content calendars, audits, discovery calls, and building a full freelance service package.",
    thumbnail: "https://i.ytimg.com/vi/bgrA3kuZpWk/maxresdefault.jpg",
    videoId: "bgrA3kuZpWk",
    lessons: 43,
    level: "Beginner",
    tag: "Trending",
    duration: "4h 33m",
    students: 0,
    rating: 4.8,
    reviewCount: 0,
    instructor: "Social Media Pro",
    topics: [
      "Role of a Social Media Manager",
      "Client Onboarding & Contracts",
      "Finding Your Niche",
      "Pricing Strategies & Premium Rates",
      "Building Freelance Service Packages",
      "Social Media Audits & Competitor Analysis",
      "Content Calendars (Airtable, Trello, Google Sheets)",
      "Discovery Calls & Client Management",
    ],
    playlist: null as Lesson[] | null,
  },
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
  {
    id: "ai-fundamentals",
    title: "AI Fundamentals",
    description: "From machine learning & deep learning to LLMs, AI agents & generative AI — understand the full AI landscape.",
    longDescription:
      "A clear, structured introduction to modern AI. Starting from the AI family tree, this course walks you through machine learning, deep learning, and generative AI — then dives into how Large Language Models work, what AI agents are, and how agentic AI differs from generative AI. Perfect for anyone who wants to genuinely understand AI, not just use it.",
    thumbnail: "https://i.ytimg.com/vi/VGFpV3Qj4as/maxresdefault.jpg",
    videoId: "VGFpV3Qj4as",
    lessons: 9,
    level: "Beginner",
    tag: "New",
    duration: "1h 00m",
    students: 0,
    rating: 4.9,
    reviewCount: 0,
    instructor: "AI Explained",
    topics: [
      "The AI Family Tree",
      "Machine Learning",
      "Deep Learning",
      "Generative AI",
      "Traditional AI vs Generative AI",
      "Large Language Models (LLMs)",
      "AI Agents & Agentic AI",
      "AI Agent vs Agentic AI vs Generative AI",
    ],
    playlist: [
      { id: "VGFpV3Qj4as", title: "Introduction",                                    duration: "0:15",  startSeconds: 0    },
      { id: "VGFpV3Qj4as", title: "AI Family Tree",                                  duration: "2:46",  startSeconds: 16   },
      { id: "VGFpV3Qj4as", title: "Machine Learning",                                duration: "12:52", startSeconds: 182  },
      { id: "VGFpV3Qj4as", title: "Deep Learning",                                   duration: "18:23", startSeconds: 955  },
      { id: "VGFpV3Qj4as", title: "Generative AI",                                   duration: "2:31",  startSeconds: 2058 },
      { id: "VGFpV3Qj4as", title: "Traditional AI vs Generative AI",                 duration: "4:30",  startSeconds: 2210 },
      { id: "VGFpV3Qj4as", title: "Large Language Models (LLMs)",                    duration: "11:56", startSeconds: 2361 },
      { id: "VGFpV3Qj4as", title: "AI Agents and Agentic AI",                        duration: "11:55", startSeconds: 2646 },
      { id: "VGFpV3Qj4as", title: "AI Agent vs Agentic AI vs Generative AI",         duration: "rest",  startSeconds: 3362 },
    ] as Lesson[],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity for Beginners",
    description: "From hacking types & cryptography to Kali Linux, SQL injection & ethical hacking — a full cybersecurity foundation.",
    longDescription:
      "A comprehensive cybersecurity training covering everything a beginner needs to break into the field. You'll explore the history of cybersecurity, types of hackers, penetration testing, cryptography, network protocols, real-world attack techniques like phishing, SQL injection, cross-site scripting, and steganography — plus hands-on sessions in Kali Linux and a look at cybersecurity frameworks, certifications, and career paths.",
    thumbnail: "https://i.ytimg.com/vi/lpa8uy4DyMo/maxresdefault.jpg",
    videoId: "lpa8uy4DyMo",
    lessons: 50,
    level: "Beginner",
    tag: "Trending",
    duration: "10h 30m",
    students: 0,
    rating: 4.8,
    reviewCount: 0,
    instructor: "Simplilearn",
    topics: [
      "Requirement & History of Cybersecurity",
      "Types of Hackers & Skills Necessary",
      "Penetration Testing & Footprinting",
      "Internet History, OSI & TCP/IP Model",
      "Wireshark, DHCP & Network Fundamentals",
      "Cryptography & Digital Encryption Standard",
      "IDS, Phishing, Password Attacks & Packet Flooding",
      "Cybersecurity Frameworks & Career Paths",
      "Kali Linux Hands-On & Proxy Chains",
      "Cross-Site Scripting & SQL Injection",
      "Steganography & Ethical Hacking Tools",
    ],
    playlist: [
      { id: "lpa8uy4DyMo", title: "Introduction",                              duration: "5:35",  startSeconds: 0      },
      { id: "lpa8uy4DyMo", title: "Requirement of Cyber Security",             duration: "18:09", startSeconds: 335    },
      { id: "lpa8uy4DyMo", title: "History of Cybersecurity",                  duration: "11:13", startSeconds: 1424   },
      { id: "lpa8uy4DyMo", title: "Types of Hackers",                          duration: "8:00",  startSeconds: 2097   },
      { id: "lpa8uy4DyMo", title: "Skills Necessary",                          duration: "8:48",  startSeconds: 2577   },
      { id: "lpa8uy4DyMo", title: "What is Penetration Testing?",              duration: "9:37",  startSeconds: 3105   },
      { id: "lpa8uy4DyMo", title: "What is Footprinting?",                     duration: "12:18", startSeconds: 4282   },
      { id: "lpa8uy4DyMo", title: "Hands-On",                                  duration: "19:43", startSeconds: 5020   },
      { id: "lpa8uy4DyMo", title: "History of the Internet",                   duration: "8:48",  startSeconds: 6003   },
      { id: "lpa8uy4DyMo", title: "OSI and TCP/IP Model",                      duration: "8:48",  startSeconds: 6131   },
      { id: "lpa8uy4DyMo", title: "What is Wireshark?",                        duration: "8:00",  startSeconds: 6659   },
      { id: "lpa8uy4DyMo", title: "What is DHCP?",                             duration: "9:37",  startSeconds: 7139   },
      { id: "lpa8uy4DyMo", title: "Cryptography",                              duration: "2:24",  startSeconds: 7716   },
      { id: "lpa8uy4DyMo", title: "History of Cryptography",                   duration: "8:00",  startSeconds: 7860   },
      { id: "lpa8uy4DyMo", title: "Digital Encryption Standard",               duration: "35:13", startSeconds: 8340   },
      { id: "lpa8uy4DyMo", title: "Bitlocker",                                 duration: "13:37", startSeconds: 10453  },
      { id: "lpa8uy4DyMo", title: "What is IDS?",                              duration: "8:00",  startSeconds: 11270  },
      { id: "lpa8uy4DyMo", title: "What is Phishing?",                         duration: "4:48",  startSeconds: 11750  },
      { id: "lpa8uy4DyMo", title: "Password Attacks",                          duration: "3:12",  startSeconds: 12038  },
      { id: "lpa8uy4DyMo", title: "Packet Flooding",                           duration: "3:12",  startSeconds: 12230  },
      { id: "lpa8uy4DyMo", title: "What is a Drive-by-Download?",              duration: "6:24",  startSeconds: 12422  },
      { id: "lpa8uy4DyMo", title: "BluVector",                                 duration: "12:49", startSeconds: 12806  },
      { id: "lpa8uy4DyMo", title: "Cybersecurity Frameworks",                  duration: "16:09", startSeconds: 13575  },
      { id: "lpa8uy4DyMo", title: "Cybersecurity is an Evergreen Industry",    duration: "16:01", startSeconds: 14631  },
      { id: "lpa8uy4DyMo", title: "Why Become a Cybersecurity Engineer?",      duration: "4:00",  startSeconds: 15592  },
      { id: "lpa8uy4DyMo", title: "Who is a Cybersecurity Engineer?",          duration: "2:25",  startSeconds: 15832  },
      { id: "lpa8uy4DyMo", title: "Roles & Responsibilities",                  duration: "32:48", startSeconds: 15977  },
      { id: "lpa8uy4DyMo", title: "How to Choose the Right Certification?",    duration: "6:24",  startSeconds: 17945  },
      { id: "lpa8uy4DyMo", title: "Keylogger",                                 duration: "2:24",  startSeconds: 18329  },
      { id: "lpa8uy4DyMo", title: "SQL Vulnerability Assessment",              duration: "28:01", startSeconds: 18473  },
      { id: "lpa8uy4DyMo", title: "Top Cyber Attacks in History",              duration: "4:48",  startSeconds: 20154  },
      { id: "lpa8uy4DyMo", title: "Cybersecurity Challenges",                  duration: "5:36",  startSeconds: 20442  },
      { id: "lpa8uy4DyMo", title: "Types of Hacking",                          duration: "22:25", startSeconds: 20778  },
      { id: "lpa8uy4DyMo", title: "What is Kali Linux?",                       duration: "5:36",  startSeconds: 22123  },
      { id: "lpa8uy4DyMo", title: "Hands-On in Kali Linux",                    duration: "25:37", startSeconds: 22459  },
      { id: "lpa8uy4DyMo", title: "What is a Proxy Chain?",                    duration: "16:12", startSeconds: 23996  },
      { id: "lpa8uy4DyMo", title: "What is a MAC Address?",                    duration: "57:38", startSeconds: 24908  },
      { id: "lpa8uy4DyMo", title: "Cryptography (Deep Dive)",                  duration: "57:38", startSeconds: 30201  },
      { id: "lpa8uy4DyMo", title: "What is Cross-Site Scripting?",             duration: "2:24",  startSeconds: 33839  },
      { id: "lpa8uy4DyMo", title: "Types of Cross-Site Scripting",             duration: "9:37",  startSeconds: 33983  },
      { id: "lpa8uy4DyMo", title: "How to Use Cross-Site Scripting",           duration: "16:48", startSeconds: 34560  },
      { id: "lpa8uy4DyMo", title: "How to Prevent Cross-Site Scripting",       duration: "20:49", startSeconds: 35568  },
      { id: "lpa8uy4DyMo", title: "What is SQL Injection?",                    duration: "19:22", startSeconds: 37817  },
      { id: "lpa8uy4DyMo", title: "What is Steganography?",                    duration: "28:01", startSeconds: 38569  },
      { id: "lpa8uy4DyMo", title: "Steganography Tools",                       duration: "12:49", startSeconds: 36050  },
      { id: "lpa8uy4DyMo", title: "Ethical Hacking & Roles",                   duration: "4:48",  startSeconds: 36819  },
      { id: "lpa8uy4DyMo", title: "Ethical Hacking Tools",                     duration: "3:12",  startSeconds: 37107  },
      { id: "lpa8uy4DyMo", title: "Cybersecurity Interview Questions",         duration: "rest",  startSeconds: 37299  },
    ] as Lesson[],
  },
  {
    id: "capcut-video-editing",
    title: "CapCut PC Video Editing",
    description: "Full CapCut Desktop tutorial — trim, animate, keyframe, AI tools, captions & export like a pro.",
    longDescription:
      "A comprehensive CapCut Desktop tutorial that takes you through a real editing project from start to finish. You'll learn how to set up CapCut, trim and organise footage, work with B-roll, add transitions and animations, keyframe audio and video, use auto-generated captions, apply colour correction, explore CapCut's AI features, and export your final video in high quality — including designing thumbnails.",
    thumbnail: "https://i.ytimg.com/vi/EMDrgqepVhM/maxresdefault.jpg",
    videoId: "EMDrgqepVhM",
    lessons: 54,
    level: "Beginner",
    tag: "New",
    duration: "1h 03m",
    students: 0,
    rating: 4.9,
    reviewCount: 0,
    instructor: "Metics Media",
    topics: [
      "Signing Up, Downloading & Interface Overview",
      "Importing Footage & Timeline Basics",
      "Trimming, Splitting & Adjusting Clips",
      "B-Roll, Markers & Clip Organisation",
      "Transitions & Animations",
      "Audio Settings, Effects & Ducking",
      "Keyframing Audio & Video",
      "Auto-Generated Captions & Animated Text",
      "Colour Correction, Filters & Stickers",
      "CapCut AI Features & AI Image/Video Generation",
      "Exporting, Thumbnails & Vertical Video",
    ],
    playlist: [
      { id: "EMDrgqepVhM", title: "Intro",                                        duration: "1:09",  startSeconds: 0    },
      { id: "EMDrgqepVhM", title: "Signing Up & Downloading CapCut Desktop",      duration: "1:19",  startSeconds: 69   },
      { id: "EMDrgqepVhM", title: "Creating A Project",                           duration: "0:11",  startSeconds: 148  },
      { id: "EMDrgqepVhM", title: "Interface Overview & Layouts",                 duration: "1:32",  startSeconds: 159  },
      { id: "EMDrgqepVhM", title: "Importing Footage",                            duration: "0:35",  startSeconds: 251  },
      { id: "EMDrgqepVhM", title: "Adding Footage to Timeline",                   duration: "0:18",  startSeconds: 286  },
      { id: "EMDrgqepVhM", title: "Zooming In & Out of Timeline",                 duration: "1:17",  startSeconds: 304  },
      { id: "EMDrgqepVhM", title: "Playback & Project Settings",                  duration: "1:21",  startSeconds: 381  },
      { id: "EMDrgqepVhM", title: "Trimming Clips",                               duration: "1:16",  startSeconds: 462  },
      { id: "EMDrgqepVhM", title: "Transcript Video Editor",                      duration: "1:21",  startSeconds: 538  },
      { id: "EMDrgqepVhM", title: "Adjusting Video Framing",                      duration: "1:43",  startSeconds: 619  },
      { id: "EMDrgqepVhM", title: "Importing B-Roll",                             duration: "0:31",  startSeconds: 722  },
      { id: "EMDrgqepVhM", title: "Video Tracks",                                 duration: "0:52",  startSeconds: 753  },
      { id: "EMDrgqepVhM", title: "Organising B-Roll Footage",                    duration: "0:50",  startSeconds: 805  },
      { id: "EMDrgqepVhM", title: "Trimming Narration Footage",                   duration: "0:53",  startSeconds: 855  },
      { id: "EMDrgqepVhM", title: "Adding Markers to Timeline",                   duration: "1:08",  startSeconds: 908  },
      { id: "EMDrgqepVhM", title: "Organising B-Roll With Markers",               duration: "2:40",  startSeconds: 976  },
      { id: "EMDrgqepVhM", title: "Trimming Narration Clip Ending",               duration: "0:26",  startSeconds: 1136 },
      { id: "EMDrgqepVhM", title: "Adjusting Clip Timing",                        duration: "1:21",  startSeconds: 1162 },
      { id: "EMDrgqepVhM", title: "Adding Stock Footage",                         duration: "2:12",  startSeconds: 1243 },
      { id: "EMDrgqepVhM", title: "Importing Remaining Footage",                  duration: "0:47",  startSeconds: 1375 },
      { id: "EMDrgqepVhM", title: "Stabilising Video",                            duration: "1:02",  startSeconds: 1422 },
      { id: "EMDrgqepVhM", title: "Adjusting Video Speed",                        duration: "1:22",  startSeconds: 1484 },
      { id: "EMDrgqepVhM", title: "Transitions",                                  duration: "1:09",  startSeconds: 1566 },
      { id: "EMDrgqepVhM", title: "Animations",                                   duration: "2:00",  startSeconds: 1635 },
      { id: "EMDrgqepVhM", title: "Adding Remaining Footage to Timeline",         duration: "1:04",  startSeconds: 1755 },
      { id: "EMDrgqepVhM", title: "Editing With Waveforms",                       duration: "1:34",  startSeconds: 1819 },
      { id: "EMDrgqepVhM", title: "Audio Settings & Effects",                     duration: "2:07",  startSeconds: 1913 },
      { id: "EMDrgqepVhM", title: "Organising Timeline",                          duration: "0:40",  startSeconds: 2040 },
      { id: "EMDrgqepVhM", title: "Muting Audio",                                 duration: "1:06",  startSeconds: 2080 },
      { id: "EMDrgqepVhM", title: "Trimming Final Narration Footage",             duration: "1:34",  startSeconds: 2146 },
      { id: "EMDrgqepVhM", title: "Organising Final B-Roll Footage",              duration: "0:42",  startSeconds: 2240 },
      { id: "EMDrgqepVhM", title: "Stock Music & Sound Effects",                  duration: "2:40",  startSeconds: 2282 },
      { id: "EMDrgqepVhM", title: "Keyframing Audio",                             duration: "2:13",  startSeconds: 2462 },
      { id: "EMDrgqepVhM", title: "Audio Ducking",                                duration: "1:34",  startSeconds: 2575 },
      { id: "EMDrgqepVhM", title: "Keyframing Video",                             duration: "1:53",  startSeconds: 2669 },
      { id: "EMDrgqepVhM", title: "Auto-Generated Captions",                      duration: "2:40",  startSeconds: 2782 },
      { id: "EMDrgqepVhM", title: "Adding Text & Animations",                     duration: "1:31",  startSeconds: 2942 },
      { id: "EMDrgqepVhM", title: "Colour Correction & Filters",                  duration: "1:23",  startSeconds: 3033 },
      { id: "EMDrgqepVhM", title: "Stickers",                                     duration: "1:28",  startSeconds: 3156 },
      { id: "EMDrgqepVhM", title: "CapCut AI Features Showcase",                  duration: "2:57",  startSeconds: 3204 },
      { id: "EMDrgqepVhM", title: "Generating AI Images & Video",                 duration: "3:36",  startSeconds: 3381 },
      { id: "EMDrgqepVhM", title: "Transforming Horizontal to Vertical Video",    duration: "1:24",  startSeconds: 3597 },
      { id: "EMDrgqepVhM", title: "Export Settings",                              duration: "0:35",  startSeconds: 3681 },
      { id: "EMDrgqepVhM", title: "Designing Thumbnails / Covers",                duration: "1:03",  startSeconds: 3716 },
      { id: "EMDrgqepVhM", title: "Final Export",                                 duration: "rest",  startSeconds: 3779 },
    ] as Lesson[],
  },
  {
  id: "ai-full-course",
  title: "Artificial Intelligence Full Course 2025",
  description: "Deep learning, maths for ML, reinforcement learning, RNNs, LLMs, transformers & beginner AI projects.",
  longDescription:
    "A comprehensive AI bootcamp covering the full spectrum of modern artificial intelligence. Starting from AI fundamentals and deep learning, you'll work through the mathematics powering machine learning, explore the AI Engineer roadmap, and dive deep into reinforcement learning, recurrent neural networks, and neural network architecture. Then go hands-on: build LLM chatbots, create an AI clone, understand how transformers work, and finish with beginner-friendly AI projects you can add to your portfolio.",
  thumbnail: "https://i.ytimg.com/vi/LGCZ-Fhm48c/maxresdefault.jpg",
  videoId: "LGCZ-Fhm48c",
  lessons: 12,
  level: "Intermediate",
  tag: "New",
  duration: "10h 22m",
  students: 0,
  rating: 4.9,
  reviewCount: 0,
  instructor: "Simplilearn",
  topics: [
    "Introduction to Artificial Intelligence",
    "What is Deep Learning",
    "Mathematics for Machine Learning",
    "AI Engineer Roadmap 2025",
    "Reinforcement Learning (Full Deep Dive)",
    "Recurrent Neural Networks (RNN)",
    "Neural Network Tutorial",
    "Building LLM Chatbots — Full Demo",
    "How to Create an AI Clone",
    "Transformers in AI Explained",
    "AI Projects for Beginners",
  ],
  playlist: [
    { id: "LGCZ-Fhm48c", title: "Introduction to AI Full Course 2025",  duration: "3:00",    startSeconds: 0     },
    { id: "LGCZ-Fhm48c", title: "Introduction to AI",                   duration: "19:06",   startSeconds: 180   },
    { id: "LGCZ-Fhm48c", title: "What is Deep Learning",                duration: "44:53",   startSeconds: 1326  },
    { id: "LGCZ-Fhm48c", title: "Mathematics for Machine Learning",     duration: "1:50:24", startSeconds: 4019  },
    { id: "LGCZ-Fhm48c", title: "AI Engineer Roadmap",                  duration: "9:19",    startSeconds: 10643 },
    { id: "LGCZ-Fhm48c", title: "Reinforcement Learning",               duration: "3:17:57", startSeconds: 11202 },
    { id: "LGCZ-Fhm48c", title: "Recurrent Neural Networks (RNN)",      duration: "2:04:15", startSeconds: 23079 },
    { id: "LGCZ-Fhm48c", title: "Neural Network Tutorial",              duration: "53:08",   startSeconds: 30534 },
    { id: "LGCZ-Fhm48c", title: "Create LLM Chatbots — Full Demo",      duration: "41:55",   startSeconds: 33722 },
    { id: "LGCZ-Fhm48c", title: "How to Create an AI Clone",            duration: "10:53",   startSeconds: 36237 },
    { id: "LGCZ-Fhm48c", title: "Transformers in AI",                   duration: "7:18",    startSeconds: 36890 },
    { id: "LGCZ-Fhm48c", title: "AI Projects for Beginners",            duration: "rest",    startSeconds: 37328 },
  ] as Lesson[],
},
  {
    id: "graphic-design",
    title: "Graphic Design Full Course",
    description: "Master Canva, Photoshop, Illustrator & Figma — from design essentials to branding and packaging.",
    longDescription:
      "A complete, hands-on graphic design course covering everything from core design principles to professional tools. You'll learn design essentials, typography, and color theory before diving deep into Canva, Photoshop, Illustrator, and Figma — creating real projects like podcast covers, social media posts, YouTube thumbnails, brand identities, stationery, packaging, and landing pages.",
    thumbnail: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg",
    videoId: "e_dv7GBHka8",
    lessons: 26,
    level: "Beginner",
    tag: "New",
    duration: "7h 45m",
    students: 0,
    rating: 4.8,
    reviewCount: 0,
    instructor: "Bring Your Own Laptop",
    topics: [
      "Graphic Design Essentials (Parts 1–4)",
      "Design in Canva (Parts 1–3)",
      "Typography Essentials in Design",
      "Color Essentials in Design",
      "Design in Photoshop (Parts 1–3)",
      "Podcast Cover Design in Photoshop",
      "Social Media Post Design in Photoshop",
      "YouTube Thumbnail Design",
      "Design in Illustrator (Parts 1–3)",
      "Carousel & Banner Design in Illustrator",
      "Branding & Logo Design (Parts 1–2)",
      "Stationery Design for a Brand",
      "Packaging Design & Mockups",
      "Introduction to Figma & Landing Page Design",
    ],
    playlist: [
      { id: "e_dv7GBHka8", title: "Introduction",                          duration: "1:24",  startSeconds: 0      },
      { id: "e_dv7GBHka8", title: "Graphic Design Essentials Part 1",      duration: "14:00", startSeconds: 84     },
      { id: "e_dv7GBHka8", title: "Graphic Design Essentials Part 2",      duration: "12:01", startSeconds: 924    },
      { id: "e_dv7GBHka8", title: "Graphic Design Essentials Part 3",      duration: "4:32",  startSeconds: 1645   },
      { id: "e_dv7GBHka8", title: "Graphic Design Essentials Part 4",      duration: "11:56", startSeconds: 1917   },
      { id: "e_dv7GBHka8", title: "Design in Canva Part 1",                duration: "16:40", startSeconds: 2633   },
      { id: "e_dv7GBHka8", title: "Design in Canva Part 2",                duration: "4:08",  startSeconds: 3633   },
      { id: "e_dv7GBHka8", title: "Design in Canva Part 3",                duration: "4:33",  startSeconds: 3881   },
      { id: "e_dv7GBHka8", title: "Typography Essentials in Design",        duration: "13:51", startSeconds: 4154   },
      { id: "e_dv7GBHka8", title: "Color Essentials in Design",             duration: "8:55",  startSeconds: 4985   },
      { id: "e_dv7GBHka8", title: "Design in Photoshop Part 1",             duration: "5:25",  startSeconds: 5520   },
      { id: "e_dv7GBHka8", title: "Design in Photoshop Part 2",             duration: "7:38",  startSeconds: 5845   },
      { id: "e_dv7GBHka8", title: "Design in Photoshop Part 3",             duration: "4:45",  startSeconds: 6303   },
      { id: "e_dv7GBHka8", title: "Podcast Cover Design in Photoshop",      duration: "50:59", startSeconds: 6588   },
      { id: "e_dv7GBHka8", title: "Social Media Post Design in Photoshop",  duration: "26:21", startSeconds: 9647   },
      { id: "e_dv7GBHka8", title: "YouTube Thumbnail Design",               duration: "23:44", startSeconds: 11228  },
      { id: "e_dv7GBHka8", title: "Design in Illustrator Part 1",           duration: "9:18",  startSeconds: 12652  },
      { id: "e_dv7GBHka8", title: "Design in Illustrator Part 2",           duration: "12:07", startSeconds: 13210  },
      { id: "e_dv7GBHka8", title: "Design in Illustrator Part 3",           duration: "15:11", startSeconds: 13937  },
      { id: "e_dv7GBHka8", title: "Carousel Design in Illustrator",         duration: "23:35", startSeconds: 14848  },
      { id: "e_dv7GBHka8", title: "Banner Design in Illustrator",           duration: "44:41", startSeconds: 16263  },
      { id: "e_dv7GBHka8", title: "Branding and Logo Design Part 1",        duration: "30:26", startSeconds: 18944  },
      { id: "e_dv7GBHka8", title: "Branding and Logo Design Part 2",        duration: "32:38", startSeconds: 20770  },
      { id: "e_dv7GBHka8", title: "Stationery Design for a Brand",          duration: "32:25", startSeconds: 24728  },
      { id: "e_dv7GBHka8", title: "Packaging Design and Mockups",           duration: "41:23", startSeconds: 26673  },
      { id: "e_dv7GBHka8", title: "Introduction to Figma",                  duration: "3:49",  startSeconds: 29156  },
      { id: "e_dv7GBHka8", title: "Landing Page Design in Figma",           duration: "rest",  startSeconds: 29385  },
    ] as Lesson[],
  },
  // ── NEW: Forex Trading for Beginners ─────────────────────────────────────
  {
    id: "forex-trading",
    title: "Forex Trading for Beginners",
    description: "Currency pairs, leverage, MetaTrader 5, technical analysis & risk management — a complete starter guide.",
    longDescription:
      "A complete, no-fluff introduction to forex trading. Starting from what forex actually is, this course walks you through currency pairs, market liquidity, essential tools, and account setup — then dives into MetaTrader 5, bid/ask/spread, lot sizes, leverage, and margin. You'll learn risk management, technical analysis with TradingView, support & resistance, and how to place real trades with stop-loss and take-profit levels. Wraps up with trading psychology, journaling, common beginner mistakes, and the mindset required for long-term success.",
    thumbnail: "https://i.ytimg.com/vi/ZwL11tUfeXg/maxresdefault.jpg",
    videoId: "ZwL11tUfeXg",
    lessons: 24,
    level: "Beginner",
    tag: "New",
    duration: "50m",
    students: 0,
    rating: 4.8,
    reviewCount: 0,
    instructor: "Jeffrey",
    topics: [
      "What is Forex & Currency Pairs Explained",
      "Forex Market Liquidity and Trading Hours",
      "Essential Tools for Forex Trading",
      "Step-by-Step Account Setup",
      "Navigating MetaTrader 5",
      "Bid, Ask and Spread",
      "Lot Size and Its Impact on Profits",
      "Forex Leverage and Margin Explained",
      "Risk Management and Capital Protection",
      "Profitability: Winning Less but Earning More",
      "Using TradingView for Market Analysis",
      "Technical Analysis: Support and Resistance",
      "Setting Trade Entry, Stop Loss, Take Profit",
      "How to Place and Manage Trades on MetaTrader 5",
      "Trading Psychology and Emotional Control",
      "Trade Journaling and Common Mistakes",
    ],
    playlist: [
      { id: "ZwL11tUfeXg", title: "Introduction to Forex Trading 2026",          duration: "1:24",  startSeconds: 0     },
      { id: "ZwL11tUfeXg", title: "Jeffrey's Forex Journey and Success",          duration: "0:29",  startSeconds: 84    },
      { id: "ZwL11tUfeXg", title: "What is Forex and Currency Pairs",             duration: "2:13",  startSeconds: 113   },
      { id: "ZwL11tUfeXg", title: "Forex Market Liquidity and Trading Hours",     duration: "0:32",  startSeconds: 246   },
      { id: "ZwL11tUfeXg", title: "Essential Tools for Forex Trading",            duration: "2:08",  startSeconds: 278   },
      { id: "ZwL11tUfeXg", title: "Step-by-Step Account Setup",                   duration: "4:14",  startSeconds: 406   },
      { id: "ZwL11tUfeXg", title: "Navigating MetaTrader 5",                      duration: "1:41",  startSeconds: 660   },
      { id: "ZwL11tUfeXg", title: "Understanding Bid, Ask and Spread",            duration: "4:35",  startSeconds: 761   },
      { id: "ZwL11tUfeXg", title: "Lot Size and Its Impact on Profits",           duration: "3:47",  startSeconds: 1036  },
      { id: "ZwL11tUfeXg", title: "Forex Leverage and Margin Explained",          duration: "4:07",  startSeconds: 1263  },
      { id: "ZwL11tUfeXg", title: "Risk Management and Capital Protection",       duration: "0:58",  startSeconds: 1510  },
      { id: "ZwL11tUfeXg", title: "Profitability: Winning Less, Earning More",    duration: "1:15",  startSeconds: 1568  },
      { id: "ZwL11tUfeXg", title: "Strategy Importance and Execution Discipline", duration: "1:26",  startSeconds: 1643  },
      { id: "ZwL11tUfeXg", title: "Using TradingView for Market Analysis",        duration: "1:19",  startSeconds: 1729  },
      { id: "ZwL11tUfeXg", title: "Types of Market Analysis in Forex",            duration: "2:13",  startSeconds: 1808  },
      { id: "ZwL11tUfeXg", title: "Technical Analysis: Support and Resistance",   duration: "2:17",  startSeconds: 1941  },
      { id: "ZwL11tUfeXg", title: "Trader Types and Timeframes Overview",         duration: "3:00",  startSeconds: 2078  },
      { id: "ZwL11tUfeXg", title: "Setting Trade Entry, Stop Loss, Take Profit",  duration: "4:55",  startSeconds: 2258  },
      { id: "ZwL11tUfeXg", title: "How to Place and Manage Trades on MT5",        duration: "3:42",  startSeconds: 2493  },
      { id: "ZwL11tUfeXg", title: "Trading Psychology and Emotional Control",     duration: "0:56",  startSeconds: 2775  },
      { id: "ZwL11tUfeXg", title: "Journaling Trades to Improve Performance",     duration: "0:33",  startSeconds: 2831  },
      { id: "ZwL11tUfeXg", title: "Common Mistakes New Traders Make",             duration: "1:20",  startSeconds: 2864  },
      { id: "ZwL11tUfeXg", title: "The Real Trading Journey and Mindset",         duration: "0:53",  startSeconds: 2944  },
      { id: "ZwL11tUfeXg", title: "Patience, Discipline, and Long-Term Success",  duration: "rest",  startSeconds: 2997  },
    ] as Lesson[],
  },

  {
  id: "node-express",
  title: "Node.js & Express Backend Development",
  description: "Build a full REST API with Node.js, Express, MongoDB, authentication, and CRUD — from scratch.",
  longDescription:
    "A complete hands-on backend course that takes you from zero to a production-ready REST API. You'll set up Node.js and Express, connect MongoDB Atlas, structure your project professionally, and build real features: user registration, login with bcrypt password hashing, logout, and full CRUD APIs for posts — all tested in Postman. Covers HTTP methods, status codes, MVC architecture (Models, Routes, Controllers), environment variables, ES Modules, and Nodemon.",
  thumbnail: "https://i.ytimg.com/vi/KOutPbKc9UM/maxresdefault.jpg",
  videoId: "KOutPbKc9UM",
  lessons: 43,
  level: "Intermediate",
  tag: "New",
  duration: "2h 25m",
  students: 0,
  rating: 4.9,
  reviewCount: 0,
  instructor: "Full Stack Dev",
  topics: [
    "What is a Backend & How APIs Work",
    "Node.js Setup & Project Initialization",
    "MongoDB Atlas Database Setup",
    "Environment Variables & ES Modules",
    "Express App & Database Connection",
    "Models, Routes & Controllers (MVC)",
    "Register, Login & Logout with Auth",
    "Password Hashing with Bcrypt",
    "Full CRUD APIs (Create, Read, Update, Delete)",
    "HTTP Methods & Status Codes",
    "Testing APIs with Postman",
  ],
  playlist: [
    { id: "KOutPbKc9UM", title: "Introduction & Overview",                    duration: "1:44",  startSeconds: 0     },
    { id: "KOutPbKc9UM", title: "What is a Backend?",                         duration: "0:17",  startSeconds: 104   },
    { id: "KOutPbKc9UM", title: "Core Components: Languages, DBs, Runtimes",  duration: "2:35",  startSeconds: 121   },
    { id: "KOutPbKc9UM", title: "Backend Architecture Flowchart",             duration: "1:08",  startSeconds: 276   },
    { id: "KOutPbKc9UM", title: "How Frontend Connects to Backend (APIs)",    duration: "1:16",  startSeconds: 344   },
    { id: "KOutPbKc9UM", title: "Prerequisites & Installing Node.js",         duration: "1:50",  startSeconds: 420   },
    { id: "KOutPbKc9UM", title: "Project Folder Structure",                   duration: "0:40",  startSeconds: 530   },
    { id: "KOutPbKc9UM", title: "Project Initialization (Git & npm)",         duration: "3:26",  startSeconds: 570   },
    { id: "KOutPbKc9UM", title: "Setting up MongoDB Atlas Database",          duration: "2:49",  startSeconds: 776   },
    { id: "KOutPbKc9UM", title: "Environment Variables (.env)",               duration: "2:51",  startSeconds: 945   },
    { id: "KOutPbKc9UM", title: "Constants & ES Modules Setup",               duration: "1:54",  startSeconds: 1116  },
    { id: "KOutPbKc9UM", title: "Creating the Express App (app.js)",          duration: "4:45",  startSeconds: 1230  },
    { id: "KOutPbKc9UM", title: "Connecting Database to Server",              duration: "6:15",  startSeconds: 1515  },
    { id: "KOutPbKc9UM", title: "Server Entry Point (index.js)",              duration: "7:30",  startSeconds: 1890  },
    { id: "KOutPbKc9UM", title: "Setting up Nodemon & Running the Server",    duration: "5:00",  startSeconds: 2340  },
    { id: "KOutPbKc9UM", title: "Understanding Models & ER Diagrams",         duration: "2:26",  startSeconds: 2640  },
    { id: "KOutPbKc9UM", title: "Creating the User Model",                    duration: "7:14",  startSeconds: 2786  },
    { id: "KOutPbKc9UM", title: "Understanding Routes",                       duration: "1:20",  startSeconds: 3220  },
    { id: "KOutPbKc9UM", title: "Setting up User Routes",                     duration: "1:23",  startSeconds: 3300  },
    { id: "KOutPbKc9UM", title: "Understanding Controllers",                  duration: "1:00",  startSeconds: 3383  },
    { id: "KOutPbKc9UM", title: "Coding the Register Controller",             duration: "10:00", startSeconds: 3443  },
    { id: "KOutPbKc9UM", title: "The Journey of a Request",                   duration: "8:44",  startSeconds: 4028  },
    { id: "KOutPbKc9UM", title: "HTTP Methods & Status Codes Explained",      duration: "4:48",  startSeconds: 4548  },
    { id: "KOutPbKc9UM", title: "Introduction to Postman",                    duration: "1:24",  startSeconds: 4836  },
    { id: "KOutPbKc9UM", title: "Testing the Register API",                   duration: "3:53",  startSeconds: 4920  },
    { id: "KOutPbKc9UM", title: "Viewing Data in MongoDB Atlas",              duration: "1:21",  startSeconds: 5153  },
    { id: "KOutPbKc9UM", title: "Coding the Login Controller",                duration: "4:26",  startSeconds: 5234  },
    { id: "KOutPbKc9UM", title: "Hashing Passwords with Bcrypt",              duration: "5:00",  startSeconds: 5800  },
    { id: "KOutPbKc9UM", title: "Comparing Passwords for Login",              duration: "5:26",  startSeconds: 6160  },
    { id: "KOutPbKc9UM", title: "Testing the Login API",                      duration: "1:58",  startSeconds: 6526  },
    { id: "KOutPbKc9UM", title: "Coding the Logout Controller",               duration: "3:36",  startSeconds: 6644  },
    { id: "KOutPbKc9UM", title: "Testing the Logout API",                     duration: "1:34",  startSeconds: 6820  },
    { id: "KOutPbKc9UM", title: "Intro to CRUD APIs",                         duration: "0:10",  startSeconds: 6914  },
    { id: "KOutPbKc9UM", title: "Creating the Post Model",                    duration: "4:09",  startSeconds: 6924  },
    { id: "KOutPbKc9UM", title: "Create Post API (Controller & Route)",       duration: "1:00",  startSeconds: 7173  },
    { id: "KOutPbKc9UM", title: "Testing Create Post",                        duration: "3:17",  startSeconds: 7233  },
    { id: "KOutPbKc9UM", title: "Read All Posts API",                         duration: "2:45",  startSeconds: 7389  },
    { id: "KOutPbKc9UM", title: "Testing Get Posts",                          duration: "2:36",  startSeconds: 7554  },
    { id: "KOutPbKc9UM", title: "Update Post API",                            duration: "8:38",  startSeconds: 7710  },
    { id: "KOutPbKc9UM", title: "Testing Update Post",                        duration: "2:28",  startSeconds: 8228  },
    { id: "KOutPbKc9UM", title: "Delete Post API",                            duration: "4:11",  startSeconds: 8376  },
    { id: "KOutPbKc9UM", title: "Testing Delete Post",                        duration: "2:26",  startSeconds: 8627  },
    { id: "KOutPbKc9UM", title: "Final Commit & Conclusion",                  duration: "rest",  startSeconds: 8713  },
  ] as Lesson[],
},

];

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
  "ai-fundamentals": [
    { name: "Yemi A.", rating: 5, date: "Mar 2025", comment: "Finally a course that explains the difference between LLMs, agents, and generative AI clearly. Loved it." },
    { name: "Kofi B.", rating: 5, date: "Mar 2025", comment: "The AI family tree section set the foundation perfectly. Everything clicked after that." },
    { name: "Ngozi E.", rating: 5, date: "Mar 2025", comment: "Concise, accurate and genuinely insightful. The deep learning section is the clearest explanation I've seen." },
  ],
  "cybersecurity": [
    { name: "Chidi N.", rating: 5, date: "Mar 2025", comment: "Incredibly thorough. The Kali Linux hands-on and SQL injection sections are gold for anyone starting out." },
    { name: "Amara O.", rating: 5, date: "Mar 2025", comment: "Finally understand cryptography and how real attacks work. Best free cybersecurity course I've found." },
    { name: "Felix K.", rating: 4, date: "Feb 2025", comment: "10 hours well spent. The career path and certification guidance alone saved me months of research." },
  ],
  "capcut-video-editing": [
    { name: "Emeka J.", rating: 5, date: "Mar 2025", comment: "Best CapCut tutorial I've found. The keyframing and audio ducking sections alone are worth it." },
    { name: "Sola F.", rating: 5, date: "Mar 2025", comment: "Loved how it follows a real project end to end. The AI features section blew my mind." },
    { name: "Tunde A.", rating: 4, date: "Feb 2025", comment: "Very thorough. Went from zero editing knowledge to exporting a polished video in one sitting." },
  ],
  "graphic-design": [
    { name: "Temi A.", rating: 5, date: "Mar 2025", comment: "Went from zero to designing real brand identities. The Photoshop and Illustrator sections are gold." },
    { name: "Jade O.", rating: 5, date: "Mar 2025", comment: "The branding and packaging modules are incredibly detailed. Best design course I've found." },
    { name: "Kwame B.", rating: 4, date: "Feb 2025", comment: "Super practical — I landed my first freelance client using the skills from this course." },
  ],
  "forex-trading": [
    { name: "Chukwudi A.", rating: 5, date: "Apr 2025", comment: "Finally understand how lots and leverage actually work. The MT5 walkthrough is gold." },
    { name: "Fatima B.", rating: 5, date: "Apr 2025", comment: "No fluff — straight to the point. The risk management and psychology sections hit different." },
    { name: "Emeka O.", rating: 4, date: "Apr 2025", comment: "Great starter course. The TradingView + support/resistance section gave me a solid foundation." },
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
  "ai-full-course": [
  { name: "Emeka A.", rating: 5, date: "Apr 2025", comment: "The reinforcement learning and RNN sections are incredibly thorough. Best free AI course available." },
  { name: "Ngozi B.", rating: 5, date: "Apr 2025", comment: "The maths for ML section finally made gradient descent click for me. The LLM chatbot demo is a bonus." },
  { name: "Kofi D.", rating: 4, date: "Apr 2025", comment: "10+ hours of quality content — the transformers and AI clone sections alone are worth it." },
],
  "node-express": [
  { name: "Chidi O.", rating: 5, date: "Apr 2025", comment: "The MVC breakdown finally made controllers and routes click for me. Best backend intro I've found." },
  { name: "Amara K.", rating: 5, date: "Apr 2025", comment: "Loved how everything was tested in Postman step by step. The bcrypt section is gold." },
  { name: "Tunde F.", rating: 4, date: "Apr 2025", comment: "Went from knowing zero Node.js to building a full auth API in one sitting. Very well paced." },
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
        <Star
          key={s}
          className={`${sz} ${s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-slate-300 fill-slate-300"}`}
        />
      ))}
    </div>
  );
}

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
        <img
          src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
          alt={title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        <button
          onClick={() => setPlaying(true)}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 group"
          aria-label="Play preview"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 flex items-center justify-center shadow-2xl group-hover:scale-110 group-active:scale-95 transition-transform duration-200 ring-4 ring-white/30">
            <Play className="w-7 h-7 sm:w-9 sm:h-9 text-blue-600 fill-current ml-1" />
          </div>
          <span className="text-white text-xs sm:text-sm font-semibold bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full">
            Watch Preview
          </span>
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
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}

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
        <p className="font-bold text-slate-800 dark:text-slate-200">Thanks for your review!</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Your feedback helps others decide.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Leave a Review</p>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onMouseEnter={() => setHoverRating(s)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(s)}
          >
            <Star
              className={`w-7 h-7 transition-colors ${
                s <= (hoverRating || rating) ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600 fill-slate-300 dark:fill-slate-600"
              }`}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
          </span>
        )}
      </div>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
      />
      <textarea
        placeholder="Share your experience with this course..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none"
      />
      <button
        onClick={handleSubmit}
        disabled={!name.trim() || !rating || !comment.trim()}
        className="flex items-center gap-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 dark:disabled:text-slate-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-95"
      >
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
  onGetCertificate?: (course: (typeof ALL_COURSES)[0]) => void;
  onReviewSubmit: (courseId: string, review: { name: string; rating: number; comment: string }) => void;
  backLabel?: string;
  autoPlayVideo?: boolean;
}

export function CourseDetail({
  course,
  status,
  reviews,
  onBack,
  onStart,
  onGetCertificate,
  onReviewSubmit,
  backLabel = "Back to Explore",
  autoPlayVideo = false,
}: CourseDetailProps) {
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const activeVideoId = activeLesson?.id ?? course.videoId;
  const activeVideoTitle = activeLesson?.title ?? course.title;
  const activeStartSeconds = activeLesson?.startSeconds ?? 0;

  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const isActive = status === "active";
  const avgRating = reviews.length
    ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
    : course.rating;
  const hasPlaylist = course.playlist && course.playlist.length > 0;

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleLessonClick = (lesson: Lesson) => {
    setActiveLesson(lesson);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-300 hover:text-white text-sm font-semibold mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {backLabel}
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
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
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> {course.students.toLocaleString()} students
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {course.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> {course.lessons} lessons
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> {course.level}
                </span>
              </div>
              <p className="text-slate-400 text-xs">
                Instructor: <span className="text-white font-semibold">{course.instructor}</span>
              </p>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
                <VideoPlayer
                  videoId={activeVideoId}
                  title={activeVideoTitle}
                  autoPlay={autoPlayVideo || !!activeLesson}
                  startSeconds={activeStartSeconds}
                />
                {activeLesson && (
                  <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate">
                      Now playing: {activeVideoTitle}
                    </p>
                  </div>
                )}
                <div className="p-5 space-y-3">
                  {isLocked ? (
                    <>
                      <button
                        disabled
                        className="w-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                      >
                        <Lock className="w-4 h-4" /> Locked
                      </button>
                      <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                        Finish your active track to unlock this course.
                      </p>
                    </>
                  ) : isCompleted ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => onStart(course.id)}
                        className="w-full bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Review Course
                      </button>
                      <button
                        onClick={() => onGetCertificate?.(course)}
                        className="w-full bg-gradient-to-r from-amber-400 to-amber-500 dark:from-amber-600 dark:to-amber-700 hover:from-amber-300 hover:to-amber-400 dark:hover:from-amber-700 dark:hover:to-amber-800 text-slate-900 dark:text-slate-100 font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-amber-400/25 dark:shadow-amber-900/40"
                      >
                        <Award className="w-4 h-4" /> Get My Certificate
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onStart(course.id)}
                      className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      {isActive ? "Continue Learning" : "Start Course — It's Free"}
                    </button>
                  )}
                  <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 dark:text-slate-400 justify-center">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Full lifetime access
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Certificate of completion
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">What you'll learn</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {course.topics.map((t, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700 dark:text-slate-300">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <button
            onClick={() => setTopicsOpen((p) => !p)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div className="text-left">
                <p className="font-black text-slate-900 dark:text-slate-100 text-sm sm:text-base">Course Content</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {course.lessons} lessons · {course.duration} total
                </p>
              </div>
            </div>
            {topicsOpen ? (
              <ChevronUp className="w-5 h-5 text-slate-400 dark:text-slate-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400 dark:text-slate-600" />
            )}
          </button>
          {topicsOpen && (
            <div className="border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
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
                          ${isLocked ? "cursor-not-allowed opacity-50" : "hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer"}
                          ${isThisActive ? "bg-blue-50 dark:bg-blue-950/30 border-l-2 border-blue-500" : ""}`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black
                          ${isThisActive ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}
                        >
                          {isThisActive ? <Play className="w-3 h-3 fill-current" /> : i + 1}
                        </div>
                        <span
                          className={`text-sm flex-1 font-medium ${
                            isThisActive ? "text-blue-700 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {lesson.title}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium tabular-nums flex-shrink-0">
                          {lesson.duration}
                        </span>
                      </button>
                    );
                  })
                : course.topics.map((t, i) => (
                    <div key={i} className="flex items-center gap-4 px-6 py-3">
                      <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                        <Play className="w-3 h-3 text-slate-500 dark:text-slate-400 fill-current" />
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{t}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium tabular-nums">
                        {String(Math.floor((i * 37 + 12) % 45) + 5)}:
                        {String(Math.floor((i * 13 + 7) % 59)).padStart(2, "0")}
                      </span>
                    </div>
                  ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">Student Reviews</h2>
            <div className="flex items-center gap-2">
              <StarRating rating={avgRating} size="sm" />
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{avgRating.toFixed(1)}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reviews.map((r, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-black text-xs">
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{r.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">{r.date}</p>
                    </div>
                  </div>
                  <StarRating rating={r.rating} size="sm" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
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
  const [extraReviews, setExtraReviews] = useState<
    Record<string, { name: string; rating: number; date: string; comment: string }[]>
  >({});
  const [quizCourse, setQuizCourse] = useState<(typeof ALL_COURSES)[0] | null>(null);
  const [certCourse, setCertCourse] = useState<(typeof ALL_COURSES)[0] | null>(null);

  const getStatus = (id: string): "completed" | "active" | "locked" | "available" => {
    if (completedCourseIds.includes(id)) return "completed";
    if (id === activeCourseId) return "active";
    if (activeCourseId && !completedCourseIds.includes(activeCourseId) && id !== activeCourseId)
      return "locked";
    return "available";
  };

  const handleCardClick = (id: string) => {
    setAutoPlayOnOpen(false);
    setSelectedCourseId(id);
  };
  const handleStartFromGrid = (courseId: string) => {
    if (getStatus(courseId) === "locked") return;
    setAutoPlayOnOpen(true);
    setSelectedCourseId(courseId);
  };
  const handleStartFromDetail = (courseId: string) => {
    if (getStatus(courseId) === "locked") return;
    if (onCourseSelect) onCourseSelect(courseId);
    setSelectedCourseId(null);
    if (onNavigate) onNavigate("home");
  };
  const handleReviewSubmit = (
    courseId: string,
    review: { name: string; rating: number; comment: string }
  ) => {
    setExtraReviews((prev) => ({
      ...prev,
      [courseId]: [{ ...review, date: "Just now" }, ...(prev[courseId] || [])],
    }));
  };

  // ── Detail view ────────────────────────────────────────────────────────
  if (selectedCourseId) {
    const course = ALL_COURSES.find((c) => c.id === selectedCourseId)!;
    const baseReviews = COURSE_REVIEWS[selectedCourseId] || [];
    const userReviews = extraReviews[selectedCourseId] || [];
    return (
      <>
        <CourseDetail
          course={course}
          status={getStatus(selectedCourseId)}
          reviews={[...userReviews, ...baseReviews]}
          onBack={() => setSelectedCourseId(null)}
          onStart={handleStartFromDetail}
          onGetCertificate={(c) => {
            if (hasPassedQuiz(c.id)) {
              setCertCourse(c);
            } else {
              setQuizCourse(c);
            }
          }}
          onReviewSubmit={handleReviewSubmit}
          backLabel="Back to Explore"
          autoPlayVideo={autoPlayOnOpen}
        />

        <CourseQuiz
          isOpen={!!quizCourse}
          courseId={quizCourse?.id ?? ""}
          courseTitle={quizCourse?.title ?? ""}
          onClose={() => setQuizCourse(null)}
          onPassed={() => {
            setCertCourse(quizCourse);
            setQuizCourse(null);
          }}
        />

        <CertificateModal
          isOpen={!!certCourse}
          onClose={() => setCertCourse(null)}
          courseTitle={certCourse?.title ?? ""}
          instructor={certCourse?.instructor ?? ""}
        />
      </>
    );
  }

  // ── Grid view ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <div className="max-w-5xl mx-auto mb-4 sm:mb-6 md:mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-2xl lg:text-4xl font-black text-black dark:text-white leading-tight">
            Explore Tracks
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
            {activeCourseId && !completedCourseIds.includes(activeCourseId)
              ? "Finish your active course to unlock other tracks."
              : "Pick one track to start — complete it before unlocking the next."}
          </p>
        </div>
      </div>

      {activeCourseId &&
        !completedCourseIds.includes(activeCourseId) &&
        (() => {
          const active = ALL_COURSES.find((c) => c.id === activeCourseId);
          return active ? (
            <div className="max-w-7xl mx-auto mb-5 sm:mb-6">
              <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl px-4 py-3">
                <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-400 font-semibold">
                  You're currently on <span className="font-black">{active.title}</span>. Complete
                  it to unlock other tracks.
                </p>
                <button
                  onClick={() => handleCardClick(activeCourseId)}
                  className="ml-auto flex-shrink-0 flex items-center gap-1 bg-blue-600 dark:bg-blue-700 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
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
            const progress = isCompleted ? 100 : progressMap[c.id]?.progressPct ?? 0;

            return (
              <div
                key={c.id}
                onClick={() => handleCardClick(c.id)}
                className={`group bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border shadow-sm transition-all overflow-hidden flex flex-col cursor-pointer
                  ${
                    isLocked
                      ? "border-slate-300 dark:border-slate-700 opacity-60"
                      : isCompleted
                      ? "border-emerald-300 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-xl dark:hover:shadow-emerald-950/30"
                      : isActive
                      ? "border-blue-400 dark:border-blue-600 hover:shadow-xl dark:hover:shadow-blue-950/40 ring-2 ring-blue-400 dark:ring-blue-700 ring-offset-1"
                      : "border-slate-300 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600 hover:shadow-xl dark:hover:shadow-slate-950/40"
                  }`}
              >
                <div className="relative overflow-hidden">
                  <div className="aspect-video">
                    <img
                      src={c.thumbnail}
                      alt={c.title}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        !isLocked ? "group-hover:scale-105" : ""
                      }`}
                    />
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
                      <span className="text-white text-[10px] font-bold text-center px-2">
                        Finish active track first
                      </span>
                    </div>
                  )}
                  {isCompleted && (
                    <div className="absolute inset-0 bg-emerald-900/20 flex items-center justify-center">
                      <div className="bg-white rounded-full p-1.5 shadow-lg">
                        <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                      </div>
                    </div>
                  )}
                  {isActive && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded-full flex items-center gap-1 shadow">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
                      In Progress
                    </div>
                  )}
                  {c.tag && !isLocked && !isCompleted && !isActive && (
                    <div className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-[9px] font-black uppercase px-2 py-1 rounded-full shadow flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      {c.tag}
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg shadow-md dark:shadow-slate-900">
                    <div
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                        isCompleted ? "bg-emerald-500" : isActive ? "bg-blue-500" : "bg-slate-300"
                      }`}
                    />
                    <span className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">{progress}%</span>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg flex items-center gap-1">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                    <span className="text-[10px] sm:text-xs font-semibold text-white">
                      {c.lessons} lessons
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex flex-col flex-1 space-y-3">
                  <div className="space-y-1.5">
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        LEVEL_COLORS[c.level] || "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {c.level}
                    </span>
                    <h3 className="font-black text-sm sm:text-base text-slate-800 dark:text-slate-50 line-clamp-1">
                      {c.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <StarRating rating={c.rating} size="sm" />
                      <span className="text-[10px] font-bold text-amber-500 dark:text-amber-400">{c.rating}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">({c.reviewCount.toLocaleString()})</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] sm:text-xs">
                      <span className="text-slate-600 dark:text-slate-400 font-semibold">
                        {isCompleted ? "Completed" : isActive ? "In progress" : "Not started"}
                      </span>
                      <span className="text-slate-500 dark:text-slate-500 font-bold">{progress}% complete</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted ? "bg-emerald-500 dark:bg-emerald-600" : isActive ? "bg-blue-500 dark:bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-auto pt-1 space-y-1.5">
                    {isLocked ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(c.id);
                        }}
                        className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" /> Preview Course
                      </button>
                    ) : isCompleted ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartFromGrid(c.id);
                          }}
                          className="w-full bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 font-semibold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Review Course
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (hasPassedQuiz(c.id)) {
                              setCertCourse(c);
                            } else {
                              setQuizCourse(c);
                            }
                          }}
                          className="w-full bg-gradient-to-r from-amber-400 dark:from-amber-600 to-amber-500 dark:to-amber-700 hover:from-amber-300 dark:hover:from-amber-700 hover:to-amber-400 dark:hover:to-amber-800 text-slate-900 dark:text-slate-100 font-black py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-sm shadow-amber-400/25 dark:shadow-amber-900/40"
                        >
                          <Award className="w-3.5 h-3.5" /> Get Certificate
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartFromGrid(c.id);
                        }}
                        className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 text-xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        {isActive ? "Continue" : "Get Started"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quiz modal — grid-level "Get Certificate" buttons */}
      <CourseQuiz
        isOpen={!!quizCourse}
        courseId={quizCourse?.id ?? ""}
        courseTitle={quizCourse?.title ?? ""}
        onClose={() => setQuizCourse(null)}
        onPassed={() => {
          setCertCourse(quizCourse);
          setQuizCourse(null);
        }}
      />

      {/* Certificate modal — only opens after quiz pass */}
      <CertificateModal
        isOpen={!!certCourse}
        onClose={() => setCertCourse(null)}
        courseTitle={certCourse?.title ?? ""}
        instructor={certCourse?.instructor ?? ""}
      />
    </div>
  );
};

export { VideoPlayer };
export default ExploreTab;