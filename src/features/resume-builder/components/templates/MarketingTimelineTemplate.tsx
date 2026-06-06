import { hexToRgba } from '../../data/themeColors'
import { itemGapStyle, sectionGapStyle } from '../../data/spacing'
import { bodyStyle, headingStyle, nameStyle, smallBodyStyle, subheadingStyle } from '../../data/typography'
import { isSectionEnabled } from '../../data/sectionOrder'
import { getMainSections } from '../../data/templateLayout'
import { formatEducationGrades } from '../../utils/educationDisplay'
import { OrderedSectionList } from './OrderedSectionList'
import { declarationBlock, personalDetailsBlock } from './sectionBlocks'
import { PhotoPlaceholder, SectionLine } from './templateParts'
import type { TemplateProps } from './types'

function TimelineItem({
  title,
  subtitle,
  dates,
  description,
  grades,
  theme,
  typography,
  isLast,
}: {
  title: string
  subtitle: string
  dates: string
  description?: string
  grades?: string | null
  theme: TemplateProps['theme']
  typography: TemplateProps['typography']
  isLast?: boolean
}) {
  return (
    <div className="resume-entry flex gap-3">
      <div className="flex flex-col items-center shrink-0 pt-1">
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: theme.heading }}
        />
        {!isLast && (
          <div className="w-px flex-1 min-h-[40px] mt-1" style={{ backgroundColor: hexToRgba(theme.heading, 0.3) }} />
        )}
      </div>
      <div className="flex-1 min-w-0 pb-4">
        <div className="flex justify-between gap-2 items-start">
          <div>
            <p style={subheadingStyle(typography, theme.subheading)}>{title}</p>
            <p className="italic" style={{ ...bodyStyle(typography, theme.body), opacity: 0.9 }}>
              {subtitle}
            </p>
          </div>
          <p className="whitespace-nowrap shrink-0" style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>
            {dates}
          </p>
        </div>
        {grades && (
          <p className="mt-0.5" style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.8 }}>
            {grades}
          </p>
        )}
        {description && (
          <p className="mt-1" style={bodyStyle(typography, theme.body)}>{description}</p>
        )}
      </div>
    </div>
  )
}

export function MarketingTimelineTemplate({ data, theme, typography, spacing }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects } = data
  const props = { data, theme, typography, spacing }
  const sectionHead = headingStyle(typography, theme.heading)

  return (
    <div className="resume-template-root flex leading-relaxed min-h-0">
      <aside
        className="w-[34%] shrink-0 resume-p flex flex-col"
        style={{ backgroundColor: hexToRgba(theme.heading, 0.06), ...sectionGapStyle(spacing) }}
      >
        <div className="relative mb-2">
          <div
            className="absolute -top-4 -left-4 w-24 h-24 -z-0"
            style={{
              backgroundColor: hexToRgba(theme.heading, 0.15),
              clipPath: 'polygon(0 0, 100% 0, 0 100%)',
            }}
          />
          <PhotoPlaceholder theme={theme} typography={typography} className="relative z-10 mx-auto" />
        </div>

        <div className="text-center">
          <h1 style={{ ...nameStyle(typography, theme.heading), fontSize: Math.max(typography.heading.fontSize + 4, 18) }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p className="mt-1" style={subheadingStyle(typography, theme.subheading)}>
              {personalInfo.jobTitle}
            </p>
          )}
        </div>

        <div className="resume-section" style={sectionGapStyle(spacing)}>
          <SectionLine title="Contact" headingStyle={sectionHead} theme={theme} />
          <div className="flex flex-col" style={itemGapStyle(spacing)}>
            {personalInfo.phone && <p style={bodyStyle(typography, theme.body)}>{personalInfo.phone}</p>}
            {personalInfo.email && <p style={bodyStyle(typography, theme.body)}>{personalInfo.email}</p>}
            {personalInfo.location && <p style={bodyStyle(typography, theme.body)}>{personalInfo.location}</p>}
            {personalInfo.website && <p style={bodyStyle(typography, theme.body)}>{personalInfo.website}</p>}
          </div>
        </div>

        {isSectionEnabled(data, 'summary') && personalInfo.summary && (
          <div className="resume-section">
            <SectionLine title="About Me" headingStyle={sectionHead} theme={theme} />
            <p style={bodyStyle(typography, theme.body)}>{personalInfo.summary}</p>
          </div>
        )}

        {isSectionEnabled(data, 'skills') && skills.length > 0 && (
          <div className="resume-section">
            <SectionLine title="Skills" headingStyle={sectionHead} theme={theme} />
            <ul className="flex flex-col" style={itemGapStyle(spacing)}>
              {skills.map((s) => (
                <li key={s.id} style={bodyStyle(typography, theme.body)}>• {s.name}</li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      <main className="flex-1 resume-p flex flex-col" style={sectionGapStyle(spacing)}>
        <OrderedSectionList
          order={data.sectionOrder}
          enabled={data.sectionEnabled}
          onlySections={getMainSections('marketingTimeline')}
          sections={{
            education: education.length > 0 ? (
              <section className="resume-section">
                <SectionLine title="Education" headingStyle={sectionHead} theme={theme} />
                {education.map((edu, i) => (
                  <TimelineItem
                    key={edu.id}
                    title={`${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`}
                    subtitle={edu.institution}
                    dates={`${edu.startDate} – ${edu.endDate}`}
                    description={edu.description}
                    grades={formatEducationGrades(edu)}
                    theme={theme}
                    typography={typography}
                    isLast={i === education.length - 1}
                  />
                ))}
              </section>
            ) : null,
            experience: experiences.length > 0 ? (
              <section className="resume-section">
                <SectionLine title="Experience" headingStyle={sectionHead} theme={theme} />
                {experiences.map((exp, i) => (
                  <TimelineItem
                    key={exp.id}
                    title={exp.position}
                    subtitle={exp.company}
                    dates={`${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`}
                    description={exp.description}
                    theme={theme}
                    typography={typography}
                    isLast={i === experiences.length - 1}
                  />
                ))}
              </section>
            ) : null,
            projects: projects.length > 0 ? (
              <section className="resume-section">
                <SectionLine title="Projects" headingStyle={sectionHead} theme={theme} />
                {projects.map((p, i) => (
                  <TimelineItem
                    key={p.id}
                    title={p.name}
                    subtitle={p.technologies ?? ''}
                    dates={`${p.startDate}${p.endDate ? ` – ${p.endDate}` : ''}`}
                    description={p.description}
                    theme={theme}
                    typography={typography}
                    isLast={i === projects.length - 1}
                  />
                ))}
              </section>
            ) : null,
            personalDetails: personalDetailsBlock(props),
            declaration: declarationBlock(props),
          }}
        />
      </main>
    </div>
  )
}
