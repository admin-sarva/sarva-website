'use client'

import { useState } from 'react'
import { Input } from '../../../@/components/ui/input'
import { Textarea } from '../../../@/components/ui/textarea'
import { Button } from '../../../@/components/ui/button'

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dlk6lycdy/image/upload'
const UPLOAD_PRESET = 'sarva_uploads' // e.g. sarva_uploads

export default function AddStayPage() {
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

  const handleSubmit = async () => {
    setSubmitting(true)

    const payload = {
      ...formData,
      pricePerNight: Number(formData.pricePerNight),
      rating: Number(formData.rating),
      tags: formData.tags.split(',').map(t => t.trim()),
      bestFor: formData.bestFor.split(',').map(t => t.trim()),
      amenities: formData.amenities.split(',').map(t => t.trim()),
      description: formData.description.split('\n').filter(Boolean),
    }

    try {
      const res = await fetch('/api/stays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to add stay')

      setSuccess(true)
      setFormData({
        name: '', slug: '', subtitle: '', place: '', type: '', tags: '',
        pricePerNight: '', rating: '', bestFor: '', heroImage: '',
        images: [], videoUrl: '', amenities: '', description: '', mapEmbedUrl: ''
      })
    } catch (err) {
      console.error(err)
      setSuccess(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Add a New Stay</h1>

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
                <img key={i} src={url} alt={`Image ${i}`} className="w-full h-24 object-cover rounded" />
              ))}
            </div>
          )}
        </div>

        <Input name="videoUrl" placeholder="Video URL (optional)" value={formData.videoUrl} onChange={handleChange} />
        <Textarea name="description" placeholder="Description (1 paragraph per line)" rows={4} value={formData.description} onChange={handleChange} />
        <Input name="amenities" placeholder="Amenities (comma-separated)" value={formData.amenities} onChange={handleChange} />
        <Input name="mapEmbedUrl" placeholder="Map Embed URL" value={formData.mapEmbedUrl} onChange={handleChange} />

        <Button disabled={submitting} onClick={handleSubmit}>
          {submitting ? 'Submitting...' : 'Submit Stay'}
        </Button>

        {success === true && <p className="text-green-600 text-sm">Stay added successfully.</p>}
        {success === false && <p className="text-red-600 text-sm">Failed to add stay.</p>}
      </div>
    </div>
  )
}
