'use client'

import { useEffect, useRef, useState } from "react"

function createGust() {
  return {
    id: `${Date.now()}-${Math.random()}`,
    top: `${Math.random() * 60}%`,
    height: `${Math.random() * 50 + 50}%`,
    transform: `translateY(${Math.random() * 30 - 15}px)`,
    opacity: Math.random() * 0.3 + 0.4,
  }
}

export default function GustWave() {
  const [gusts, setGusts] = useState([])
  const timeoutRef = useRef(null)

  useEffect(() => {
    const triggerGust = () => {
      const gust = createGust()
      setGusts((prev) => [...prev, gust])

      setTimeout(() => {
        setGusts((prev) => prev.filter((item) => item.id !== gust.id))
      }, 5000)

      timeoutRef.current = setTimeout(triggerGust, Math.random() * 4000 + 4000)
    }

    triggerGust()

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <>
      {gusts.map((gust) => (
        <div
          key={gust.id}
          className="breeze-gust"
          style={{
            top: gust.top,
            height: gust.height,
            animation: "gustWave 5s ease-in-out forwards",
            transform: gust.transform,
            opacity: gust.opacity,
          }}
        />
      ))}
    </>
  )
}
