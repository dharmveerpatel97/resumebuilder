import { Globe, Mail, Phone } from 'lucide-react'
import type { CSSProperties } from 'react'
import { hexToRgba } from '../../data/themeColors'
import { itemGapStyle, sectionGapStyle } from '../../data/spacing'
import { bodyStyle, headingStyle, nameStyle, smallBodyStyle, subheadingStyle } from '../../data/typography'
import { OrderedSectionList } from './OrderedSectionList'
import { declarationBlock, personalDetailsBlock } from './sectionBlocks'
import type { TemplateProps } from './types'

function SectionHeading({ title, style }: { title: string; style: CSSProperties }) {
  const color = typeof style.color === 'string' ? style.color : '#000'
  return (
    <div className="mb-2">
      <h3 className="uppercase tracking-wider" style={style}>{title}</h3>
      <div className="mt-1 h-px" style={{ backgroundColor: hexToRgba(color, 0.25) }} />
    </div>
  )
}

export function WebDesignerTemplate({ data, theme, typography, spacing }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects } = data
  const props = { data, theme, typography, spacing }

  const skillColumns = (() => {
    const cols: typeof skills[] = [[], [], [], []]
    skills.forEach((skill, i) => cols[i % 4].push(skill))
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
          education: education.length > 0 ? (
            <section className="resume-section">
              <SectionHeading title="Education" style={sectionHeading} />
              <div className="flex flex-col" style={itemGapStyle(spacing)}>
                {education.map((edu) => (
                  <div key={edu.id} className="resume-entry grid grid-cols-[28%_1fr] gap-3">
                    <div>
                      <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>{edu.startDate} – {edu.endDate}</p>
                      <p className="mt-0.5" style={subheadingStyle(typography, theme.subheading)}>{edu.institution}</p>
                    </div>
                    <div>
                      <p style={subheadingStyle(typography, theme.subheading)}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                      {edu.description && <p className="mt-1" style={bodyStyle(typography, theme.body)}>{edu.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null,
          experience: experiences.length > 0 ? (
            <section className="resume-section">
              <SectionHeading title="Experience" style={sectionHeading} />
              <div className="flex flex-col" style={itemGapStyle(spacing)}>
                {experiences.map((exp) => (
                  <div key={exp.id} className="resume-entry grid grid-cols-[28%_1fr] gap-3">
                    <div>
                      <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</p>
                      <p className="mt-0.5" style={subheadingStyle(typography, theme.subheading)}>{exp.company}</p>
                    </div>
                    <div>
                      <p style={subheadingStyle(typography, theme.subheading)}>{exp.position}</p>
                      {exp.description && <p className="mt-1" style={bodyStyle(typography, theme.body)}>{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null,
          projects: projects.length > 0 ? (
            <section className="resume-section">
              <SectionHeading title="Projects" style={sectionHeading} />
              <div className="flex flex-col" style={itemGapStyle(spacing)}>
                {projects.map((project) => (
                  <div key={project.id} className="resume-entry grid grid-cols-[28%_1fr] gap-3">
                    <div>
                      <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>
                        {project.startDate}{project.endDate ? ` – ${project.endDate}` : ''}
                      </p>
                      {project.url && <p className="mt-0.5 break-all" style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>{project.url}</p>}
                    </div>
                    <div>
                      <p style={subheadingStyle(typography, theme.subheading)}>{project.name}</p>
                      {project.technologies && <p className="italic mt-0.5" style={{ ...smallBodyStyle(typography, theme.subheading), opacity: 0.85 }}>{project.technologies}</p>}
                      {project.description && <p className="mt-1" style={bodyStyle(typography, theme.body)}>{project.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null,
          skills: skills.length > 0 ? (
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
