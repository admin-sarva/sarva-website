'use client'

import { motion } from "framer-motion"
import Link from "next/link"

export default function FinalCTA() {
  return (
    <section className="bg-white py-24 px-4 sm:px-6 md:px-16 text-center">
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-5xl font-serif text-emerald-900 mb-6">
          Let the Journey Begin
        </h2>
        <p className="text-gray-700 text-base md:text-lg mb-8 leading-relaxed">
          You don’t need an itinerary.  
          You just need a pause.  
          Wander through our places, feel what calls you,  
          and we’ll meet you where the forest begins.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/places"
            className="bg-emerald-700 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-emerald-800 transition"
          >
            Wander the Map
          </Link>
          <Link
            href="/stays"
            className="border border-emerald-700 text-emerald-700 px-6 py-3 rounded-full text-sm font-medium hover:bg-emerald-50 transition"
          >
            Find Your Stay
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
