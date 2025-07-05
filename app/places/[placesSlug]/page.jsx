'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Footer from '../../../components/sections/footer'
import placesData from '../../../data/placesData'
import StayCard from '../../../components/ui/stay-card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../../../@/components/ui/carousel'
import {
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from '../../../@/components/ui/dialog'

import { Button } from '../../../@/components/ui/button'
import Loading from '../../../components/shared/loading'

export default function PlacePage() {
  const { placesSlug } = useParams()
  const [place, setPlace] = useState(null)
  const [stays, setStays] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSpot, setSelectedSpot] = useState(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        // Fetch place data
        const placeRes = await fetch(`/api/places/${placesSlug}`)
        if (!placeRes.ok) throw new Error('Place not found')
        const placeData = await placeRes.json()
        setPlace(placeData)

        // Fetch stays data for this specific place
        const staysRes = await fetch(`/api/stays?place=${placeData.slug}`)
        if (!staysRes.ok) throw new Error('Failed to fetch stays')
        const staysData = await staysRes.json()
        setStays(staysData)
      } catch (err) {
        setError(err.message)
        setPlace(null)
        setStays([])
      } finally {
        setLoading(false)
      }
    }
    if (placesSlug) fetchData()
  }, [placesSlug])

  if (loading) return <div className="p-10 text-center"> <Loading /> </div>
  if (error || !place) return <div className="p-10 text-center">Place not found.</div>

  // The stays are already filtered by place from the API
  const placeStays = stays
  
  console.log('Stays for this place:', placeStays)

  return (
    <main className="bg-gradient-to-b from-[#fefcf8] via-white to-[#f0fdf4] text-gray-700">
      {/* Hero */}
      <section
        className="relative h-[60vh] w-full flex items-center justify-center text-white bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${place.heroImage}')` }}
      >
        <div className="absolute inset-0 bg-[#0d1d14]/60 z-0" />
        <motion.div
          className="relative z-10 text-center px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <h1 className="text-3xl md:text-5xl font-serif tracking-wide mb-4">
            {place.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-200">{place.subtitle}</p>
        </motion.div>
      </section>

      {/* Paragraphs */}
      <section className="px-6 sm:px-10 py-16 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
        {place.description.map((para, idx) => (
          <p key={idx} className="mb-6">
            {para}
          </p>
        ))}
        <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-emerald-800 my-6">
          “{place.quote}”
        </blockquote>
      </section>
{/* Immersive Image Carousel */}
<section className="w-full overflow-hidden mb-16">
  <Carousel className="relative w-full h-[60vh]">
    <CarouselContent>
      {place.images.map((img, i) => (
        <CarouselItem key={i}>
          <div className="relative w-full h-[60vh]">
            <Image src={img} alt={`Image ${i}`} fill className="object-cover" />
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2" />
    <CarouselNext className="right-4 top-1/2 -translate-y-1/2" />
  </Carousel>
</section>

      {/* 🌟 Recommended Stays - moved up */}
      <section className="px-6 sm:px-10 pb-20 max-w-6xl mx-auto">
        <h2 className="text-2xl font-serif text-emerald-900 mb-2">
          Your Stay in {place.name} Awaits
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Immerse in nature's calm — from cozy forest lodges to scenic retreats nestled in the wild.
        </p>
        {placeStays.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {placeStays.map((stay) => (
              <div key={stay.slug} className="transform transition duration-300 hover:scale-[1.02]">
                <StayCard stay={stay} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            No stays listed here yet, but we're on it.
          </p>
        )}
      </section>

      {/* Scenic Spots */}
      <section className="px-6 sm:px-10 pb-20 max-w-5xl mx-auto">
        <h2 className="text-2xl font-serif text-emerald-900 mb-6">
          Scenic Places to Wander
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {place.spots.map((spot, idx) => (
            <Dialog key={idx}>
              <DialogTrigger asChild>
                <motion.div
                  className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden flex flex-col cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="relative w-full h-56">
                    <Image src={spot.image} alt={spot.name} fill className="object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-emerald-800">{spot.name}</h3>
                    <p className="text-sm text-gray-600 mt-2">{spot.preview}</p>
                  </div>
                </motion.div>
              </DialogTrigger>

              <DialogContent className="max-w-2xl">
                <DialogTitle>{spot.name}</DialogTitle>
                <Carousel className="mt-4 relative">
                  <CarouselContent>
                    {spot.images.map((img, i) => (
                      <CarouselItem key={i}>
                        <div className="relative w-full h-64 sm:h-80">
                          <Image
                            src={img}
                            alt={`${spot.name} ${i}`}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2" />
                  <CarouselNext className="right-2 top-1/2 -translate-y-1/2" />
                </Carousel>
                <p className="text-sm text-gray-600 mt-4">{spot.description}</p>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
