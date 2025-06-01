'use client'

import testimonials from "../../data/testimonials.json"
import TestimonialCard from "../../components/ui/TestimonialCard"
import { motion } from "framer-motion"

export default function Testimonials() {
  return (
    <section className="bg-gradient-to-b from-[#e6f4ef] via-white to-[#f0fdf4] py-20 px-4 sm:px-6 md:px-16">
      <motion.div
        className="text-center max-w-2xl mx-auto mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-5xl font-serif text-emerald-900 mb-4">
          Words from Our Wanderers
        </h2>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
          Gentle moments shared by those who stayed  - and stayed present.
        </p>
      </motion.div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {testimonials.map((t, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <TestimonialCard testimonial={t} />
          </motion.div>
        ))}
      </div>

      {/* Mobile Horizontal Scroll */}
      <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4">
        {testimonials.map((t, idx) => (
          <motion.div
            key={idx}
            className="min-w-[85%] snap-start shrink-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <TestimonialCard testimonial={t} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
