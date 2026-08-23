'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import Image from 'next/image'
import Footer from '../../../components/sections/footer'
import Loading from '../../../components/shared/loading'

export default function WanderNoteDetailPage() {
  const { slug } = useParams()
  const [note, setNote] = useState(null)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    if (!slug) return

    fetch(`/api/notes?slug=${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then((data) => {
        const item = Array.isArray(data) ? data[0] : data
        if (!item) {
          setMissing(true)
          return
        }
        setNote(item)
      })
      .catch(() => setMissing(true))
  }, [slug])

  if (missing) return notFound()
  if (!note) return <div className="p-10 text-center"><Loading /></div>

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fefcf8] via-white to-[#f0fdf4] text-gray-800">
      <section className="relative h-[58vh] w-full">
        <Image src={note.image} alt={note.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-[#0d1d14]/60" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-emerald-100">{note.place}</p>
          <h1 className="max-w-4xl text-3xl font-serif md:text-5xl">{note.title}</h1>
          <p className="mt-4 max-w-2xl text-base text-gray-100 md:text-lg">{note.summary}</p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 py-14 text-base leading-8 text-gray-700 md:text-lg">
        {note.content.split('\n').filter(Boolean).map((paragraph, index) => (
          <p key={index} className="mb-6">{paragraph}</p>
        ))}
      </article>

      <Footer />
    </main>
  )
}
