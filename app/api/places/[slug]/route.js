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
