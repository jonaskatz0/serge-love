import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

/**
 * POST /api/upload
 * Accepts a product image, uploads it to Telegraph (free, anonymous CDN),
 * and returns a public URL for use with kie.ai image-to-video.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    // Validate type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only images are allowed' }, { status: 400 })
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be under 5MB' }, { status: 400 })
    }

    // Upload to Telegraph (free anonymous CDN — no API key needed)
    const telegraphForm = new FormData()
    telegraphForm.append('file', file)

    const res = await fetch('https://telegra.ph/upload', {
      method: 'POST',
      body: telegraphForm,
    })

    if (!res.ok) throw new Error('Telegraph upload failed')

    const data = await res.json()
    const url = `https://telegra.ph${data[0].src}`

    return NextResponse.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
