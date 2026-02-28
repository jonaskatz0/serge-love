'use client'
import { useState, useRef, useCallback } from 'react'
import { TopBar } from '@/components/dashboard/TopBar'
import { ModelCard } from '@/components/dashboard/ModelCard'
import { ActorCard } from '@/components/dashboard/ActorCard'
import { AI_MODELS, ACTORS } from '@/lib/ai-models'
import { Textarea } from '@/components/ui/Input'

const FORMATS = ['TikTok 9:16', 'Instagram 1:1', 'YouTube 16:9', 'Stories 9:16']
const DURATIONS = ['15s', '30s', '60s']
const FILTERS = ['All', 'Female', 'Male', 'European', 'Asian', 'Latino', 'African']

type Step = 1 | 2 | 3
type Status = 'idle' | 'generating' | 'done' | 'error'

const GENERATION_STEPS = [
  'Uploading product photo...',
  'Initializing AI engine...',
  'Rendering actor...',
  'Adding motion & effects...',
  'Finalizing video...',
]

export default function CreatePage() {
  const [step, setStep]                   = useState<Step>(1)
  const [status, setStatus]               = useState<Status>('idle')
  const [progress, setProgress]           = useState(0)
  const [genStep, setGenStep]             = useState(0)
  const [errorMsg, setErrorMsg]           = useState('')
  const [videoUrl, setVideoUrl]           = useState<string | null>(null)

  // Product form
  const [productImage, setProductImage]   = useState<File | null>(null)
  const [imagePreview, setImagePreview]   = useState<string | null>(null)
  const [isDragging, setIsDragging]       = useState(false)
  const [script, setScript]               = useState('')
  const [format, setFormat]               = useState('TikTok 9:16')
  const [duration, setDuration]           = useState('30s')

  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [selectedActor, setSelectedActor] = useState<string | null>(null)
  const [filter, setFilter]               = useState('All')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredActors = ACTORS.filter(a =>
    filter === 'All' || a.gender === filter || a.ethnicity === filter
  )

  /* ── Image upload handlers ─────────────────────────────────────────── */
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    setProductImage(file)
    const reader = new FileReader()
    reader.onload = e => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const removeImage = () => {
    setProductImage(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  /* ── Generation ────────────────────────────────────────────────────── */
  const handleGenerate = async () => {
    if (!selectedModel || !selectedActor) return
    setStatus('generating')
    setProgress(0)
    setGenStep(0)
    setErrorMsg('')

    // Animated progress
    let current = 0
    const interval = setInterval(() => {
      current = Math.min(current + 1.2, 88)
      setProgress(Math.floor(current))
      setGenStep(Math.floor((current / 88) * (GENERATION_STEPS.length - 1)))
    }, 200)

    try {
      // Upload image if provided
      let productImageUrl: string | undefined
      if (productImage) {
        const fd = new FormData()
        fd.append('file', productImage)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
        if (uploadRes.ok) {
          const { url } = await uploadRes.json()
          productImageUrl = url
        }
      }

      // Call generate API
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script,
          format,
          duration: duration.replace('s', ''),
          aiModel: selectedModel,
          actorId: selectedActor,
          productImageUrl,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')

      clearInterval(interval)
      setProgress(92)

      // Poll for completion
      const poll = async () => {
        try {
          const statusRes = await fetch(`/api/generate/status?videoId=${data.videoId}`)
          const statusData = await statusRes.json()
          if (statusData.status === 'DONE') {
            setProgress(100)
            setVideoUrl(statusData.videoUrl || null)
            setStatus('done')
          } else if (statusData.status === 'FAILED') {
            throw new Error('AI generation failed')
          } else {
            setTimeout(poll, 5000)
          }
        } catch {
          setStatus('error')
          setErrorMsg('Video generation failed. Please try again.')
        }
      }
      setTimeout(poll, 5000)

    } catch (err) {
      clearInterval(interval)
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const resetAll = () => {
    setStep(1)
    setStatus('idle')
    setProgress(0)
    setSelectedModel(null)
    setSelectedActor(null)
    setVideoUrl(null)
    removeImage()
    setScript('')
  }

  /* ── Render ────────────────────────────────────────────────────────── */
  return (
    <div>
      <TopBar title="Create Ad" subtitle="Generate a new AI video ad in 3 simple steps" />
      <div className="p-8 max-w-5xl">

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          {([1, 2, 3] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <button
                onClick={() => s < step && status === 'idle' && setStep(s)}
                className={`w-8 h-8 rounded-full text-sm font-bold transition-all flex items-center justify-center ${
                  step === s ? 'bg-[#0A0A0B] text-white'
                  : step > s ? 'bg-[#2563EB] text-white cursor-pointer hover:opacity-90'
                  : 'bg-[#E2E8F0] text-[#6B7280]'
                }`}
              >{s}</button>
              <span className={`text-sm font-medium ${step === s ? 'text-[#0A0A0B]' : 'text-[#6B7280]'}`}>
                {['Product', 'AI Engine', 'AI Actor'][i]}
              </span>
              {s < 3 && <div className={`h-px w-12 ${step > s ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'}`} />}
            </div>
          ))}
        </div>

        {/* ── STEP 1 ── */}
        {step === 1 && status === 'idle' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#0A0A0B]">Import your product photo</h2>

            <div className="grid grid-cols-2 gap-6">
              {/* Drag & Drop zone */}
              <div className="col-span-2">
                {!imagePreview ? (
                  <div
                    onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
                      isDragging
                        ? 'border-[#2563EB] bg-[#EBF5FF]'
                        : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB] hover:bg-[#EBF5FF]'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
                    />
                    <div className="w-14 h-14 bg-white border border-[#E2E8F0] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <svg className="w-7 h-7 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-[#0A0A0B] font-semibold mb-1">Drop your product photo here</p>
                    <p className="text-[#6B7280] text-sm">
                      or <span className="text-[#2563EB] font-medium">click to browse</span>
                    </p>
                    <p className="text-xs text-[#9CA3AF] mt-2">JPG, PNG, WEBP · max 5MB</p>
                  </div>
                ) : (
                  <div className="relative border-2 border-[#2563EB] bg-[#EBF5FF] rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-[#BFDBFE]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="Product" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0A0A0B] truncate">{productImage?.name}</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        {productImage ? (productImage.size / 1024).toFixed(0) + ' KB' : ''}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-xs text-green-600 font-medium">Photo ready</span>
                      </div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); removeImage() }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7280] hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Script */}
              <div className="col-span-2">
                <Textarea
                  label="Ad Script (optional)"
                  placeholder="Write your script or leave empty to auto-generate from the photo..."
                  rows={4}
                  value={script}
                  onChange={e => setScript(e.target.value)}
                />
              </div>

              {/* Format */}
              <div>
                <label className="block text-sm font-medium text-[#0A0A0B] mb-2">Format</label>
                <div className="grid grid-cols-2 gap-2">
                  {FORMATS.map(f => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all ${
                        format === f
                          ? 'border-[#2563EB] bg-[#EBF5FF] text-[#2563EB]'
                          : 'border-[#E2E8F0] text-[#6B7280] hover:border-[#BFDBFE]'
                      }`}
                    >{f}</button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-[#0A0A0B] mb-2">Duration</label>
                <div className="flex gap-2">
                  {DURATIONS.map(d => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        duration === d
                          ? 'border-[#2563EB] bg-[#EBF5FF] text-[#2563EB]'
                          : 'border-[#E2E8F0] text-[#6B7280] hover:border-[#BFDBFE]'
                      }`}
                    >{d}</button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!productImage && !script}
              className="mt-2 bg-[#0A0A0B] text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-[#1a1a1b] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Choose AI Engine →
            </button>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#0A0A0B]">Choose your AI engine</h2>
            <div className="grid grid-cols-3 gap-4">
              {AI_MODELS.map(m => (
                <ModelCard key={m.id} model={m} selected={selectedModel === m.id} onSelect={() => setSelectedModel(m.id)} />
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-8 py-3 rounded-full font-semibold text-sm border border-[#E2E8F0] text-[#6B7280] hover:bg-[#F8FAFC] transition-all">← Back</button>
              <button onClick={() => setStep(3)} disabled={!selectedModel} className="bg-[#0A0A0B] text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-[#1a1a1b] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                Next: Choose Actor →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && status === 'idle' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#0A0A0B]">Choose your AI actor</h2>
            <div className="flex gap-2 flex-wrap">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === f ? 'bg-[#0A0A0B] text-white' : 'bg-[#F8FAFC] text-[#6B7280] border border-[#E2E8F0] hover:border-[#BFDBFE]'}`}>{f}</button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {filteredActors.map(a => (
                <ActorCard key={a.id} {...a} selected={selectedActor === a.id} onSelect={() => setSelectedActor(a.id)} />
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-8 py-3 rounded-full font-semibold text-sm border border-[#E2E8F0] text-[#6B7280] hover:bg-[#F8FAFC] transition-all">← Back</button>
              <button onClick={handleGenerate} disabled={!selectedActor} className="bg-[#0A0A0B] text-white px-10 py-3.5 rounded-full font-bold text-base hover:bg-[#1a1a1b] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
                ✨ Generate Video Ad
              </button>
            </div>
          </div>
        )}

        {/* ── GENERATING ── */}
        {status === 'generating' && (
          <div className="flex flex-col items-center justify-center py-24 space-y-8">
            <div className="w-20 h-20 bg-[#EBF5FF] rounded-2xl flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#0A0A0B] mb-2">Generating your ad...</h2>
              <p className="text-[#6B7280]">{GENERATION_STEPS[Math.min(genStep, GENERATION_STEPS.length - 1)]}</p>
              <p className="text-xs text-[#9CA3AF] mt-2">This can take 1–3 minutes depending on the model</p>
            </div>
            <div className="w-full max-w-sm">
              <div className="flex justify-between text-xs text-[#6B7280] mb-2">
                <span>Progress</span><span>{progress}%</span>
              </div>
              <div className="w-full bg-[#E2E8F0] rounded-full h-2">
                <div className="bg-[#2563EB] h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
            {imagePreview && (
              <div className="flex items-center gap-3 bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Product" className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <p className="text-xs font-medium text-[#0A0A0B]">Product photo uploaded</p>
                  <p className="text-xs text-[#6B7280]">AI is analyzing your product...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ERROR ── */}
        {status === 'error' && (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center text-4xl">❌</div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#0A0A0B] mb-2">Generation failed</h2>
              <p className="text-[#6B7280] text-sm max-w-sm">{errorMsg || 'Something went wrong. Please try again.'}</p>
            </div>
            <button onClick={() => { setStatus('idle'); setProgress(0) }} className="bg-[#0A0A0B] text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-[#1a1a1b] transition-all">
              Try Again
            </button>
          </div>
        )}

        {/* ── DONE ── */}
        {status === 'done' && (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center text-4xl">🎉</div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#0A0A0B] mb-2">Your video is ready!</h2>
              <p className="text-[#6B7280]">Your AI video ad has been generated successfully.</p>
            </div>
            <div className="flex gap-3">
              {videoUrl && (
                <a href={videoUrl} download target="_blank" rel="noopener noreferrer"
                  className="bg-[#0A0A0B] text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-[#1a1a1b] transition-all duration-200 shadow-sm">
                  ↓ Download Video
                </a>
              )}
              <button onClick={resetAll} className="px-8 py-3 rounded-full font-semibold text-sm border border-[#E2E8F0] text-[#0A0A0B] hover:bg-[#F8FAFC] transition-all">
                Create Another
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
