'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Mic, Film, ImageIcon, ChevronRight, Sparkles, Settings2 } from 'lucide-react'

/* ── Extended tools / models list ────────────────────────────────────────── */
type ToolType = 'MODEL' | 'TOOL' | 'PRESET'
interface Tool {
  id: string
  name: string
  type: ToolType
  isNew?: boolean
  description: string
  specs?: string
  icon: string
}

const ALL_TOOLS: Tool[] = [
  { id: 'kling30',       name: 'Kling 3.0',          type: 'MODEL',  isNew: true,  icon: '🎬', description: 'Create high-fidelity video clips with complex movement and realistic transitions.',       specs: '9:16|16:9 · 3s-15s' },
  { id: 'sora2pro',      name: 'Sora 2 Pro',          type: 'MODEL',  isNew: true,  icon: '🔥', description: 'OpenAI\'s most advanced video generation model with unprecedented realism.',               specs: '9:16|16:9|1:1 · 5s-20s' },
  { id: 'veo31',         name: 'Veo 3.1',             type: 'MODEL',                icon: '⚡', description: 'Google\'s fastest video model with exceptional motion quality.',                           specs: '9:16|16:9 · 5s-8s' },
  { id: 'talking',       name: 'Talking Actors',      type: 'TOOL',                 icon: '🎭', description: 'Generate realistic AI actors that speak your script with natural expressions.',             specs: '9:16|1:1 · 5s-60s' },
  { id: 'changevoice',   name: 'Change Voice',        type: 'TOOL',                 icon: '🎙️', description: 'Change the voice in your video using an audio reference for natural, consistent audio.' },
  { id: 'camera',        name: 'Camera Angle',        type: 'TOOL',                 icon: '📷', description: 'Adjust the camera angle of your image with horizontal, vertical, and zoom controls.',     specs: '9:16|16:9|1:1' },
  { id: 'gestures',      name: 'Gestures',            type: 'PRESET',               icon: '🤸', description: 'Animate avatars with expressive gestures and emotions using AI-powered motion.',           specs: '9:16|16:9|1:1 · 5s' },
  { id: 'nanobanana2',   name: 'Nano Banana 2',       type: 'MODEL',                icon: '🍌', description: 'Generate stunning product images with viral-ready aesthetics.',                            specs: '1:1|4:3' },
  { id: 'transcribe',    name: 'Transcribe',          type: 'TOOL',                 icon: '📝', description: 'Transcribe any video or audio file into text in seconds.' },
  { id: 'translate',     name: 'Translate Video',     type: 'TOOL',                 icon: '🌍', description: 'Translate your video into any language while keeping the original voice.' },
  { id: 'ugcstudio',     name: 'UGC Studio',          type: 'MODEL',                icon: '🤳', description: 'Generate high-quality influencer-style content with authentic UGC aesthetics.' },
  { id: 'minimax',       name: 'MiniMax Hailuo',      type: 'MODEL',                icon: '🎯', description: 'Best value for high-volume production with consistent quality.',                           specs: '9:16|16:9 · 5s-10s' },
  { id: 'wan21',         name: 'Wan 2.1',             type: 'MODEL',                icon: '✨', description: 'Ultra-sharp detail rendering with exceptional color grading.',                             specs: '1:1|9:16|16:9' },
  { id: 'klingo3',       name: 'Kling o3 Editor',     type: 'TOOL',  isNew: true,  icon: '✂️', description: 'Add, swap or remove any elements in your video using Kling o3 cutting edge technology.',  specs: '5s|10s' },
  { id: 'grokimage',     name: 'Grok Image',          type: 'TOOL',                 icon: '🖼️', description: 'Generate images with xAI Grok. Supports text-to-image and image editing.',               specs: '1:1|16:9' },
  { id: 'grokvideo',     name: 'Grok Video',          type: 'MODEL',                icon: '🚀', description: 'xAI\'s Grok video generation model with text-to-video and image-to-video modes.',         specs: '1:1|9:16|16:9 · 1-15s' },
  { id: 'seedance',      name: 'Seedance 1.5',        type: 'MODEL',                icon: '💫', description: 'ByteDance\'s fast video generation model with high motion quality.',                       specs: '9:16|16:9 · 5s-10s' },
  { id: 'kling26',       name: 'Kling 2.6 Motion',   type: 'MODEL',                icon: '🌀', description: 'Bring any photo to life with AI-powered motion control.',                                  specs: '9:16|16:9|1:1 · 5s-10s' },
]

const TYPE_COLORS: Record<ToolType, string> = {
  MODEL:  'bg-purple-100 text-purple-700',
  TOOL:   'bg-blue-100 text-blue-700',
  PRESET: 'bg-amber-100 text-amber-700',
}

const TABS = [
  { id: 'actors', label: 'Talking Actors', icon: Mic  },
  { id: 'video',  label: 'Video',          icon: Film },
  { id: 'image',  label: 'Image',          icon: ImageIcon },
]

// 1 credit = $0.005 USD (kie.ai)
const CREDIT_VALUE = 0.005

// Kling 3.0: 20cr/s Standard no audio (source: kie.ai/kling-3-0)
// → 5s = 100cr ($0.50) | 10s = 200cr ($1.00)
const VIDEO_CREDITS_PER_SECOND: Record<string, number> = {
  'Kling 3.0': 20,
}

// Sora 2 Pro: lookup by [resolution][duration] (source: kie.ai/s-2pro)
const SORA_CREDITS: Record<string, Record<string, number>> = {
  '720p':  { '10s': 150, '15s': 270 },   // $0.75 | $1.35
  '1080p': { '10s': 330, '15s': 630 },   // $1.65 | $3.15
}

// Veo 3.1 (source: kie.ai/veo-3-1)
// Fast 1080p: 60cr gen + 5cr output = 65cr ($0.325)
// Quality 4K: 250cr gen + 120cr 4K output = 370cr ($1.85)
const VEO_CREDITS = { fast: 65, quality4K: 370 }

// Other video models — estimés (à affiner)
const VIDEO_MODEL_CREDITS: Record<string, number> = {
  'MiniMax Hailuo': 60,   // estimé ~$0.30
  'Wan 2.1':        80,   // estimé ~$0.40
  'Grok Video':     60,   // estimé ~$0.30
  'Seedance 1.5':   60,   // estimé ~$0.30
  'Talking Actors': 100,  // estimé ~$0.50
  'UGC Studio':     100,  // estimé ~$0.50
}

// Image model costs in credits per resolution (source: kie.ai — confirmés pour Nano Banana 2)
const IMAGE_MODEL_CREDITS: Record<string, Record<string, number>> = {
  'Nano-Banana 2': { '1K': 8, '2K': 12, '4K': 18 },
  'Grok Image':    { '1K': 8, '2K': 12, '4K': 18 },
  'Seedream 4.5':  { '1K': 8, '2K': 12, '4K': 18 },
  'GPT Image 1.5': { '1K': 10, '2K': 16, '4K': 20 },
}

/* ── Spring presets ──────────────────────────────────────────────────────── */
const spring     = { type: 'spring' as const, stiffness: 400, damping: 30 }
const springFast = { type: 'spring' as const, stiffness: 500, damping: 35 }

/* ── Card stagger variants ───────────────────────────────────────────────── */
const cardVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { ...spring, delay: i * 0.03 },
  }),
}

/* ── Component ───────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab]           = useState('video')
  const [prompt, setPrompt]                 = useState('')
  const [count, setCount]                   = useState(1)
  const [showModal, setShowModal]           = useState(false)
  const [search, setSearch]                 = useState('')
  const [filter, setFilter]                 = useState<'all' | 'tools' | 'models'>('all')
  const [selectedTool, setSelectedTool]     = useState<Tool | null>(null)
  const [uploadedImages, setUploadedImages] = useState<{ file: File; preview: string }[]>([])
  const [isDragging, setIsDragging]         = useState(false)
  const [draggedImgIdx, setDraggedImgIdx]   = useState<number | null>(null)
  const [dragOverImgIdx, setDragOverImgIdx] = useState<number | null>(null)
  const [showSettings, setShowSettings]     = useState(false)
  const [aspectRatio, setAspectRatio]       = useState('9:16')
  const [aiModel, setAiModel]               = useState('')
  const [videoLength, setVideoLength]       = useState('8s')
  const [videoResolution, setVideoResolution]   = useState('1080p')
  const [imageResolution, setImageResolution]   = useState('1K')
  const [coins, setCoins]                   = useState<number | null>(null)
  const fileInputRef      = useRef<HTMLInputElement>(null)
  const settingsRef       = useRef<HTMLDivElement>(null)

  // Fetch coins balance on mount
  useEffect(() => {
    fetch('/api/user/credits')
      .then(r => r.json())
      .then(d => setCoins(d.credits ?? 0))
      .catch(() => setCoins(0))
  }, [])

  // Image tools that support upload
  const IMAGE_TOOL_IDS = ['nanobanana2', 'grokimage']
  const showImageUpload = activeTab === 'video' || activeTab === 'image' || (selectedTool !== null && IMAGE_TOOL_IDS.includes(selectedTool.id))
  const isVeo31 = (aiModel || 'Kling 3.0') === 'Veo 3.1'
  const showFrameLabels = activeTab === 'video' && isVeo31 && uploadedImages.length === 2

  // Models per tab
  const MODELS_BY_TAB: Record<string, string[]> = {
    video:  ['Kling 3.0', 'Sora 2 Pro', 'Veo 3.1', 'MiniMax Hailuo', 'Wan 2.1', 'Grok Video', 'Seedance 1.5'],
    image:  ['Nano-Banana 2', 'Grok Image', 'Seedream 4.5', 'GPT Image 1.5'],
    actors: ['Talking Actors', 'UGC Studio'],
  }

  const MODEL_VIDEO_SETTINGS: Record<string, { aspectRatios: string[]; lengths: string[]; resolutions: string[] }> = {
    'Kling 3.0':      { aspectRatios: ['9:16', '16:9', '1:1'],                         lengths: ['5s', '10s'],         resolutions: ['720p', '1080p'] },
    'Sora 2 Pro':     { aspectRatios: ['9:16', '16:9'],                                 lengths: ['10s', '15s'],        resolutions: ['720p', '1080p'] },
    'Veo 3.1':        { aspectRatios: ['9:16', '16:9'],                                 lengths: ['5s', '8s', '12s', '15s'], resolutions: ['1080p', '4K'] },
    'MiniMax Hailuo': { aspectRatios: ['9:16', '16:9', '1:1'],                          lengths: ['5s', '10s'],         resolutions: ['720p', '1080p'] },
    'Wan 2.1':        { aspectRatios: ['9:16', '16:9', '1:1'],                          lengths: ['5s', '10s'],         resolutions: ['720p', '1080p'] },
    'Grok Video':     { aspectRatios: ['9:16', '16:9', '1:1'],                          lengths: ['5s', '10s', '15s'],  resolutions: ['720p', '1080p'] },
    'Seedance 1.5':   { aspectRatios: ['9:16', '16:9', '1:1', '4:3', '3:4', '21:9'],   lengths: ['4s', '8s', '12s'],   resolutions: ['480p', '720p', '1080p'] },
  }

  const MODEL_IMAGE_SETTINGS: Record<string, { aspectRatios: string[]; resolutions: string[] }> = {
    'Nano-Banana 2': { aspectRatios: ['1:1', '4:3', '3:4'],           resolutions: ['1K', '2K', '4K'] },
    'Grok Image':    { aspectRatios: ['1:1', '16:9', '9:16'],         resolutions: ['1K', '2K', '4K'] },
    'Seedream 4.5':  { aspectRatios: ['1:1', '4:3', '3:4', '16:9'],  resolutions: ['1K', '2K', '4K'] },
    'GPT Image 1.5': { aspectRatios: ['1:1', '16:9', '9:16', '4:3'], resolutions: ['1K', '2K', '4K'] },
  }

  const IMAGE_ASPECT_RATIOS = ['1:1', '4:3', '3:4', '16:9', '9:16']
  const activeVideoModel    = aiModel || 'Kling 3.0'
  const activeImageModel    = aiModel || 'Nano-Banana 2'
  const modelSettings       = MODEL_VIDEO_SETTINGS[activeVideoModel] ?? MODEL_VIDEO_SETTINGS['Kling 3.0']
  const imageModelSettings  = MODEL_IMAGE_SETTINGS[activeImageModel]  ?? MODEL_IMAGE_SETTINGS['Nano-Banana 2']
  const currentAspectRatios = activeTab === 'video' ? modelSettings.aspectRatios : (MODEL_IMAGE_SETTINGS[activeImageModel]?.aspectRatios ?? IMAGE_ASPECT_RATIOS)
  const currentLengths      = modelSettings.lengths
  const currentResolutions  = modelSettings.resolutions
  const currentImageResolutions = imageModelSettings.resolutions
  const tabLabel            = { video: 'Video', image: 'Image', actors: 'Actor' }[activeTab]
  const currentModels       = MODELS_BY_TAB[activeTab] ?? []

  // Cost calculation (1 credit = $0.005)
  const activeModelName   = aiModel || currentModels[0] || ''
  const isVeo4K           = isVeo31 && videoResolution === '4K'
  const selectedSecs      = parseInt((currentLengths.includes(videoLength) ? videoLength : currentLengths[0] ?? '8s').replace('s', '')) || 8

  const baseCreditCost = (() => {
    // ── Image tab ────────────────────────────────────────────────────────────
    if (activeTab === 'image') {
      const res = currentImageResolutions.includes(imageResolution) ? imageResolution : currentImageResolutions[0]
      return IMAGE_MODEL_CREDITS[activeModelName]?.[res] ?? 8
    }
    // ── Veo 3.1 (source: kie.ai/veo-3-1) ─────────────────────────────────
    if (isVeo31) return isVeo4K ? VEO_CREDITS.quality4K : VEO_CREDITS.fast
    // ── Sora 2 Pro (source: kie.ai/s-2pro) ───────────────────────────────
    if (activeModelName === 'Sora 2 Pro') {
      const res = currentResolutions.includes(videoResolution) ? videoResolution : currentResolutions[0]
      return SORA_CREDITS[res]?.[`${selectedSecs}s`] ?? 150
    }
    // ── Kling 3.0 (source: kie.ai/kling-3-0) — 20cr/s Standard no audio ─
    if (VIDEO_CREDITS_PER_SECOND[activeModelName]) {
      return VIDEO_CREDITS_PER_SECOND[activeModelName] * selectedSecs
    }
    // ── Other models (estimés) ────────────────────────────────────────────
    return VIDEO_MODEL_CREDITS[activeModelName] ?? 80
  })()

  const baseCost       = baseCreditCost * CREDIT_VALUE
  const generationCost = (baseCost * count).toFixed(2)
  const creditCost     = baseCreditCost * count

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => {
      setUploadedImages(prev => {
        if (prev.length >= 2) return prev
        return [...prev, { file, preview: e.target?.result as string }]
      })
    }
    reader.readAsDataURL(file)
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const reorderImages = (fromIdx: number, toIdx: number) => {
    setUploadedImages(prev => {
      const arr = [...prev]
      const [moved] = arr.splice(fromIdx, 1)
      arr.splice(toIdx, 0, moved)
      return arr
    })
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    Array.from(e.dataTransfer.files).slice(0, 2).forEach(f => handleImageFile(f))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const placeholder = {
    actors: 'Describe your actor and what they should say...',
    video:  'Describe your video ad...',
    image:  'Describe your product image...',
  }[activeTab]

  const filtered = ALL_TOOLS.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                        t.description.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' ||
      (filter === 'tools'  && (t.type === 'TOOL' || t.type === 'PRESET')) ||
      (filter === 'models' && t.type === 'MODEL')
    return matchSearch && matchFilter
  })

  const handleGenerate = () => {
    if (!prompt.trim()) return
    let finalPrompt = prompt.trim()
    // For Veo 3.1, inject duration constraint into the prompt since the API has no duration param
    if (activeTab === 'video' && isVeo31 && currentLengths.length > 0) {
      const chosenLength = currentLengths.includes(videoLength) ? videoLength : currentLengths[0]
      const secs = chosenLength.replace('s', '')
      finalPrompt += ` — The video must be exactly ${secs} seconds long.`
    }
    const resolution = currentResolutions.includes(videoResolution) ? videoResolution : currentResolutions[0]
    router.push(`/create?prompt=${encodeURIComponent(finalPrompt)}&mode=${activeTab}&model=${encodeURIComponent(aiModel || currentModels[0])}&resolution=${resolution}`)
  }

  return (
    <div className="relative flex flex-col h-full bg-white overflow-hidden">

      {/* ── Grid background ───────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#F0F0F0 1px, transparent 1px), linear-gradient(90deg, #F0F0F0 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,255,255,0) 0%, white 80%)' }}
      />

      {/* ── Empty state ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center pb-44 px-6">
        <motion.div
          className="relative flex flex-col items-center gap-5 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.1 }}
        >
          <motion.div
            className="w-16 h-16 bg-white border border-[#E5E7EB] rounded-2xl flex items-center justify-center shadow-sm"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="w-7 h-7 text-[#9CA3AF]" />
          </motion.div>
          <div>
            <p className="text-[#111827] font-semibold text-base">Generate your first ad</p>
            <p className="text-[#9CA3AF] text-sm mt-1">
              Generate winning assets with talking actors,<br />videos and more.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom creation bar ───────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-6 px-4 bg-gradient-to-t from-white via-white to-transparent pt-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.15 }}
      >
        <div className="w-full max-w-[650px] relative">

          {/* Coins / cost badge */}
          <motion.div
            className="absolute right-[calc(100%+12px)] bottom-0 flex flex-col items-end gap-1"
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: 0.2 }}
          >
            <div className="bg-purple-50 border border-purple-200 rounded-2xl px-4 py-2.5 text-right whitespace-nowrap">
              {coins !== null && coins > 0 && (
                <p className="text-purple-500 font-bold text-sm leading-tight">
                  {coins.toLocaleString()} coins
                </p>
              )}
              <p className={`text-purple-400 text-xs font-medium ${coins !== null && coins > 0 ? 'mt-1' : ''}`}>
                {creditCost} credit{creditCost > 1 ? 's' : ''}
              </p>
              <p className="text-purple-300 text-xs mt-0.5">
                ${generationCost}
              </p>
            </div>
          </motion.div>

          {/* Settings panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                ref={settingsRef}
                className="absolute left-[calc(100%+12px)] bottom-0 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl w-60 p-4 z-50"
                initial={{ opacity: 0, x: -10, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.96 }}
                transition={springFast}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-[#111827]">{tabLabel} Settings</p>
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => setShowSettings(false)}
                    className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF]"
                  >
                    <X size={13} />
                  </motion.button>
                </div>
                <div className="flex items-center justify-between py-2.5 border-t border-[#F3F4F6]">
                  <span className="text-sm text-[#6B7280]">Model</span>
                  <div className="relative">
                    <select
                      value={aiModel || currentModels[0]}
                      onChange={e => setAiModel(e.target.value)}
                      className="appearance-none bg-transparent text-sm font-medium text-[#111827] pr-5 outline-none cursor-pointer text-right"
                    >
                      {currentModels.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-[#9CA3AF] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4M8 15l4 4 4-4" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2.5 border-t border-[#F3F4F6]">
                  <span className="text-sm text-[#6B7280]">Aspect ratio</span>
                  <div className="relative">
                    <select
                      value={currentAspectRatios.includes(aspectRatio) ? aspectRatio : currentAspectRatios[0]}
                      onChange={e => setAspectRatio(e.target.value)}
                      className="appearance-none bg-transparent text-sm font-medium text-[#111827] pr-5 outline-none cursor-pointer text-right"
                    >
                      {currentAspectRatios.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-[#9CA3AF] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4M8 15l4 4 4-4" />
                    </svg>
                  </div>
                </div>
                {activeTab === 'video' && (
                  <>
                    <div className="flex items-center justify-between py-2.5 border-t border-[#F3F4F6]">
                      <span className="text-sm text-[#6B7280]">Length</span>
                      {currentLengths.length === 0 ? (
                        <span className="text-sm font-medium text-[#9CA3AF]">Auto</span>
                      ) : (
                        <div className="relative">
                          <select
                            value={currentLengths.includes(videoLength) ? videoLength : currentLengths[0]}
                            onChange={e => setVideoLength(e.target.value)}
                            className="appearance-none bg-transparent text-sm font-medium text-[#111827] pr-5 outline-none cursor-pointer text-right"
                          >
                            {currentLengths.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                          <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-[#9CA3AF] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4M8 15l4 4 4-4" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between py-2.5 border-t border-[#F3F4F6]">
                      <span className="text-sm text-[#6B7280]">Resolution</span>
                      <div className="relative">
                        <select
                          value={currentResolutions.includes(videoResolution) ? videoResolution : currentResolutions[0]}
                          onChange={e => setVideoResolution(e.target.value)}
                          className="appearance-none bg-transparent text-sm font-medium text-[#111827] pr-5 outline-none cursor-pointer text-right"
                        >
                          {currentResolutions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-[#9CA3AF] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4M8 15l4 4 4-4" />
                        </svg>
                      </div>
                    </div>
                  </>
                )}
                {activeTab === 'image' && (
                  <div className="flex items-center justify-between py-2.5 border-t border-[#F3F4F6]">
                    <span className="text-sm text-[#6B7280]">Resolution</span>
                    <div className="relative">
                      <select
                        value={currentImageResolutions.includes(imageResolution) ? imageResolution : currentImageResolutions[0]}
                        onChange={e => setImageResolution(e.target.value)}
                        className="appearance-none bg-transparent text-sm font-medium text-[#111827] pr-5 outline-none cursor-pointer text-right"
                      >
                        {currentImageResolutions.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-[#9CA3AF] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4M8 15l4 4 4-4" />
                      </svg>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabs row */}
          <div className="flex items-center gap-1 mb-2.5 px-1">
            {TABS.map(tab => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileTap={{ scale: 0.94 }}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-[6px] text-sm font-medium transition-colors ${
                    active ? 'text-white' : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[#0A0A0B] rounded-[6px] shadow-sm"
                      transition={spring}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon size={13} />
                    {tab.label}
                  </span>
                </motion.button>
              )
            })}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-[6px] text-sm font-medium text-[#6B7280] hover:bg-[#F3F4F6] transition-colors"
            >
              See more
              <ChevronRight size={13} />
            </motion.button>
          </div>

          {/* Input box */}
          <motion.div
            className={`bg-white border rounded-2xl shadow-sm overflow-hidden transition-colors ${
              isDragging ? 'border-[#2563EB] bg-blue-50/30' : 'border-[#E5E7EB]'
            }`}
            whileFocus={{ boxShadow: '0 0 0 3px rgba(37,99,235,0.08)' }}
            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false) }}
            onDrop={onDrop}
          >
            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => {
                Array.from(e.target.files ?? []).slice(0, 2).forEach(f => handleImageFile(f))
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
            />

            {/* Uploaded images */}
            <AnimatePresence>
              {uploadedImages.length > 0 && (
                <motion.div
                  className="flex gap-2 px-4 pt-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={spring}
                >
                  {uploadedImages.map((img, i) => (
                    <motion.div
                      key={img.preview}
                      className={`relative group flex-shrink-0 transition-opacity ${draggedImgIdx === i ? 'opacity-40' : dragOverImgIdx === i ? 'ring-2 ring-[#2563EB] rounded-xl' : ''}`}
                      initial={{ opacity: 0, scale: 0.75 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.75 }}
                      transition={springFast}
                      draggable
                      onDragStart={e => { e.stopPropagation(); setDraggedImgIdx(i) }}
                      onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragOverImgIdx(i) }}
                      onDragLeave={() => setDragOverImgIdx(null)}
                      onDrop={e => {
                        e.preventDefault(); e.stopPropagation()
                        if (draggedImgIdx !== null && draggedImgIdx !== i) reorderImages(draggedImgIdx, i)
                        setDraggedImgIdx(null); setDragOverImgIdx(null)
                      }}
                      onDragEnd={() => { setDraggedImgIdx(null); setDragOverImgIdx(null) }}
                    >
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#E5E7EB] cursor-grab active:cursor-grabbing">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.preview} alt={`upload-${i}`} className="w-full h-full object-cover" />
                        {showFrameLabels && (
                          <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] font-bold text-white bg-black/50 py-0.5 leading-none">
                            {i === 0 ? 'START' : 'END'}
                          </span>
                        )}
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => removeImage(i)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-[#6B7280] hover:text-red-500"
                      >
                        <X size={10} />
                      </motion.button>
                    </motion.div>
                  ))}
                  {uploadedImages.length < 2 && (
                    <motion.button
                      whileTap={{ scale: 0.93 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-14 h-14 rounded-xl border-2 border-dashed border-[#E5E7EB] hover:border-[#2563EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#2563EB] transition-colors flex-shrink-0"
                    >
                      <ImageIcon size={16} />
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>


            {/* Textarea */}
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate() } }}
              placeholder={placeholder}
              rows={3}
              className="w-full bg-transparent text-sm text-[#0A0A0B] placeholder:text-[#9CA3AF] outline-none resize-none px-4 pt-3 pb-2"
            />

            {/* Bottom row */}
            <div className="flex items-center justify-between px-3 pb-3">
              {/* Left */}
              <div className="flex items-center gap-1.5">
                <AnimatePresence mode="popLayout">
                  {activeTab === 'video' && (
                    <motion.button
                      key="presets"
                      initial={{ opacity: 0, scale: 0.85, x: -6 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.85, x: -6 }}
                      transition={springFast}
                      whileTap={{ scale: 0.93 }}
                      className="h-8 flex items-center gap-1.5 px-2.5 rounded-[6px] border border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#6B7280] text-xs font-medium transition-colors"
                    >
                      <Sparkles size={12} />
                      Presets
                    </motion.button>
                  )}
                  {showImageUpload && uploadedImages.length < 2 && (
                    <motion.button
                      key="image-upload"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={springFast}
                      whileTap={{ scale: 0.88 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                      title={`Add image (${uploadedImages.length}/2)`}
                    >
                      <ImageIcon size={15} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Right */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 bg-[#F3F4F6] rounded-lg px-2 py-1.5">
                  <motion.button whileTap={{ scale: 0.8 }} onClick={() => setCount(c => Math.max(1, c - 1))} className="w-5 h-5 flex items-center justify-center text-[#6B7280] hover:text-[#0A0A0B] text-sm transition-colors">−</motion.button>
                  <span className="text-sm font-semibold text-[#0A0A0B] w-4 text-center">{count}</span>
                  <motion.button whileTap={{ scale: 0.8 }} onClick={() => setCount(c => Math.min(4, c + 1))} className="w-5 h-5 flex items-center justify-center text-[#6B7280] hover:text-[#0A0A0B] text-sm transition-colors">+</motion.button>
                </div>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setShowSettings(s => !s)}
                  className={`w-8 h-8 flex items-center justify-center rounded-xl transition-colors border ${
                    showSettings ? 'bg-[#F3F4F6] border-[#D1D5DB] text-[#374151]' : 'hover:bg-[#F3F4F6] text-[#9CA3AF] border-[#E5E7EB]'
                  }`}
                >
                  <Settings2 size={14} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  whileHover={{ scale: 1.06 }}
                  onClick={handleGenerate}
                  disabled={!prompt.trim()}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#0A0A0B] text-white hover:bg-[#1a1a1b] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-4 h-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── "See more" modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="absolute inset-0 flex items-end justify-center z-50 pb-36"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={e => e.target === e.currentTarget && setShowModal(false)}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[650px] max-h-[55vh] flex flex-col overflow-hidden mx-4"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={spring}
            >
              {/* Modal header */}
              <div className="flex items-center gap-3 p-4 border-b border-[#F4F4F5]">
                <div className="flex-1 flex items-center gap-2 bg-[#F4F4F5] rounded-xl px-3 py-2">
                  <Search size={14} className="text-[#9CA3AF]" />
                  <input
                    autoFocus
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search tools & models..."
                    className="flex-1 bg-transparent text-sm text-[#0A0A0B] placeholder:text-[#9CA3AF] outline-none"
                  />
                  {search && (
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => setSearch('')} className="text-[#9CA3AF] hover:text-[#6B7280]">
                      <X size={12} />
                    </motion.button>
                  )}
                </div>
                <div className="flex gap-1">
                  {(['all', 'tools', 'models'] as const).map(f => (
                    <motion.button
                      key={f}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => setFilter(f)}
                      className={`relative px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                        filter === f ? 'text-white' : 'text-[#6B7280] hover:bg-[#F4F4F5]'
                      }`}
                    >
                      {filter === f && (
                        <motion.span layoutId="filterPill" className="absolute inset-0 bg-[#0A0A0B] rounded-full" transition={spring} />
                      )}
                      <span className="relative z-10">
                        {f === 'all' ? 'All' : f === 'tools' ? 'Tools' : 'Models'}
                      </span>
                    </motion.button>
                  ))}
                </div>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#F4F4F5] text-[#6B7280] transition-colors ml-1"
                >
                  <X size={16} />
                </motion.button>
              </div>

              {/* Modal grid */}
              <div className="overflow-y-auto p-4">
                <div className="grid grid-cols-4 gap-3">
                  {filtered.map((tool, i) => (
                    <motion.button
                      key={tool.id}
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ y: -2, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        setShowModal(false)
                        setSelectedTool(tool)
                        if (tool.type === 'MODEL' && ['kling30','sora2pro','veo31','minimax','wan21','grokvideo','seedance','kling26'].includes(tool.id)) setActiveTab('video')
                        else if (['talking','ugcstudio'].includes(tool.id)) setActiveTab('actors')
                        else if (['nanobanana2','grokimage'].includes(tool.id)) setActiveTab('image')
                      }}
                      className="text-left bg-[#FAFAFA] border border-[#F0F0F0] rounded-2xl p-3.5 transition-colors hover:bg-[#F4F4F5] hover:border-[#E2E8F0]"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xl">{tool.icon}</span>
                        <div className="flex flex-col items-end gap-1">
                          {tool.isNew && (
                            <span className="text-[10px] font-bold bg-[#0A0A0B] text-white px-1.5 py-0.5 rounded-full">NEW</span>
                          )}
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${TYPE_COLORS[tool.type]}`}>
                            {tool.type}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-[#0A0A0B] mb-1 leading-tight">{tool.name}</p>
                      <p className="text-[11px] text-[#6B7280] leading-relaxed line-clamp-2">{tool.description}</p>
                      {tool.specs && (
                        <p className="text-[10px] text-[#9CA3AF] mt-2 font-medium">{tool.specs}</p>
                      )}
                    </motion.button>
                  ))}
                </div>
                {filtered.length === 0 && (
                  <motion.div
                    className="flex flex-col items-center justify-center py-12 text-[#9CA3AF]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Search size={24} className="mb-2" />
                    <p className="text-sm">No results for &quot;{search}&quot;</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
