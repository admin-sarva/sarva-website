import { dbConnect } from '../../../../lib/db'
import Stay from '../../../models/stay'
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
  await dbConnect()
  const stay = await Stay.findOne({ slug: params.slug })

  if (!stay) {
    return NextResponse.json({ error: 'Stay not found' }, { status: 404 })
  }

  return NextResponse.json(stay)
}
