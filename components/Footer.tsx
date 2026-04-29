"use client";

import React from "react";
import { Twitter, Github } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-gray-800 py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 text-center md:text-left">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Sabi Skill</h3>
            <p className="text-sm text-gray-400">
              Learn smarter, not harder. Free learning paths for every dreamer in
              Nigeria and beyond.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 tracking-wide">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#features" className="hover:text-blue-400 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-blue-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-blue-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 tracking-wide">
              CONNECT
            </h4>
            <div className="flex justify-center md:justify-start gap-4">
              <a
                href="https://x.com/Jesse_can_code"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/JesseJohn7"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Product Hunt Badge */}
        <div className="flex justify-center mb-6">
          <a
            href="https://www.producthunt.com/products/sabiskill?utm_source=other&utm_medium=social"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#FF6154] hover:bg-[#e8503f] text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,97,84,0.4)] group"
          >
            {/* PH Logo */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <circle cx="20" cy="20" r="20" fill="white" fillOpacity="0.2" />
              <path
                d="M22.5 14H16V26H19V22.5H22.5C24.985 22.5 27 20.485 27 18C27 15.515 24.985 13.5 22.5 13.5V14ZM22.5 20H19V16.5H22.5C23.605 16.5 24.5 17.395 24.5 18.5C24.5 19.605 23.605 20.5 22.5 20.5V20Z"
                fill="white"
              />
            </svg>
            <span>Find us on Product Hunt</span>
            {/* upvote arrow */}
            <span className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5 text-xs font-bold">
              ▲ Upvote
            </span>
          </a>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Sabi Skill. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;