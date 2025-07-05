import { NextResponse } from 'next/server'
import { dbConnect } from '../../../lib/db'
import Contact from '../../models/contact'

export async function POST(req) {
  try {
    await dbConnect()
    
    const { name, email, message, members, destination } = await req.json()
    
    if (!name || !email || !message || !members || !destination) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate members is a positive number
    if (isNaN(members) || members < 1 || members > 50) {
      return NextResponse.json({ error: 'Invalid number of members' }, { status: 400 })
    }

    // Save to database
    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      members: parseInt(members),
      destination: destination.trim()
    })
    
    await contact.save()

    console.log('Contact saved successfully:', contact._id)
    return NextResponse.json({ 
      success: true, 
      message: 'Contact form submitted successfully',
      contactId: contact._id 
    })
  } catch (error) {
    console.error('[CONTACT_ERROR]', error)
    return NextResponse.json({ 
      error: 'Failed to process contact form',
      details: error.message 
    }, { status: 500 })
  }
}
