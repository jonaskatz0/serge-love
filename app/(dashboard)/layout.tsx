import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const userName = user.firstName
    ? `${user.firstName} ${user.lastName ?? ''}`.trim()
    : (user.emailAddresses[0]?.emailAddress ?? 'User')

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar userName={userName} userPlan="Pro Plan" credits={47} maxCredits={50} />
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
