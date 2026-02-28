import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../app/generated/prisma/client'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/serge_love',
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')
  const actors = [
    { id: 'sophia',  name: 'Sophia',  gender: 'Female', ethnicity: 'European', style: 'Corporate',  mood: 'Professional',  gradient: 'from-pink-400 to-rose-500' },
    { id: 'marcus',  name: 'Marcus',  gender: 'Male',   ethnicity: 'African',  style: 'Casual',     mood: 'Energetic',     gradient: 'from-blue-400 to-indigo-500' },
    { id: 'yuki',    name: 'Yuki',    gender: 'Female', ethnicity: 'Asian',    style: 'Trendy',     mood: 'Playful',       gradient: 'from-purple-400 to-pink-500' },
    { id: 'elena',   name: 'Elena',   gender: 'Female', ethnicity: 'European', style: 'Lifestyle',  mood: 'Warm',          gradient: 'from-orange-400 to-rose-500' },
    { id: 'james',   name: 'James',   gender: 'Male',   ethnicity: 'European', style: 'Premium',    mood: 'Authoritative', gradient: 'from-slate-600 to-slate-800' },
    { id: 'aisha',   name: 'Aisha',   gender: 'Female', ethnicity: 'African',  style: 'Beauty',     mood: 'Glowing',       gradient: 'from-amber-400 to-orange-500' },
    { id: 'carlos',  name: 'Carlos',  gender: 'Male',   ethnicity: 'Latino',   style: 'Sports',     mood: 'Active',        gradient: 'from-green-400 to-emerald-500' },
    { id: 'nina',    name: 'Nina',    gender: 'Female', ethnicity: 'European', style: 'Luxury',     mood: 'Elegant',       gradient: 'from-violet-400 to-purple-600' },
    { id: 'wei',     name: 'Wei',     gender: 'Male',   ethnicity: 'Asian',    style: 'Tech',       mood: 'Confident',     gradient: 'from-cyan-400 to-blue-500' },
    { id: 'priya',   name: 'Priya',   gender: 'Female', ethnicity: 'Asian',    style: 'Wellness',   mood: 'Serene',        gradient: 'from-teal-400 to-emerald-500' },
    { id: 'andre',   name: 'Andre',   gender: 'Male',   ethnicity: 'Latino',   style: 'Casual',     mood: 'Friendly',      gradient: 'from-yellow-400 to-orange-500' },
    { id: 'zoe',     name: 'Zoe',     gender: 'Female', ethnicity: 'European', style: 'Fitness',    mood: 'Motivating',    gradient: 'from-rose-400 to-red-500' },
  ]

  for (const actor of actors) {
    await prisma.actor.upsert({
      where: { id: actor.id },
      update: actor,
      create: actor,
    })
  }
  console.log(`✅ Seeded ${actors.length} actors`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
