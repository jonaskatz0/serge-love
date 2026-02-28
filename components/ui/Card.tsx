import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover }: CardProps) {
  return (
    <div className={cn('bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6', hover && 'transition-all duration-200 hover:shadow-md hover:scale-[1.01] cursor-pointer', className)}>
      {children}
    </div>
  )
}

export function BlueCard({ children, className, hover }: CardProps) {
  return (
    <div className={cn('bg-[#EBF5FF] rounded-2xl border border-[#BFDBFE] p-6', hover && 'transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer', className)}>
      {children}
    </div>
  )
}
