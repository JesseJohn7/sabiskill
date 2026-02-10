"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll effect: add shadow/blur when scrolling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "backdrop-blur-md border-b border-gray-800" : ""
        }`}
    >
      <div className="flex items-center justify-between h-[70px] px-6 md:px-16 lg:px-24 xl:px-32">
        {/* Logo */}
        <Link href="#" className="text-2xl font-bold text-white-500">
          Sabi<span className="text-blue-600">skill</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-10 text-gray-300 font-medium">
          <li><Link href="#home" className="hover:text-blue-500 transition">Home</Link></li>
          <li><Link href="#features" className="hover:text-blue-500 transition">Features</Link></li>
          <li><Link href="#how-it-works" className="hover:text-blue-500 transition">How it Works</Link></li>
          <li><Link href="#testimonials" className="hover:text-blue-500 transition">Testimonials</Link></li>
          <li><Link href="#faqs" className="hover:text-blue-500 transition">FAQs</Link></li>
        </ul>

        {/* Right Side */}
        <div className="hidden md:flex items-center">
          <button
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-blue-700 transition cursor-pointer"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          aria-label="menu"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col justify-center items-center gap-1 transition-all active:scale-90"
        >
          <span
            className={`h-[2px] w-6 bg-green-500 rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[5px]" : ""}`}
          />
          <span
            className={`h-[2px] w-6 bg-green-500 rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`h-[2px] w-6 bg-green-500 rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[5px]" : ""}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden flex flex-col items-center gap-5 text-gray-300 font-medium overflow-hidden transition-all duration-500 ease-in-out ${menuOpen ? "max-h-[400px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-5"
          }`}
      >
        <Link href="#home" className="hover:text-green-500 transition mt-4">Home</Link>
        <Link href="#features" className="hover:text-green-500 transition">Features</Link>
        <Link href="#how-it-works" className="hover:text-green-500 transition">How it Works</Link>
        <Link href="#testimonials" className="hover:text-green-500 transition">Testimonials</Link>
        <Link href="#faqs" className="hover:text-green-500 transition">FAQs</Link>

        <button
          onClick={() => setMenuOpen(false)}
          className="bg-green-600 text-white font-semibold px-6 py-2 rounded-full mb-4 hover:bg-green-700 transition"
        >
          Join Waitlist
        </button>
      </div>
    </nav>
  );
};

export default Navbar;