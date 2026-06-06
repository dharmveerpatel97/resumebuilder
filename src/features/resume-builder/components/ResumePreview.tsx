import { forwardRef } from 'react'
import type { ResumeData, TemplateId } from '../types/resume.types'
import type { ResumeTheme } from '../data/themeColors'
import type { ResumeSpacing } from '../data/spacing'
import type { ResumeTypography } from '../data/typography'
import { getTemplateComponent } from './templates'

interface ResumePreviewProps {
  data: ResumeData
  templateId: TemplateId
  theme: ResumeTheme
  typography: ResumeTypography
  spacing: ResumeSpacing
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  function ResumePreview({ data, templateId, theme, typography, spacing }, ref) {
    const Template = getTemplateComponent(templateId)

    return (
      <div className="resume-paper resume-paper-preview" ref={ref}>
        <Template data={data} theme={theme} typography={typography} spacing={spacing} />
      </div>
    )
  },
)
