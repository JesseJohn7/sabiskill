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

export default function Testimonial() {
  return (
    <section className="w-full py-20 px-6 bg-[#0b0f1a] text-white">
      <div className="max-w-6xl mx-auto">

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          What Developers Are Saying
        </h2>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 shadow-lg hover:border-blue-500"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border border-blue-500"
                />

                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-400">{item.username}</p>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed">
                "{item.comment}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}