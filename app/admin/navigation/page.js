"use client"

import { useAuth } from "../../../lib/useAuth"
import { Button } from "../../../@/components/ui/button"
import Link from "next/link"
import Loading from "../../../components/shared/loading"

export default function AdminNavigationPage() {
  const { isAuthenticated, loading: authLoading, logout } = useAuth()

  const adminPages = [
    {
      title: "Admin Dashboard",
      description: "Main admin dashboard with overview and quick actions",
      path: "/admin",
      icon: "🏠",
      category: "Main"
    },
    {
      title: "Contact Submissions",
      description: "View and manage contact form submissions from visitors",
      path: "/admin/contacts",
      icon: "📧",
      category: "Content"
    },
    {
      title: "Wander Notes Management",
      description: "Review, approve, and manage user-submitted wander notes",
      path: "/admin/notes",
      icon: "📝",
      category: "Content"
    },
    {
      title: "Stays Management",
      description: "Add, edit, and manage accommodation listings and properties",
      path: "/admin/stays",
      icon: "🏡",
      category: "Content"
    },
    {
      title: "Places Management",
      description: "Add, edit, and manage destination pages and locations",
      path: "/admin/places",
      icon: "🗺️",
      category: "Content"
    },
    {
      title: "Admin Login",
      description: "Authentication page for admin access",
      path: "/admin/login",
      icon: "🔐",
      category: "System"
    }
  ]

  const groupedPages = adminPages.reduce((acc, page) => {
    if (!acc[page.category]) {
      acc[page.category] = []
    }
    acc[page.category].push(page)
    return acc
  }, {})

  if (authLoading) return <div className="p-8"><Loading /> </div>
  if (!isAuthenticated) return null // Will redirect to login

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ecfdf5] to-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900 mb-2">Admin Navigation</h1>
            <p className="text-gray-600">Complete list of all admin pages and functions</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Button onClick={logout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        <div className="grid gap-8">
          {Object.entries(groupedPages).map(([category, pages]) => (
            <div key={category} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-emerald-800 mb-4 border-b pb-2">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pages.map((page) => (
                  <Link key={page.path} href={page.path}>
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{page.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                            {page.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {page.description}
                          </p>
                          <p className="text-xs text-emerald-600 mt-2 font-mono">
                            {page.path}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/contacts">
              <Button className="w-full" variant="outline">
                📧 Contacts
              </Button>
            </Link>
            <Link href="/admin/notes">
              <Button className="w-full" variant="outline">
                📝 Notes
              </Button>
            </Link>
            <Link href="/admin/stays">
              <Button className="w-full" variant="outline">
                🏡 Stays
              </Button>
            </Link>
            <Link href="/admin/places">
              <Button className="w-full" variant="outline">
                🗺️ Places
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-emerald-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-emerald-800 mb-3">Admin Panel Features</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✅ <strong>Contact Management:</strong> View and manage contact form submissions</li>
            <li>✅ <strong>Wander Notes:</strong> Review and approve user submissions</li>
            <li>✅ <strong>Stays Management:</strong> Add/edit accommodation listings with image uploads</li>
            <li>✅ <strong>Places Management:</strong> Create destination pages with rich content</li>
            <li>✅ <strong>Secure Authentication:</strong> Password-protected access</li>
            <li>✅ <strong>Session Management:</strong> Automatic logout after 24 hours</li>
            <li>✅ <strong>Responsive Design:</strong> Works on all devices</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 