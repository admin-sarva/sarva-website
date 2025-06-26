'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Input } from '../../../../../@/components/ui/input'
import { Textarea } from '../../../../../@/components/ui/textarea'
import { Button } from '../../../../../@/components/ui/button'
import { useAuth } from '../../../../../lib/useAuth'

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

  if (authLoading || loading) return <div className="p-8">Loading...</div>
  if (!isAuthenticated) return null

  if (!stay) return <div className="p-8">Stay not found</div>

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Stay: {stay.name}</h1>
        <div className="flex gap-2">
          <Button onClick={() => router.push('/admin/stays')} variant="outline">
            Back to Stays
          </Button>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <Input name="slug" placeholder="Slug (e.g. misty-canopy)" value={formData.slug} onChange={handleChange} />
        <Input name="subtitle" placeholder="Subtitle" value={formData.subtitle} onChange={handleChange} />
        <Input name="place" placeholder="Place" value={formData.place} onChange={handleChange} />
        <Input name="type" placeholder="Type (e.g. Treehouse, Homestay)" value={formData.type} onChange={handleChange} />
        <Input name="tags" placeholder="Tags (comma-separated)" value={formData.tags} onChange={handleChange} />
        <Input name="pricePerNight" placeholder="Price Per Night" value={formData.pricePerNight} onChange={handleChange} />
        <Input name="rating" placeholder="Rating" value={formData.rating} onChange={handleChange} />
        <Input name="bestFor" placeholder="Best For (comma-separated)" value={formData.bestFor} onChange={handleChange} />

        <div className="space-y-2">
          <label className="text-sm font-medium">Hero Image</label>
          <input type="file" accept="image/*" onChange={handleHeroUpload} />
          {uploadingHero ? (
            <p className="text-sm text-gray-500">Uploading hero image...</p>
          ) : formData.heroImage && (
            <img src={formData.heroImage} alt="Hero" className="w-full h-40 object-cover rounded" />
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Gallery Images</label>
          <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} />
          {uploadingGallery ? (
            <p className="text-sm text-gray-500">Uploading gallery images...</p>
          ) : formData.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {formData.images.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt={`Image ${i}`} className="w-full h-24 object-cover rounded" />
                  <button
                    onClick={() => removeGalleryImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Input name="videoUrl" placeholder="Video URL (optional)" value={formData.videoUrl} onChange={handleChange} />
        <Textarea name="description" placeholder="Description (1 paragraph per line)" rows={4} value={formData.description} onChange={handleChange} />
        <Input name="amenities" placeholder="Amenities (comma-separated)" value={formData.amenities} onChange={handleChange} />
        <Input name="mapEmbedUrl" placeholder="Map Embed URL" value={formData.mapEmbedUrl} onChange={handleChange} />

        <Button disabled={submitting} onClick={handleSubmit}>
          {submitting ? 'Updating...' : 'Update Stay'}
        </Button>

        {success === true && <p className="text-green-600 text-sm">Stay updated successfully. Redirecting...</p>}
        {success === false && <p className="text-red-600 text-sm">Failed to update stay.</p>}
      </div>
    </div>
  )
} 