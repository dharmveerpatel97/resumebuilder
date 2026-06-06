import { itemGapStyle, sectionGapStyle } from '../../data/spacing'
import { bodyStyle, headingStyle, nameStyle, smallBodyStyle, subheadingStyle } from '../../data/typography'
import { formatEducationGrades } from '../../utils/educationDisplay'
import type { TemplateProps } from './types'

function SectionBlock({
  title,
  headingStyle,
  children,
}: {
  title: string
  headingStyle: React.CSSProperties
  children: React.ReactNode
}) {
  return (
    <section className="resume-section">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-current shrink-0" style={{ color: 'inherit' }} />
        <h3 className="uppercase tracking-wider font-bold" style={headingStyle}>{title}</h3>
      </div>
      {children}
    </section>
  )
}

export function FresherInternTemplate({ data, theme, typography, spacing }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, fresherDetails } = data
  const sectionHead = headingStyle(typography, theme.heading)
  const body = bodyStyle(typography, theme.body)

  return (
    <div className="resume-template-root leading-relaxed resume-p flex flex-col" style={sectionGapStyle(spacing)}>
      <header className="border-l-4 pl-4" style={{ borderColor: theme.heading }}>
        <h1 style={nameStyle(typography, theme.heading)}>{personalInfo.fullName || 'Your Name'}</h1>
        {personalInfo.jobTitle && (
          <p className="mt-0.5" style={subheadingStyle(typography, theme.subheading)}>{personalInfo.jobTitle}</p>
        )}
        <p className="mt-1" style={smallBodyStyle(typography, theme.body)}>
          {[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(' | ')}
        </p>
      </header>

      {personalInfo.summary && (
        <SectionBlock title="Career Objective" headingStyle={sectionHead}>
          <p style={body}>{personalInfo.summary}</p>
        </SectionBlock>
      )}

      {education.length > 0 && (
        <SectionBlock title="Education" headingStyle={sectionHead}>
          <div className="flex flex-col" style={itemGapStyle(spacing)}>
            {education.map((edu) => {
              const grades = formatEducationGrades(edu)
              return (
                <div key={edu.id} className="resume-entry flex justify-between gap-3 border-b border-gray-200 pb-2">
                  <div>
                    <p style={subheadingStyle(typography, theme.subheading)}>
                      {edu.degree}{edu.field ? ` (${edu.field})` : ''}
                    </p>
                    <p style={body}>{edu.institution}</p>
                    {(edu.division || grades) && (
                      <p style={smallBodyStyle(typography, theme.body)}>
                        {[edu.division, grades].filter(Boolean).join(' • ')}
                      </p>
                    )}
                  </div>
                  <p className="shrink-0" style={smallBodyStyle(typography, theme.body)}>{edu.endDate}</p>
                </div>
              )
            })}
          </div>
        </SectionBlock>
      )}

      {experiences.length > 0 && (
        <SectionBlock title="Internships & Industrial Training" headingStyle={sectionHead}>
          <div className="flex flex-col" style={itemGapStyle(spacing)}>
            {experiences.map((exp) => (
              <div key={exp.id} className="resume-entry">
                <div className="flex justify-between gap-2">
                  <p style={subheadingStyle(typography, theme.subheading)}>{exp.position}</p>
                  <p style={smallBodyStyle(typography, theme.body)}>
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </p>
                </div>
                <p style={body}>{exp.company}</p>
                {exp.description && <p className="mt-0.5" style={body}>{exp.description}</p>}
              </div>
            ))}
          </div>
        </SectionBlock>
      )}

      {skills.length > 0 && (
        <SectionBlock title="Technical Skills & Certifications" headingStyle={sectionHead}>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {skills.map((s) => (
              <p key={s.id} style={body}>▸ {s.name}</p>
            ))}
          </div>
        </SectionBlock>
      )}

      {projects.length > 0 && (
        <SectionBlock title="Projects" headingStyle={sectionHead}>
          <div className="flex flex-col" style={itemGapStyle(spacing)}>
            {projects.map((p) => (
              <div key={p.id} className="resume-entry">
                <p style={subheadingStyle(typography, theme.subheading)}>{p.name}</p>
                {p.description && <p style={body}>{p.description}</p>}
              </div>
            ))}
          </div>
        </SectionBlock>
      )}

      {(fresherDetails.fatherName || fresherDetails.dateOfBirth) && (
        <SectionBlock title="Personal Information" headingStyle={sectionHead}>
          <div className="grid grid-cols-2 gap-2" style={body}>
            {fresherDetails.fatherName && <p><span className="font-semibold">Father:</span> {fresherDetails.fatherName}</p>}
            {fresherDetails.motherName && <p><span className="font-semibold">Mother:</span> {fresherDetails.motherName}</p>}
            {fresherDetails.gender && <p><span className="font-semibold">Gender:</span> {fresherDetails.gender}</p>}
            {fresherDetails.dateOfBirth && <p><span className="font-semibold">DOB:</span> {fresherDetails.dateOfBirth}</p>}
            {fresherDetails.nationality && <p><span className="font-semibold">Nationality:</span> {fresherDetails.nationality}</p>}
            {fresherDetails.languageKnowledge && <p><span className="font-semibold">Languages:</span> {fresherDetails.languageKnowledge}</p>}
          </div>
        </SectionBlock>
      )}
    </div>
  )
}
