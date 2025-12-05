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
    <div className="min-h-screen bg-gradient-to-br from-[#ecfdf5] to-white">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">Edit Place</h1>
            <p className="text-gray-600 mt-1">{place.name}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push('/admin/places/list')} variant="outline">
              View All Places
            </Button>
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

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid gap-8 p-8">
            {/* Basic Information Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-emerald-800 mb-4">Basic Information</h2>
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Name</label>
                  <Input name="name" placeholder="Name (e.g. Agumbe)" value={formData.name} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Slug</label>
                  <Input name="slug" placeholder="Slug (e.g. agumbe)" value={formData.slug} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Title</label>
                  <Input name="title" placeholder="Title" value={formData.title} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Subtitle</label>
                  <Input name="subtitle" placeholder="Subtitle" value={formData.subtitle} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Quote</label>
                  <Input name="quote" placeholder="Quote" value={formData.quote} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-emerald-800 mb-4">Images</h2>
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
              </div>
            </div>

            {/* Description Section */}
            <div className="border-b pb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-emerald-800">Description</h2>
                <Button onClick={addDescription} variant="outline" size="sm">
                  + Add Paragraph
                </Button>
              </div>
              <div className="space-y-3">
                {formData.description.map((desc, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <Textarea
                        value={desc}
                        onChange={(e) => handleDescriptionChange(idx, e.target.value)}
                        placeholder={`Description paragraph ${idx + 1}`}
                        rows={3}
                        className="w-full"
                      />
                    </div>
                    <button
                      onClick={() => removeDescription(idx)}
                      className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                      disabled={formData.description.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Spots Section */}
            <div className="border-b pb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-emerald-800">Spots</h2>
                <Button onClick={addSpot} variant="outline" size="sm">
                  + Add Spot
                </Button>
              </div>
              <div className="space-y-4">
                {formData.spots.map((spot, idx) => (
                  <div key={idx} className="border-2 border-gray-200 p-5 rounded-lg bg-gray-50 space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b">
                      <h4 className="font-semibold text-lg text-gray-800">Spot {idx + 1}</h4>
                      <button
                        onClick={() => removeSpot(idx)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                      >
                        Remove Spot
                      </button>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Spot Name</label>
                      <Input
                        placeholder="Spot name"
                        value={spot.name}
                        onChange={(e) => handleSpotChange(idx, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Preview Text</label>
                      <Input
                        placeholder="Preview text"
                        value={spot.preview}
                        onChange={(e) => handleSpotChange(idx, 'preview', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Spot Description</label>
                      <Textarea
                        placeholder="Spot description"
                        value={spot.description}
                        onChange={(e) => handleSpotChange(idx, 'description', e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 block">Spot Main Image</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleSpotImageUpload(idx, e)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                      />
                      {uploadingSpotImage[idx] ? (
                        <p className="text-sm text-gray-500 mt-2">Uploading spot image...</p>
                      ) : spot.image && (
                        <div className="mt-3">
                          <img src={spot.image} alt="Spot" className="w-full h-48 object-cover rounded-lg border-2 border-gray-200" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 block">Spot Gallery Images</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={(e) => handleSpotGalleryUpload(idx, e)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                      />
                      {uploadingSpotGallery[idx] ? (
                        <p className="text-sm text-gray-500 mt-2">Uploading spot gallery images...</p>
                      ) : spot.images && spot.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-3 mt-3">
                          {spot.images.map((url, imgIdx) => (
                            <div key={imgIdx} className="relative group">
                              <img src={url} alt={`Spot image ${imgIdx}`} className="w-full h-32 object-cover rounded-lg border-2 border-gray-200" />
                              <button
                                onClick={() => removeSpotGalleryImage(idx, imgIdx)}
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
                  </div>
                ))}
              </div>
            </div>

            {/* Legacy Fields Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-emerald-800 mb-4">Legacy Fields</h2>
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Caption</label>
                  <Input name="caption" placeholder="Caption" value={formData.caption} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Image URL</label>
                  <Input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="flex justify-between items-center pt-4">
              <div>
                {success === true && <p className="text-green-600 text-sm font-medium">✓ Place updated successfully. Redirecting...</p>}
                {success === false && <p className="text-red-600 text-sm font-medium">✗ Failed to update place. Please try again.</p>}
              </div>
              <Button disabled={submitting} onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
                {submitting ? 'Updating...' : 'Update Place'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 