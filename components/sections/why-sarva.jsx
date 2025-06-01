'use client'

import { motion } from "framer-motion"
import { Leaf, MapPin, Bell, Home } from "lucide-react"

const values = [
  {
    icon: Leaf,
    title: "Rooted in Nature",
    desc: "We don’t build in nature. We build with it. Every stay blends into the forest, not over it."
  },
  {
    icon: MapPin,
    title: "Guided by Locals",
    desc: "Our experiences come from people who live where you travel  - not from guidebooks."
  },
  {
    icon: Home,
    title: "Stay Small, Stay True",
    desc: "No mega resorts. Just cabins, cottages, and spaces that whisper, not shout."
  },
  {
    icon: Bell,
    title: "Silence is Sacred",
    desc: "We curate stillness. Not itineraries. No horns, no playlists  - just wind and birdsong."
  }
]

export default function WhySarva() {
  return (
    <section
      id="why-sarva"
      className="relative py-20 px-6 md:px-16 text-gray-800 bg-gradient-to-b from-[#ecfdf5] to-white"
    >
      <motion.div
        className="text-center max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-5xl font-serif text-emerald-900 mb-4">
          Why we choose the places we do
        </h2>

        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
          We’re not outsiders who found these places. We were born here.
          <br />
          Raised by these hills, these rains, these forests.
          <br /><br />
          <strong className="text-emerald-800 font-medium">
            Sarva Holidays isn’t a travel brand  - it’s a way of remembering the Nature we almost forgot.
          </strong>
          <br />
          A quiet, sacred home. Still waiting to be rediscovered.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-6xl mx-auto">
        {values.map((item, idx) => (
          <motion.div
            key={item.title}
            className="flex flex-col items-start gap-3 bg-white/90 p-5 rounded-xl shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.2 }}
            viewport={{ once: true }}
          >
            <item.icon className="w-6 h-6 text-emerald-800" />
            <h4 className="text-base md:text-lg font-semibold text-emerald-900">
              {item.title}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
