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

function arrayMove(arr, from, to) {
  const copy = [...arr]
  const val = copy.splice(from, 1)[0]
  copy.splice(to, 0, val)
  return copy
}

export default function EditPlacePage() {
  const { slug } = useParams()
  const router = useRouter()
  const { isAuthenticated, loading: authLoading, logout } = useAuth()
  
  const [place, setPlace] = useState(null)
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      fetch(`/api/places/${slug}`)
        .then(res => res.json())
        .then(data => {
          setPlace(data)
          setFormData({
            name: data.name || '',
            slug: data.slug || '',
            title: data.title || '',
            subtitle: data.subtitle || '',
            heroImage: data.heroImage || '',
            quote: data.quote || '',
            description: data.description && data.description.length > 0 ? data.description : [''],
            images: data.images || [],
            spots: data.spots || [],
            caption: data.caption || '',
            image: data.image || '',
          })
          setLoading(false)
        })
        .catch(err => {
          console.error('Error fetching place:', err)
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
      const res = await fetch(`/api/places/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to update place')
      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/places')
      }, 2000)
    } catch (err) {
      setSuccess(false)
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || loading) return <div className="p-8">  <Loading /> </div>
  if (!isAuthenticated) return null

  if (!place) return <div className="p-8">Place not found</div>

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Place: {place.name}</h1>
        <div className="flex gap-2">
          <Button onClick={() => router.push('/admin/places')} variant="outline">
            Back to Places
          </Button>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>
      </div>

      <div className="grid gap-6 bg-white p-6 rounded-xl shadow-lg">
        <Input name="name" placeholder="Name (e.g. Agumbe)" value={formData.name} onChange={handleChange} />
        <Input name="slug" placeholder="Slug (e.g. agumbe)" value={formData.slug} onChange={handleChange} />
        <Input name="title" placeholder="Title" value={formData.title} onChange={handleChange} />
        <Input name="subtitle" placeholder="Subtitle" value={formData.subtitle} onChange={handleChange} />
        <Input name="quote" placeholder="Quote" value={formData.quote} onChange={handleChange} />

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

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          {formData.description.map((desc, idx) => (
            <div key={idx} className="flex gap-2">
              <Textarea
                value={desc}
                onChange={(e) => handleDescriptionChange(idx, e.target.value)}
                placeholder={`Description paragraph ${idx + 1}`}
                rows={3}
              />
              <button
                onClick={() => removeDescription(idx)}
                className="bg-red-500 text-white px-2 rounded hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
          <Button onClick={addDescription} variant="outline" size="sm">
            Add Description Paragraph
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Spots</label>
            <Button onClick={addSpot} variant="outline" size="sm">
              Add Spot
            </Button>
          </div>
          {formData.spots.map((spot, idx) => (
            <div key={idx} className="border p-4 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Spot {idx + 1}</h4>
                <button
                  onClick={() => removeSpot(idx)}
                  className="bg-red-500 text-white px-2 rounded hover:bg-red-600"
                >
                  Remove Spot
                </button>
              </div>
              <Input
                placeholder="Spot name"
                value={spot.name}
                onChange={(e) => handleSpotChange(idx, 'name', e.target.value)}
              />
              <Input
                placeholder="Preview text"
                value={spot.preview}
                onChange={(e) => handleSpotChange(idx, 'preview', e.target.value)}
              />
              <Textarea
                placeholder="Spot description"
                value={spot.description}
                onChange={(e) => handleSpotChange(idx, 'description', e.target.value)}
                rows={3}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Spot Image</label>
                <input type="file" accept="image/*" onChange={(e) => handleSpotImageUpload(idx, e)} />
                {uploadingSpotImage[idx] ? (
                  <p className="text-sm text-gray-500">Uploading spot image...</p>
                ) : spot.image && (
                  <img src={spot.image} alt="Spot" className="w-full h-40 object-cover rounded" />
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Spot Gallery Images</label>
                <input type="file" accept="image/*" multiple onChange={(e) => handleSpotGalleryUpload(idx, e)} />
                {uploadingSpotGallery[idx] ? (
                  <p className="text-sm text-gray-500">Uploading spot gallery images...</p>
                ) : spot.images && spot.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {spot.images.map((url, imgIdx) => (
                      <div key={imgIdx} className="relative">
                        <img src={url} alt={`Spot image ${imgIdx}`} className="w-full h-24 object-cover rounded" />
                        <button
                          onClick={() => removeSpotGalleryImage(idx, imgIdx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <Input name="caption" placeholder="Caption" value={formData.caption} onChange={handleChange} />
        <Input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} />

        <Button disabled={submitting} onClick={handleSubmit}>
          {submitting ? 'Updating...' : 'Update Place'}
        </Button>

        {success === true && <p className="text-green-600 text-sm">Place updated successfully. Redirecting...</p>}
        {success === false && <p className="text-red-600 text-sm">Failed to update place.</p>}
      </div>
    </div>
  )
} 