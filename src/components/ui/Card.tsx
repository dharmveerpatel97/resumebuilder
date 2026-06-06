import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-border bg-white p-6 ${hover ? 'transition-shadow duration-200 hover:shadow-lg' : 'shadow-sm'} ${className}`}
    >
      {children}
    </div>
  )
}
