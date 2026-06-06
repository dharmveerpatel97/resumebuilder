import { hexToRgba } from '../../data/themeColors'
import { itemGapStyle, sectionGapStyle } from '../../data/spacing'
import { bodyStyle, headingStyle, nameStyle, smallBodyStyle, subheadingStyle } from '../../data/typography'
import { isSectionEnabled } from '../../data/sectionOrder'
import { getMainSections } from '../../data/templateLayout'
import { formatEducationGrades } from '../../utils/educationDisplay'
import { OrderedSectionList } from './OrderedSectionList'
import { declarationBlock, personalDetailsBlock } from './sectionBlocks'
import type { TemplateProps } from './types'

function SectionTitle({ title, style }: { title: string; style: React.CSSProperties }) {
  return (
    <div className="mb-3 pb-2 border-b border-gray-300">
      <h3 className="uppercase tracking-widest font-bold" style={style}>{title}</h3>
    </div>
  )
}

export function AccountantTemplate({ data, theme, typography, spacing }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects } = data
  const props = { data, theme, typography, spacing }
  const sectionHead = headingStyle(typography, theme.heading)
  const skillHalf = Math.ceil(skills.length / 2)

  return (
    <div className="resume-template-root leading-relaxed">
      <header
        className="resume-px resume-py border-b border-gray-200"
        style={{ backgroundColor: hexToRgba(theme.heading, 0.06) }}
      >
        <h1 className="uppercase tracking-wide" style={nameStyle(typography, theme.heading)}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && (
          <p className="mt-1" style={subheadingStyle(typography, theme.subheading)}>
            {personalInfo.jobTitle}
          </p>
        )}
      </header>

      <div className="flex">
        <main className="flex-[2] resume-p flex flex-col" style={sectionGapStyle(spacing)}>
          <OrderedSectionList
            order={data.sectionOrder}
            enabled={data.sectionEnabled}
            onlySections={getMainSections('accountant')}
            sections={{
              summary: personalInfo.summary ? (
                <section className="resume-section">
                  <SectionTitle title="About Me" style={sectionHead} />
                  <p style={bodyStyle(typography, theme.body)}>{personalInfo.summary}</p>
                </section>
              ) : null,
              education: education.length > 0 ? (
                <section className="resume-section">
                  <SectionTitle title="Education" style={sectionHead} />
                  <div className="flex flex-col" style={itemGapStyle(spacing)}>
                    {education.map((edu) => {
                      const grades = formatEducationGrades(edu)
                      return (
                        <div key={edu.id} className="resume-entry">
                          <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.8 }}>
                            {edu.institution} | {edu.startDate} – {edu.endDate}
                          </p>
                          <p style={subheadingStyle(typography, theme.subheading)}>
                            {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                          </p>
                          {grades && <p style={smallBodyStyle(typography, theme.body)}>{grades}</p>}
                          {edu.description && <p className="mt-1" style={bodyStyle(typography, theme.body)}>{edu.description}</p>}
                        </div>
                      )
                    })}
                  </div>
                </section>
              ) : null,
              experience: experiences.length > 0 ? (
                <section className="resume-section">
                  <SectionTitle title="Work Experience" style={sectionHead} />
                  <div className="flex flex-col" style={itemGapStyle(spacing)}>
                    {experiences.map((exp) => (
                      <div key={exp.id} className="resume-entry">
                        <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.8 }}>
                          {exp.company} | {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                        </p>
                        <p style={subheadingStyle(typography, theme.subheading)}>{exp.position}</p>
                        {exp.description && <p className="mt-1" style={bodyStyle(typography, theme.body)}>{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null,
              projects: projects.length > 0 ? (
                <section className="resume-section">
                  <SectionTitle title="Projects" style={sectionHead} />
                  <div className="flex flex-col" style={itemGapStyle(spacing)}>
                    {projects.map((p) => (
                      <div key={p.id} className="resume-entry">
                        <p style={subheadingStyle(typography, theme.subheading)}>{p.name}</p>
                        {p.description && <p className="mt-1" style={bodyStyle(typography, theme.body)}>{p.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null,
              personalDetails: personalDetailsBlock(props),
              declaration: declarationBlock(props),
            }}
          />
        </main>

        <aside
          className="flex-1 resume-p border-l border-gray-200 flex flex-col"
          style={sectionGapStyle(spacing)}
        >
          <section className="resume-section">
            <SectionTitle title="Contact" style={sectionHead} />
            <div className="flex flex-col" style={itemGapStyle(spacing)}>
              {personalInfo.phone && <p style={bodyStyle(typography, theme.body)}>{personalInfo.phone}</p>}
              {personalInfo.email && <p style={bodyStyle(typography, theme.body)}>{personalInfo.email}</p>}
              {personalInfo.location && <p style={bodyStyle(typography, theme.body)}>{personalInfo.location}</p>}
              {personalInfo.website && <p style={bodyStyle(typography, theme.body)}>{personalInfo.website}</p>}
            </div>
          </section>

          {isSectionEnabled(data, 'skills') && skills.length > 0 && (
            <section className="resume-section">
              <SectionTitle title="Skills" style={sectionHead} />
              {skillHalf > 0 && (
                <>
                  <p className="font-semibold mb-1" style={subheadingStyle(typography, theme.subheading)}>Professional</p>
                  <ul className="flex flex-col mb-3" style={itemGapStyle(spacing)}>
                    {skills.slice(0, skillHalf).map((s) => (
                      <li key={s.id} style={bodyStyle(typography, theme.body)}>{s.name}</li>
                    ))}
                  </ul>
                </>
              )}
              {skills.length > skillHalf && (
                <>
                  <p className="font-semibold mb-1" style={subheadingStyle(typography, theme.subheading)}>Personal</p>
                  <ul className="flex flex-col" style={itemGapStyle(spacing)}>
                    {skills.slice(skillHalf).map((s) => (
                      <li key={s.id} style={bodyStyle(typography, theme.body)}>{s.name}</li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          )}

          {personalInfo.linkedin && (
            <section className="resume-section">
              <SectionTitle title="Languages" style={sectionHead} />
              <ul className="flex flex-col" style={itemGapStyle(spacing)}>
                <li style={bodyStyle(typography, theme.body)}>• English — Fluent</li>
                {personalInfo.linkedin && (
                  <li style={bodyStyle(typography, theme.body)}>• {personalInfo.linkedin}</li>
                )}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}
