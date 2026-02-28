import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    const variants = {
      primary: 'bg-[#0A0A0B] text-white hover:bg-[#1a1a1b] focus:ring-[#0A0A0B] shadow-sm hover:shadow-md',
      secondary: 'bg-[#EBF5FF] text-[#2563EB] hover:bg-[#DBEAFE] focus:ring-[#2563EB] border border-[#BFDBFE]',
      ghost: 'text-[#6B7280] hover:text-[#0A0A0B] hover:bg-[#F8FAFC] focus:ring-[#E2E8F0]',
      destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
      outline: 'border border-[#E2E8F0] text-[#0A0A0B] hover:bg-[#F8FAFC] focus:ring-[#E2E8F0]',
    }
    const sizes = {
      sm: 'px-4 py-1.5 text-sm',
      md: 'px-6 py-2.5 text-sm',
      lg: 'px-8 py-3.5 text-base',
    }
    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} disabled={disabled || loading} {...props}>
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {children}
          </span>
        ) : children}
      </button>
    )
  }
)
Button.displayName = 'Button'
export { Button }
