import Image from "next/image"
import { MapPin } from "lucide-react"

export default function ResortCard({ resort }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
      <div className="relative w-full h-48">
        <Image
          src={resort.image?.[0]}
          alt={resort.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-gray-900">{resort.name}</h3>
        <p className="text-sm italic text-gray-600">{resort.description}</p>
        <div className="flex items-center gap-1 text-xs text-emerald-700 mt-2">
          <MapPin className="w-4 h-4" />
          <span>{resort.place}</span>
        </div>
      </div>
    </div>
  )
}
