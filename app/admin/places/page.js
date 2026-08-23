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
const PLACE_THEME_SUGGESTIONS = ['Hill station', 'Coffee country', 'Rainforest', 'Beach town', 'Temple town', 'Waterfall trail', 'Heritage city']
const SPOT_TEMPLATE_SUGGESTIONS = [
  { name: 'Sunset Point', preview: 'A relaxed viewpoint for golden-hour photographs and slow evenings.', description: 'This spot works best as an easy first stop, especially for guests who want a scenic view without committing to a long walk.' },
  { name: 'Waterfall Trail', preview: 'A nature stop with water, forest cover, and a short outdoor walk.', description: 'Add details about access, seasonality, walking difficulty, and whether local guidance is recommended during monsoon months.' },
  { name: 'Local Market', preview: 'A simple cultural stop for food, produce, souvenirs, and everyday local life.', description: 'Use this spot to help guests understand the local rhythm of the destination beyond viewpoints and photo stops.' },
  { name: 'Heritage Stop', preview: 'A temple, old street, palace, fort, or landmark that adds context to the trip.', description: 'Mention why the landmark matters, the best time to visit, and how long guests should set aside.' },
  { name: 'Nature Walk', preview: 'A quiet trail or green patch for slow mornings and birdwatching.', description: 'Describe the terrain, suggested timing, nearby stays, and whether the route is better with a local guide.' },
]

function arrayMove(arr, from, to) {
  const copy = [...arr]
  const val = copy.splice(from, 1)[0]
  copy.splice(to, 0, val)
  return copy
}

function makeSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function AddPlacePage() {
  const router = useRouter()
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
    const data = await res.json()
    return data.secure_url
  }

  // Hero image upload
  const handleHeroUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingHero(true)
    const url = await uploadToCloudinary(file)
    setFormData(prev => ({ ...prev, heroImage: url, image: prev.image || url, images: prev.images.length ? prev.images : [url] }))
    setUploadingHero(false)
    if (propagationOn) setTimeout(() => jumpToStep('place-step-story'), 100)
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
  const addSpotTemplate = (template) => {
    setFormData(prev => ({
      ...prev,
      spots: [
        ...prev.spots,
        { ...template, image: '', images: [] },
      ],
    }))
    if (propagationOn) setTimeout(() => jumpToStep('place-step-spots'), 100)
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

  const jumpToStep = (targetId) => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const addThemeToSubtitle = (theme) => {
    setFormData(prev => ({
      ...prev,
      subtitle: prev.subtitle || `${theme} escape with local stays, scenic stops, and slow travel routes`,
    }))
  }

  const addDescriptionStarter = () => {
    setFormData(prev => {
      const name = prev.name || 'This destination'
      const starter = `${name} is best introduced through its pace: slow mornings, local food, scenic drives, and small stops that help travellers feel the place instead of rushing through it.`
      const description = prev.description.length === 1 && !prev.description[0] ? [starter] : [...prev.description, starter]
      return { ...prev, description }
    })
    if (propagationOn) setTimeout(() => jumpToStep('place-step-gallery'), 100)
  }

  const placeSteps = [
    {
      label: 'Add place name, title, subtitle, and quote',
      done: Boolean(formData.name && formData.slug && formData.title && formData.subtitle),
      next: 'Complete the place identity and choose a theme if helpful.',
      targetId: 'place-step-identity',
    },
    {
      label: 'Upload the hero image',
      done: Boolean(formData.heroImage),
      next: 'Upload one strong landscape image for this place.',
      targetId: 'place-step-hero',
    },
    {
      label: 'Write the destination story',
      done: formData.description.some(desc => desc.trim().length > 80),
      next: 'Add at least one useful destination paragraph.',
      targetId: 'place-step-story',
    },
    {
      label: 'Add gallery support',
      done: formData.images.length > 0,
      next: 'Use the hero as the first gallery image or add more photos.',
      targetId: 'place-step-gallery',
    },
    {
      label: 'Create tourist spots',
      done: formData.spots.length > 0 && formData.spots.every(spot => spot.name && spot.preview && spot.description),
      next: 'Add 3-5 tourist spots with preview copy and descriptions.',
      targetId: 'place-step-spots',
    },
    {
      label: 'Publish and review',
      done: false,
      next: 'Submit the place, then review it from View All Places.',
      targetId: 'place-step-publish',
    },
  ]

  const placeSuggestions = [
    ...PLACE_THEME_SUGGESTIONS.map(theme => ({
      group: 'theme',
      value: theme,
      label: `Theme: ${theme}`,
      onSelect: () => addThemeToSubtitle(theme),
    })),
    {
      group: 'copy',
      value: 'description-starter',
      label: 'Add description starter',
      onSelect: addDescriptionStarter,
    },
    ...SPOT_TEMPLATE_SUGGESTIONS.slice(0, 4).map(template => ({
      group: 'spot',
      value: template.name,
      label: `Spot: ${template.name}`,
      onSelect: () => addSpotTemplate(template),
    })),
  ]

  const handleSubmit = async () => {
    if (!formData.name || !formData.slug || !formData.title || !formData.heroImage) {
      setSuccess(false)
      return
    }

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

  if (authLoading) return <div className="p-8">  <Loading /> </div>
  if (!isAuthenticated) return null // Will redirect to login

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Add a New Place</h1>
          <p className="text-sm text-gray-600">Create the destination page, homepage card, gallery, and scenic spots.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => router.push('/admin/places/list')} variant="outline">
            View All Places
          </Button>
          <Button onClick={() => router.push('/admin')} variant="outline">
            Dashboard
          </Button>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>
      </div>
      <PropagationGuide
        enabled={propagationOn}
        onToggle={setPropagationOn}
        title="Place propagation"
        steps={placeSteps}
        suggestions={placeSuggestions}
        onJump={jumpToStep}
      />

      <div className="mb-8 rounded-lg border border-emerald-100 bg-emerald-50 p-5 text-sm text-emerald-950">
        <h2 className="mb-3 text-lg font-semibold">Place publishing steps</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Add the place identity: name, slug, title, subtitle, and quote.</li>
          <li>Upload a hero image for the top of the detail page and cards.</li>
          <li>Add destination description paragraphs. Keep the first paragraph short and useful.</li>
          <li>Add 4-8 gallery images that show the location clearly.</li>
          <li>Add scenic spots, each with a name, preview, description, main image, and optional gallery.</li>
          <li>Submit, then open View All Places to review and edit.</li>
        </ol>
      </div>
      <div className="grid gap-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div id="place-step-identity" className="scroll-mt-6">
          <h2 className="text-lg font-semibold text-emerald-900">1. Place identity</h2>
          <p className="text-sm text-gray-600">The slug is generated from the name until you edit it manually.</p>
        </div>
        <Input name="name" placeholder="Name (e.g. Agumbe)" value={formData.name} onChange={handleChange} />
        <Input name="slug" placeholder="Slug (e.g. agumbe)" value={formData.slug} onChange={handleChange} />
        <Input name="title" placeholder="Title (e.g. Agumbe: Where the Rain Writes First)" value={formData.title} onChange={handleChange} />
        <Input name="subtitle" placeholder="Subtitle (e.g. A village of mist, memory, and monsoon)" value={formData.subtitle} onChange={handleChange} />
        <Input name="quote" placeholder="Quote (e.g. In Agumbe, even time takes shelter.)" value={formData.quote} onChange={handleChange} />
        {propagationOn && (
          <div className="flex flex-wrap gap-2">
            {PLACE_THEME_SUGGESTIONS.map(theme => (
              <button key={theme} type="button" onClick={() => addThemeToSubtitle(theme)} className="rounded-full border border-gray-200 px-3 py-1 text-xs hover:border-emerald-500">
                {theme}
              </button>
            ))}
          </div>
        )}
        <div id="place-step-hero" className="scroll-mt-6 pt-2">
          <h2 className="text-lg font-semibold text-emerald-900">2. Hero image</h2>
          <p className="text-sm text-gray-600">Required. Use a strong landscape image because it appears first on the page.</p>
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
        <div id="place-step-story" className="scroll-mt-6 pt-2">
          <h2 className="text-lg font-semibold text-emerald-900">3. Destination story</h2>
          <p className="text-sm text-gray-600">Add one idea per paragraph. The first paragraph should summarize the destination.</p>
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
          {propagationOn && (
            <Button variant="outline" size="sm" onClick={addDescriptionStarter}>Add Starter Copy</Button>
          )}
        </div>
        <div id="place-step-gallery" className="scroll-mt-6 pt-2">
          <h2 className="text-lg font-semibold text-emerald-900">4. Place gallery</h2>
          <p className="text-sm text-gray-600">Use clear images of landscapes, streets, views, water, forest, and local experiences.</p>
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
        <div id="place-step-spots" className="scroll-mt-6 pt-2">
          <h2 className="text-lg font-semibold text-emerald-900">5. Scenic spots</h2>
          <p className="text-sm text-gray-600">Each spot becomes a card and modal on the destination page.</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Spots</label>
          {propagationOn && (
            <div className="flex flex-wrap gap-2">
              {SPOT_TEMPLATE_SUGGESTIONS.map(template => (
                <button key={template.name} type="button" onClick={() => addSpotTemplate(template)} className="rounded-full border border-gray-200 px-3 py-1 text-xs hover:border-emerald-500">
                  {template.name}
                </button>
              ))}
            </div>
          )}
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
        <div id="place-step-publish" className="scroll-mt-6 pt-2">
          <h2 className="text-lg font-semibold text-emerald-900">6. Publish</h2>
          <p className="text-sm text-gray-600">After submit, review the detail page and confirm the gallery, spots, and stay recommendations.</p>
        </div>
        <Button disabled={submitting} onClick={handleSubmit}>
          {submitting ? 'Submitting...' : 'Submit Place'}
        </Button>
        {success === true && <p className="text-green-600 text-sm">Place added successfully.</p>}
        {success === false && <p className="text-red-600 text-sm">Failed to add place. Check required fields: name, slug, title, and hero image.</p>}
      </div>
    </div>
  )
}
