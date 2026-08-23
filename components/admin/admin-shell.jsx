'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, ClipboardList, Home, Inbox, LogOut, MapPin, NotebookText, Plus, TentTree } from 'lucide-react'
import { Button } from '../../@/components/ui/button'
import { useAuth } from '../../lib/useAuth'
import Loading from '../shared/loading'

const navSections = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: Home },
      { label: 'All Actions', href: '/admin/navigation', icon: ClipboardList },
      { label: 'Contacts', href: '/admin/contacts', icon: Inbox },
      { label: 'Wander Notes', href: '/admin/notes', icon: NotebookText },
    ],
  },
  {
    title: 'Places',
    items: [
      { label: 'Add Place', href: '/admin/places', icon: Plus },
      { label: 'All Places', href: '/admin/places/list', icon: MapPin },
    ],
  },
  {
    title: 'Stays',
    items: [
      { label: 'Add Stay', href: '/admin/stays', icon: Plus },
      { label: 'All Stays', href: '/admin/stays/list', icon: TentTree },
    ],
  },
]

function isActive(pathname, href) {
  if (href === '/admin') return pathname === '/admin'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function AdminShell({ children }) {
  const pathname = usePathname()

  if (pathname === '/admin/login') {
    return children
  }

  return <AuthenticatedAdminShell>{children}</AuthenticatedAdminShell>
}

function AuthenticatedAdminShell({ children }) {
  const pathname = usePathname()
  const { isAuthenticated, loading, logout } = useAuth()

  if (loading) {
    return <div className="p-8"><Loading /></div>
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-[#f7faf7] text-gray-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-emerald-100 bg-white lg:flex lg:flex-col">
        <div className="border-b border-emerald-100 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Sarva Holidays</p>
          <h1 className="mt-1 text-xl font-bold text-emerald-950">Admin Panel</h1>
          <p className="mt-2 text-sm text-gray-600">Content, enquiries, places, and stays live here.</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {navSections.map((section) => (
            <div key={section.title} className="mb-5">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500">{section.title}</p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const active = isActive(pathname, item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                        active
                          ? 'bg-emerald-100 text-emerald-950'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-900'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-emerald-100 p-4">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 flex items-center justify-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:border-emerald-300 hover:text-emerald-900"
          >
            <BookOpen className="h-4 w-4" />
            Open Public Site
          </Link>
          <Button onClick={logout} variant="outline" className="w-full justify-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-emerald-100 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link href="/admin" className="font-bold text-emerald-950">Admin Panel</Link>
          <div className="flex gap-2">
            <Link href="/admin/navigation">
              <Button variant="outline" size="sm">Actions</Button>
            </Link>
            <Button onClick={logout} variant="outline" size="sm">Logout</Button>
          </div>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {navSections.flatMap(section => section.items).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium ${
                isActive(pathname, item.href)
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                  : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </header>

      <div className="lg:pl-72">
        {children}
      </div>
    </div>
  )
}
