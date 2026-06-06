import { itemGapStyle, sectionGapStyle } from '../../data/spacing'
import { bodyStyle, headingStyle, nameStyle, smallBodyStyle, subheadingStyle } from '../../data/typography'
import { formatEducationGrades } from '../../utils/educationDisplay'
import { OrderedSectionList } from './OrderedSectionList'
import type { TemplateProps } from './types'

export function ProfessionalTemplate({ data, theme, typography, spacing }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects } = data
  const sectionHead = headingStyle(typography, theme.heading)

  return (
    <div className="resume-template-root leading-relaxed resume-p flex flex-col" style={sectionGapStyle(spacing)}>
      <header className="pb-4 border-b-2" style={{ borderColor: theme.heading }}>
        <h1 className="tracking-tight" style={nameStyle(typography, theme.heading)}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2" style={subheadingStyle(typography, theme.subheading)}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        {(personalInfo.linkedin || personalInfo.website) && (
          <div className="flex flex-wrap gap-x-3 mt-1" style={{ ...bodyStyle(typography, theme.body), opacity: 0.85 }}>
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
            {personalInfo.website && <span>{personalInfo.website}</span>}
          </div>
        )}
      </header>

      <OrderedSectionList
        order={data.sectionOrder}
        enabled={data.sectionEnabled}
        className="flex flex-col"
        style={sectionGapStyle(spacing)}
        sections={{
          summary: personalInfo.summary ? (
            <section className="resume-section">
              <h3 className="uppercase tracking-widest mb-2" style={sectionHead}>Professional Summary</h3>
              <p style={bodyStyle(typography, theme.body)}>{personalInfo.summary}</p>
            </section>
          ) : null,
          experience: experiences.length > 0 ? (
            <section className="resume-section">
              <h3 className="uppercase tracking-widest mb-2" style={sectionHead}>Work Experience</h3>
              <div className="flex flex-col" style={itemGapStyle(spacing)}>
                {experiences.map((exp) => (
                  <div key={exp.id} className="resume-entry">
                    <div className="flex justify-between items-baseline">
                      <p style={subheadingStyle(typography, theme.subheading)}>{exp.position}</p>
                      <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </p>
                    </div>
                    <p className="italic" style={{ ...subheadingStyle(typography, theme.subheading), opacity: 0.85 }}>{exp.company}</p>
                    {exp.description && <p className="mt-1" style={bodyStyle(typography, theme.body)}>{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          ) : null,
          education: education.length > 0 ? (
            <section className="resume-section">
              <h3 className="uppercase tracking-widest mb-2" style={sectionHead}>Education</h3>
              <div className="flex flex-col" style={itemGapStyle(spacing)}>
                {education.map((edu) => {
                  const grades = formatEducationGrades(edu)
                  return (
                    <div key={edu.id} className="resume-entry">
                      <div className="flex justify-between items-baseline">
                        <p style={subheadingStyle(typography, theme.subheading)}>{edu.degree} in {edu.field}</p>
                        <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>{edu.startDate} – {edu.endDate}</p>
                      </div>
                      <p style={bodyStyle(typography, theme.body)}>{edu.institution}{grades ? ` · ${grades}` : ''}</p>
                      {edu.description && <p className="mt-0.5" style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.85 }}>{edu.description}</p>}
                    </div>
                  )
                })}
              </div>
            </section>
          ) : null,
          projects: projects.length > 0 ? (
            <section className="resume-section">
              <h3 className="uppercase tracking-widest mb-2" style={sectionHead}>Projects</h3>
              <div className="flex flex-col" style={itemGapStyle(spacing)}>
                {projects.map((project) => (
                  <div key={project.id} className="resume-entry">
                    <div className="flex justify-between items-baseline">
                      <p style={subheadingStyle(typography, theme.subheading)}>{project.name}</p>
                      <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>
                        {project.startDate}{project.endDate ? ` – ${project.endDate}` : ''}
                      </p>
                    </div>
                    {project.technologies && <p className="italic" style={{ ...subheadingStyle(typography, theme.subheading), opacity: 0.85 }}>{project.technologies}</p>}
                    {project.description && <p className="mt-1" style={bodyStyle(typography, theme.body)}>{project.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          ) : null,
          skills: skills.length > 0 ? (
            <section className="resume-section">
              <h3 className="uppercase tracking-widest mb-2" style={sectionHead}>Technical Skills</h3>
              <p style={bodyStyle(typography, theme.body)}>{skills.map((s) => s.name).join(' · ')}</p>
            </section>
          ) : null,
        }}
      />
    </div>
  )
}
