import { Globe, Mail, Phone } from 'lucide-react'
import type { CSSProperties } from 'react'
import { hexToRgba } from '../../data/themeColors'
import { itemGapStyle, sectionGapStyle } from '../../data/spacing'
import { bodyStyle, headingStyle, nameStyle, smallBodyStyle, subheadingStyle } from '../../data/typography'
import { getDescriptionMarker, renderDescription } from '../../utils/descriptionDisplay'
import { OrderedSectionList } from './OrderedSectionList'
import { declarationBlock, personalDetailsBlock } from './sectionBlocks'
import type { TemplateProps } from './types'
import {
  degreeWithField,
  filledEducation,
  filledExperiences,
  filledProjects,
  filledSkills,
  formatDateRange,
  formatProjectDateRange,
  hasText,
} from '../../utils/resumeEntryUtils'

function SectionHeading({ title, style }: { title: string; style: CSSProperties }) {
  const color = typeof style.color === 'string' ? style.color : '#000'
  return (
    <div className="mb-2">
      <h3 className="uppercase tracking-wider" style={style}>{title}</h3>
      <div className="mt-1 h-px" style={{ backgroundColor: hexToRgba(color, 0.25) }} />
    </div>
  )
}

export function WebDesignerTemplate({ data, templateId, theme, typography, spacing }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects } = data
  const props = { data, templateId, theme, typography, spacing }
  const descMarker = getDescriptionMarker(templateId, data.useBulletPoints)

  const skillColumns = (() => {
    const cols: typeof skills[] = [[], [], [], []]
    filledSkills(skills).forEach((skill, i) => cols[i % 4].push(skill))
    return cols
  })()

  const sectionHeading = headingStyle(typography, theme.heading)

  return (
    <div className="resume-template-root leading-relaxed resume-p flex flex-col" style={sectionGapStyle(spacing)}>
      <header className="flex gap-4">
        <div
          className="w-20 h-20 shrink-0 rounded-sm flex items-center justify-center text-white"
          style={{ ...smallBodyStyle(typography), backgroundColor: theme.heading }}
        >
          Photo
        </div>
        <div className="flex-1">
          <h1 className="uppercase tracking-wide leading-tight" style={nameStyle(typography, theme.heading)}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p className="mt-0.5" style={subheadingStyle(typography, theme.subheading)}>
              {personalInfo.jobTitle}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2" style={smallBodyStyle(typography, theme.body)}>
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.website && (
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {personalInfo.website}
              </span>
            )}
          </div>
        </div>
      </header>

      <OrderedSectionList
        order={data.sectionOrder}
        enabled={data.sectionEnabled}
        className="flex flex-col"
        style={sectionGapStyle(spacing)}
        sections={{
          summary: personalInfo.summary ? (
            <section className="resume-section">
              <SectionHeading title="About Me" style={sectionHeading} />
              <p className="leading-relaxed" style={bodyStyle(typography, theme.body)}>{personalInfo.summary}</p>
            </section>
          ) : null,
          education: filledEducation(education).length > 0 ? (
            <section className="resume-section">
              <SectionHeading title="Education" style={sectionHeading} />
              <div className="flex flex-col" style={itemGapStyle(spacing)}>
                {filledEducation(education).map((edu) => {
                  const dates = formatDateRange(edu.startDate, edu.endDate)
                  const degree = degreeWithField(edu)
                  return (
                    <div key={edu.id} className="resume-entry grid grid-cols-[28%_1fr] gap-3">
                      <div>
                        {dates && <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>{dates}</p>}
                        {hasText(edu.institution) && (
                          <p className="mt-0.5" style={subheadingStyle(typography, theme.subheading)}>{edu.institution}</p>
                        )}
                      </div>
                      <div>
                        {degree && <p style={subheadingStyle(typography, theme.subheading)}>{degree}</p>}
                        {hasText(edu.description) && <p className="mt-1" style={bodyStyle(typography, theme.body)}>{edu.description}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ) : null,
          experience: filledExperiences(experiences).length > 0 ? (
            <section className="resume-section">
              <SectionHeading title="Experience" style={sectionHeading} />
              <div className="flex flex-col" style={itemGapStyle(spacing)}>
                {filledExperiences(experiences).map((exp) => {
                  const dates = formatDateRange(exp.startDate, exp.endDate, exp.current)
                  return (
                    <div key={exp.id} className="resume-entry grid grid-cols-[28%_1fr] gap-3">
                      <div>
                        {dates && <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>{dates}</p>}
                        {hasText(exp.company) && (
                          <p className="mt-0.5" style={subheadingStyle(typography, theme.subheading)}>{exp.company}</p>
                        )}
                      </div>
                      <div>
                        {hasText(exp.position) && <p style={subheadingStyle(typography, theme.subheading)}>{exp.position}</p>}
                        {renderDescription(exp.description, bodyStyle(typography, theme.body), descMarker, theme.heading)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ) : null,
          projects: filledProjects(projects).length > 0 ? (
            <section className="resume-section">
              <SectionHeading title="Projects" style={sectionHeading} />
              <div className="flex flex-col" style={itemGapStyle(spacing)}>
                {filledProjects(projects).map((project) => {
                  const dates = formatProjectDateRange(project)
                  return (
                    <div key={project.id} className="resume-entry grid grid-cols-[28%_1fr] gap-3">
                      <div>
                        {dates && <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>{dates}</p>}
                        {hasText(project.url) && (
                          <p className="mt-0.5 break-all" style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>{project.url}</p>
                        )}
                      </div>
                      <div>
                        {hasText(project.name) && <p style={subheadingStyle(typography, theme.subheading)}>{project.name}</p>}
                        {hasText(project.technologies) && (
                          <p className="italic mt-0.5" style={{ ...smallBodyStyle(typography, theme.subheading), opacity: 0.85 }}>{project.technologies}</p>
                        )}
                        {renderDescription(project.description, bodyStyle(typography, theme.body), descMarker, theme.heading)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ) : null,
          skills: filledSkills(skills).length > 0 ? (
            <section className="resume-section">
              <SectionHeading title="Skills" style={sectionHeading} />
              <div className="grid grid-cols-4 gap-3">
                {skillColumns.map((col, colIndex) => (
                  <ul key={colIndex} className="flex flex-col" style={itemGapStyle(spacing)}>
                    {col.map((skill) => (
                      <li key={skill.id} className="flex items-start gap-1" style={bodyStyle(typography, theme.body)}>
                        <span style={{ color: theme.heading }}>•</span>
                        {skill.name}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </section>
          ) : null,
          personalDetails: personalDetailsBlock(props),
          declaration: declarationBlock(props),
        }}
      />
    </div>
  )
}
