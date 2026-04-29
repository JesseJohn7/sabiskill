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
            <p className="text-sm text-gray-400 mb-4">
              Learn smarter, not harder. Free learning paths for every dreamer in
              Nigeria and beyond.
            </p>

            {/* Product Hunt Badge */}
            <a
              href="https://www.producthunt.com/products/sabiskill?utm_source=other&utm_medium=social"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition-all duration-200 group"
            >
              {/* PH Logo */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <circle cx="20" cy="20" r="20" fill="#FF6154" />
                <path
                  d="M22.5 13.5H16V26H19V22.5H22.5C24.985 22.5 27 20.485 27 18C27 15.515 24.985 13.5 22.5 13.5ZM22.5 20H19V16.5H22.5C23.605 16.5 24.5 17.395 24.5 18.5C24.5 19.605 23.605 20.5 22.5 20.5V20Z"
                  fill="white"
                />
              </svg>

              <span className="text-gray-300 group-hover:text-white transition-colors">
                Find us on Product Hunt
              </span>

              {/* Upvote chip */}
              <span className="flex items-center gap-1 bg-black text-gray-400 group-hover:text-gray-300 rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide border border-gray-700 transition-colors">
                ▲ Upvote
              </span>
            </a>
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