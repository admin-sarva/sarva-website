import Link from "next/link"
import ContactNow from "../shared/contactNow"

export default function Footer() {
  return (
    <footer className="bg-[#f9fafb] text-gray-700 py-12 px-4 sm:px-6 md:px-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* Brand */}
        <div className="space-y-2">
          <h4 className="text-xl font-serif text-emerald-900">Sarva Holidays</h4>
          <p className="text-gray-500 italic">Nature doesn’t rush, and neither should you.</p>
        </div>

        {/* Links */}
        <div className="space-y-2">
          <h5 className="font-semibold text-gray-900">Explore</h5>
          <ul className="space-y-1">
            <li><Link href="/places" className="hover:underline">Places to Wander</Link></li>
            <li><Link href="/stays" className="hover:underline">Stays</Link></li>
            <li><Link href="/wander-notes" className="hover:underline">Wander Notes</Link></li>
            <ContactNow />
          </ul>
        </div>

        {/* Signature */}
        <div className="space-y-2 text-right md:text-left">
          <p>Made with 🌿 somewhere between rain and stillness.</p>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Sarva Holidays</p>
        </div>
      </div>
    </footer>
  )
}
