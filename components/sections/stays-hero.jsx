'use client'

import { motion } from "framer-motion"

export default function StaysHero() {
  return (
    <section className="h-[60vh] w-full bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
      style={{ backgroundImage: "url('/images/shared/places.png')" }}
    >
      <div className="absolute inset-0 bg-[#0d1d14]/60 z-0" />
      <motion.div
        className="relative z-10 text-center px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-3xl md:text-5xl font-serif text-white mb-4">Find your kind of quiet</h1>
        <p className="text-white text-lg md:text-xl">From mountain cabins to coastal cottages — explore stays that pause with you.</p>
      </motion.div>
    </section>
  )
}
