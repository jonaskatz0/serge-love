import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import crypto from 'crypto'

function hashKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { model, apiKey } = await req.json()
    if (!model || !apiKey) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const keyHash = hashKey(apiKey)
    // In production: upsert in DB
    // await prisma.apiKey.upsert({ where: { userId_model: { userId, model } }, update: { keyHash }, create: { userId, model, keyHash } })

    return NextResponse.json({ success: true, model })
  } catch (error) {
    console.error('API key save error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
