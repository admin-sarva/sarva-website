'use client'

import { useState } from 'react'
import { Input } from '../../../@/components/ui/input'
import { Textarea } from '../../../@/components/ui/textarea'
import { Button } from '../../../@/components/ui/button'

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dlk6lycdy/image/upload'
const UPLOAD_PRESET = 'sarva_uploads'

function arrayMove(arr, from, to) {
  const copy = [...arr]
  const val = copy.splice(from, 1)[0]
  copy.splice(to, 0, val)
  return copy
}

export default function AddPlacePage() {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    title: '',
    subtitle: '',
    heroImage: '',
    quote: '',
    description: [''],
    images: [],
    spots: [],
    caption: '',
    image: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [uploadingSpotImage, setUploadingSpotImage] = useState({})
  const [uploadingSpotGallery, setUploadingSpotGallery] = useState({})
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

  // Hero image upload
  const handleHeroUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingHero(true)
    const url = await uploadToCloudinary(file)
    setFormData(prev => ({ ...prev, heroImage: url }))
    setUploadingHero(false)
  }

  // Gallery images upload
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

  // Description array handlers
  const handleDescriptionChange = (idx, value) => {
    setFormData(prev => {
      const desc = [...prev.description]
      desc[idx] = value
      return { ...prev, description: desc }
    })
  }
  const addDescription = () => {
    setFormData(prev => ({ ...prev, description: [...prev.description, ''] }))
  }
  const removeDescription = (idx) => {
    setFormData(prev => ({ ...prev, description: prev.description.filter((_, i) => i !== idx) }))
  }

  // Spots handlers
  const addSpot = () => {
    setFormData(prev => ({
      ...prev,
      spots: [
        ...prev.spots,
        { name: '', image: '', preview: '', description: '', images: [] },
      ],
    }))
  }
  const removeSpot = (idx) => {
    setFormData(prev => ({ ...prev, spots: prev.spots.filter((_, i) => i !== idx) }))
  }
  const handleSpotChange = (idx, field, value) => {
    setFormData(prev => {
      const spots = [...prev.spots]
      spots[idx][field] = value
      return { ...prev, spots }
    })
  }
  // Spot image upload
  const handleSpotImageUpload = async (idx, e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingSpotImage(prev => ({ ...prev, [idx]: true }))
    const url = await uploadToCloudinary(file)
    setFormData(prev => {
      const spots = [...prev.spots]
      spots[idx].image = url
      return { ...prev, spots }
    })
    setUploadingSpotImage(prev => ({ ...prev, [idx]: false }))
  }
  // Spot gallery upload
  const handleSpotGalleryUpload = async (idx, e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    setUploadingSpotGallery(prev => ({ ...prev, [idx]: true }))
    const urls = []
    for (const file of files) {
      const url = await uploadToCloudinary(file)
      urls.push(url)
    }
    setFormData(prev => {
      const spots = [...prev.spots]
      spots[idx].images = [...(spots[idx].images || []), ...urls]
      return { ...prev, spots }
    })
    setUploadingSpotGallery(prev => ({ ...prev, [idx]: false }))
  }

  // Remove gallery image
  const removeGalleryImage = (idx) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))
  }
  // Remove spot gallery image
  const removeSpotGalleryImage = (spotIdx, imgIdx) => {
    setFormData(prev => {
      const spots = [...prev.spots]
      spots[spotIdx].images = spots[spotIdx].images.filter((_, i) => i !== imgIdx)
      return { ...prev, spots }
    })
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    const payload = {
      ...formData,
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      heroImage: formData.heroImage,
      quote: formData.quote.trim(),
      description: formData.description.map(d => d.trim()).filter(Boolean),
      images: formData.images,
      spots: formData.spots.map(spot => ({
        ...spot,
        name: spot.name.trim(),
        preview: spot.preview.trim(),
        description: spot.description.trim(),
        image: spot.image,
        images: spot.images,
      })),
      caption: formData.caption.trim(),
      image: formData.image,
    }
    try {
      const res = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to add place')
      setSuccess(true)
      setFormData({
        name: '', slug: '', title: '', subtitle: '', heroImage: '', quote: '',
        description: [''], images: [], spots: [], caption: '', image: ''
      })
    } catch (err) {
      setSuccess(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Add a New Place</h1>
      <div className="grid gap-6 bg-white p-6 rounded-xl shadow-lg">
        <Input name="name" placeholder="Name (e.g. Agumbe)" value={formData.name} onChange={handleChange} />
        <Input name="slug" placeholder="Slug (e.g. agumbe)" value={formData.slug} onChange={handleChange} />
        <Input name="title" placeholder="Title (e.g. Agumbe: Where the Rain Writes First)" value={formData.title} onChange={handleChange} />
        <Input name="subtitle" placeholder="Subtitle (e.g. A village of mist, memory, and monsoon)" value={formData.subtitle} onChange={handleChange} />
        <Input name="quote" placeholder="Quote (e.g. In Agumbe, even time takes shelter.)" value={formData.quote} onChange={handleChange} />
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
          <label className="text-sm font-medium">Description Paragraphs</label>
          {formData.description.map((desc, idx) => (
            <div key={idx} className="flex gap-2 items-start mb-2">
              <Textarea
                value={desc}
                onChange={e => handleDescriptionChange(idx, e.target.value)}
                placeholder={`Paragraph ${idx + 1}`}
                rows={2}
              />
              <Button variant="outline" size="sm" onClick={() => removeDescription(idx)} disabled={formData.description.length === 1}>Remove</Button>
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={addDescription}>Add Paragraph</Button>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Gallery Images</label>
          <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} />
          {uploadingGallery ? (
            <p className="text-sm text-gray-500">Uploading gallery images...</p>
          ) : formData.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {formData.images.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt={`Gallery ${i}`} className="w-full h-24 object-cover rounded" />
                  <button type="button" className="absolute top-1 right-1 bg-white/80 rounded-full px-2 py-0.5 text-xs text-red-600 shadow" onClick={() => removeGalleryImage(i)}>x</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Spots</label>
          {formData.spots.map((spot, idx) => (
            <div key={idx} className="border rounded-lg p-4 mb-4 bg-gray-50">
              <div className="flex gap-2 mb-2">
                <Input
                  value={spot.name}
                  onChange={e => handleSpotChange(idx, 'name', e.target.value)}
                  placeholder="Spot Name"
                />
                <Button variant="outline" size="sm" onClick={() => removeSpot(idx)}>Remove</Button>
              </div>
              <Input
                value={spot.preview}
                onChange={e => handleSpotChange(idx, 'preview', e.target.value)}
                placeholder="Preview (short summary)"
                className="mb-2"
              />
              <Textarea
                value={spot.description}
                onChange={e => handleSpotChange(idx, 'description', e.target.value)}
                placeholder="Spot Description"
                rows={2}
                className="mb-2"
              />
              <div className="space-y-1 mb-2">
                <label className="text-xs font-medium">Spot Main Image</label>
                <input type="file" accept="image/*" onChange={e => handleSpotImageUpload(idx, e)} />
                {uploadingSpotImage[idx] ? (
                  <p className="text-xs text-gray-500">Uploading image...</p>
                ) : spot.image && (
                  <img src={spot.image} alt="Spot" className="w-full h-20 object-cover rounded" />
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Spot Gallery Images</label>
                <input type="file" accept="image/*" multiple onChange={e => handleSpotGalleryUpload(idx, e)} />
                {uploadingSpotGallery[idx] ? (
                  <p className="text-xs text-gray-500">Uploading gallery images...</p>
                ) : spot.images?.length > 0 && (
                  <div className="grid grid-cols-3 gap-1">
                    {spot.images.map((img, imgIdx) => (
                      <div key={imgIdx} className="relative group">
                        <img src={img} alt={`Spot Gallery ${imgIdx}`} className="w-full h-14 object-cover rounded" />
                        <button type="button" className="absolute top-0.5 right-0.5 bg-white/80 rounded-full px-1 py-0 text-xs text-red-600 shadow" onClick={() => removeSpotGalleryImage(idx, imgIdx)}>x</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={addSpot}>Add Spot</Button>
        </div>
        <Input name="caption" placeholder="Caption (for legacy support)" value={formData.caption} onChange={handleChange} />
        <Input name="image" placeholder="Image (for legacy support)" value={formData.image} onChange={handleChange} />
        <Button disabled={submitting} onClick={handleSubmit}>
          {submitting ? 'Submitting...' : 'Submit Place'}
        </Button>
        {success === true && <p className="text-green-600 text-sm">Place added successfully.</p>}
        {success === false && <p className="text-red-600 text-sm">Failed to add place.</p>}
      </div>
    </div>
  )
}
