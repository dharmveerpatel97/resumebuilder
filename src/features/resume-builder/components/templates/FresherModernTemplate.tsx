import { hexToRgba } from '../../data/themeColors'
import { itemGapStyle, sectionGapStyle } from '../../data/spacing'
import { bodyStyle, headingStyle, nameStyle, smallBodyStyle, subheadingStyle } from '../../data/typography'
import { formatEducationGrades } from '../../utils/educationDisplay'
import { PhotoPlaceholder } from './templateParts'
import type { TemplateProps } from './types'
import { getDescriptionMarker } from '../../utils/descriptionDisplay'
import { filledEducation, filledExperiences, filledProjects, filledSkills } from '../../utils/resumeEntryUtils'
import { ExperienceEntryFields, ProjectEntryFields } from './entryFields'

export function FresherModernTemplate({ data, templateId, theme, typography, spacing }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects } = data
  const sectionHead = headingStyle(typography, theme.heading)
  const descMarker = getDescriptionMarker(templateId, data.useBulletPoints)

  return (
    <div className="resume-template-root leading-relaxed">
      <div
        className="resume-px resume-py text-white flex items-center gap-4"
        style={{ backgroundColor: theme.heading }}
      >
        <PhotoPlaceholder size={72} theme={theme} typography={typography} className="border-white" />
        <div>
          <h1 style={{ ...nameStyle(typography, '#fff'), fontSize: Math.max(typography.heading.fontSize + 2, 18) }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p className="mt-0.5 opacity-90" style={subheadingStyle(typography, '#e2e8f0')}>
              {personalInfo.jobTitle}
            </p>
          )}
          <div className="flex flex-wrap gap-x-3 mt-1 opacity-85" style={smallBodyStyle(typography, '#f1f5f9')}>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </div>
      </div>

      <div className="resume-p flex flex-col" style={sectionGapStyle(spacing)}>
        {personalInfo.summary && (
          <section className="resume-section">
            <h3 className="uppercase tracking-wider font-bold mb-2" style={sectionHead}>About Me</h3>
            <p style={bodyStyle(typography, theme.body)}>{personalInfo.summary}</p>
          </section>
        )}

        <div className="grid grid-cols-2 gap-6">
          {filledEducation(education).length > 0 && (
            <section className="resume-section">
              <h3 className="uppercase tracking-wider font-bold mb-2" style={sectionHead}>Education</h3>
              <div className="flex flex-col" style={itemGapStyle(spacing)}>
                {filledEducation(education).map((edu) => {
                  const grades = formatEducationGrades(edu)
                  return (
                    <div key={edu.id} className="resume-entry p-2 rounded" style={{ backgroundColor: hexToRgba(theme.heading, 0.06) }}>
                      <p style={subheadingStyle(typography, theme.subheading)}>{edu.degree}</p>
                      <p style={smallBodyStyle(typography, theme.body)}>{edu.institution}</p>
                      <p style={smallBodyStyle(typography, theme.body)}>
                        {edu.endDate}{edu.division ? ` • ${edu.division}` : ''}{grades ? ` • ${grades}` : ''}
                      </p>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {filledSkills(skills).length > 0 && (
            <section className="resume-section">
              <h3 className="uppercase tracking-wider font-bold mb-2" style={sectionHead}>Skills</h3>
              <div className="flex flex-wrap gap-2">
                {filledSkills(skills).map((s) => (
                  <span
                    key={s.id}
                    className="px-2 py-0.5 rounded-full"
                    style={{ ...smallBodyStyle(typography, theme.heading), backgroundColor: hexToRgba(theme.heading, 0.12) }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {filledProjects(projects).length > 0 && (
          <section className="resume-section">
            <h3 className="uppercase tracking-wider font-bold mb-2" style={sectionHead}>Projects</h3>
            <div className="flex flex-col" style={itemGapStyle(spacing)}>
              {filledProjects(projects).map((p) => (
                <div key={p.id} className="resume-entry">
                  <ProjectEntryFields project={p} theme={theme} typography={typography} descriptionMarker={descMarker} />
                </div>
              ))}
            </div>
          </section>
        )}

        {filledExperiences(experiences).length > 0 && (
          <section className="resume-section">
            <h3 className="uppercase tracking-wider font-bold mb-2" style={sectionHead}>Internships & Training</h3>
            <div className="flex flex-col" style={itemGapStyle(spacing)}>
              {filledExperiences(experiences).map((exp) => (
                <div key={exp.id} className="resume-entry">
                  <ExperienceEntryFields exp={exp} theme={theme} typography={typography} descriptionMarker={descMarker} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
