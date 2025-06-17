"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../../../@/components/ui/dialog"

export default function AdminNotesPage() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedNote, setSelectedNote] = useState(null)

  useEffect(() => {
    fetch("/api/notes?status=pending")
      .then(res => res.json())
      .then(pending => {
        fetch("/api/notes?status=approved")
          .then(res => res.json())
          .then(approved => {
            setNotes([...pending, ...approved])
            setLoading(false)
          })
      })
  }, [])

  const approveNote = async (id) => {
    await fetch("/api/notes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "approved" })
    })
    setNotes(notes => notes.map(n => n._id === id ? { ...n, status: "approved" } : n))
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">All Wander Notes</h1>
      <div className="grid gap-6">
        {notes.map(note => (
          <div key={note._id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{note.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{note.place}</p>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{note.summary}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${note.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {note.status}
                  </span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="text-sm text-blue-600 hover:text-blue-800">Preview</button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>{note.title}</DialogTitle>
                        <DialogDescription>{note.place}</DialogDescription>
                      </DialogHeader>
                      <img src={note.image} alt={note.title} className="w-full rounded mb-4" />
                      <p className="italic text-gray-600 mb-2">{note.summary}</p>
                      <div className="prose max-w-none text-gray-800 whitespace-pre-line">{note.content}</div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              {note.status === "pending" && (
                <button
                  className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
                  onClick={() => approveNote(note._id)}
                >
                  Approve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 