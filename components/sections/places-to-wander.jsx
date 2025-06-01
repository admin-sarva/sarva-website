'use client'

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import places from "../../data/places.json"

export default function PlacesToWander() {
  const router = useRouter()

  return (
    <section className="py-20 px-6 md:px-12 bg-[url('/images/shared/bg-texture.png')] bg-cover bg-no-repeat bg-center">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-5xl font-serif text-emerald-900">
          Where would you like to wander?
        </h2>
        <p className="mt-3 text-gray-700 text-base md:text-lg">
          From monsoon-kissed hills to coastlines that hum at sunset  - your story begins here.
        </p>
      </div>

      {/* Desktop grid view */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8">
        {places.map((place, idx) => (
          <motion.div
            key={place.slug}
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            onClick={() => router.push(`/places/${place.slug}`)}
            className="cursor-pointer rounded-xl overflow-hidden shadow-lg group transition transform hover:shadow-xl"
          >
            <div className="relative w-full h-56">
              <Image
                src={place.image}
                alt={place.name}
                fill
                className="object-cover group-hover:brightness-90 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
              <div className="absolute bottom-4 left-4 z-20">
                <h3 className="text-xl text-white font-semibold">{place.name}</h3>
                <p className="text-sm italic text-gray-200">{place.caption}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile horizontal scroll view */}
      <div id="places-scroll" className="md:hidden flex gap-5 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 pt-2 pb-4">
        {places.map((place, idx) => (
          <motion.div
            key={place.slug}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            onClick={() => router.push(`/places/${place.slug}`)}
            className="min-w-[80%] snap-start shrink-0 rounded-xl overflow-hidden shadow-md bg-white"
          >
            <div className="relative h-56 w-full">
              <Image
                src={place.image}
                alt={place.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
              <div className="absolute bottom-4 left-4 z-20">
                <h3 className="text-xl text-white font-semibold">{place.name}</h3>
                <p className="text-sm italic text-gray-200">{place.caption}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Scroll right arrow – mobile only */}
      {/* <div className="md:hidden flex justify-end pr-6 mt-2">
      <ScrollArrowButton />
      </div> */}
    </section>
  )
}
