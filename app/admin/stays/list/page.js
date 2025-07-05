"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../../../@/components/ui/button"
import { useAuth } from "../../../../lib/useAuth"
import Loading from "../../../../components/shared/loading"

export default function StaysListPage() {
  const [stays, setStays] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { isAuthenticated, loading: authLoading, logout } = useAuth()

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetch("/api/stays")
        .then(res => res.json())
        .then(data => {
          setStays(data)
          setLoading(false)
        })
        .catch(err => {
          console.error('Error fetching stays:', err)
          setLoading(false)
        })
    }
  }, [authLoading, isAuthenticated])

  const handleDelete = async (slug) => {
    if (!confirm('Are you sure you want to delete this stay?')) return
    
    try {
      const res = await fetch(`/api/stays/${slug}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        setStays(stays.filter(stay => stay.slug !== slug))
      } else {
        alert('Failed to delete stay')
      }
    } catch (err) {
      console.error('Error deleting stay:', err)
      alert('Failed to delete stay')
    }
  }

  if (authLoading) return <div className="p-8"><Loading /></div>
  if (!isAuthenticated) return null

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Stays</h1>
        <div className="flex gap-2">
          <Button onClick={() => router.push('/admin/stays')} variant="outline">
            Add New Stay
          </Button>
          <Button onClick={() => router.push('/admin')} variant="outline">
            Dashboard
          </Button>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8"><Loading /></div>
      ) : (
        <div className="grid gap-4">
          {stays.map(stay => (
            <div key={stay._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-semibold">{stay.name}</h3>
                    <span className="text-sm text-gray-500">({stay.slug})</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{stay.subtitle}</p>
                  <p className="text-sm text-gray-500 mb-2">{stay.place}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Type: {stay.type}</span>
                    <span>Price: ₹{stay.pricePerNight}/night</span>
                    <span>Rating: {stay.rating}/5</span>
                  </div>
                  {stay.tags && stay.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {stay.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => router.push(`/admin/stays/edit/${stay.slug}`)}
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(stay.slug)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && stays.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No stays found. <Button onClick={() => router.push('/admin/stays')} variant="link">Add your first stay</Button>
        </div>
      )}
    </div>
  )
} 