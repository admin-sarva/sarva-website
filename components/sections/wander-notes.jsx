'use client'

import BlogCard from "../../components/ui/blog-card"
import notes from "../../data/wander-notes.json"
import { motion } from "framer-motion"

export default function WanderNotes() {
  const featuredNotes = notes.slice(0, 8)

  return (
    <section className="bg-gradient-to-b from-[#f0fdf4] via-white to-[#f7fefc] py-20 px-4 sm:px-6 md:px-16">
      <motion.div
        className="text-center max-w-3xl mx-auto mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-5xl font-serif text-emerald-900 mb-4">
          Wander Notes
        </h2>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
          Stories, secrets and nearby wonders  - softly shared from the road.
        </p>
      </motion.div>

      {/* Desktop grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {featuredNotes.map((note, idx) => (
          <motion.div
            key={note.slug}
            className="h-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <BlogCard note={note} />
          </motion.div>
        ))}
      </div>

      {/* Mobile horizontal scroll */}
      <div id="notes-scroll" className="md:hidden flex gap-5 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pt-2 pb-4">
        {featuredNotes.map((note, idx) => (
          <motion.div
            key={note.slug}
            className="min-w-[85%] snap-start shrink-0 h-full"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <BlogCard note={note} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
