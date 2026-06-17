import { sectionGapStyle } from '../../data/spacing'
import { bodyStyle, nameStyle, subheadingStyle } from '../../data/typography'
import { hasText } from '../../utils/resumeEntryUtils'
import { OrderedSectionList } from './OrderedSectionList'
import { buildStandardSections } from './sectionBlocks'
import type { TemplateProps } from './types'

export function ProfessionalTemplate({ data, templateId, theme, typography, spacing }: TemplateProps) {
  const { personalInfo } = data
  const props = { data, templateId, theme, typography, spacing }
  return (
    <div className="resume-template-root leading-relaxed resume-p flex flex-col" style={sectionGapStyle(spacing)}>
      <header className="pb-4 border-b-2" style={{ borderColor: theme.heading }}>
        <h1 className="tracking-tight" style={nameStyle(typography, theme.heading)}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2" style={subheadingStyle(typography, theme.subheading)}>
          {hasText(personalInfo.email) && <span>{personalInfo.email}</span>}
          {hasText(personalInfo.phone) && <span>•</span>}
          {hasText(personalInfo.phone) && <span>{personalInfo.phone}</span>}
          {hasText(personalInfo.location) && <span>•</span>}
          {hasText(personalInfo.location) && <span>{personalInfo.location}</span>}
        </div>
        {(hasText(personalInfo.linkedin) || hasText(personalInfo.website)) && (
          <div className="flex flex-wrap gap-x-3 mt-1" style={{ ...bodyStyle(typography, theme.body), opacity: 0.85 }}>
            {hasText(personalInfo.linkedin) && <span>{personalInfo.linkedin}</span>}
            {hasText(personalInfo.website) && <span>{personalInfo.website}</span>}
          </div>
        )}
      </header>

      <OrderedSectionList
        order={data.sectionOrder}
        enabled={data.sectionEnabled}
        className="flex flex-col"
        style={sectionGapStyle(spacing)}
        sections={buildStandardSections(
          props,
          { summary: 'Professional Summary', experience: 'Work Experience', skills: 'Technical Skills' },
          {},
        )}
      />
    </div>
  )
}
