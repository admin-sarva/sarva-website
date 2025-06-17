import { dbConnect } from '../../../lib/db'
import Stay from '../../models/stay'
import { NextResponse } from 'next/server'

export async function GET() {
  await dbConnect()
  const stays = await Stay.find({})
  return NextResponse.json(stays)
}

export async function POST(req) {
  await dbConnect()
  const body = await req.json()
  const stay = await Stay.create(body)
  return NextResponse.json(stay, { status: 201 })
}
