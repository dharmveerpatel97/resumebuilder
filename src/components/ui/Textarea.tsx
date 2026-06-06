import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export function Textarea({ label, className = '', id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-dark">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-dark placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-y min-h-[80px] ${className}`}
        {...props}
      />
    </div>
  )
}
