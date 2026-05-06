"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Mykhailo Sorochuk",
    username: "@sir4K_zen",
    avatar: "/avatar1.jpg",
    comment: "Nice ship, Jesse.",
  },
  {
    name: "Musa",
    username: "@moseskwagga",
    avatar: "/avatar2.jpg",
    comment:
      "And I thought I was the greatest developer in the north east, now someone has taken my name and my title. Site loaded so fast before I could even open in browser. Great job.",
  },
  {
    name: "IfeOluwa Olajubaje",
    username: "@emanncodedev",
    avatar: "/avatar3.jpg",
    comment: "This is just top notch brooo.",
  },
  {
    name: "Felix Hongo",
    username: "@devfelixhongo",
    avatar: "/avatar4.jpg",
    comment: "The billionaire coder.",
  },
  {
    name: "Andrew",
    username: "@amuche_andrew",
    avatar: "/avatar5.jpg",
    comment: "Sabiskill is impressive. Love the direction.",
  },
  {
    name: "Awolesi Victor",
    username: "@awolesi_victor",
    avatar: "/avatar6.jpg",
    comment: "This is very nice, good work.",
  },
];

// Split into two rows for the two marquee tracks
const row1 = testimonials.slice(0, 3);
const row2 = testimonials.slice(3, 6);

interface TestimonialCardProps {
  name: string;
  username: string;
  avatar: string;
  comment: string;
}

const TestimonialCard = ({ name, username, avatar, comment }: TestimonialCardProps) => (
  <div className="mx-3 w-72 sm:w-80 shrink-0 bg-[#111827] border border-[#1f2937] hover:border-blue-500/60 rounded-xl p-5 shadow-lg transition-colors duration-300">
    <div className="flex items-center gap-3 mb-3">
      <img
        src={avatar}
        alt={name}
        className="w-11 h-11 rounded-full object-cover border border-blue-500/60 flex-shrink-0"
      />
      <div className="min-w-0">
        <div className="flex items-center gap-1">
          <h3 className="font-semibold text-white text-sm truncate">{name}</h3>
          {/* Verified badge */}
          <svg className="fill-blue-500 flex-shrink-0" width="13" height="13" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z" />
          </svg>
        </div>
        <p className="text-xs text-slate-500 truncate">{username}</p>
      </div>
    </div>
    <p className="text-sm text-gray-300 leading-relaxed">"{comment}"</p>
  </div>
);

interface MarqueeRowProps {
  items: TestimonialCardProps[];
  reverse?: boolean;
}

const MarqueeRow = ({ items, reverse = false }: MarqueeRowProps) => {
  const doubled = [...items, ...items, ...items, ...items]; // extra copies for seamless loop

  return (
    <div className="relative w-full overflow-hidden">
      {/* Left fade */}
      <div className="absolute left-0 top-0 h-full w-16 sm:w-28 z-10 pointer-events-none bg-gradient-to-r from-[#0b0f1a] to-transparent" />

      <div
        className={`flex py-3 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ width: "max-content" }}
      >
        {doubled.map((card, i) => (
          <TestimonialCard key={i} {...card} />
        ))}
      </div>

      {/* Right fade */}
      <div className="absolute right-0 top-0 h-full w-16 sm:w-28 z-10 pointer-events-none bg-gradient-to-l from-[#0b0f1a] to-transparent" />
    </div>
  );
};

export default function Testimonial() {
  return (
    <>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 30s linear infinite;
        }
        .animate-marquee:hover,
        .animate-marquee-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>

      <section className="w-full py-20 bg-[#0b0f1a] text-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center"
          >
            What People Are Saying
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center text-slate-400 mt-3 text-sm sm:text-base"
          >
            Hear from People who've already seen results.
          </motion.p>
        </div>

        {/* Row 1 — left to right */}
        <MarqueeRow items={row1} />

        {/* Row 2 — right to left */}
        <MarqueeRow items={row2} reverse />
      </section>
    </>
  );
}