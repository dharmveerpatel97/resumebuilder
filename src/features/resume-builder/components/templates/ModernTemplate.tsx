import { themeLightBg } from '../../data/themeColors'
import { itemGapStyle, sectionGapStyle } from '../../data/spacing'
import { bodyStyle, headingStyle, nameStyle, smallBodyStyle, subheadingStyle } from '../../data/typography'
import { formatEducationGrades } from '../../utils/educationDisplay'
import { OrderedSectionList } from './OrderedSectionList'
import { declarationBlock, personalDetailsBlock } from './sectionBlocks'
import type { TemplateProps } from './types'

export function ModernTemplate({ data, theme, typography, spacing }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects } = data
  const props = { data, theme, typography, spacing }
  const sectionHead = headingStyle(typography, theme.heading)

  return (
    <div className="resume-template-root leading-relaxed">
      <header className="text-white resume-px resume-py" style={{ backgroundColor: theme.heading }}>
        <h1 style={nameStyle(typography)}>{personalInfo.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 opacity-90" style={bodyStyle(typography)}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap gap-x-4 opacity-80 mt-1" style={bodyStyle(typography)}>
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </header>

      <div className="resume-px resume-pb resume-pt flex flex-col" style={{ ...sectionGapStyle(spacing), paddingTop: '6mm' }}>
        <OrderedSectionList
          order={data.sectionOrder}
          enabled={data.sectionEnabled}
          className="flex flex-col"
          style={sectionGapStyle(spacing)}
          sections={{
            summary: personalInfo.summary ? (
              <section className="resume-section">
                <h3 className="mb-1" style={sectionHead}>About Me</h3>
                <p style={bodyStyle(typography, theme.body)}>{personalInfo.summary}</p>
              </section>
            ) : null,
            experience: experiences.length > 0 ? (
              <section className="resume-section">
                <h3 className="mb-2" style={sectionHead}>Experience</h3>
                <div className="flex flex-col" style={itemGapStyle(spacing)}>
                  {experiences.map((exp) => (
                    <div key={exp.id} className="resume-entry pl-3 border-l-2" style={{ borderColor: themeLightBg(theme) }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p style={subheadingStyle(typography, theme.subheading)}>{exp.position}</p>
                          <p style={{ ...subheadingStyle(typography, theme.subheading), opacity: 0.85 }}>{exp.company}</p>
                        </div>
                        <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>
                          {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                        </p>
                      </div>
                      {exp.description && <p className="mt-1" style={bodyStyle(typography, theme.body)}>{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            ) : null,
            education: education.length > 0 ? (
              <section className="resume-section">
                <h3 className="mb-2" style={sectionHead}>Education</h3>
                <div className="flex flex-col" style={itemGapStyle(spacing)}>
                  {education.map((edu) => {
                    const grades = formatEducationGrades(edu)
                    return (
                      <div key={edu.id} className="resume-entry">
                        <p style={subheadingStyle(typography, theme.subheading)}>
                          {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                        </p>
                        <p style={bodyStyle(typography, theme.body)}>
                          {edu.institution} · {edu.startDate} – {edu.endDate}
                        </p>
                        {grades && <p style={smallBodyStyle(typography, theme.body)}>{grades}</p>}
                      </div>
                    )
                  })}
                </div>
              </section>
            ) : null,
            projects: projects.length > 0 ? (
              <section className="resume-section">
                <h3 className="mb-2" style={sectionHead}>Projects</h3>
                <div className="flex flex-col" style={itemGapStyle(spacing)}>
                  {projects.map((project) => (
                    <div key={project.id} className="resume-entry pl-3 border-l-2" style={{ borderColor: themeLightBg(theme) }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p style={subheadingStyle(typography, theme.subheading)}>{project.name}</p>
                          {project.technologies && (
                            <p style={{ ...subheadingStyle(typography, theme.subheading), opacity: 0.85 }}>{project.technologies}</p>
                          )}
                        </div>
                        <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>
                          {project.startDate}{project.endDate ? ` – ${project.endDate}` : ''}
                        </p>
                      </div>
                      {project.description && <p className="mt-1" style={bodyStyle(typography, theme.body)}>{project.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            ) : null,
            skills: skills.length > 0 ? (
              <section className="resume-section">
                <h3 className="mb-2" style={sectionHead}>Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="rounded-full px-2.5 py-0.5"
                      style={{ ...bodyStyle(typography), backgroundColor: themeLightBg(theme), color: theme.heading }}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            ) : null,
            personalDetails: personalDetailsBlock(props),
            declaration: declarationBlock(props),
          }}
        />
      </div>
    </div>
  )
}
