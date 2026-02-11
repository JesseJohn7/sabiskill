"use client";

import React, { useState } from "react";

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState(-1);

  const faqs = [
    {
      question: "Is this platform really free?",
      answer:
        "Yes, 100% free! No subscription fees, no hidden costs, no payment required. All courses, resources, and the roadmap are completely free to access. We believe quality education should be accessible to everyone.",
    },
    {
      question: "Who can use this learning platform?",
      answer:
        "Anyone in Nigeria (and beyond) who wants to learn new skills! Whether you're a student, professional looking to upskill, career changer, or just curious to learn something new this platform is built for you.",
    },
    {
      question: "What kind of courses are available?",
      answer:
        "We offer quality courses across various fields including Web Development, AI Prompting , UI Design,Web3 Development,Marketing and Many more. Each course is designed to help you build practical skills that you can apply immediately in your career or personal projects.",
    },
    {
      question: "What is the roadmap feature?",
      answer:
        "The roadmap is your personalized learning journey guide. It helps you navigate through courses in a structured way, showing you the best path to achieve your learning goals. Think of it as your GPS for skill development.",
    },
    {
      question: "Do I need any special requirements to start?",
      answer:
        "No wahala! Just an internet connection and the desire to learn. No prior experience needed for beginner courses. You can start learning immediately without any downloads or installations.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="bg-black flex items-center justify-center py-12 md:py-20 px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8 md:mb-12">
          <p className="text-xs md:text-sm font-medium tracking-wider text-blue-400 mb-2">
            FAQ'S
          </p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium text-white">
            Everything you need to know
          </h1>
        </div>

        <div className="space-y-3 md:space-y-4">
          {faqs.map((faq, index) => (
            <div key={index}>
              <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-3 md:p-4 text-left hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <span className="text-sm md:text-base text-gray-200 pr-3 md:pr-4 font-medium">
                    {faq.question}
                  </span>
                  <span className="shrink-0">
                    {openIndex === index ? (
                      <div className="size-6 md:size-7 rounded-full bg-white/10 flex items-center justify-center">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="md:w-6 md:h-6"
                        >
                          <path
                            d="m8.348 8.348 6.874 6.874m.001-6.874-6.875 6.874"
                            stroke="#fff"
                            strokeOpacity=".6"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="size-6 md:size-7 rounded-full bg-white/10 flex items-center justify-center">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 17 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="md:w-[17px] md:h-[17px]"
                        >
                          <path
                            d="M3.472 8.332h9.722M8.333 3.473v9.722"
                            stroke="#fff"
                            strokeOpacity=".6"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </span>
                </button>
              </div>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index
                    ? "max-h-60 md:max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-4 md:px-5 py-3 md:py-4">
                  <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;