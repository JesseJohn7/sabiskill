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

  // Prevent scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "backdrop-blur-md border-b border-blue-900/30" : ""
        }`}
      >
        <div className="flex items-center justify-between h-[70px] px-6 md:px-16 lg:px-24 xl:px-32">
          {/* Logo */}
          <Link href="#" className="text-2xl font-bold text-white z-50">
            Sabi<span className="text-blue-500">skill</span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-10 text-gray-300 font-medium">
            <li><Link href="#home" className="hover:text-blue-400 transition">Home</Link></li>
            <li><Link href="#features" className="hover:text-blue-400 transition">Features</Link></li>
            <li><Link href="#how-it-works" className="hover:text-blue-400 transition">How it Works</Link></li>
            <li><Link href="#testimonials" className="hover:text-blue-400 transition">Testimonials</Link></li>
            <li><Link href="#faqs" className="hover:text-blue-400 transition">FAQs</Link></li>
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
            className="md:hidden flex flex-col justify-center items-center gap-1 transition-all active:scale-90 z-50"
          >
            <span
              className={`h-[2px] w-6 bg-blue-500 rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[5px]" : ""}`}
            />
            <span
              className={`h-[2px] w-6 bg-blue-500 rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`h-[2px] w-6 bg-blue-500 rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[5px]" : ""}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Full Screen Menu */}
      <div
        className={`fixed inset-0 bg-black z-40 md:hidden transition-all duration-500 ease-in-out ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col justify-center items-start h-full px-8 gap-6">
          <Link 
            href="#home" 
            className="text-2xl text-gray-300 hover:text-blue-300 transition"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="#features" 
            className="text-2xl text-gray-300 hover:text-blue-300 transition"
            onClick={() => setMenuOpen(false)}
          >
            Features
          </Link>
          <Link 
            href="#how-it-works" 
            className="text-2xl text-gray-300 hover:text-blue-300 transition"
            onClick={() => setMenuOpen(false)}
          >
            How it Works
          </Link>
          <Link 
            href="#testimonials" 
            className="text-2xl text-gray-300 hover:text-blue-300 transition"
            onClick={() => setMenuOpen(false)}
          >
            Testimonials
          </Link>
          <Link 
            href="#faqs" 
            className="text-2xl text-gray-300 hover:text-blue-300 transition"
            onClick={() => setMenuOpen(false)}
          >
            FAQs
          </Link>

          <button
            onClick={() => setMenuOpen(false)}
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-blue-700 transition cursor-pointer mt-8"
          >
            Get Started
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;