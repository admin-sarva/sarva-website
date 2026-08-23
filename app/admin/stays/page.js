'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '../../../@/components/ui/input'
import { Textarea } from '../../../@/components/ui/textarea'
import { Button } from '../../../@/components/ui/button'
import { useAuth } from '../../../lib/useAuth'
import Loading from '../../../components/shared/loading'
import PropagationGuide from '../../../components/admin/propagation-guide'

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dlk6lycdy/image/upload'
const UPLOAD_PRESET = 'sarva_uploads'
const PLACE_SUGGESTIONS = ['Agumbe', 'Coorg', 'Sakleshpur', 'Madikeri', 'Ooty', 'Wayanad', 'Chikkamagalur', 'Udupi', 'Gokarna', 'Coonoor', 'Mysore']
const STAY_TAG_SUGGESTIONS = ['forest', 'coffee estate', 'waterfall', 'family-friendly', 'couples', 'workation', 'pet-friendly', 'pool', 'premium', 'budget']
const BEST_FOR_SUGGESTIONS = ['couples', 'families', 'friends', 'workation', 'nature lovers', 'slow travel']
const AMENITY_SUGGESTIONS = ['wifi', 'parking', 'breakfast', 'bonfire', 'pool', 'guided walks', 'pet friendly', 'power backup']

function makeSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function AddStayPage() {
  const router = useRouter()
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
  const [propagationOn, setPropagationOn] = useState(true)
  const { isAuthenticated, loading: authLoading, logout } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'name' && !prev.slug ? { slug: makeSlug(value) } : {}),
    }))
  }

  const uploadToCloudinary = async (file) => {
    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', UPLOAD_PRESET)

    const res = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: form,
    })

    if (!res.ok) throw new Error('Image upload failed')
    const data = await res.json()
    return data.secure_url
  }

  const handleHeroUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingHero(true)
    try {
      const url = await uploadToCloudinary(file)
      setFormData(prev => ({ ...prev, heroImage: url }))
      if (propagationOn) setTimeout(() => jumpToStep('stay-step-content'), 100)
    } finally {
      setUploadingHero(false)
    }
  }

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    setUploadingGallery(true)
    try {
      const urls = []
      for (const file of files) {
        const url = await uploadToCloudinary(file)
        urls.push(url)
      }
      setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }))
    } finally {
      setUploadingGallery(false)
    }
  }

  const removeGalleryImage = (idx) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))
  }

  const appendCsvValue = (field, value) => {
    setFormData(prev => {
      const values = prev[field].split(',').map(item => item.trim()).filter(Boolean)
      if (!values.includes(value)) values.push(value)
      return { ...prev, [field]: values.join(', ') }
    })
  }

  const jumpToStep = (targetId) => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const staySteps = [
    {
      label: 'Name the stay and confirm its destination',
      done: Boolean(formData.name && formData.slug && formData.place && formData.type),
      next: 'Add the stay name, place, and property type.',
      targetId: 'stay-step-identity',
    },
    {
      label: 'Add tags, pricing, rating, and audience',
      done: Boolean(formData.tags && formData.pricePerNight && formData.rating && formData.bestFor),
      next: 'Pick tags, add price, rating, and best-for groups.',
      targetId: 'stay-step-discovery',
    },
    {
      label: 'Upload the required hero image',
      done: Boolean(formData.heroImage),
      next: 'Upload one strong landscape hero image.',
      targetId: 'stay-step-images',
    },
    {
      label: 'Add detail copy, amenities, and map',
      done: Boolean(formData.description && formData.amenities),
      next: 'Write the description and add amenities.',
      targetId: 'stay-step-content',
    },
    {
      label: 'Publish and review',
      done: false,
      next: 'Submit the stay, then review it from View All Stays.',
      targetId: 'stay-step-publish',
    },
  ]

  const staySuggestions = [
    ...PLACE_SUGGESTIONS.slice(0, 6).map(place => ({
      group: 'place',
      value: place,
      label: `Place: ${place}`,
      onSelect: () => setFormData(prev => ({ ...prev, place })),
    })),
    ...STAY_TAG_SUGGESTIONS.map(tag => ({
      group: 'tag',
      value: tag,
      label: `Tag: ${tag}`,
      onSelect: () => appendCsvValue('tags', tag),
    })),
    ...BEST_FOR_SUGGESTIONS.map(value => ({
      group: 'bestFor',
      value,
      label: `Best for: ${value}`,
      onSelect: () => appendCsvValue('bestFor', value),
    })),
    ...AMENITY_SUGGESTIONS.slice(0, 5).map(value => ({
      group: 'amenity',
      value,
      label: `Amenity: ${value}`,
      onSelect: () => appendCsvValue('amenities', value),
    })),
  ]

  const handleSubmit = async () => {
    if (!formData.name || !formData.slug || !formData.place || !formData.heroImage) {
      setSuccess(false)
      return
    }

    setSubmitting(true)

    const payload = {
      ...formData,
      pricePerNight: Number(formData.pricePerNight),
      rating: Number(formData.rating),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      bestFor: formData.bestFor.split(',').map(t => t.trim()).filter(Boolean),
      amenities: formData.amenities.split(',').map(t => t.trim()).filter(Boolean),
      description: formData.description.split('\n').map(t => t.trim()).filter(Boolean),
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

  if (authLoading) return <div className="p-8"><Loading /></div>
  if (!isAuthenticated) return null

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Add a New Stay</h1>
          <p className="text-sm text-gray-600">Create a stay card and detail page in one guided flow.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => router.push('/admin/stays/list')} variant="outline">View All Stays</Button>
          <Button onClick={() => router.push('/admin')} variant="outline">Dashboard</Button>
          <Button onClick={logout} variant="outline">Logout</Button>
        </div>
      </div>

      <PropagationGuide
        enabled={propagationOn}
        onToggle={setPropagationOn}
        title="Stay propagation"
        steps={staySteps}
        suggestions={staySuggestions}
        onJump={jumpToStep}
      />

      <div className="mb-8 rounded-lg border border-emerald-100 bg-emerald-50 p-5 text-sm text-emerald-950">
        <h2 className="mb-3 text-lg font-semibold">Stay publishing steps</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Enter the identity: name, slug, subtitle, place, and property type.</li>
          <li>Add discovery details: tags, price, rating, best-for groups, amenities, and description paragraphs.</li>
          <li>Upload one hero image first, then add 3-8 gallery images for the detail page.</li>
          <li>Add optional video and map URLs when available.</li>
          <li>Submit, then open View All Stays to review the card and edit if needed.</li>
        </ol>
      </div>

      <div className="grid gap-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div id="stay-step-identity" className="scroll-mt-6">
          <h2 className="text-lg font-semibold text-emerald-900">1. Stay identity</h2>
          <p className="text-sm text-gray-600">The slug is generated from the name until you edit it manually.</p>
        </div>
        <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <Input name="slug" placeholder="Slug (e.g. misty-canopy)" value={formData.slug} onChange={handleChange} />
        <Input name="subtitle" placeholder="Subtitle" value={formData.subtitle} onChange={handleChange} />
        <Input name="place" placeholder="Place slug or name (match the place used for filtering)" value={formData.place} onChange={handleChange} />
        <Input name="type" placeholder="Type (e.g. Treehouse, Homestay)" value={formData.type} onChange={handleChange} />

        <div id="stay-step-discovery" className="scroll-mt-6 pt-4">
          <h2 className="text-lg font-semibold text-emerald-900">2. Search and booking details</h2>
          <p className="text-sm text-gray-600">Use comma-separated values for tags, best-for, and amenities.</p>
        </div>
        <Input name="tags" placeholder="Tags (forest, pet-friendly, pool)" value={formData.tags} onChange={handleChange} />
        {propagationOn && (
          <div className="flex flex-wrap gap-2">
            {STAY_TAG_SUGGESTIONS.map(tag => (
              <button key={tag} type="button" onClick={() => appendCsvValue('tags', tag)} className="rounded-full border border-gray-200 px-3 py-1 text-xs hover:border-emerald-500">
                {tag}
              </button>
            ))}
          </div>
        )}
        <Input name="pricePerNight" placeholder="Price Per Night" value={formData.pricePerNight} onChange={handleChange} />
        <Input name="rating" placeholder="Rating (0-5)" value={formData.rating} onChange={handleChange} />
        <Input name="bestFor" placeholder="Best For (couples, families, workation)" value={formData.bestFor} onChange={handleChange} />

        <div id="stay-step-images" className="scroll-mt-6 pt-4">
          <h2 className="text-lg font-semibold text-emerald-900">3. Images</h2>
          <p className="text-sm text-gray-600">Hero image is required. Use landscape photos, ideally 1600x900 or wider.</p>
        </div>
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
                <div key={url} className="relative group">
                  <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600"
                    aria-label={`Remove gallery image ${i + 1}`}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div id="stay-step-content" className="scroll-mt-6 pt-4">
          <h2 className="text-lg font-semibold text-emerald-900">4. Detail page content</h2>
          <p className="text-sm text-gray-600">Write one paragraph per line. The first paragraph is used in cards and previews.</p>
        </div>
        <Input name="videoUrl" placeholder="Video URL (optional)" value={formData.videoUrl} onChange={handleChange} />
        <Textarea name="description" placeholder="Description (1 paragraph per line)" rows={4} value={formData.description} onChange={handleChange} />
        <Input name="amenities" placeholder="Amenities (wifi, parking, breakfast)" value={formData.amenities} onChange={handleChange} />
        <Input name="mapEmbedUrl" placeholder="Map Embed URL" value={formData.mapEmbedUrl} onChange={handleChange} />

        <div id="stay-step-publish" className="scroll-mt-6 pt-4">
          <h2 className="text-lg font-semibold text-emerald-900">5. Publish</h2>
          <p className="text-sm text-gray-600">After submitting, review the listing from View All Stays.</p>
        </div>
        <Button disabled={submitting || uploadingHero || uploadingGallery} onClick={handleSubmit}>
          {submitting ? 'Submitting...' : 'Submit Stay'}
        </Button>

        {success === true && <p className="text-green-600 text-sm">Stay added successfully.</p>}
        {success === false && <p className="text-red-600 text-sm">Failed to add stay. Check required fields: name, slug, place, and hero image.</p>}
      </div>
    </div>
  )
}
