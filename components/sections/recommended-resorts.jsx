'use client'

import ResortCard from "../../components/ui/ResortCard"
import resorts from "../../data/stays.json"
import { motion } from "framer-motion"

export default function RecommendedResorts() {
  const featuredResorts = resorts.filter((r) => r.highlighted)

  return (
    <section className="bg-gradient-to-b from-white to-[#fefcf8] py-20 px-4 sm:px-6 md:px-16">
      <motion.div
        className="text-center max-w-3xl mx-auto mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-5xl font-serif text-emerald-900 mb-4">
          Where You Might Want to Stay
        </h2>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
          A few places we’ve stayed, loved, and quietly offer to you.
        </p>
      </motion.div>

      {/* Grid view for desktop */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {featuredResorts.map((resort, idx) => (
          <motion.div
            key={resort.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <ResortCard resort={resort} />
          </motion.div>
        ))}
      </div>

      {/* Horizontal scroll for mobile */}
      <div id="resorts-scroll" className="md:hidden flex gap-5 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pt-2 pb-4">
        {featuredResorts.map((resort, idx) => (
          <motion.div
            key={resort.name}
            className="min-w-[80%] snap-start shrink-0"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <ResortCard resort={resort} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
