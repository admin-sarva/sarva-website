'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa'
import GustWave from './gustWave'
import HamburgerMenu from './hamburgerMenu'

export default function PublicChrome() {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  if (isAdminRoute) return null

  return (
    <>
      <GustWave />
      <HamburgerMenu />
      <Link
        href="https://wa.me/919632467873"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 rounded-full bg-green-500 p-3 shadow-lg transition-colors hover:bg-green-600"
      >
        <FaWhatsapp className="text-white" size={28} />
      </Link>
    </>
  )
}
