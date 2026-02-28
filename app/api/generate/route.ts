import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { createKieTask } from '@/lib/kie-ai'

// Format the user-selected format into an aspect ratio string
function toAspectRatio(format: string): string {
  if (format?.includes('9:16') || format?.toLowerCase().includes('tiktok') || format?.toLowerCase().includes('stories')) return '9:16'
  if (format?.includes('1:1') || format?.toLowerCase().includes('instagram')) return '1:1'
  return '16:9'
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { productUrl, script, format, duration, aiModel, actorId, resolution } = body

    if (!aiModel || !actorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Upsert user in DB (sync with Clerk)
    const user = await prisma.user.upsert({
      where:  { clerkId: userId },
      update: {},
      create: { clerkId: userId, email: `${userId}@placeholder.com`, credits: 3 },
    })

    // Check credits
    if (user.credits <= 0) {
      return NextResponse.json({ error: 'No credits remaining' }, { status: 402 })
    }

    // Build the prompt from product info + script
    const prompt = script?.trim()
      || `Create a compelling video ad for this product: ${productUrl || 'a premium product'}. Show the product in use, highlight key benefits, and end with a strong call to action.`

    const aspectRatio = toAspectRatio(format)
    const durationStr = String(duration || '30')

    // Create DB entry immediately with PROCESSING status
    const video = await prisma.video.create({
      data: {
        userId:    user.id,
        title:     `${actorId} × ${aiModel} — ${new Date().toLocaleDateString()}`,
        status:    'PROCESSING',
        aiModel,
        actorId,
        scriptText: prompt,
        format:    aspectRatio,
        duration:  parseInt(durationStr),
      },
    })

    // Submit to kie.ai (non-blocking — we store taskId and poll later)
    try {
      const kieTaskId = await createKieTask({
        modelId:     aiModel,
        prompt,
        aspectRatio,
        duration:    durationStr,
        resolution,
      })

      // Save taskId to DB
      await prisma.video.update({
        where: { id: video.id },
        data:  { kieTaskId },
      })

      // Deduct 1 credit
      await prisma.user.update({
        where: { id: user.id },
        data:  { credits: { decrement: 1 } },
      })

      return NextResponse.json({
        success:       true,
        videoId:       video.id,
        kieTaskId,
        title:         video.title,
        status:        'PROCESSING',
        estimatedTime: aiModel === 'veo31' ? 90 : aiModel === 'sora2pro' ? 180 : 120,
      })
    } catch (kieError) {
      // Mark video as failed if kie.ai call fails
      await prisma.video.update({
        where: { id: video.id },
        data:  { status: 'FAILED' },
      })
      console.error('Kie.ai error:', kieError)
      return NextResponse.json({ error: 'AI generation failed', details: String(kieError) }, { status: 502 })
    }
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
