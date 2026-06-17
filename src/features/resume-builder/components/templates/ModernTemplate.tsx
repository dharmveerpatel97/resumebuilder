import { themeLightBg } from '../../data/themeColors'
import { itemGapStyle, sectionGapStyle } from '../../data/spacing'
import { bodyStyle, headingStyle, nameStyle, smallBodyStyle, subheadingStyle } from '../../data/typography'
import {
  filledEducation,
  filledExperiences,
  filledProjects,
  filledSkills,
  formatDateRange,
  formatProjectDateRange,
  hasText,
} from '../../utils/resumeEntryUtils'
import { getDescriptionMarker, renderDescription } from '../../utils/descriptionDisplay'
import { EducationEntryFields } from './entryFields'
import { OrderedSectionList } from './OrderedSectionList'
import { declarationBlock, personalDetailsBlock } from './sectionBlocks'
import type { TemplateProps } from './types'

export function ModernTemplate({ data, templateId, theme, typography, spacing }: TemplateProps) {
  const { personalInfo } = data
  const props = { data, templateId, theme, typography, spacing }
  const descMarker = getDescriptionMarker(templateId, data.useBulletPoints)
  const experiences = filledExperiences(data.experiences)
  const education = filledEducation(data.education)
  const projects = filledProjects(data.projects)
  const skills = filledSkills(data.skills)
  const sectionHead = headingStyle(typography, theme.heading)

  return (
    <div className="resume-template-root leading-relaxed">
      <header className="text-white resume-px resume-py" style={{ backgroundColor: theme.heading }}>
        <h1 style={nameStyle(typography)}>{personalInfo.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 opacity-90" style={bodyStyle(typography)}>
          {hasText(personalInfo.email) && <span>{personalInfo.email}</span>}
          {hasText(personalInfo.phone) && <span>{personalInfo.phone}</span>}
          {hasText(personalInfo.location) && <span>{personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap gap-x-4 opacity-80 mt-1" style={bodyStyle(typography)}>
          {hasText(personalInfo.linkedin) && <span>{personalInfo.linkedin}</span>}
          {hasText(personalInfo.website) && <span>{personalInfo.website}</span>}
        </div>
      </header>

      <div className="resume-px resume-pb resume-pt flex flex-col" style={{ ...sectionGapStyle(spacing), paddingTop: '6mm' }}>
        <OrderedSectionList
          order={data.sectionOrder}
          enabled={data.sectionEnabled}
          className="flex flex-col"
          style={sectionGapStyle(spacing)}
          sections={{
            summary: hasText(personalInfo.summary) ? (
              <section className="resume-section">
                <h3 className="mb-1" style={sectionHead}>About Me</h3>
                <p style={bodyStyle(typography, theme.body)}>{personalInfo.summary}</p>
              </section>
            ) : null,
            experience: experiences.length > 0 ? (
              <section className="resume-section">
                <h3 className="mb-2" style={sectionHead}>Experience</h3>
                <div className="flex flex-col" style={itemGapStyle(spacing)}>
                  {experiences.map((exp) => {
                    const dates = formatDateRange(exp.startDate, exp.endDate, exp.current)
                    return (
                      <div key={exp.id} className="resume-entry pl-3 border-l-2" style={{ borderColor: themeLightBg(theme) }}>
                        {(hasText(exp.position) || hasText(exp.company) || dates) && (
                          <div className="flex justify-between items-start">
                            <div>
                              {hasText(exp.position) && <p style={subheadingStyle(typography, theme.subheading)}>{exp.position}</p>}
                              {hasText(exp.company) && (
                                <p style={{ ...subheadingStyle(typography, theme.subheading), opacity: 0.85 }}>{exp.company}</p>
                              )}
                            </div>
                            {dates && <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>{dates}</p>}
                          </div>
                        )}
                        {renderDescription(exp.description, bodyStyle(typography, theme.body), descMarker, theme.heading)}
                      </div>
                    )
                  })}
                </div>
              </section>
            ) : null,
            education: education.length > 0 ? (
              <section className="resume-section">
                <h3 className="mb-2" style={sectionHead}>Education</h3>
                <div className="flex flex-col" style={itemGapStyle(spacing)}>
                  {education.map((edu) => (
                    <div key={edu.id} className="resume-entry">
                      <EducationEntryFields edu={edu} theme={theme} typography={typography} layout="inline" />
                    </div>
                  ))}
                </div>
              </section>
            ) : null,
            projects: projects.length > 0 ? (
              <section className="resume-section">
                <h3 className="mb-2" style={sectionHead}>Projects</h3>
                <div className="flex flex-col" style={itemGapStyle(spacing)}>
                  {projects.map((project) => {
                    const dates = formatProjectDateRange(project)
                    return (
                      <div key={project.id} className="resume-entry pl-3 border-l-2" style={{ borderColor: themeLightBg(theme) }}>
                        {(hasText(project.name) || hasText(project.technologies) || dates) && (
                          <div className="flex justify-between items-start">
                            <div>
                              {hasText(project.name) && <p style={subheadingStyle(typography, theme.subheading)}>{project.name}</p>}
                              {hasText(project.technologies) && (
                                <p style={{ ...subheadingStyle(typography, theme.subheading), opacity: 0.85 }}>{project.technologies}</p>
                              )}
                            </div>
                            {dates && <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>{dates}</p>}
                          </div>
                        )}
                        {renderDescription(project.description, bodyStyle(typography, theme.body), descMarker, theme.heading)}
                      </div>
                    )
                  })}
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
