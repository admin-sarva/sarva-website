import { NextResponse } from 'next/server'
import { dbConnect } from '../../../../lib/db'
import Contact from '../../../models/contact'

export async function GET(req) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1)
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '10', 10), 1), 50)
    const status = searchParams.get('status')
    const search = searchParams.get('search')?.trim()

    const query = {}

    if (status && status !== 'all') {
      query.status = status
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (page - 1) * limit
    const [contacts, total] = await Promise.all([
      Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(query),
    ])

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(Math.ceil(total / limit), 1),
      },
    })
  } catch (error) {
    console.error('[ADMIN_CONTACTS_GET]', error)
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    await dbConnect()

    const { id, status } = await req.json()
    const allowedStatuses = ['new', 'read', 'replied', 'archived']

    if (!id || !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid contact status update' }, { status: 400 })
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    )

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    return NextResponse.json(contact)
  } catch (error) {
    console.error('[ADMIN_CONTACTS_PATCH]', error)
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 })
  }
}
