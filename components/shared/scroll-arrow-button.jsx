'use client'

import { useEffect, useState } from "react"

const wanderPhrases = [
  "Keep Wandering",
  "Wander Further",
  "More trails →",
  "The trail continues"
]

export default function ScrollArrowButton() {
  const [labelIndex, setLabelIndex] = useState(0)
  const [isEndReached, setIsEndReached] = useState(false)

  useEffect(() => {
    const container = document.querySelector("#places-scroll")

    const checkScroll = () => {
      if (!container) return
      const maxScroll = container.scrollWidth - container.clientWidth
      const currentScroll = container.scrollLeft

      if (currentScroll >= maxScroll - 20) {
        setIsEndReached(true)
      } else {
        setIsEndReached(false)
      }
    }

    if (container) {
      container.addEventListener("scroll", checkScroll)
      return () => container.removeEventListener("scroll", checkScroll)
    }
  }, [])

  const handleScroll = () => {
    const container = document.querySelector("#places-scroll")
    if (!container || isEndReached) return

    container.scrollBy({ left: 300, behavior: "smooth" })

    // Only update label if not at end
    setLabelIndex((prev) => {
      const next = prev >= 3 ? 1 + Math.floor(Math.random() * 3) : prev + 1
      return next
    })
  }

  if (isEndReached) return null

  return (
    <div className="md:hidden flex justify-end pr-6 mt-2">
      <button
        onClick={handleScroll}
        className="bg-emerald-700 text-white px-4 py-2 rounded-full shadow hover:bg-emerald-800 transition flex items-center gap-2 animate-pulse"
      >
        <span className="text-sm italic">{wanderPhrases[labelIndex]}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
