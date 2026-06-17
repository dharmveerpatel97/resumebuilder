import { themeLightBg } from '../../data/themeColors'
import { isSectionEnabled } from '../../data/sectionOrder'
import { getMainSections } from '../../data/templateLayout'
import { itemGapStyle, sectionGapStyle } from '../../data/spacing'
import { bodyStyle, headingStyle, nameStyle } from '../../data/typography'
import { getDescriptionMarker } from '../../utils/descriptionDisplay'
import {
  filledEducation,
  filledExperiences,
  filledProjects,
  filledSkills,
  hasText,
} from '../../utils/resumeEntryUtils'
import { EducationEntryFields, ExperienceEntryFields, ProjectEntryFields } from './entryFields'
import { OrderedSectionList } from './OrderedSectionList'
import { declarationBlock, personalDetailsBlock } from './sectionBlocks'
import type { TemplateProps } from './types'

export function ClassicTemplate({ data, templateId, theme, typography, spacing }: TemplateProps) {
  const { personalInfo } = data
  const props = { data, templateId, theme, typography, spacing }
  const descMarker = getDescriptionMarker(templateId, data.useBulletPoints)
  const experiences = filledExperiences(data.experiences)
  const education = filledEducation(data.education)
  const skills = filledSkills(data.skills)
  const projects = filledProjects(data.projects)
  const sectionHead = { ...headingStyle(typography, theme.heading), borderColor: themeLightBg(theme) }

  return (
    <div className="resume-classic-layout resume-template-root resume-col-layout leading-relaxed" style={{ ['--resume-sidebar-width' as string]: '35%' }}>
      <aside
        className="resume-classic-sidebar resume-col-sidebar text-white resume-p flex flex-col"
        style={{ backgroundColor: theme.heading, ...sectionGapStyle(spacing) }}
      >
        <h1 style={nameStyle(typography)}>{personalInfo.fullName || 'Your Name'}</h1>
        <div className="flex flex-col opacity-90" style={itemGapStyle(spacing)}>
          {hasText(personalInfo.email) && <p style={bodyStyle(typography)}>{personalInfo.email}</p>}
          {hasText(personalInfo.phone) && <p style={bodyStyle(typography)}>{personalInfo.phone}</p>}
          {hasText(personalInfo.location) && <p style={bodyStyle(typography)}>{personalInfo.location}</p>}
          {hasText(personalInfo.linkedin) && <p style={bodyStyle(typography)}>{personalInfo.linkedin}</p>}
          {hasText(personalInfo.website) && <p style={bodyStyle(typography)}>{personalInfo.website}</p>}
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
              {education.map((edu) => (
                <div key={edu.id}>
                  <EducationEntryFields edu={edu} theme={theme} typography={typography} layout="sidebar" />
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      <main className="resume-classic-main resume-col-main resume-p">
        <OrderedSectionList
          order={data.sectionOrder}
          enabled={data.sectionEnabled}
          onlySections={getMainSections('classic')}
          className="flex flex-col"
          style={sectionGapStyle(spacing)}
          sections={{
            summary: hasText(personalInfo.summary) ? (
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
                      <ExperienceEntryFields exp={exp} theme={theme} typography={typography} descriptionMarker={descMarker} />
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
                      <ProjectEntryFields project={project} theme={theme} typography={typography} descriptionMarker={descMarker} />
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
