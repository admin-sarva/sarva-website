"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../../../@/components/ui/button"
import { useAuth } from "../../../../lib/useAuth"
import Loading from "../../../../components/shared/loading"

export default function PlacesListPage() {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { isAuthenticated, loading: authLoading, logout } = useAuth()

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetch("/api/places")
        .then(res => res.json())
        .then(data => {
          setPlaces(data)
          setLoading(false)
        })
        .catch(err => {
          console.error('Error fetching places:', err)
          setLoading(false)
        })
    }
  }, [authLoading, isAuthenticated])

  const handleDelete = async (slug) => {
    if (!confirm('Are you sure you want to delete this place? This action cannot be undone.')) return
    
    try {
      const res = await fetch(`/api/places/${slug}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        setPlaces(places.filter(place => place.slug !== slug))
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to delete place')
      }
    } catch (err) {
      console.error('Error deleting place:', err)
      alert('Failed to delete place')
    }
  }

  if (authLoading) return <div className="p-8"><Loading /></div>
  if (!isAuthenticated) return null

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Places</h1>
        <div className="flex gap-2">
          <Button onClick={() => router.push('/admin/places')} variant="outline">
            Add New Place
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
          {places.map(place => (
            <div key={place._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-semibold">{place.name}</h3>
                    <span className="text-sm text-gray-500">({place.slug})</span>
                  </div>
                  {place.title && (
                    <p className="text-md text-gray-700 font-medium mb-1">{place.title}</p>
                  )}
                  {place.subtitle && (
                    <p className="text-sm text-gray-600 mb-2">{place.subtitle}</p>
                  )}
                  {place.quote && (
                    <p className="text-sm italic text-gray-500 mb-2">"{place.quote}"</p>
                  )}
                  {place.description && place.description.length > 0 && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {place.description[0]}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Spots: {place.spots?.length || 0}</span>
                    <span>Gallery Images: {place.images?.length || 0}</span>
                  </div>
                  {place.heroImage && (
                    <div className="mt-3">
                      <img 
                        src={place.heroImage} 
                        alt={place.name} 
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => router.push(`/admin/places/edit/${place.slug}`)}
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(place.slug)}
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

      {!loading && places.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No places found. <Button onClick={() => router.push('/admin/places')} variant="link">Add your first place</Button>
        </div>
      )}
    </div>
  )
}

