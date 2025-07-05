export default function Loading() {
    const phrases = [
        "Don’t litter. Keep nature clean 🌱",
        "Stick to trails. Protect plants 🌿",
        "Respect wildlife. Keep a safe distance 🦉",
        "Leave no trace. Pack out all waste 🏕️"
      ]
  
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)]
  
    return (
      <span className="inline-flex flex-col justify-center items-center h-full py-2">
        <span className="relative flex items-center justify-center">
          <span className="w-6 h-6 rounded-full border-2 border-emerald-300 border-t-emerald-600 animate-spin"></span>
          <span className="absolute text-emerald-600 text-lg">🌿</span>
        </span>
        <span className="mt-2 text-md text-emerald-700 text-center">
          {randomPhrase}
        </span>
      </span>
    )
  }
  