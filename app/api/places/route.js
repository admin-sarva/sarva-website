import { dbConnect } from '../../../lib/db'
import Place from '../../models/place'
import { NextResponse } from 'next/server'

export async function GET() {
  await dbConnect()
  const places = await Place.find({})
  return NextResponse.json(places)
}

export async function POST(req) {
  await dbConnect()
  const body = await req.json()
  const place = await Place.create(body)
  return NextResponse.json(place, { status: 201 })
}

// This API now supports rich place data (title, subtitle, heroImage, quote, description[], images[], spots[])
