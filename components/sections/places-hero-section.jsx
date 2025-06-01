'use client'

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

export default function PlacesHeroSection() {
  return (
    <section
      className="relative h-screen w-full flex items-center justify-center text-white bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/shared/places.png')", // Replace with your actual image
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0d1d14]/60 z-0" />

      {/* Text block */}
      <motion.div
        className="relative z-10 text-center px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <motion.h1
          className="text-3xl md:text-5xl font-serif tracking-wide mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          The places we don’t rush through
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          Forest trails, ocean winds, hillside mornings  - each waits in its own way.
        </motion.p>

        {/* Scroll cue */}
        <motion.div
          className="mt-12 flex flex-col items-center text-sm text-gray-300 tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <span className="mb-2 uppercase">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          >
            <ChevronDown className="w-6 h-6 opacity-80" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
