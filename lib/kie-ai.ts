const KIE_API_BASE = 'https://api.kie.ai'

// Map from our internal model IDs to kie.ai model identifiers
const MODEL_CONFIG: Record<string, { kieModel: string; endpoint: 'jobs' | 'veo' | 'image' }> = {
  sora2pro:    { kieModel: 'sora-2-pro-text-to-video', endpoint: 'jobs' },
  veo31:       { kieModel: 'veo3',                     endpoint: 'veo'  },
  kling30:     { kieModel: 'kling-3.0/video',          endpoint: 'jobs' },
  nanobanana2: { kieModel: 'nano-banana-2',            endpoint: 'image'},
}

function kieHeaders() {
  return {
    'Authorization': `Bearer ${process.env.KIE_API_KEY}`,
    'Content-Type': 'application/json',
  }
}

/**
 * Submit a generation task to kie.ai.
 * Returns the taskId to poll for results.
 */
export async function createKieTask(params: {
  modelId: string
  prompt: string
  aspectRatio: string   // '9:16' | '16:9' | '1:1'
  duration: string      // seconds as string, e.g. '10', '15'
  resolution?: string   // '720p'|'1080p' for Sora | '1080p'|'4K' for Veo | '1K'|'2K'|'4K' for images
}): Promise<string> {
  const config = MODEL_CONFIG[params.modelId]
  if (!config) throw new Error(`Unknown model: ${params.modelId}`)

  // ── Veo 3.1 ──────────────────────────────────────────────────────────────
  if (config.endpoint === 'veo') {
    // 1080p → veo3_fast (rapide, moins cher) | 4K → veo3 (quality)
    const veoModel = params.resolution === '4K' ? 'veo3' : 'veo3_fast'
    const res = await fetch(`${KIE_API_BASE}/api/v1/veo/generate`, {
      method: 'POST',
      headers: kieHeaders(),
      body: JSON.stringify({
        model:        veoModel,
        prompt:       params.prompt,
        aspect_ratio: params.aspectRatio,
      }),
    })
    const data = await res.json()
    if (data.code !== 200) throw new Error(`Veo error: ${data.msg}`)
    return data.data.taskId
  }

  // ── Nano Banana 2 (image) ─────────────────────────────────────────────────
  if (config.endpoint === 'image') {
    // Map '1K' | '2K' | '4K' to kie.ai resolution param
    const sizeMap: Record<string, string> = { '1K': '1k', '2K': '2k', '4K': '4k' }
    const size = sizeMap[params.resolution ?? '1K'] ?? '1k'
    const res = await fetch(`${KIE_API_BASE}/api/v1/jobs/createTask`, {
      method: 'POST',
      headers: kieHeaders(),
      body: JSON.stringify({
        model: config.kieModel,
        input: {
          prompt:        params.prompt,
          aspect_ratio:  params.aspectRatio,
          resolution:    size,
          output_format: 'jpg',
        },
      }),
    })
    const data = await res.json()
    if (data.code !== 200) throw new Error(`Nano Banana error: ${data.msg}`)
    return data.data.taskId
  }

  // ── Sora 2 Pro & Kling 3.0 ───────────────────────────────────────────────
  const input: Record<string, unknown> = {
    prompt:       params.prompt,
    aspect_ratio: params.aspectRatio,
    sound:        true,
  }

  if (params.modelId === 'kling30') {
    input.duration    = params.duration
    input.mode        = 'standard'  // Standard = 20cr/s (pricing confirmé kie.ai)
    input.multi_shots = false
  }

  if (params.modelId === 'sora2pro') {
    // n_frames = durée en secondes
    const secs = parseInt(params.duration) || 10
    input.n_frames = String(secs)
    // size: '720p' → standard | '1080p' → high (source: kie.ai/s-2pro)
    input.size = params.resolution === '1080p' ? 'high' : 'standard'
  }

  const res = await fetch(`${KIE_API_BASE}/api/v1/jobs/createTask`, {
    method: 'POST',
    headers: kieHeaders(),
    body: JSON.stringify({ model: config.kieModel, input }),
  })
  const data = await res.json()
  if (data.code !== 200) throw new Error(`${params.modelId} error: ${data.msg}`)
  return data.data.taskId
}

export type KieTaskResult =
  | { status: 'PROCESSING' }
  | { status: 'DONE'; url: string }
  | { status: 'FAILED' }

/**
 * Poll kie.ai for the current status of a task.
 */
export async function getKieTaskStatus(
  taskId:  string,
  modelId: string,
): Promise<KieTaskResult> {
  const headers = { 'Authorization': `Bearer ${process.env.KIE_API_KEY}` }

  // ── Veo polling ──────────────────────────────────────────────────────────
  if (modelId === 'veo31') {
    const res  = await fetch(`${KIE_API_BASE}/api/v1/veo/record-info?taskId=${taskId}`, { headers })
    const data = await res.json()
    const d    = data.data
    if (d?.successFlag === 1) {
      const urls: string[] = JSON.parse(d.resultUrls || '[]')
      return { status: 'DONE', url: urls[0] }
    }
    if (d?.successFlag >= 2) return { status: 'FAILED' }
    return { status: 'PROCESSING' }
  }

  // ── Generic jobs polling (Sora, Kling, Nano Banana) ──────────────────────
  const res  = await fetch(`${KIE_API_BASE}/api/v1/jobs/record-info?taskId=${taskId}`, { headers })
  const data = await res.json()
  const d    = data.data

  if (d?.successFlag === 1) {
    // Nano Banana returns direct image URLs; video models return JSON-encoded array
    let url: string
    if (modelId === 'nanobanana2') {
      url = Array.isArray(d.resultUrls) ? d.resultUrls[0] : d.resultUrls
    } else {
      const urls: string[] = JSON.parse(d.resultUrls || '[]')
      url = urls[0]
    }
    return { status: 'DONE', url }
  }
  if (d?.successFlag >= 2) return { status: 'FAILED' }
  return { status: 'PROCESSING' }
}
