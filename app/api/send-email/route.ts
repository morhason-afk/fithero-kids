import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const apiKey = process.env.RESEND_API_KEY
// From address: use your Resend sender, e.g. "FitHero Kids <fitherokids-support@juuzoraan.resend.app>"
const fromEmail = process.env.RESEND_FROM_EMAIL || 'FitHero Kids <onboarding@resend.dev>'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { to, subject, message } = body

    if (!to || typeof to !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid "to" email address' }, { status: 400 })
    }
    if (!subject || typeof subject !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid "subject"' }, { status: 400 })
    }
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid "message"' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to.trim())) {
      return NextResponse.json({ error: 'Invalid email address format' }, { status: 400 })
    }

    if (!apiKey || apiKey.length < 10) {
      return NextResponse.json(
        { error: 'Email not configured. Add RESEND_API_KEY to your environment (see EMAIL_SETUP.md).' },
        { status: 503 }
      )
    }

    const resend = new Resend(apiKey)
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to.trim()],
      subject: String(subject).slice(0, 200),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #667eea; margin-bottom: 20px;">${String(subject).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</h2>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="font-size: 16px; line-height: 1.6; color: #333;">${String(message).replace(/\n/g, '<br>').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">FitHero Kids – Exercise Game</p>
        </div>
      `,
      text: String(message).slice(0, 10000),
    })

    if (error) {
      const msg =
        (error as { message?: string })?.message ||
        (error instanceof Error ? error.message : JSON.stringify(error))
      return NextResponse.json(
        { error: `Failed to send email: ${msg}`, details: msg },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, messageId: data?.id, message: 'Email sent successfully' })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Server error: ${msg}`, details: msg },
      { status: 500 }
    )
  }
}
