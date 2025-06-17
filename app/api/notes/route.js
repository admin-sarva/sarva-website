import { NextResponse } from 'next/server'
import { dbConnect } from '../../../lib/db'
import Note from '../../models/note'

export async function GET(req) {
  await dbConnect()
  const url = new URL(req.url)
  const status = url.searchParams.get('status') || 'approved'
  const notes = await Note.find({ status })
  return NextResponse.json(notes)
}

export async function POST(req) {
  await dbConnect()
  const data = await req.json()
  const note = await Note.create({ ...data, status: 'pending' })
  return NextResponse.json(note, { status: 201 })
}

export async function PATCH(req) {
  await dbConnect()
  const { id, status } = await req.json()
  const note = await Note.findByIdAndUpdate(id, { status }, { new: true })
  if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 })
  return NextResponse.json(note)
} 