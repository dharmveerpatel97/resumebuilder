import type { CSSProperties } from 'react'
import { hexToRgba } from '../../data/themeColors'
import { itemGapStyle, sectionGapStyle } from '../../data/spacing'
import { bodyStyle, headingStyle, nameStyle, smallBodyStyle, subheadingStyle } from '../../data/typography'
import { formatEducationGrades } from '../../utils/educationDisplay'
import { getDescriptionMarker, renderDescription } from '../../utils/descriptionDisplay'
import {
  degreeWithField,
  filledEducation,
  filledExperiences,
  filledProjects,
  filledSkills,
  formatDateRange,
  formatProjectDateRange,
  hasText,
  joinParts,
} from '../../utils/resumeEntryUtils'
import { OrderedSectionList } from './OrderedSectionList'
import type { TemplateProps } from './types'

function SectionTitle({ title, style }: { title: string; style: CSSProperties }) {
  const color = typeof style.color === 'string' ? style.color : '#1d4ed8'
  return (
    <div className="mb-1.5">
      <h3 className="uppercase tracking-wide" style={style}>{title}</h3>
      <div className="mt-1 h-px" style={{ backgroundColor: hexToRgba(color, 0.25) }} />
    </div>
  )
}

function contactLine(parts: (string | null | undefined)[]): string | null {
  return joinParts(parts.filter(hasText) as string[], ' | ')
}

export function CompactProTemplate({ data, templateId, theme, typography, spacing }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects } = data
  const sectionHead = headingStyle(typography, theme.heading)
  const body = bodyStyle(typography, theme.body)
  const descMarker = getDescriptionMarker(templateId, data.useBulletPoints)

  const skillColumns = (() => {
    const cols: typeof skills[] = [[], [], []]
    filledSkills(skills).forEach((skill, i) => cols[i % 3].push(skill))
    return cols
  })()

  const contact = contactLine([
    personalInfo.phone,
    personalInfo.email,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.website,
  ])

  return (
    <div className="resume-template-root leading-relaxed resume-p-compact flex flex-col text-center" style={sectionGapStyle(spacing)}>
      <header>
        <h1 style={nameStyle(typography, theme.heading)}>{personalInfo.fullName || 'Your Name'}</h1>
        {hasText(personalInfo.jobTitle) && (
          <p className="mt-1" style={subheadingStyle(typography, theme.subheading)}>{personalInfo.jobTitle}</p>
        )}
        {contact && (
          <p className="mt-2" style={smallBodyStyle(typography, theme.body)}>{contact}</p>
        )}
      </header>

      <OrderedSectionList
        order={data.sectionOrder}
        enabled={data.sectionEnabled}
        className="flex flex-col text-left"
        style={sectionGapStyle(spacing)}
        sections={{
          summary: hasText(personalInfo.summary) ? (
            <section className="resume-section">
              <p className="text-justify" style={body}>{personalInfo.summary}</p>
            </section>
          ) : null,
          skills: filledSkills(skills).length > 0 ? (
            <section className="resume-section">
              <SectionTitle title="Skills" style={sectionHead} />
              <div className="grid grid-cols-3 gap-x-6">
                {skillColumns.map((col, colIndex) => (
                  <ul key={colIndex} className="flex flex-col gap-0.5 m-0 p-0 list-none">
                    {col.map((skill) => (
                      <li key={skill.id} className="flex items-start gap-1 leading-snug" style={body}>
                        <span className="shrink-0" style={{ color: theme.heading }}>•</span>
                        <span>{skill.name}</span>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </section>
          ) : null,
          experience: filledExperiences(experiences).length > 0 ? (
            <section className="resume-section">
              <SectionTitle title="Work Experience" style={sectionHead} />
              <div className="flex flex-col" style={itemGapStyle(spacing)}>
                {filledExperiences(experiences).map((exp) => {
                  const dates = formatDateRange(exp.startDate, exp.endDate, exp.current)
                  const title = joinParts([exp.position, exp.company], ' at ') ?? exp.company ?? exp.position
                  return (
                    <div key={exp.id} className="resume-entry">
                      {(title || dates) && (
                        <div className="flex justify-between items-start gap-3">
                          {title && <p style={subheadingStyle(typography, theme.subheading)}>{title}</p>}
                          {dates && (
                            <p className="whitespace-nowrap shrink-0" style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.85 }}>
                              {dates}
                            </p>
                          )}
                        </div>
                      )}
                      {renderDescription(exp.description, body, descMarker, theme.heading)}
                    </div>
                  )
                })}
              </div>
            </section>
          ) : null,
          projects: filledProjects(projects).length > 0 ? (
            <section className="resume-section">
              <SectionTitle title="Projects" style={sectionHead} />
              <div className="flex flex-col" style={itemGapStyle(spacing)}>
                {filledProjects(projects).map((project) => {
                  const dates = formatProjectDateRange(project)
                  return (
                    <div key={project.id} className="resume-entry">
                      {(hasText(project.name) || dates) && (
                        <div className="flex justify-between items-start gap-3">
                          {hasText(project.name) && (
                            <p style={subheadingStyle(typography, theme.subheading)}>{project.name}</p>
                          )}
                          {dates && (
                            <p className="whitespace-nowrap shrink-0" style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.85 }}>
                              {dates}
                            </p>
                          )}
                        </div>
                      )}
                      {hasText(project.technologies) && (
                        <p className="italic mt-0.5" style={{ ...smallBodyStyle(typography, theme.subheading), opacity: 0.85 }}>
                          {project.technologies}
                        </p>
                      )}
                      {renderDescription(project.description, body, descMarker, theme.heading)}
                    </div>
                  )
                })}
              </div>
            </section>
          ) : null,
          education: filledEducation(education).length > 0 ? (
            <section className="resume-section">
              <SectionTitle title="Education" style={sectionHead} />
              <div className="flex flex-col" style={itemGapStyle(spacing)}>
                {filledEducation(education).map((edu) => {
                  const degree = degreeWithField(edu)
                  const grades = formatEducationGrades(edu)
                  const year = edu.endDate.trim() || edu.startDate.trim()
                  const details = joinParts([degree, edu.institution, grades], ', ')
                  return (
                    <div key={edu.id} className="resume-entry flex gap-3 items-start">
                      {year && (
                        <p className="shrink-0 w-12" style={{ ...subheadingStyle(typography, theme.subheading), opacity: 0.9 }}>
                          {year}
                        </p>
                      )}
                      {details && <p className="flex-1" style={body}>{details}</p>}
                    </div>
                  )
                })}
              </div>
            </section>
          ) : null,
          personalDetails: null,
          declaration: null,
        }}
      />
    </div>
  )
}
