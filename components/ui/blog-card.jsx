import Image from "next/image"
import Link from "next/link"

export default function BlogCard({ note }) {
  return (
    <Link href={`/wander-notes/${note.slug}`} className="group">
      <div className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
        <div className="relative w-full h-48">
          <Image
            src={note.image}
            alt={note.title}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
        <div className="p-4 flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
          <p className="text-sm italic text-gray-600">{note.summary}</p>
          <span className="text-xs text-emerald-700 mt-1">{note.place}</span>
        </div>
      </div>
    </Link>
  )
}
