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

export async function PUT(req, { params }) {
  await dbConnect()
  
  try {
    const body = await req.json()
    const stay = await Stay.findOneAndUpdate(
      { slug: params.slug },
      body,
      { new: true, runValidators: true }
    )

    if (!stay) {
      return NextResponse.json({ error: 'Stay not found' }, { status: 404 })
    }

    return NextResponse.json(stay)
  } catch (error) {
    console.error('Error updating stay:', error)
    return NextResponse.json({ error: 'Failed to update stay' }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  await dbConnect()
  
  try {
    const stay = await Stay.findOneAndDelete({ slug: params.slug })

    if (!stay) {
      return NextResponse.json({ error: 'Stay not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Stay deleted successfully' })
  } catch (error) {
    console.error('Error deleting stay:', error)
    return NextResponse.json({ error: 'Failed to delete stay' }, { status: 500 })
  }
}
