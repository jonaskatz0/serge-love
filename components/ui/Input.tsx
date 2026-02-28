import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef, TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-[#0A0A0B] mb-1.5">{label}</label>}
      <input
        ref={ref}
        className={cn('w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0A0A0B] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all duration-200 text-sm', error && 'border-red-400 focus:ring-red-400', className)}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-[#0A0A0B] mb-1.5">{label}</label>}
      <textarea
        ref={ref}
        className={cn('w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0A0A0B] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all duration-200 text-sm resize-none', error && 'border-red-400 focus:ring-red-400', className)}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
)
Textarea.displayName = 'Textarea'
