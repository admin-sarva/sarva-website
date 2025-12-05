'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Input } from '../../../../../@/components/ui/input'
import { Textarea } from '../../../../../@/components/ui/textarea'
import { Button } from '../../../../../@/components/ui/button'
import { useAuth } from '../../../../../lib/useAuth'
import Loading from '../../../../../components/shared/loading'

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dlk6lycdy/image/upload'
const UPLOAD_PRESET = 'sarva_uploads'

export default function EditStayPage() {
  const { slug } = useParams()
  const router = useRouter()
  const { isAuthenticated, loading: authLoading, logout } = useAuth()
  
  const [stay, setStay] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    subtitle: '',
    place: '',
    type: '',
    tags: '',
    pricePerNight: '',
    rating: '',
    bestFor: '',
    heroImage: '',
    images: [],
    videoUrl: '',
    amenities: '',
    description: '',
    mapEmbedUrl: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      fetch(`/api/stays/${slug}`)
        .then(res => res.json())
        .then(data => {
          setStay(data)
          setFormData({
            name: data.name || '',
            slug: data.slug || '',
            subtitle: data.subtitle || '',
            place: data.place || '',
            type: data.type || '',
            tags: data.tags ? data.tags.join(', ') : '',
            pricePerNight: data.pricePerNight || '',
            rating: data.rating || '',
            bestFor: data.bestFor ? data.bestFor.join(', ') : '',
            heroImage: data.heroImage || '',
            images: data.images || [],
            videoUrl: data.videoUrl || '',
            amenities: data.amenities ? data.amenities.join(', ') : '',
            description: data.description ? data.description.join('\n') : '',
            mapEmbedUrl: data.mapEmbedUrl || '',
          })
          setLoading(false)
        })
        .catch(err => {
          console.error('Error fetching stay:', err)
          setLoading(false)
        })
    }
  }, [slug])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const uploadToCloudinary = async (file) => {
    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', UPLOAD_PRESET)

    const res = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: form,
    })

    const data = await res.json()
    return data.secure_url
  }

  const handleHeroUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingHero(true)
    const url = await uploadToCloudinary(file)
    setFormData(prev => ({ ...prev, heroImage: url }))
    setUploadingHero(false)
  }

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    setUploadingGallery(true)
    const urls = []
    for (const file of files) {
      const url = await uploadToCloudinary(file)
      urls.push(url)
    }
    setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }))
    setUploadingGallery(false)
  }

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)

    const payload = {
      ...formData,
      pricePerNight: Number(formData.pricePerNight),
      rating: Number(formData.rating),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      bestFor: formData.bestFor.split(',').map(t => t.trim()).filter(Boolean),
      amenities: formData.amenities.split(',').map(t => t.trim()).filter(Boolean),
      description: formData.description.split('\n').filter(Boolean),
    }

    try {
      const res = await fetch(`/api/stays/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to update stay')

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/stays')
      }, 2000)
    } catch (err) {
      console.error(err)
      setSuccess(false)
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || loading) return <div className="p-8"> <Loading /> </div>
  if (!isAuthenticated) return null

  if (!stay) return <div className="p-8">Stay not found</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ecfdf5] to-white">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">Edit Stay</h1>
            <p className="text-gray-600 mt-1">{stay.name}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push('/admin/stays/list')} variant="outline">
              View All Stays
            </Button>
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

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid gap-8 p-8">
            {/* Basic Information Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-emerald-800 mb-4">Basic Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Name</label>
                  <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Slug</label>
                  <Input name="slug" placeholder="Slug (e.g. misty-canopy)" value={formData.slug} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Subtitle</label>
                  <Input name="subtitle" placeholder="Subtitle" value={formData.subtitle} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Place</label>
                  <Input name="place" placeholder="Place" value={formData.place} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Type</label>
                  <Input name="type" placeholder="Type (e.g. Treehouse, Homestay)" value={formData.type} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Price Per Night (₹)</label>
                  <Input name="pricePerNight" type="number" placeholder="Price Per Night" value={formData.pricePerNight} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Rating</label>
                  <Input name="rating" type="number" step="0.1" placeholder="Rating (0-5)" value={formData.rating} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Tags</label>
                  <Input name="tags" placeholder="Tags (comma-separated)" value={formData.tags} onChange={handleChange} />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Best For</label>
                  <Input name="bestFor" placeholder="Best For (comma-separated)" value={formData.bestFor} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-emerald-800 mb-4">Images & Media</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">Hero Image</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleHeroUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                  {uploadingHero ? (
                    <p className="text-sm text-gray-500 mt-2">Uploading hero image...</p>
                  ) : formData.heroImage && (
                    <div className="mt-3">
                      <img src={formData.heroImage} alt="Hero" className="w-full h-48 object-cover rounded-lg border-2 border-gray-200" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">Gallery Images</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleGalleryUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                  {uploadingGallery ? (
                    <p className="text-sm text-gray-500 mt-2">Uploading gallery images...</p>
                  ) : formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mt-3">
                      {formData.images.map((url, i) => (
                        <div key={i} className="relative group">
                          <img src={url} alt={`Image ${i}`} className="w-full h-32 object-cover rounded-lg border-2 border-gray-200" />
                          <button
                            onClick={() => removeGalleryImage(i)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Video URL (optional)</label>
                  <Input name="videoUrl" placeholder="Video URL (optional)" value={formData.videoUrl} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-emerald-800 mb-4">Content</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                  <Textarea 
                    name="description" 
                    placeholder="Description (1 paragraph per line)" 
                    rows={6} 
                    value={formData.description} 
                    onChange={handleChange}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter each paragraph on a new line</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Amenities</label>
                  <Input name="amenities" placeholder="Amenities (comma-separated)" value={formData.amenities} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Map Embed URL</label>
                  <Input name="mapEmbedUrl" placeholder="Map Embed URL" value={formData.mapEmbedUrl} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="flex justify-between items-center pt-4">
              <div>
                {success === true && <p className="text-green-600 text-sm font-medium">✓ Stay updated successfully. Redirecting...</p>}
                {success === false && <p className="text-red-600 text-sm font-medium">✗ Failed to update stay. Please try again.</p>}
              </div>
              <Button disabled={submitting} onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
                {submitting ? 'Updating...' : 'Update Stay'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 