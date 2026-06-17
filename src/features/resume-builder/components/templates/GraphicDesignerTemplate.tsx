import type { CSSProperties } from 'react'
import { hexToRgba } from '../../data/themeColors'
import { itemGapStyle, sectionGapStyle } from '../../data/spacing'
import { bodyStyle, headingStyle, nameStyle, smallBodyStyle, subheadingStyle } from '../../data/typography'
import { isSectionEnabled } from '../../data/sectionOrder'
import { getMainSections } from '../../data/templateLayout'
import { OrderedSectionList } from './OrderedSectionList'
import { declarationBlock, personalDetailsBlock } from './sectionBlocks'
import type { TemplateProps } from './types'
import { getDescriptionMarker, renderDescription } from '../../utils/descriptionDisplay'
import { filledEducation, filledExperiences, filledProjects, filledSkills } from '../../utils/resumeEntryUtils'

function LeftSectionHeading({ title, style }: { title: string; style: CSSProperties }) {
  const color = typeof style.color === 'string' ? style.color : '#000'
  return (
    <h3
      className="uppercase tracking-wider mb-2 pb-1 border-b"
      style={{ ...style, borderColor: hexToRgba(color, 0.2) }}
    >
      {title}
    </h3>
  )
}

function RightSectionHeading({ title, style }: { title: string; style: CSSProperties }) {
  return (
    <h3 className="uppercase tracking-wider mb-2" style={style}>{title}</h3>
  )
}

export function GraphicDesignerTemplate({ data, templateId, theme, typography, spacing }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects } = data
  const props = { data, templateId, theme, typography, spacing }
  const descMarker = getDescriptionMarker(templateId, data.useBulletPoints)
  const body = bodyStyle(typography, theme.body)
  const sectionHeading = headingStyle(typography, theme.heading)

  return (
    <div className="min-h-[297mm] leading-relaxed p-[10mm] flex flex-col" style={sectionGapStyle(spacing)}>
      <header className="flex justify-between items-start">
        <div>
          <h1 className="uppercase tracking-tight leading-none" style={nameStyle(typography, theme.heading)}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <div className="mt-2 text-white px-3 py-1 inline-block" style={{ backgroundColor: theme.heading }}>
              <p className="uppercase tracking-wider" style={subheadingStyle(typography)}>
                {personalInfo.jobTitle}
              </p>
            </div>
          )}
        </div>
        <div className="text-right min-w-[140px] flex flex-col" style={{ ...smallBodyStyle(typography, theme.body), ...itemGapStyle(spacing) }}>
          {personalInfo.location && (
            <div className="pb-1 border-b" style={{ borderColor: hexToRgba(theme.body, 0.2) }}>
              <p className="uppercase" style={{ ...smallBodyStyle(typography, theme.subheading), opacity: 0.7 }}>
                Address
              </p>
              <p>{personalInfo.location}</p>
            </div>
          )}
          {personalInfo.phone && (
            <div className="pb-1 border-b" style={{ borderColor: hexToRgba(theme.body, 0.2) }}>
              <p className="uppercase" style={{ ...smallBodyStyle(typography, theme.subheading), opacity: 0.7 }}>
                Phone
              </p>
              <p>{personalInfo.phone}</p>
            </div>
          )}
          {personalInfo.email && (
            <div className="pb-1 border-b" style={{ borderColor: hexToRgba(theme.body, 0.2) }}>
              <p className="uppercase" style={{ ...smallBodyStyle(typography, theme.subheading), opacity: 0.7 }}>
                Email
              </p>
              <p>{personalInfo.email}</p>
            </div>
          )}
          {personalInfo.website && (
            <div>
              <p className="uppercase" style={{ ...smallBodyStyle(typography, theme.subheading), opacity: 0.7 }}>
                Website
              </p>
              <p>{personalInfo.website}</p>
            </div>
          )}
        </div>
      </header>

      <div className="flex gap-5">
        <aside
          className="w-[32%] shrink-0 border-r pr-4 flex flex-col"
          style={{ borderColor: hexToRgba(theme.heading, 0.2), ...sectionGapStyle(spacing) }}
        >
          {isSectionEnabled(data, 'education') && filledEducation(education).length > 0 && (
            <section>
              <LeftSectionHeading title="Education" style={sectionHeading} />
              <div className="flex flex-col" style={itemGapStyle(spacing)}>
                {filledEducation(education).map((edu) => (
                  <div key={edu.id}>
                    <p style={subheadingStyle(typography, theme.subheading)}>
                      {edu.degree}
                      {edu.field ? ` in ${edu.field}` : ''}
                    </p>
                    <p style={bodyStyle(typography, theme.body)}>{edu.institution}</p>
                    <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>
                      {edu.startDate} – {edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {isSectionEnabled(data, 'skills') && filledSkills(skills).length > 0 && (
            <section>
              <LeftSectionHeading title="Skills" style={sectionHeading} />
              <ul className="flex flex-col" style={itemGapStyle(spacing)}>
                {filledSkills(skills).map((skill) => (
                  <li key={skill.id} className="flex items-start gap-1" style={bodyStyle(typography, theme.body)}>
                    <span style={{ color: theme.heading }}>•</span>
                    {skill.name}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {personalInfo.linkedin && (
            <section>
              <LeftSectionHeading title="Follow Me" style={sectionHeading} />
              <p style={bodyStyle(typography, theme.body)}>{personalInfo.linkedin}</p>
            </section>
          )}
        </aside>

        <main className="flex-1 flex flex-col" style={sectionGapStyle(spacing)}>
          <OrderedSectionList
            order={data.sectionOrder}
            enabled={data.sectionEnabled}
            onlySections={getMainSections('graphicDesigner')}
            sections={{
              summary: personalInfo.summary ? (
                <section className="resume-section">
                  <RightSectionHeading title="About Me" style={sectionHeading} />
                  <p className="leading-relaxed" style={bodyStyle(typography, theme.body)}>{personalInfo.summary}</p>
                </section>
              ) : null,
              experience: filledExperiences(experiences).length > 0 ? (
                <section className="resume-section">
                  <RightSectionHeading title="Experience" style={sectionHeading} />
                  <div className="flex flex-col" style={itemGapStyle(spacing)}>
                    {filledExperiences(experiences).map((exp) => (
                      <div key={exp.id} className="resume-entry">
                        <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>
                          {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                        </p>
                        <p style={subheadingStyle(typography, theme.subheading)}>{exp.position} / {exp.company}</p>
                        {renderDescription(exp.description, body, descMarker, theme.heading)}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null,
              projects: filledProjects(projects).length > 0 ? (
                <section className="resume-section">
                  <RightSectionHeading title="Projects" style={sectionHeading} />
                  <div className="flex flex-col" style={itemGapStyle(spacing)}>
                    {filledProjects(projects).map((project) => (
                      <div key={project.id} className="resume-entry">
                        <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>
                          {project.startDate}{project.endDate ? ` – ${project.endDate}` : ''}
                        </p>
                        <p style={subheadingStyle(typography, theme.subheading)}>{project.name}</p>
                        {project.technologies && (
                          <p className="italic" style={{ ...smallBodyStyle(typography, theme.subheading), opacity: 0.85 }}>{project.technologies}</p>
                        )}
                        {renderDescription(project.description, body, descMarker, theme.heading)}
                        {project.url && <p className="mt-0.5" style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>{project.url}</p>}
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
      </div>
    </div>
  )
}
