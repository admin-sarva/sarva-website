'use client'

import { useParams, notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import stays from '../../../data/stays.json'
import Footer from '../../../components/sections/footer'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../../../@/components/ui/carousel'
import ContactNow from "../../../components/shared/contactNow"
import { Badge } from '../../../@/components/ui/badge'

export default function StayDetailPage() {
  const { staysSlug } = useParams()
  const stay = stays.find((s) => s.slug === staysSlug)
  const [videoLoaded, setVideoLoaded] = useState(false)

  if (!stay) return notFound()

  return (
    <main className="bg-gradient-to-b from-[#fefcf8] via-white to-[#f0fdf4] text-gray-700">
      {/* Hero section */}
      <section className="relative h-[60vh] w-full flex items-center justify-center text-white bg-cover bg-center bg-no-repeat">
        {stay.videoUrl ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
          >
            <source src={stay.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={stay.heroImage || stay.images?.[0]}
            alt={stay.name}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-[#0d1d14]/60 z-0" />
        <motion.div
          className="relative z-10 text-center px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <h1 className="text-3xl md:text-5xl font-serif tracking-wide mb-4">
            {stay.name}
          </h1>
          <p className="text-lg md:text-xl text-gray-200">{stay.subtitle}</p>
        </motion.div>
      </section>

      {/* Overview */}
      <section className="px-6 sm:px-10 py-10 max-w-4xl mx-auto space-y-4">
        <div className="flex flex-wrap gap-2 text-sm">
          <Badge>{stay.type}</Badge>
          {stay.tags.map((tag, idx) => (
            <Badge key={idx} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-xl font-semibold text-emerald-800">
              ₹{stay.pricePerNight.toLocaleString()} / night
            </p>
            <p className="text-sm text-gray-500">
              Rated {stay.rating} ★ — Best for {stay.bestFor.join(', ')}
            </p>
          </div>
          <ContactNow />
        </div>
      </section>

      {/* Description */}
      <section className="px-6 sm:px-10 pb-10 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
        {stay.description?.map((para, idx) => (
          <p key={idx} className="mb-6">
            {para}
          </p>
        ))}
      </section>

      {/* Image Carousel */}
      {stay.images?.length > 0 && (
        <section className="px-6 sm:px-10 pb-16 max-w-5xl mx-auto">
          <h2 className="text-2xl font-serif text-emerald-900 mb-4">Gallery</h2>
          <div className="overflow-hidden rounded-xl shadow-md">
            <Carousel className="relative w-full h-[60vh]">
              <CarouselContent>
                {stay.images.map((img, i) => (
                  <CarouselItem key={i}>
                    <div className="relative w-full h-[60vh]">
                      <Image src={img} alt={`Stay image ${i}`} fill className="object-cover" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2" />
              <CarouselNext className="right-4 top-1/2 -translate-y-1/2" />
            </Carousel>
          </div>
        </section>
      )}

      {/* Amenities */}
      {stay.amenities?.length > 0 && (
        <section className="px-6 sm:px-10 pb-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-serif text-emerald-900 mb-4">Amenities</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            {stay.amenities.map((item, idx) => (
              <li
                key={idx}
                className="pl-4 relative before:content-['•'] before:absolute before:left-0 text-emerald-800"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Map */}
      {stay.mapEmbedUrl && (
        <section className="px-6 sm:px-10 pb-20 max-w-5xl mx-auto">
          <h2 className="text-2xl font-serif text-emerald-900 mb-4">How to Reach</h2>
          <div className="rounded-xl overflow-hidden shadow-lg aspect-video">
            <iframe
              src={stay.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
