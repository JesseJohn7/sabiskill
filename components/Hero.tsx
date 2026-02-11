"use client";

import React, { useState, useEffect } from "react";

const Hero: React.FC = () => {
  const words = ["Learn","Sabi","Koyi", "Kọ ẹkọ", "ịmụta"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center pt-[70px] md:pt-[70px]">
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center gap-6 px-6 py-4 md:py-20">
        <h1 
          className="font-extrabold text-[2.8rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] leading-[1.08] text-white/95 tracking-tight"
          style={{ opacity: 1, transform: "none" }}
        >
          Come{" "}
          <span 
            className="inline-block relative overflow-hidden align-bottom text-left"
            style={{ width: "auto", transition: "width 0.3s" }}
          >
            <span className="invisible absolute left-0 top-0 whitespace-nowrap">
              {words[currentWordIndex]}
            </span>
            <span 
              className="block text-left"
              style={{ 
                opacity: isAnimating ? 0 : 1, 
                transform: isAnimating ? "translateY(-20px)" : "none",
                transition: "opacity 0.3s, transform 0.3s"
              }}
            >
              {words[currentWordIndex]}
            </span>
          </span>
          <br />
          <span className="text-blue-400/90">for free, no wahala.</span>
        </h1>

        <p 
          className="max-w-2xl text-[0.95rem] md:text-[1.05rem] leading-[1.7] text-white/70"
          style={{ opacity: 1, transform: "none" }}
        >
          Nigeria's free learning platform built for you. Access quality courses, 
          learn new skills, and grow your career. No subscription fees, no hidden costs, just pure knowledge.
        </p>

        <div 
          className="flex flex-col sm:flex-row items-center gap-3 mt-4"
          style={{ opacity: 1, transform: "none" }}
        >
          <button className="w-full font-medium text-base md:text-[16px] whitespace-nowrap leading-[22px] rounded-full px-8 py-4 md:px-[40px] md:py-[15px] text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 active:scale-[0.97] cursor-pointer min-w-48 md:min-w-40">Start Learning</button> 

          {/* <button className="w-full sm:w-auto font-medium text-base md:text-[16px] whitespace-nowrap leading-[21.94px] rounded-full px-6 py-3 md:px-[40px] md:py-[15px] text-white bg-[#282c38]/50 hover:bg-white/10 transition-all duration-300 active:scale-[0.97] cursor-pointer min-w-[10rem]">
            Browse Courses
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Hero;