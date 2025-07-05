import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function StayCard({ stay }) {
  const router = useRouter()

  // Helper function to pick a valid image
  const getValidImageSrc = (stay) => {
    if (stay?.images && stay.images.length > 0 && (stay.images[0].startsWith('/') || stay.images[0].startsWith('http'))) {
      return stay.images[0]
    }
    if (stay?.heroImage && (stay.heroImage.startsWith('/') || stay.heroImage.startsWith('http'))) {
      return stay.heroImage
    }
    return null
  }

  const src = getValidImageSrc(stay)

  return (
    <div
      className="bg-white cursor-pointer rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col h-[500px] max-w-[400px] w-full"
      onClick={() => { router.push(`/stays/${stay.slug}`) }}
    >
      <div className="relative w-full h-52">
        {src ? (
          <Image
            src={src}
            alt={stay?.name || "Stay image"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image available</span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <h3 className="text-xl font-serif text-emerald-900">{stay?.name}</h3>
        <p className="text-sm text-gray-600 italic">{stay?.place}</p>
        <p className="text-sm text-gray-700 line-clamp-3">{stay?.description?.[0]}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {stay?.tags?.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto">
          <Link
            href={`/stays/${stay?.slug}`}
            className="text-sm font-medium text-emerald-700 hover:underline w-max"
            onClick={(e) => e.stopPropagation()} // prevent outer div click
          >
            View Stay →
          </Link>
        </div>
      </div>
    </div>
  )
}
