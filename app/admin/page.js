"use client"

import { useAuth } from "../../lib/useAuth"
import { Button } from "../../@/components/ui/button"
import Link from "next/link"
import Loading from "../../components/shared/loading"

export default function AdminDashboard() {
  const { isAuthenticated, loading: authLoading, logout } = useAuth()

  if (authLoading) return <div className="p-8"><Loading /> </div>
  if (!isAuthenticated) return null // Will redirect to login

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ecfdf5] to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-900">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Link href="/admin/navigation">
              <Button variant="outline">All Pages</Button>
            </Link>
            <Button onClick={logout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/notes">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">Wander Notes</h2>
              <p className="text-gray-600">Review and approve user-submitted wander notes</p>
            </div>
          </Link>

          <Link href="/admin/stays">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">Manage Stays</h2>
              <p className="text-gray-600">Add and manage accommodation listings</p>
            </div>
          </Link>

          <Link href="/admin/places">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">Manage Places</h2>
              <p className="text-gray-600">Add and manage destination pages</p>
            </div>
          </Link>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/admin/notes">
              <Button className="w-full" variant="outline">
                Review Pending Notes
              </Button>
            </Link>
            <Link href="/admin/stays">
              <Button className="w-full" variant="outline">
                Add New Stay
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-emerald-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-emerald-800 mb-3">📋 Complete Admin Navigation</h2>
          <p className="text-gray-700 mb-4">View all available admin pages and their functions in one place.</p>
          <Link href="/admin/navigation">
            <Button className="w-full">
              View All Admin Pages
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 