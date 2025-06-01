import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  try {
    console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY)

    const { name, email, message } = await req.json()
    console.log(name, email, message);
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      subject: `New message from ${name}`,
      reply_to: email,
      html: `
        <div style="font-family:sans-serif;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong><br/>${message}</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[CONTACT_ERROR]', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
