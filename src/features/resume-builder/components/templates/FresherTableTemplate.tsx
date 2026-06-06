import { sectionGapStyle } from '../../data/spacing'
import { bodyStyle, headingStyle, subheadingStyle } from '../../data/typography'
import { SquarePhotoPlaceholder } from './templateParts'
import { OrderedSectionList } from './OrderedSectionList'
import { buildStandardSections } from './sectionBlocks'
import type { TemplateProps } from './types'

export function FresherTableTemplate({ data, theme, typography, spacing }: TemplateProps) {
  const { personalInfo } = data
  const props = { data, theme, typography, spacing }
  const sectionHead = headingStyle(typography, theme.heading)
  const body = bodyStyle(typography, theme.body)

  return (
    <div className="resume-template-root leading-snug resume-p flex flex-col" style={sectionGapStyle(spacing)}>
      <h2 className="text-center font-bold uppercase tracking-widest border-b-2 border-gray-800 pb-2" style={sectionHead}>Resume</h2>
      <div className="flex justify-between gap-4 items-start">
        <div className="flex-1 min-w-0">
          <p className="font-bold uppercase" style={subheadingStyle(typography, theme.heading)}>{personalInfo.fullName || 'Your Name'}</p>
          {personalInfo.location && <p className="mt-1 whitespace-pre-line" style={body}>{personalInfo.location}</p>}
          {personalInfo.phone && <p className="mt-1" style={body}><span className="font-semibold">Mobile No:</span> {personalInfo.phone}</p>}
          {personalInfo.email && <p style={body}><span className="font-semibold">Email:</span> {personalInfo.email}</p>}
        </div>
        <SquarePhotoPlaceholder theme={theme} typography={typography} />
      </div>
      <OrderedSectionList
        order={data.sectionOrder}
        enabled={data.sectionEnabled}
        className="flex flex-col"
        style={sectionGapStyle(spacing)}
        sections={buildStandardSections(
          props,
          { summary: 'Career Objective', education: 'Academic Qualification', skills: 'Computer Skills', experience: 'Work Experience' },
          { educationTable: true, skillsBullets: true, experienceBullets: true },
        )}
      />
    </div>
  )
}
