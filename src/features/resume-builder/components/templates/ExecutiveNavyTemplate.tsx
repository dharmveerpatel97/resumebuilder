import { hexToRgba } from '../../data/themeColors'
import { itemGapStyle, sectionGapStyle } from '../../data/spacing'
import { bodyStyle, headingStyle, nameStyle, smallBodyStyle, subheadingStyle } from '../../data/typography'
import { isSectionEnabled } from '../../data/sectionOrder'
import { getMainSections } from '../../data/templateLayout'
import { formatEducationGrades } from '../../utils/educationDisplay'
import { OrderedSectionList } from './OrderedSectionList'
import { declarationBlock, personalDetailsBlock } from './sectionBlocks'
import { PhotoPlaceholder, SectionLine } from './templateParts'
import { SplittableTimelineSection } from './timelineParts'
import type { TemplateProps } from './types'
import { getDescriptionMarker, renderDescription } from '../../utils/descriptionDisplay'
import { filledEducation, filledExperiences, filledProjects, filledSkills } from '../../utils/resumeEntryUtils'

export function ExecutiveNavyTemplate({ data, templateId, theme, typography, spacing }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects } = data
  const props = { data, templateId, theme, typography, spacing }
  const descMarker = getDescriptionMarker(templateId, data.useBulletPoints)
  const body = bodyStyle(typography, theme.body)
  const skillList = filledSkills(skills)
  const half = Math.ceil(skillList.length / 2)

  return (
    <div className="resume-template-root leading-relaxed">
      <div className="relative flex">
        <div className="w-[30%] shrink-0 resume-pt resume-px pb-4 flex justify-center">
          <PhotoPlaceholder size={96} theme={theme} typography={typography} />
        </div>
        <div
          className="flex-1 resume-py resume-px resume-pb flex flex-col justify-center text-white"
          style={{ backgroundColor: theme.heading }}
        >
          <h1
            className="uppercase tracking-wide leading-tight"
            style={{ ...nameStyle(typography, '#ffffff'), fontSize: Math.max(typography.heading.fontSize + 6, 22) }}
          >
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p className="uppercase tracking-widest mt-1 opacity-90" style={subheadingStyle(typography, '#e2e8f0')}>
              {personalInfo.jobTitle}
            </p>
          )}
        </div>
      </div>

      <div className="resume-col-layout" style={{ ['--resume-sidebar-width' as string]: '30%' }}>
        <aside
          className="resume-col-sidebar resume-p flex flex-col"
          style={{ backgroundColor: hexToRgba(theme.heading, 0.07), ...sectionGapStyle(spacing) }}
        >
          <div className="resume-section">
            <SectionLine title="Contact" headingStyle={headingStyle(typography, theme.heading)} theme={theme} />
            <div className="flex flex-col" style={itemGapStyle(spacing)}>
              {personalInfo.phone && <p style={bodyStyle(typography, theme.body)}>{personalInfo.phone}</p>}
              {personalInfo.email && <p style={bodyStyle(typography, theme.body)}>{personalInfo.email}</p>}
              {personalInfo.location && <p style={bodyStyle(typography, theme.body)}>{personalInfo.location}</p>}
              {personalInfo.website && <p style={bodyStyle(typography, theme.body)}>{personalInfo.website}</p>}
            </div>
          </div>

          {isSectionEnabled(data, 'skills') && skillList.length > 0 && (
            <div className="resume-section">
              <SectionLine title="Skills" headingStyle={headingStyle(typography, theme.heading)} theme={theme} />
              <ul className="flex flex-col" style={itemGapStyle(spacing)}>
                {skillList.slice(0, half).map((s) => (
                  <li key={s.id} style={bodyStyle(typography, theme.body)}>• {s.name}</li>
                ))}
              </ul>
            </div>
          )}

          {isSectionEnabled(data, 'skills') && skillList.length > half && (
            <div className="resume-section">
              <SectionLine title="Languages" headingStyle={headingStyle(typography, theme.heading)} theme={theme} />
              <ul className="flex flex-col" style={itemGapStyle(spacing)}>
                {skillList.slice(half).map((s) => (
                  <li key={s.id} style={bodyStyle(typography, theme.body)}>• {s.name}</li>
                ))}
              </ul>
            </div>
          )}

          {personalInfo.linkedin && (
            <div className="resume-section">
              <SectionLine title="Reference" headingStyle={headingStyle(typography, theme.heading)} theme={theme} />
              <p style={bodyStyle(typography, theme.body)}>{personalInfo.linkedin}</p>
            </div>
          )}
        </aside>

        <main className="resume-col-main resume-p flex flex-col" style={sectionGapStyle(spacing)}>
          <OrderedSectionList
            order={data.sectionOrder}
            enabled={data.sectionEnabled}
            onlySections={getMainSections('executiveNavy')}
            sections={{
              summary: personalInfo.summary ? (
                <SplittableTimelineSection title="Profile" theme={theme} typography={typography} marker="circle">
                  <p style={bodyStyle(typography, theme.body)}>{personalInfo.summary}</p>
                </SplittableTimelineSection>
              ) : null,
              experience: filledExperiences(experiences).length > 0 ? (
                <SplittableTimelineSection title="Work Experience" theme={theme} typography={typography} marker="circle">
                  <div className="flex flex-col" style={itemGapStyle(spacing)}>
                    {filledExperiences(experiences).map((exp) => (
                      <div key={exp.id} className="resume-entry">
                        <div className="flex justify-between gap-2">
                          <p style={subheadingStyle(typography, theme.subheading)}>{exp.company}</p>
                          <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>
                            {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                          </p>
                        </div>
                        <p style={bodyStyle(typography, theme.body)}>{exp.position}</p>
                        {renderDescription(exp.description, body, descMarker, theme.heading)}
                      </div>
                    ))}
                  </div>
                </SplittableTimelineSection>
              ) : null,
              education: filledEducation(education).length > 0 ? (
                <SplittableTimelineSection title="Education" theme={theme} typography={typography} marker="circle">
                  <div className="flex flex-col" style={itemGapStyle(spacing)}>
                    {filledEducation(education).map((edu) => {
                      const grades = formatEducationGrades(edu)
                      return (
                        <div key={edu.id} className="resume-entry">
                          <div className="flex justify-between gap-2">
                            <p style={subheadingStyle(typography, theme.subheading)}>
                              {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                            </p>
                            <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>
                              {edu.startDate} – {edu.endDate}
                            </p>
                          </div>
                          <p style={bodyStyle(typography, theme.body)}>{edu.institution}</p>
                          {grades && <p className="mt-0.5" style={smallBodyStyle(typography, theme.body)}>{grades}</p>}
                        </div>
                      )
                    })}
                  </div>
                </SplittableTimelineSection>
              ) : null,
              projects: filledProjects(projects).length > 0 ? (
                <SplittableTimelineSection title="Projects" theme={theme} typography={typography} marker="circle">
                  <div className="flex flex-col" style={itemGapStyle(spacing)}>
                    {filledProjects(projects).map((p) => (
                      <div key={p.id} className="resume-entry">
                        <p style={subheadingStyle(typography, theme.subheading)}>{p.name}</p>
                        {renderDescription(p.description, body, descMarker, theme.heading)}
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
