import { itemGapStyle, sectionGapStyle } from '../../data/spacing'
import { bodyStyle, headingStyle, nameStyle, smallBodyStyle, subheadingStyle } from '../../data/typography'
import { isSectionEnabled } from '../../data/sectionOrder'
import { getMainSections } from '../../data/templateLayout'
import { formatEducationGrades } from '../../utils/educationDisplay'
import { OrderedSectionList } from './OrderedSectionList'
import { declarationBlock, personalDetailsBlock } from './sectionBlocks'
import type { TemplateProps } from './types'

function GridCell({
  title,
  children,
  className = '',
  headingStyleProp,
}: {
  title: string
  children: React.ReactNode
  className?: string
  headingStyleProp: React.CSSProperties
}) {
  return (
    <div className={`p-3 border border-black ${className}`}>
      <h3 className="uppercase tracking-widest font-bold mb-2" style={headingStyleProp}>
        {title}
      </h3>
      {children}
    </div>
  )
}

export function GridInteriorTemplate({ data, theme, typography, spacing }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects } = data
  const props = { data, theme, typography, spacing }
  const sectionHead = headingStyle(typography, theme.heading)
  const skillHalf = Math.ceil(skills.length / 2)

  return (
    <div className="resume-template-root leading-relaxed resume-p border border-black">
      <div className="grid grid-cols-[1fr_auto] border-b border-black">
        <div className="p-4 border-r border-black">
          <h1 className="uppercase tracking-wide" style={nameStyle(typography, theme.heading)}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p className="uppercase tracking-[0.2em] mt-1" style={subheadingStyle(typography, theme.subheading)}>
              {personalInfo.jobTitle}
            </p>
          )}
        </div>
        <div className="p-4 min-w-[200px] flex flex-col" style={{ ...smallBodyStyle(typography, theme.body), ...itemGapStyle(spacing) }}>
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.website && <p>{personalInfo.website}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
        </div>
      </div>

      {isSectionEnabled(data, 'summary') && personalInfo.summary && (
        <GridCell title="About Me" headingStyleProp={sectionHead} className="border-b border-t-0 border-x-0">
          <p style={bodyStyle(typography, theme.body)}>{personalInfo.summary}</p>
        </GridCell>
      )}

      <div className="grid grid-cols-[32%_1fr]">
        <div className="border-r border-black flex flex-col">
          {isSectionEnabled(data, 'skills') && skills.length > 0 && (
            <GridCell title="Skills" headingStyleProp={sectionHead} className="border-0 border-b border-black rounded-none">
              <ul className="flex flex-col" style={itemGapStyle(spacing)}>
                {skills.slice(0, skillHalf).map((s) => (
                  <li key={s.id} style={bodyStyle(typography, theme.body)}>• {s.name}</li>
                ))}
              </ul>
            </GridCell>
          )}
          {isSectionEnabled(data, 'skills') && skills.length > skillHalf && (
            <GridCell title="Design Tools" headingStyleProp={sectionHead} className="border-0 border-b border-black rounded-none">
              <ul className="flex flex-col" style={itemGapStyle(spacing)}>
                {skills.slice(skillHalf).map((s) => (
                  <li key={s.id} style={bodyStyle(typography, theme.body)}>• {s.name}</li>
                ))}
              </ul>
            </GridCell>
          )}
          {isSectionEnabled(data, 'education') && education.length > 0 && (
            <GridCell title="Education" headingStyleProp={sectionHead} className="border-0 border-b border-black rounded-none">
              <div className="flex flex-col" style={itemGapStyle(spacing)}>
                {education.map((edu) => {
                  const grades = formatEducationGrades(edu)
                  return (
                    <div key={edu.id} className="resume-entry">
                      <p style={subheadingStyle(typography, theme.subheading)}>
                        {edu.degree}{edu.field ? ` (${edu.field})` : ''}
                      </p>
                      <p style={bodyStyle(typography, theme.body)}>{edu.institution}</p>
                      <p style={smallBodyStyle(typography, theme.body)}>{edu.endDate}</p>
                      {grades && <p style={smallBodyStyle(typography, theme.body)}>{grades}</p>}
                    </div>
                  )
                })}
              </div>
            </GridCell>
          )}
          {isSectionEnabled(data, 'projects') && projects[0] && (
            <GridCell title="Achievements" headingStyleProp={sectionHead} className="border-0 rounded-none flex-1">
              <p style={bodyStyle(typography, theme.body)}>{projects[0].description}</p>
            </GridCell>
          )}
        </div>

        <div className="flex flex-col">
          <OrderedSectionList
            order={data.sectionOrder}
            enabled={data.sectionEnabled}
            onlySections={getMainSections('gridInterior')}
            className="flex flex-col"
            sections={{
              experience: experiences.length > 0 ? (
                <GridCell title="Experience" headingStyleProp={sectionHead} className="border-0 border-b border-black rounded-none">
                  <div className="flex flex-col" style={{ ...sectionGapStyle(spacing) }}>
                    {experiences.map((exp) => (
                      <div key={exp.id} className="resume-entry">
                        <div className="flex justify-between gap-2">
                          <p className="uppercase font-bold" style={subheadingStyle(typography, theme.subheading)}>{exp.position}</p>
                          <p style={smallBodyStyle(typography, theme.body)}>
                            {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                          </p>
                        </div>
                        <p className="italic" style={bodyStyle(typography, theme.body)}>{exp.company}</p>
                        {exp.description && <p className="mt-1" style={bodyStyle(typography, theme.body)}>{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </GridCell>
              ) : null,
              projects: projects.length > 1 ? (
                <GridCell title="Projects" headingStyleProp={sectionHead} className="border-0 border-b border-black rounded-none">
                  <div className="flex flex-col" style={itemGapStyle(spacing)}>
                    {projects.slice(1).map((p) => (
                      <div key={p.id} className="resume-entry">
                        <p style={subheadingStyle(typography, theme.subheading)}>{p.name}</p>
                        {p.description && <p style={bodyStyle(typography, theme.body)}>{p.description}</p>}
                      </div>
                    ))}
                  </div>
                </GridCell>
              ) : null,
              personalDetails: personalDetailsBlock(props),
              declaration: declarationBlock(props),
            }}
          />
          <GridCell title="Reference" headingStyleProp={sectionHead} className="border-0 rounded-none flex-1">
            {personalInfo.linkedin ? (
              <>
                <p style={subheadingStyle(typography, theme.subheading)}>Professional Reference</p>
                <p className="mt-1" style={bodyStyle(typography, theme.body)}>{personalInfo.linkedin}</p>
                {personalInfo.email && <p style={bodyStyle(typography, theme.body)}>{personalInfo.email}</p>}
              </>
            ) : (
              <p style={bodyStyle(typography, theme.body)}>Available upon request</p>
            )}
          </GridCell>
        </div>
      </div>
    </div>
  )
}
