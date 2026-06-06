import { themeLightBg } from '../../data/themeColors'
import { isSectionEnabled } from '../../data/sectionOrder'
import { getMainSections } from '../../data/templateLayout'
import { itemGapStyle, sectionGapStyle } from '../../data/spacing'
import { bodyStyle, headingStyle, nameStyle, smallBodyStyle, subheadingStyle } from '../../data/typography'
import { formatEducationGrades } from '../../utils/educationDisplay'
import { OrderedSectionList } from './OrderedSectionList'
import { declarationBlock, personalDetailsBlock } from './sectionBlocks'
import type { TemplateProps } from './types'

export function ClassicTemplate({ data, theme, typography, spacing }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects } = data
  const props = { data, theme, typography, spacing }
  const sectionHead = { ...headingStyle(typography, theme.heading), borderColor: themeLightBg(theme) }
  const mainOrder = data.sectionOrder

  return (
    <div className="resume-classic-layout resume-template-root flex leading-relaxed">
      <aside
        className="resume-classic-sidebar w-[35%] text-white resume-p flex flex-col"
        style={{ backgroundColor: theme.heading, ...sectionGapStyle(spacing) }}
      >
        <h1 style={nameStyle(typography)}>{personalInfo.fullName || 'Your Name'}</h1>
        <div className="flex flex-col opacity-90" style={itemGapStyle(spacing)}>
          {personalInfo.email && <p style={bodyStyle(typography)}>{personalInfo.email}</p>}
          {personalInfo.phone && <p style={bodyStyle(typography)}>{personalInfo.phone}</p>}
          {personalInfo.location && <p style={bodyStyle(typography)}>{personalInfo.location}</p>}
          {personalInfo.linkedin && <p style={bodyStyle(typography)}>{personalInfo.linkedin}</p>}
          {personalInfo.website && <p style={bodyStyle(typography)}>{personalInfo.website}</p>}
        </div>

        {isSectionEnabled(data, 'skills') && skills.length > 0 && (
          <div>
            <h3 className="uppercase tracking-wider mb-2 border-b border-white/30 pb-1" style={headingStyle(typography)}>Skills</h3>
            <ul className="flex flex-col" style={itemGapStyle(spacing)}>
              {skills.map((skill) => <li key={skill.id} style={bodyStyle(typography)}>• {skill.name}</li>)}
            </ul>
          </div>
        )}

        {isSectionEnabled(data, 'education') && education.length > 0 && (
          <div>
            <h3 className="uppercase tracking-wider mb-2 border-b border-white/30 pb-1" style={headingStyle(typography)}>Education</h3>
            <div className="flex flex-col" style={itemGapStyle(spacing)}>
              {education.map((edu) => {
                const grades = formatEducationGrades(edu)
                return (
                  <div key={edu.id}>
                    <p style={subheadingStyle(typography)}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                    <p style={{ ...bodyStyle(typography), opacity: 0.9 }}>{edu.institution}</p>
                    <p style={{ ...smallBodyStyle(typography), opacity: 0.75 }}>{edu.startDate} – {edu.endDate}</p>
                    {grades && <p style={{ ...smallBodyStyle(typography), opacity: 0.75 }}>{grades}</p>}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </aside>

      <main className="resume-classic-main flex-1 resume-p">
        <OrderedSectionList
          order={mainOrder}
          enabled={data.sectionEnabled}
          onlySections={getMainSections('classic')}
          className="flex flex-col"
          style={sectionGapStyle(spacing)}
          sections={{
            summary: personalInfo.summary ? (
              <section className="resume-section">
                <h3 className="uppercase tracking-wider mb-2 border-b pb-1" style={sectionHead}>Summary</h3>
                <p style={bodyStyle(typography, theme.body)}>{personalInfo.summary}</p>
              </section>
            ) : null,
            experience: experiences.length > 0 ? (
              <section className="resume-section">
                <h3 className="uppercase tracking-wider mb-2 border-b pb-1" style={sectionHead}>Experience</h3>
                <div className="flex flex-col" style={itemGapStyle(spacing)}>
                  {experiences.map((exp) => (
                    <div key={exp.id} className="resume-entry">
                      <div className="flex justify-between items-start">
                        <div>
                          <p style={subheadingStyle(typography, theme.subheading)}>{exp.position}</p>
                          <p style={{ ...subheadingStyle(typography, theme.subheading), opacity: 0.85 }}>{exp.company}</p>
                        </div>
                        <p className="whitespace-nowrap" style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>
                          {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                        </p>
                      </div>
                      {exp.description && <p className="mt-1" style={bodyStyle(typography, theme.body)}>{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            ) : null,
            projects: projects.length > 0 ? (
              <section className="resume-section">
                <h3 className="uppercase tracking-wider mb-2 border-b pb-1" style={sectionHead}>Projects</h3>
                <div className="flex flex-col" style={itemGapStyle(spacing)}>
                  {projects.map((project) => (
                    <div key={project.id} className="resume-entry">
                      <div className="flex justify-between items-start">
                        <div>
                          <p style={subheadingStyle(typography, theme.subheading)}>{project.name}</p>
                          {project.technologies && (
                            <p style={{ ...subheadingStyle(typography, theme.subheading), opacity: 0.85 }}>{project.technologies}</p>
                          )}
                        </div>
                        <p className="whitespace-nowrap" style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>
                          {project.startDate}{project.endDate ? ` – ${project.endDate}` : ''}
                        </p>
                      </div>
                      {project.description && <p className="mt-1" style={bodyStyle(typography, theme.body)}>{project.description}</p>}
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
  )
}
