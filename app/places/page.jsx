'use client'

import Image from "next/image"
import Link from "next/link"
import places from "../../data/places.json"
import { motion } from "framer-motion"
import Footer from "../../components/sections/footer"
import PlacesHeroSection from "../../components/sections/places-hero-section"

export default function PlacesPage() {
  return (
    <>
   <PlacesHeroSection />
<main className="bg-gradient-to-b from-[#e6f4ef] via-white to-[#f0fdf4] py-20 px-4 sm:px-6 md:px-16 text-gray-800">
<motion.div
        className="text-center max-w-3xl mx-auto mb-14"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-serif text-emerald-900 mb-4">
          All the Places You Can Wander
        </h1>
        <p className="text-gray-700 text-base md:text-lg">
          Let your journey begin where the rain falls soft and the trees still speak.  
          Choose your rhythm and we’ll show you where to pause.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {places.map((place, idx) => (
          <motion.div
            key={place.slug}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col md:flex-row"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            {/* Image */}
            <div className="relative w-full md:w-1/2 h-64 md:h-auto">
              <Image
                src={place.image}
                alt={place.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Text content */}
            <div className="p-6 md:p-8 flex flex-col justify-between w-full md:w-1/2">
              <div>
                <h3 className="text-2xl font-serif text-emerald-900 mb-2">
                  {place.name}
                </h3>
                <p className="text-sm text-gray-600 italic mb-4">{place.caption}</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {place.description || "A place where mist lingers, waterfalls whisper, and nature reclaims time. Ideal for those who want to pause  - and mean it."}
                </p>
              </div>

              <Link
                href={`/places/${place.slug}`}
                className="mt-6 inline-block bg-emerald-700 text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-emerald-800 transition w-max"
              >
                Wander Here →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-12">  <Footer /></div>
    
    </main>
    </>
  )
}
