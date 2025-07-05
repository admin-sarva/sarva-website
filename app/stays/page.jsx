'use client'

import { useState, useEffect } from 'react'
import StayCard from '../../components/ui/stay-card'
import StaysHero from '../../components/sections/stays-hero'
import Footer from '../../components/sections/footer'
import { useRouter } from 'next/router'
import Loading from '../../components/shared/loading'

export default function StaysPage() {
  const [stays, setStays] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlace, setSelectedPlace] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedType, setSelectedType] = useState('')
  const [minRating, setMinRating] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const router = useRouter

  useEffect(() => {
    setLoading(true)
    fetch('/api/stays')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch stays')
        return res.json()
      })
      .then(data => {
        setStays(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const uniquePlaces = Array.from(new Set(stays.map(s => s.place)))
  const uniqueTags = Array.from(new Set(stays.flatMap(s => s.tags)))
  const uniqueTypes = Array.from(new Set(stays.map(s => s.type)))

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedPlace('')
    setSelectedTags([])
    setSelectedType('')
    setMinRating('')
    setMaxPrice('')
  }

  const filteredStays = stays.filter((stay) => {
    const matchesSearch =
      stay?.name.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      stay?.description?.toLowerCase().includes(searchTerm?.toLowerCase())

    const matchesPlace = !selectedPlace || stay?.place === selectedPlace
    const matchesType = !selectedType || stay?.type === selectedType
    const matchesTags =
      selectedTags.length === 0 || selectedTags.every(tag => stay?.tags.includes(tag))

    const stayPrice = stay?.pricePerNight || 0
    const priceOk = !maxPrice || stayPrice <= parseInt(maxPrice)

    const stayRating = stay?.rating || 0
    const ratingOk = !minRating || stayRating >= parseFloat(minRating)

    return (
      matchesSearch && matchesPlace && matchesType &&
      matchesTags && priceOk && ratingOk
    )
  })

  return (
    <main>
      <StaysHero />

      <div className="py-10 px-4 sm:px-6 md:px-16 bg-white">
        {/* Filters Panel */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 mb-10">
          {/* Search */}
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-600 mb-1 block">Search</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Search by name or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Place */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Place</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedPlace}
              onChange={(e) => setSelectedPlace(e.target.value)}
            >
              <option value="">All</option>
              {uniquePlaces.map(place => (
                <option key={place}>{place}</option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Type</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All</option>
              {uniqueTypes.map(type => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Min. Rating</label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. 4.5"
            />
          </div>

          {/* Price */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Max Price (₹)</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. 5000"
            />
          </div>

          {/* Reset Button */}
          <div className="self-end">
            <button
              className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Tag Filter (multi-select tabs) */}
        <div className="flex flex-wrap gap-3 mb-10">
          {uniqueTags.map(tag => {
            const active = selectedTags.includes(tag)
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-sm px-3 py-1 rounded-full border transition ${
                  active
                    ? "bg-emerald-700 text-white border-emerald-700"
                    : "bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50"
                }`}
              >
                {tag}
              </button>
            )
          })}
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="text-center text-gray-500 italic mt-10"> <Loading /> </div>
        ) : error ? (
          <div className="text-center text-red-500 italic mt-10">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStays.map((stay) => (
              <StayCard key={stay.slug} stay={stay} />
            ))}
          </div>
        )}

        {!loading && !error && filteredStays.length === 0 && (
          <div className="text-center text-gray-500 italic mt-10">
            No stays match your filters.
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}
