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

function TimelineBlock({
  title,
  theme,
  typography,
  children,
}: {
  title: string
  theme: TemplateProps['theme']
  typography: TemplateProps['typography']
  children: React.ReactNode
}) {
  return (
    <section className="resume-section flex gap-3">
      <div
        className="w-6 h-6 shrink-0 flex items-center justify-center text-white text-xs font-bold mt-0.5"
        style={{ backgroundColor: theme.heading }}
      >
        ■
      </div>
      <div className="flex-1 min-w-0 pb-3 border-l-2 pl-3 -ml-px" style={{ borderColor: hexToRgba(theme.heading, 0.2) }}>
        <SectionLine title={title} headingStyle={headingStyle(typography, theme.heading)} theme={theme} />
        {children}
      </div>
    </section>
  )
}

export function StudentPurpleTemplate({ data, theme, typography, spacing }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects } = data
  const props = { data, theme, typography, spacing }
  const sectionHead = headingStyle(typography, theme.heading)
  const softSkills = skills.slice(0, Math.ceil(skills.length / 2))
  const techSkills = skills.slice(Math.ceil(skills.length / 2))

  return (
    <div className="resume-template-root leading-relaxed">
      <div className="flex">
        <div className="w-[28%] shrink-0 resume-pt resume-px flex justify-center">
          <PhotoPlaceholder theme={theme} typography={typography} />
        </div>
        <div
          className="flex-1 resume-py resume-px text-white uppercase"
          style={{ backgroundColor: theme.heading }}
        >
          <h1 style={{ ...nameStyle(typography, '#fff'), fontSize: Math.max(typography.heading.fontSize + 4, 20) }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p className="mt-1 tracking-wider opacity-90" style={subheadingStyle(typography, '#e9d5ff')}>
              {personalInfo.jobTitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex">
        <aside
          className="w-[28%] shrink-0 resume-p flex flex-col"
          style={{ backgroundColor: hexToRgba(theme.heading, 0.08), ...sectionGapStyle(spacing) }}
        >
          <div className="resume-section">
            <SectionLine title="Contact" headingStyle={sectionHead} theme={theme} />
            <div className="flex flex-col" style={itemGapStyle(spacing)}>
              {personalInfo.phone && <p style={bodyStyle(typography, theme.body)}>{personalInfo.phone}</p>}
              {personalInfo.email && <p style={bodyStyle(typography, theme.body)}>{personalInfo.email}</p>}
              {personalInfo.location && <p style={bodyStyle(typography, theme.body)}>{personalInfo.location}</p>}
              {personalInfo.website && <p style={bodyStyle(typography, theme.body)}>{personalInfo.website}</p>}
            </div>
          </div>

          {isSectionEnabled(data, 'skills') && softSkills.length > 0 && (
            <div className="resume-section">
              <SectionLine title="Soft Skills" headingStyle={sectionHead} theme={theme} />
              <ul className="flex flex-col" style={itemGapStyle(spacing)}>
                {softSkills.map((s) => (
                  <li key={s.id} style={bodyStyle(typography, theme.body)}>• {s.name}</li>
                ))}
              </ul>
            </div>
          )}

          {isSectionEnabled(data, 'skills') && techSkills.length > 0 && (
            <div className="resume-section">
              <SectionLine title="Tech Skills" headingStyle={sectionHead} theme={theme} />
              <ul className="flex flex-col" style={itemGapStyle(spacing)}>
                {techSkills.map((s) => (
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
            onlySections={getMainSections('studentPurple')}
            sections={{
              summary: personalInfo.summary ? (
                <TimelineBlock title="Profile" theme={theme} typography={typography}>
                  <p style={bodyStyle(typography, theme.body)}>{personalInfo.summary}</p>
                </TimelineBlock>
              ) : null,
              education: education.length > 0 ? (
                <TimelineBlock title="Education" theme={theme} typography={typography}>
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
                          {grades && <p style={smallBodyStyle(typography, theme.body)}>{grades}</p>}
                        </div>
                      )
                    })}
                  </div>
                </TimelineBlock>
              ) : null,
              projects: projects.length > 0 ? (
                <TimelineBlock title="Projects" theme={theme} typography={typography}>
                  <div className="flex flex-col" style={itemGapStyle(spacing)}>
                    {projects.map((p) => (
                      <div key={p.id} className="resume-entry">
                        <div className="flex justify-between gap-2">
                          <p style={subheadingStyle(typography, theme.subheading)}>{p.name}</p>
                          <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>
                            {p.startDate}{p.endDate ? ` – ${p.endDate}` : ''}
                          </p>
                        </div>
                        {p.description && <p className="mt-1" style={bodyStyle(typography, theme.body)}>{p.description}</p>}
                        {p.technologies && (
                          <p className="italic mt-0.5" style={smallBodyStyle(typography, theme.body)}>
                            Technologies: {p.technologies}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </TimelineBlock>
              ) : null,
              experience: experiences.length > 0 ? (
                <TimelineBlock title="Achievements" theme={theme} typography={typography}>
                  <div className="flex flex-col" style={itemGapStyle(spacing)}>
                    {experiences.map((exp) => (
                      <div key={exp.id} className="resume-entry">
                        <p style={subheadingStyle(typography, theme.subheading)}>{exp.position} — {exp.company}</p>
                        {exp.description && <p className="mt-0.5" style={bodyStyle(typography, theme.body)}>{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </TimelineBlock>
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
