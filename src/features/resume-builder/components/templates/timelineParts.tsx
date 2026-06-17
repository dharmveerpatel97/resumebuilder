import type { ReactNode } from 'react'
import { hexToRgba } from '../../data/themeColors'
import type { ResumeTheme } from '../../data/themeColors'
import { headingStyle } from '../../data/typography'
import type { ResumeTypography } from '../../data/typography'
import { SectionLine } from './templateParts'

/** Timeline section that can split across pages — header stays compact, entries flow naturally. */
export function SplittableTimelineSection({
  title,
  theme,
  typography,
  children,
  marker = 'square',
}: {
  title: string
  theme: ResumeTheme
  typography: ResumeTypography
  children: ReactNode
  marker?: 'square' | 'circle'
}) {
  const sectionHead = headingStyle(typography, theme.heading)

  return (
    <div className="resume-timeline-section">
      <div className="resume-timeline-head flex gap-3 items-start">
        <div className="shrink-0 pt-0.5">
          {marker === 'circle' ? (
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
              style={{ backgroundColor: theme.heading }}
            >
              •
            </div>
          ) : (
            <div
              className="w-6 h-6 flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: theme.heading }}
            >
              ■
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 pb-2">
          <SectionLine title={title} headingStyle={sectionHead} theme={theme} />
        </div>
      </div>
      <div
        className="resume-timeline-body pl-9 border-l-2 ml-3"
        style={{ borderColor: hexToRgba(theme.heading, 0.2) }}
      >
        {children}
      </div>
    </div>
  )
}
