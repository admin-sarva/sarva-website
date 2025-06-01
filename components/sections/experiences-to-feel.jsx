'use client'

import { motion } from "framer-motion"
import {
  Sunrise,
  Coffee,
  Heart,
  Flame,
  CloudRain,
  UserRound,
  Waves,
  Landmark
} from "lucide-react"

const experiences = [
  {
    icon: Sunrise,
    title: "Watch the Sunrise",
    line: "Let the light find you before the world does."
  },
  {
    icon: Coffee,
    title: "Smell the Coffee Trail",
    line: "Warmth, memory, and mornings that never hurry."
  },
  {
    icon: Waves,
    title: "Walk Along the Beach",
    line: "Let the waves take what you no longer need."
  },
  {
    icon: Landmark,
    title: "Visit a Holy Place in Silence",
    line: "Not for belief  - just for peace."
  },
  {
    icon: UserRound,
    title: "Sit with Old Friends",
    line: "No agendas. Just stories and time."
  },
  {
    icon: Heart,
    title: "Be with Someone You Love",
    line: "Silence feels different when shared."
  },
  {
    icon: CloudRain,
    title: "Listen to the Rain",
    line: "Sometimes the downpour says what you can’t."
  },
  {
    icon: Flame,
    title: "Share Firelight",
    line: "End your day with sparks and slow laughter."
  }
]

export default function ExperiencesToFeel() {
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
          What would you like to feel again?
        </h2>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
          A long walk with an old friend? The first quiet moment of sunrise?  
          <br />Or just the comfort of silence beside someone you love.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {experiences.map((exp, idx) => (
          <motion.div
            key={exp.title}
            className="bg-white min-h-[140px] p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2">
              <exp.icon className="w-5 h-5 text-emerald-700" />
              <h4 className="text-sm md:text-base font-semibold text-gray-900">{exp.title}</h4>
            </div>
            <p className="text-xs md:text-sm italic text-gray-600 mt-2">
              {exp.line}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
