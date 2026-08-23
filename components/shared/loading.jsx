const phrase = "Keep nature clean. Stay on trails. Leave no trace."

export default function Loading() {
  return (
    <span className="inline-flex flex-col justify-center items-center h-full py-2">
      <span className="relative flex items-center justify-center">
        <span className="w-6 h-6 rounded-full border-2 border-emerald-300 border-t-emerald-600 animate-spin" />
        <span className="absolute text-emerald-600 text-sm">leaf</span>
      </span>
      <span className="mt-2 text-md text-emerald-700 text-center">
        {phrase}
      </span>
    </span>
  )
}
