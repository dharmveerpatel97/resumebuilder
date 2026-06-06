import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface FormSectionProps {
  title: string
  subtitle?: string
  defaultOpen?: boolean
  action?: ReactNode
  children: ReactNode
}

export function FormSection({
  title,
  subtitle,
  defaultOpen = true,
  action,
  children,
}: FormSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="rounded-xl border border-border bg-white overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 px-3 sm:px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex flex-1 items-center gap-2 min-w-0 text-left hover:opacity-80 transition-opacity cursor-pointer"
          aria-expanded={open}
        >
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-text-muted transition-transform duration-200 ${
              open ? 'rotate-0' : '-rotate-90'
            }`}
          />
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-text-dark">{title}</h3>
            {subtitle && (
              <p className="text-xs sm:text-sm text-text-body mt-0.5 line-clamp-2 sm:line-clamp-1">{subtitle}</p>
            )}
          </div>
        </button>
        {action && <div className="shrink-0 w-full sm:w-auto flex justify-end">{action}</div>}
      </div>

      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-border space-y-4">{children}</div>
      )}
    </section>
  )
}
