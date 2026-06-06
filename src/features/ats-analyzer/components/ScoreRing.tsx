interface ScoreRingProps {
  score: number
  size?: number
  label?: string
  variant?: 'light' | 'dark'
}

export function ScoreRing({
  score,
  size = 140,
  label = 'ATS Score',
  variant = 'light',
}: ScoreRingProps) {
  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const isDark = variant === 'dark'

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg className="h-full w-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className={isDark ? 'text-white/15' : 'text-border'}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`text-4xl font-bold tabular-nums leading-none ${
            isDark ? 'text-white' : 'text-text-dark'
          }`}
        >
          {score}
        </span>
        <span
          className={`text-xs mt-1 font-medium ${
            isDark ? 'text-white/60' : 'text-text-muted'
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  )
}
