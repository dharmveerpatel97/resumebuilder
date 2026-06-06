import { sectionGapStyle } from '../../data/spacing'
import { nameStyle, smallBodyStyle, subheadingStyle } from '../../data/typography'
import { OrderedSectionList } from './OrderedSectionList'
import { buildStandardSections } from './sectionBlocks'
import type { TemplateProps } from './types'

export function FresherSimpleTemplate({ data, theme, typography, spacing }: TemplateProps) {
  const { personalInfo } = data
  const props = { data, theme, typography, spacing }

  return (
    <div className="resume-template-root leading-relaxed resume-p flex flex-col" style={sectionGapStyle(spacing)}>
      <header className="text-center border-b-2 pb-4" style={{ borderColor: theme.heading }}>
        <h1 style={nameStyle(typography, theme.heading)}>{personalInfo.fullName || 'Your Name'}</h1>
        {personalInfo.jobTitle && (
          <p className="mt-1" style={subheadingStyle(typography, theme.subheading)}>{personalInfo.jobTitle}</p>
        )}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2" style={smallBodyStyle(typography, theme.body)}>
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.email && <span>• {personalInfo.email}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
        </div>
      </header>

      <OrderedSectionList
        order={data.sectionOrder}
        enabled={data.sectionEnabled}
        className="flex flex-col"
        style={sectionGapStyle(spacing)}
        sections={buildStandardSections(
          props,
          { summary: 'Career Objective', experience: 'Experience / Training' },
          { headingVariant: 'fresher', skillsBullets: false },
        )}
      />
    </div>
  )
}
