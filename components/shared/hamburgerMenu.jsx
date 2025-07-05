'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, MapPin, Home, BookOpen } from 'lucide-react'

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const menuItems = [
    {
      name: 'Places',
      href: '/places',
      icon: <MapPin className="w-5 h-5" />,
      description: 'Explore amazing destinations'
    },
    {
      name: 'Stays',
      href: '/stays',
      icon: <Home className="w-5 h-5" />,
      description: 'Find perfect accommodations'
    },
    {
      name: 'Wander Notes',
      href: '/wander-notes',
      icon: <BookOpen className="w-5 h-5" />,
      description: 'Read travel stories & tips'
    }
  ]

  return (
    <>
      {/* Fixed Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-6 left-6 z-50 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-gray-200"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={closeMenu}
        />
      )}

      {/* Menu Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Sarva Holidays</h2>
            <p className="text-sm text-gray-600">Explore & Discover</p>
          </div>
          <button
            onClick={closeMenu}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-6">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center justify-center w-full py-3 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </>
  )
} 