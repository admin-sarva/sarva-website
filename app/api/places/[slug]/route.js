import { dbConnect } from '../../../../lib/db'
import Place from '../../../models/place'
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
  await dbConnect()
  const { slug } = params
  const place = await Place.findOne({ slug })
  if (!place) {
    return NextResponse.json({ error: 'Place not found' }, { status: 404 })
  }
  return NextResponse.json(place)
}

export async function PUT(req, { params }) {
  await dbConnect()
  
  try {
    const body = await req.json()
    const place = await Place.findOneAndUpdate(
      { slug: params.slug },
      body,
      { new: true, runValidators: true }
    )

    if (!place) {
      return NextResponse.json({ error: 'Place not found' }, { status: 404 })
    }

    return NextResponse.json(place)
  } catch (error) {
    console.error('Error updating place:', error)
    return NextResponse.json({ error: 'Failed to update place' }, { status: 500 })
  }
}
