'use client'

import { useEffect, useState } from "react";

export default function GustWave() {
  const [gusts, setGusts] = useState([]);

  useEffect(() => {
    const triggerGust = () => {
      const id = Date.now();
      setGusts((prev) => [...prev, id]);

      setTimeout(() => {
        setGusts((prev) => prev.filter((g) => g !== id));
      }, 5000); // gust lasts 5s

      const nextDelay = Math.random() * 4000 + 4000;
      setTimeout(triggerGust, nextDelay);
    };

    triggerGust();
  }, []);

  return (
    <>
      {gusts.map((id) => (
        <div
          key={id}
          className="breeze-gust"
          style={{
            top: `${Math.random() * 60}%`,
            height: `${Math.random() * 50 + 50}%`, // thicker: 50–100% of screen
            animation: "gustWave 5s ease-in-out forwards",
            transform: `translateY(${Math.random() * 30 - 15}px)`,
            opacity: Math.random() * 0.3 + 0.4, // stronger base opacity
          }}
        />
      ))}
    </>
  );
}
