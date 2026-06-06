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

function TimelineSection({
  title,
  children,
  theme,
  typography,
}: {
  title: string
  children: React.ReactNode
  theme: TemplateProps['theme']
  typography: TemplateProps['typography']
}) {
  const sectionHead = headingStyle(typography, theme.heading)
  return (
    <section className="resume-section flex gap-3">
      <div className="flex flex-col items-center shrink-0">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
          style={{ backgroundColor: theme.heading }}
        >
          •
        </div>
        <div className="w-px flex-1 min-h-full" style={{ backgroundColor: hexToRgba(theme.heading, 0.25) }} />
      </div>
      <div className="flex-1 min-w-0 pb-4">
        <SectionLine title={title} headingStyle={sectionHead} theme={theme} />
        {children}
      </div>
    </section>
  )
}

export function ExecutiveNavyTemplate({ data, theme, typography, spacing }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects } = data
  const props = { data, theme, typography, spacing }
  const half = Math.ceil(skills.length / 2)

  return (
    <div className="resume-template-root leading-relaxed">
      <div className="relative flex">
        <div className="w-[30%] shrink-0 resume-pt resume-px pb-4 flex justify-center">
          <PhotoPlaceholder size={96} theme={theme} typography={typography} />
        </div>
        <div
          className="flex-1 resume-py resume-px resume-pb flex flex-col justify-center text-white"
          style={{ backgroundColor: theme.heading }}
        >
          <h1
            className="uppercase tracking-wide leading-tight"
            style={{ ...nameStyle(typography, '#ffffff'), fontSize: Math.max(typography.heading.fontSize + 6, 22) }}
          >
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p className="uppercase tracking-widest mt-1 opacity-90" style={subheadingStyle(typography, '#e2e8f0')}>
              {personalInfo.jobTitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex">
        <aside
          className="w-[30%] shrink-0 resume-p flex flex-col"
          style={{ backgroundColor: hexToRgba(theme.heading, 0.07), ...sectionGapStyle(spacing) }}
        >
          <div className="resume-section">
            <SectionLine title="Contact" headingStyle={headingStyle(typography, theme.heading)} theme={theme} />
            <div className="flex flex-col" style={itemGapStyle(spacing)}>
              {personalInfo.phone && <p style={bodyStyle(typography, theme.body)}>{personalInfo.phone}</p>}
              {personalInfo.email && <p style={bodyStyle(typography, theme.body)}>{personalInfo.email}</p>}
              {personalInfo.location && <p style={bodyStyle(typography, theme.body)}>{personalInfo.location}</p>}
              {personalInfo.website && <p style={bodyStyle(typography, theme.body)}>{personalInfo.website}</p>}
            </div>
          </div>

          {isSectionEnabled(data, 'skills') && skills.length > 0 && (
            <div className="resume-section">
              <SectionLine title="Skills" headingStyle={headingStyle(typography, theme.heading)} theme={theme} />
              <ul className="flex flex-col" style={itemGapStyle(spacing)}>
                {skills.slice(0, half).map((s) => (
                  <li key={s.id} style={bodyStyle(typography, theme.body)}>• {s.name}</li>
                ))}
              </ul>
            </div>
          )}

          {isSectionEnabled(data, 'skills') && skills.length > half && (
            <div className="resume-section">
              <SectionLine title="Languages" headingStyle={headingStyle(typography, theme.heading)} theme={theme} />
              <ul className="flex flex-col" style={itemGapStyle(spacing)}>
                {skills.slice(half).map((s) => (
                  <li key={s.id} style={bodyStyle(typography, theme.body)}>• {s.name}</li>
                ))}
              </ul>
            </div>
          )}

          {personalInfo.linkedin && (
            <div className="resume-section">
              <SectionLine title="Reference" headingStyle={headingStyle(typography, theme.heading)} theme={theme} />
              <p style={bodyStyle(typography, theme.body)}>{personalInfo.linkedin}</p>
            </div>
          )}
        </aside>

        <main className="flex-1 resume-p flex flex-col" style={sectionGapStyle(spacing)}>
          <OrderedSectionList
            order={data.sectionOrder}
            enabled={data.sectionEnabled}
            onlySections={getMainSections('executiveNavy')}
            sections={{
              summary: personalInfo.summary ? (
                <TimelineSection title="Profile" theme={theme} typography={typography}>
                  <p style={bodyStyle(typography, theme.body)}>{personalInfo.summary}</p>
                </TimelineSection>
              ) : null,
              experience: experiences.length > 0 ? (
                <TimelineSection title="Work Experience" theme={theme} typography={typography}>
                  <div className="flex flex-col" style={itemGapStyle(spacing)}>
                    {experiences.map((exp) => (
                      <div key={exp.id} className="resume-entry">
                        <div className="flex justify-between gap-2">
                          <p style={subheadingStyle(typography, theme.subheading)}>{exp.company}</p>
                          <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>
                            {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                          </p>
                        </div>
                        <p style={bodyStyle(typography, theme.body)}>{exp.position}</p>
                        {exp.description && <p className="mt-1" style={bodyStyle(typography, theme.body)}>{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </TimelineSection>
              ) : null,
              education: education.length > 0 ? (
                <TimelineSection title="Education" theme={theme} typography={typography}>
                  <div className="flex flex-col" style={itemGapStyle(spacing)}>
                    {education.map((edu) => {
                      const grades = formatEducationGrades(edu)
                      return (
                        <div key={edu.id} className="resume-entry">
                          <div className="flex justify-between gap-2">
                            <p style={subheadingStyle(typography, theme.subheading)}>
                              {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                            </p>
                            <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>
                              {edu.startDate} – {edu.endDate}
                            </p>
                          </div>
                          <p style={bodyStyle(typography, theme.body)}>{edu.institution}</p>
                          {grades && <p className="mt-0.5" style={smallBodyStyle(typography, theme.body)}>{grades}</p>}
                        </div>
                      )
                    })}
                  </div>
                </TimelineSection>
              ) : null,
              projects: projects.length > 0 ? (
                <TimelineSection title="Projects" theme={theme} typography={typography}>
                  <div className="flex flex-col" style={itemGapStyle(spacing)}>
                    {projects.map((p) => (
                      <div key={p.id} className="resume-entry">
                        <p style={subheadingStyle(typography, theme.subheading)}>{p.name}</p>
                        {p.description && <p className="mt-1" style={bodyStyle(typography, theme.body)}>{p.description}</p>}
                      </div>
                    ))}
                  </div>
                </TimelineSection>
              ) : null,
              personalDetails: personalDetailsBlock(props),
              declaration: declarationBlock(props),
            }}
          />
        </main>
      </div>
    </div>
  )
}
