import type { ResumeData, TemplateId } from '../../types/resume.types'
import type { ResumeTheme } from '../../data/themeColors'
import type { ResumeSpacing } from '../../data/spacing'
import type { ResumeTypography } from '../../data/typography'

export interface TemplateProps {
  data: ResumeData
  templateId: TemplateId
  theme: ResumeTheme
  typography: ResumeTypography
  spacing: ResumeSpacing
}
