import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getKieTaskStatus } from '@/lib/kie-ai'

/**
 * GET /api/generate/status?videoId=xxx
 * Polls kie.ai for the task status and updates the DB.
 * Called by the frontend every ~5s while a video is PROCESSING.
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const videoId = req.nextUrl.searchParams.get('videoId')
    if (!videoId) return NextResponse.json({ error: 'Missing videoId' }, { status: 400 })

    // Fetch the video + verify ownership
    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const video = await prisma.video.findFirst({
      where: { id: videoId, userId: user.id },
    })
    if (!video) return NextResponse.json({ error: 'Video not found' }, { status: 404 })

    // If already resolved, return immediately
    if (video.status === 'DONE' || video.status === 'FAILED') {
      return NextResponse.json({ status: video.status, videoUrl: video.videoUrl })
    }

    // No taskId yet → still queued
    if (!video.kieTaskId) {
      return NextResponse.json({ status: 'PROCESSING' })
    }

    // Poll kie.ai
    const result = await getKieTaskStatus(video.kieTaskId, video.aiModel)

    if (result.status === 'DONE') {
      await prisma.video.update({
        where: { id: video.id },
        data: {
          status:   'DONE',
          videoUrl: result.url,
        },
      })
      return NextResponse.json({ status: 'DONE', videoUrl: result.url })
    }

    if (result.status === 'FAILED') {
      await prisma.video.update({
        where: { id: video.id },
        data:  { status: 'FAILED' },
      })
      return NextResponse.json({ status: 'FAILED' })
    }

    return NextResponse.json({ status: 'PROCESSING' })
  } catch (error) {
    console.error('Status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
