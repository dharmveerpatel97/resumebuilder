import { forwardRef } from 'react'
import type { ResumeData, TemplateId } from '../types/resume.types'
import type { ResumeTheme } from '../data/themeColors'
import type { ResumeSpacing } from '../data/spacing'
import { fontFamilyStyle, type ResumeTypography } from '../data/typography'
import { getTemplateComponent } from './templates'

interface ResumePreviewProps {
  data: ResumeData
  templateId: TemplateId
  theme: ResumeTheme
  typography: ResumeTypography
  spacing: ResumeSpacing
  /** Rendered inside a paginated page frame (no repeating band background) */
  embedded?: boolean
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  function ResumePreview({ data, templateId, theme, typography, spacing, embedded }, ref) {
    const Template = getTemplateComponent(templateId)

    return (
      <div
        className={embedded ? 'resume-paper' : 'resume-paper resume-paper-preview'}
        ref={ref}
        data-font={typography.fontFamily}
        style={fontFamilyStyle(typography)}
      >
        <Template
          data={data}
          templateId={templateId}
          theme={theme}
          typography={typography}
          spacing={spacing}
        />
      </div>
    )
  },
)
