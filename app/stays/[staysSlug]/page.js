'use client'

import { useParams, notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Footer from '../../../components/sections/footer'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../../../@/components/ui/carousel'
import ContactNow from '../../../components/shared/contactNow'
import { Badge } from '../../../@/components/ui/badge'
import Loading from '../../../components/shared/loading'

export default function StayDetailPage() {
  const { staysSlug } = useParams()
  const [stay, setStay] = useState(null)
  const [notFoundFlag, setNotFoundFlag] = useState(false)

  useEffect(() => {
    if (!staysSlug) return
    fetch(`/api/stays/${staysSlug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then((data) => setStay(data))
      .catch(() => setNotFoundFlag(true))
  }, [staysSlug])

  if (notFoundFlag) return notFound()
  if (!stay) return <div className="p-10 text-center"><Loading /></div>

  const images = Array.isArray(stay.images) ? stay.images : []
  const tags = Array.isArray(stay.tags) ? stay.tags : []
  const bestFor = Array.isArray(stay.bestFor) ? stay.bestFor : []
  const descriptions = Array.isArray(stay.description) ? stay.description : []
  const amenities = Array.isArray(stay.amenities) ? stay.amenities : []
  const heroImage = stay.heroImage || images[0]

  return (
    <main className="bg-gradient-to-b from-[#fefcf8] via-white to-[#f0fdf4] text-gray-700">
      <section className="relative h-[60vh] w-full flex items-center justify-center text-white bg-cover bg-center bg-no-repeat">
        {stay.videoUrl ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={stay.videoUrl} type="video/mp4" />
          </video>
        ) : heroImage ? (
          <Image
            src={heroImage}
            alt={stay.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-emerald-950" />
        )}
        <div className="absolute inset-0 bg-[#0d1d14]/60 z-0" />
        <motion.div
          className="relative z-10 text-center px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <h1 className="text-3xl md:text-5xl font-serif tracking-wide mb-4">{stay.name}</h1>
          {stay.subtitle && <p className="text-lg md:text-xl text-gray-200">{stay.subtitle}</p>}
        </motion.div>
      </section>

      <section className="px-6 sm:px-10 py-10 max-w-4xl mx-auto space-y-4">
        <div className="flex flex-wrap gap-2 text-sm">
          {stay.type && <Badge>{stay.type}</Badge>}
          {tags.map((tag, idx) => (
            <Badge key={`${tag}-${idx}`} variant="outline">{tag}</Badge>
          ))}
        </div>
        <div className="flex flex-col gap-4 mt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Rated {stay.rating || 'N/A'} star{bestFor.length > 0 ? ` - Best for ${bestFor.join(', ')}` : ''}
            </p>
          </div>
          <ContactNow />
        </div>
      </section>

      <section className="px-6 sm:px-10 pb-10 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
        {descriptions.map((para, idx) => (
          <p key={idx} className="mb-6">{para}</p>
        ))}
      </section>

      {images.length > 0 && (
        <section className="px-6 sm:px-10 pb-16 max-w-5xl mx-auto">
          <h2 className="text-2xl font-serif text-emerald-900 mb-4">Gallery</h2>
          <div className="overflow-hidden rounded-xl shadow-md">
            <Carousel className="relative w-full h-[60vh]">
              <CarouselContent>
                {images.map((img, i) => (
                  <CarouselItem key={img}>
                    <div className="relative w-full h-[60vh]">
                      <Image src={img} alt={`Stay image ${i + 1}`} fill className="object-cover" />
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

      {amenities.length > 0 && (
        <section className="px-6 sm:px-10 pb-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-serif text-emerald-900 mb-4">Amenities</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            {amenities.map((item, idx) => (
              <li key={`${item}-${idx}`} className="pl-4 relative before:content-['-'] before:absolute before:left-0 text-emerald-800">
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

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
