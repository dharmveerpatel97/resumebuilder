import type { ResumeData, TemplateId } from '../types/resume.types'
import type { ResumeTheme } from '../data/themeColors'
import { defaultSpacing } from '../data/spacing'
import type { ResumeSpacing } from '../data/spacing'
import { defaultTypography } from '../data/typography'
import type { ResumeTypography } from '../data/typography'
import { ResumePreview } from './ResumePreview'

interface TemplateThumbnailProps {
  templateId: TemplateId
  data: ResumeData
  theme: ResumeTheme
  typography?: ResumeTypography
  spacing?: ResumeSpacing
}

export function TemplateThumbnail({
  templateId,
  data,
  theme,
  typography = defaultTypography,
  spacing = defaultSpacing,
}: TemplateThumbnailProps) {
  return (
    <div className="relative h-[280px] overflow-hidden bg-gray-100">
      <div
        className="absolute left-1/2 top-3 pointer-events-none"
        style={{ transform: 'translateX(-50%) scale(0.3)', transformOrigin: 'top center' }}
      >
        <ResumePreview
          data={data}
          templateId={templateId}
          theme={theme}
          typography={typography}
          spacing={spacing}
        />
      </div>
    </div>
  )
}
