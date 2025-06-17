import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function StayCard({ stay }) {
    const router = useRouter();
    return (
        <div className="bg-white cursor-pointer rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col h-[500px] max-w-[400px] w-full" onClick={()=>{router.push(`/stays/${stay.slug}`)}}>
            <div className="relative w-full h-52">
                <Image
                    src={stay?.images?.[0] || stay?.heroImage}
                    alt={stay?.name}
                    fill
                    className="object-cover"
                />
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
                    >
                        View Stay →
                    </Link>
                </div>
            </div>
        </div>
    )
}
