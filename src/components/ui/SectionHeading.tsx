interface SectionHeadingProps {
  title: string
  subtitle?: string
  highlight?: string
  align?: 'left' | 'center'
  light?: boolean
}

export function SectionHeading({
  title,
  subtitle,
  highlight,
  align = 'center',
  light = false,
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left'

  return (
    <div className={`mb-12 ${alignClass}`}>
      <h2
        className={`text-3xl font-bold tracking-tight md:text-4xl ${light ? 'text-white' : 'text-text-dark'}`}
      >
        {title}
        {highlight && (
          <>
            {' '}
            <span className={light ? 'text-primary-light' : 'text-primary'}>
              {highlight}
            </span>
          </>
        )}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-lg max-w-2xl ${align === 'center' ? 'mx-auto' : ''} ${light ? 'text-white/80' : 'text-text-body'}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
