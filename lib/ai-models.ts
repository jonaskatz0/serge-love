export interface AIModel {
  id: string
  name: string
  provider: string
  badge: string
  badgeColor: string
  description: string
  quality: number
  speed: number
  pricePerVideo: number
  color: string
  emoji: string
}

export const AI_MODELS: AIModel[] = [
  {
    id: 'sora2pro',
    name: 'Sora 2 Pro',
    provider: 'OpenAI',
    badge: 'NEW',
    badgeColor: '#10b981',
    description: "The most advanced video generation model with unprecedented realism and coherence. Perfect for premium brand campaigns.",
    quality: 99,
    speed: 70,
    pricePerVideo: 2.50,
    color: '#10b981',
    emoji: '🔥',
  },
  {
    id: 'veo31',
    name: 'Veo 3.1',
    provider: 'Google',
    badge: 'FAST',
    badgeColor: '#3b82f6',
    description: "Google's fastest video model with exceptional motion quality and natural physics simulation.",
    quality: 95,
    speed: 90,
    pricePerVideo: 1.80,
    color: '#3b82f6',
    emoji: '⚡',
  },
  {
    id: 'kling30',
    name: 'Kling 3.0',
    provider: 'Kuaishou',
    badge: 'PRO',
    badgeColor: '#a855f7',
    description: "Professional-grade cinematic quality with advanced actor rendering and scene composition.",
    quality: 97,
    speed: 75,
    pricePerVideo: 2.20,
    color: '#a855f7',
    emoji: '💎',
  },
  {
    id: 'nanobanana2',
    name: 'Nano Banana 2',
    provider: 'NanoBanana',
    badge: 'HOT',
    badgeColor: '#f59e0b',
    description: "Optimized for social media content with viral-ready aesthetics and trendy visual styles.",
    quality: 88,
    speed: 95,
    pricePerVideo: 0.90,
    color: '#f59e0b',
    emoji: '🍌',
  },
  {
    id: 'wan21',
    name: 'Wan 2.1',
    provider: 'Alibaba',
    badge: 'SHARP',
    badgeColor: '#ec4899',
    description: "Ultra-sharp detail rendering with exceptional color grading and studio-quality lighting.",
    quality: 93,
    speed: 80,
    pricePerVideo: 1.50,
    color: '#ec4899',
    emoji: '✨',
  },
  {
    id: 'minimax',
    name: 'MiniMax Hailuo',
    provider: 'MiniMax',
    badge: 'VALUE',
    badgeColor: '#06b6d4',
    description: "Best value for high-volume production with consistent quality and reliable performance.",
    quality: 85,
    speed: 88,
    pricePerVideo: 0.60,
    color: '#06b6d4',
    emoji: '🎯',
  },
]

export const ACTORS = [
  { id: 'sophia',  name: 'Sophia',  gender: 'Female', ethnicity: 'European', style: 'Corporate',  mood: 'Professional', gradient: 'from-pink-400 to-rose-500' },
  { id: 'marcus',  name: 'Marcus',  gender: 'Male',   ethnicity: 'African',  style: 'Casual',     mood: 'Energetic',    gradient: 'from-blue-400 to-indigo-500' },
  { id: 'yuki',    name: 'Yuki',    gender: 'Female', ethnicity: 'Asian',    style: 'Trendy',     mood: 'Playful',      gradient: 'from-purple-400 to-pink-500' },
  { id: 'elena',   name: 'Elena',   gender: 'Female', ethnicity: 'European', style: 'Lifestyle',  mood: 'Warm',         gradient: 'from-orange-400 to-rose-500' },
  { id: 'james',   name: 'James',   gender: 'Male',   ethnicity: 'European', style: 'Premium',    mood: 'Authoritative',gradient: 'from-slate-600 to-slate-800' },
  { id: 'aisha',   name: 'Aisha',   gender: 'Female', ethnicity: 'African',  style: 'Beauty',     mood: 'Glowing',      gradient: 'from-amber-400 to-orange-500' },
  { id: 'carlos',  name: 'Carlos',  gender: 'Male',   ethnicity: 'Latino',   style: 'Sports',     mood: 'Active',       gradient: 'from-green-400 to-emerald-500' },
  { id: 'nina',    name: 'Nina',    gender: 'Female', ethnicity: 'European', style: 'Luxury',     mood: 'Elegant',      gradient: 'from-violet-400 to-purple-600' },
  { id: 'wei',     name: 'Wei',     gender: 'Male',   ethnicity: 'Asian',    style: 'Tech',       mood: 'Confident',    gradient: 'from-cyan-400 to-blue-500' },
  { id: 'priya',   name: 'Priya',   gender: 'Female', ethnicity: 'Asian',    style: 'Wellness',   mood: 'Serene',       gradient: 'from-teal-400 to-emerald-500' },
  { id: 'andre',   name: 'Andre',   gender: 'Male',   ethnicity: 'Latino',   style: 'Casual',     mood: 'Friendly',     gradient: 'from-yellow-400 to-orange-500' },
  { id: 'zoe',     name: 'Zoe',     gender: 'Female', ethnicity: 'European', style: 'Fitness',    mood: 'Motivating',   gradient: 'from-rose-400 to-red-500' },
]
