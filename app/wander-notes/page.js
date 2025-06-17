"use client"

import { useEffect, useState } from "react"
import BlogCard from "../../components/ui/blog-card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogClose } from "../../@/components/ui/dialog"

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dlk6lycdy/image/upload'
const UPLOAD_PRESET = 'sarva_uploads'

export default function WanderNotesPage() {
  const [notes, setNotes] = useState([])
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', slug: '', summary: '', place: '', image: '', content: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    fetch("/api/notes")
      .then(res => res.json())
      .then(setNotes)
  }, [])

  const handleFormChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleFormSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
    setSubmitting(false)
    setSubmitted(true)
    setForm({ title: '', slug: '', summary: '', place: '', image: '', content: '' })
  }

  const uploadToCloudinary = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)
    const res = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    return data.secure_url
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const url = await uploadToCloudinary(file)
      setForm(prev => ({ ...prev, image: url }))
    } catch (err) {
      console.error('Failed to upload image:', err)
    }
    setUploadingImage(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#f7fefc] py-16 px-4 sm:px-6 md:px-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-emerald-900 mb-4">Wander Notes</h1>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">Stories, secrets and nearby wonders - softly shared from the road.</p>
        <button onClick={() => setShowForm(true)} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-emerald-700 transition">Share your story</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {notes.map(note => (
          <Dialog key={note._id || note.slug}>
            <DialogTrigger asChild>
              <div onClick={() => setSelected(note)}><BlogCard note={note} /></div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{note.title}</DialogTitle>
                <DialogDescription>{note.place}</DialogDescription>
              </DialogHeader>
              <img src={note.image} alt={note.title} className="w-full rounded mb-4" />
              <p className="italic text-gray-600 mb-2">{note.summary}</p>
              <div className="prose max-w-none text-gray-800 whitespace-pre-line">{note.content}</div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share your Wander Note</DialogTitle>
            <DialogDescription>Your story will be reviewed by admin before it appears here.</DialogDescription>
          </DialogHeader>
          {submitted ? (
            <div className="text-emerald-700 font-semibold py-8 text-center">Thank you for sharing! Your note is under review.</div>
          ) : (
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <input name="title" value={form.title} onChange={handleFormChange} required placeholder="Title" className="w-full border rounded p-2" />
              <input name="slug" value={form.slug} onChange={handleFormChange} required placeholder="Unique Slug (e.g. my-trip)" className="w-full border rounded p-2" />
              <input name="summary" value={form.summary} onChange={handleFormChange} required placeholder="Summary" className="w-full border rounded p-2" />
              <input name="place" value={form.place} onChange={handleFormChange} required placeholder="Place" className="w-full border rounded p-2" />
              <div className="space-y-2">
                <label className="text-sm font-medium">Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full" />
                {uploadingImage ? (
                  <p className="text-sm text-gray-500">Uploading image...</p>
                ) : form.image && (
                  <img src={form.image} alt="Preview" className="w-full h-40 object-cover rounded" />
                )}
              </div>
              <textarea name="content" value={form.content} onChange={handleFormChange} required placeholder="Your story..." className="w-full border rounded p-2 min-h-[120px]" />
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <button type="button" className="px-4 py-2 rounded border">Cancel</button>
                </DialogClose>
                <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded font-semibold hover:bg-emerald-700 transition" disabled={submitting}>{submitting ? "Submitting..." : "Submit"}</button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
