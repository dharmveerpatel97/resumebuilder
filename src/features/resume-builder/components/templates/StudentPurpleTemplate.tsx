import { hexToRgba } from '../../data/themeColors'
import { itemGapStyle, sectionGapStyle } from '../../data/spacing'
import { bodyStyle, headingStyle, nameStyle, smallBodyStyle, subheadingStyle } from '../../data/typography'
import { isSectionEnabled } from '../../data/sectionOrder'
import { getMainSections } from '../../data/templateLayout'
import { formatEducationGrades } from '../../utils/educationDisplay'
import { getDescriptionMarker, renderDescription } from '../../utils/descriptionDisplay'
import { degreeWithField, filledEducation, filledExperiences, filledProjects, filledSkills, formatDateRange, formatProjectDateRange, hasText } from '../../utils/resumeEntryUtils'
import { OrderedSectionList } from './OrderedSectionList'
import { declarationBlock, personalDetailsBlock } from './sectionBlocks'
import { PhotoPlaceholder, SectionLine } from './templateParts'
import { SplittableTimelineSection } from './timelineParts'
import type { TemplateProps } from './types'

export function StudentPurpleTemplate({ data, templateId, theme, typography, spacing }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects } = data
  const props = { data, templateId, theme, typography, spacing }
  const descMarker = getDescriptionMarker(templateId, data.useBulletPoints)
  const body = bodyStyle(typography, theme.body)
  const sectionHead = headingStyle(typography, theme.heading)
  const allSkills = filledSkills(skills)
  const softSkills = allSkills.slice(0, Math.ceil(allSkills.length / 2))
  const techSkills = allSkills.slice(Math.ceil(allSkills.length / 2))
  const eduEntries = filledEducation(education)
  const projectEntries = filledProjects(projects)
  const expEntries = filledExperiences(experiences)

  return (
    <div className="resume-template-root leading-relaxed" style={{ ['--resume-sidebar-width' as string]: '28%' }}>
      <div className="flex">
        <div className="w-[28%] shrink-0 resume-pt resume-px flex justify-center">
          <PhotoPlaceholder theme={theme} typography={typography} />
        </div>
        <div
          className="flex-1 resume-py resume-px text-white uppercase"
          style={{ backgroundColor: theme.heading }}
        >
          <h1 style={{ ...nameStyle(typography, '#fff'), fontSize: Math.max(typography.heading.fontSize + 4, 20) }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p className="mt-1 tracking-wider opacity-90" style={subheadingStyle(typography, '#e9d5ff')}>
              {personalInfo.jobTitle}
            </p>
          )}
        </div>
      </div>

      <div className="resume-col-layout">
        <aside
          className="resume-col-sidebar resume-p flex flex-col"
          style={{ backgroundColor: hexToRgba(theme.heading, 0.08), ...sectionGapStyle(spacing) }}
        >
          <div className="resume-section">
            <SectionLine title="Contact" headingStyle={sectionHead} theme={theme} />
            <div className="flex flex-col" style={itemGapStyle(spacing)}>
              {hasText(personalInfo.phone) && <p style={bodyStyle(typography, theme.body)}>{personalInfo.phone}</p>}
              {hasText(personalInfo.email) && <p style={bodyStyle(typography, theme.body)}>{personalInfo.email}</p>}
              {hasText(personalInfo.location) && <p style={bodyStyle(typography, theme.body)}>{personalInfo.location}</p>}
              {hasText(personalInfo.website) && <p style={bodyStyle(typography, theme.body)}>{personalInfo.website}</p>}
            </div>
          </div>

          {isSectionEnabled(data, 'skills') && softSkills.length > 0 && (
            <div className="resume-section">
              <SectionLine title="Soft Skills" headingStyle={sectionHead} theme={theme} />
              <ul className="flex flex-col" style={itemGapStyle(spacing)}>
                {softSkills.map((s) => (
                  <li key={s.id} style={bodyStyle(typography, theme.body)}>• {s.name}</li>
                ))}
              </ul>
            </div>
          )}

          {isSectionEnabled(data, 'skills') && techSkills.length > 0 && (
            <div className="resume-section">
              <SectionLine title="Tech Skills" headingStyle={sectionHead} theme={theme} />
              <ul className="flex flex-col" style={itemGapStyle(spacing)}>
                {techSkills.map((s) => (
                  <li key={s.id} style={bodyStyle(typography, theme.body)}>• {s.name}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        <main className="resume-col-main resume-p flex flex-col" style={sectionGapStyle(spacing)}>
          <OrderedSectionList
            order={data.sectionOrder}
            enabled={data.sectionEnabled}
            onlySections={getMainSections('studentPurple')}
            sections={{
              summary: hasText(personalInfo.summary) ? (
                <SplittableTimelineSection title="Profile" theme={theme} typography={typography}>
                  <p style={bodyStyle(typography, theme.body)}>{personalInfo.summary}</p>
                </SplittableTimelineSection>
              ) : null,
              education: eduEntries.length > 0 ? (
                <SplittableTimelineSection title="Education" theme={theme} typography={typography}>
                  <div className="flex flex-col" style={itemGapStyle(spacing)}>
                    {eduEntries.map((edu) => {
                      const grades = formatEducationGrades(edu)
                      const degree = degreeWithField(edu)
                      const dates = formatDateRange(edu.startDate, edu.endDate)
                      return (
                        <div key={edu.id} className="resume-entry">
                          {(degree || dates) && (
                            <div className="flex justify-between gap-2">
                              {degree && <p style={subheadingStyle(typography, theme.subheading)}>{degree}</p>}
                              {dates && <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>{dates}</p>}
                            </div>
                          )}
                          {hasText(edu.institution) && <p style={bodyStyle(typography, theme.body)}>{edu.institution}</p>}
                          {grades && <p style={smallBodyStyle(typography, theme.body)}>{grades}</p>}
                        </div>
                      )
                    })}
                  </div>
                </SplittableTimelineSection>
              ) : null,
              projects: projectEntries.length > 0 ? (
                <SplittableTimelineSection title="Projects" theme={theme} typography={typography}>
                  <div className="flex flex-col" style={itemGapStyle(spacing)}>
                    {projectEntries.map((p) => {
                      const dates = formatProjectDateRange(p)
                      return (
                        <div key={p.id} className="resume-entry">
                          {(hasText(p.name) || dates) && (
                            <div className="flex justify-between gap-2">
                              {hasText(p.name) && <p style={subheadingStyle(typography, theme.subheading)}>{p.name}</p>}
                              {dates && <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>{dates}</p>}
                            </div>
                          )}
                          {renderDescription(p.description, body, descMarker, theme.heading)}
                          {hasText(p.technologies) && (
                            <p className="italic mt-0.5" style={smallBodyStyle(typography, theme.body)}>
                              Technologies: {p.technologies}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </SplittableTimelineSection>
              ) : null,
              experience: expEntries.length > 0 ? (
                <SplittableTimelineSection title="Achievements" theme={theme} typography={typography}>
                  <div className="flex flex-col" style={itemGapStyle(spacing)}>
                    {expEntries.map((exp) => (
                      <div key={exp.id} className="resume-entry">
                        {(hasText(exp.position) || hasText(exp.company)) && (
                          <p style={subheadingStyle(typography, theme.subheading)}>
                            {[exp.position, exp.company].filter(hasText).join(' — ')}
                          </p>
                        )}
                        {renderDescription(exp.description, body, descMarker, theme.heading, 'mt-0.5')}
                      </div>
                    ))}
                  </div>
                </SplittableTimelineSection>
              ) : null,
              personalDetails: personalDetailsBlock(props),
              declaration: declarationBlock(props),
            }}
          />
        </main>
      </div>
    </div>
  )
}
