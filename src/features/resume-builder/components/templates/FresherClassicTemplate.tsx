import { hexToRgba } from '../../data/themeColors'
import { itemGapStyle, sectionGapStyle } from '../../data/spacing'
import { bodyStyle, headingStyle, nameStyle, smallBodyStyle, subheadingStyle } from '../../data/typography'
import { isSectionEnabled } from '../../data/sectionOrder'
import { getMainSections } from '../../data/templateLayout'
import { OrderedSectionList } from './OrderedSectionList'
import { declarationBlock, personalDetailsBlock } from './sectionBlocks'
import { EducationTable } from './templateParts'
import type { TemplateProps } from './types'

export function FresherClassicTemplate({ data, theme, typography, spacing }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, fresherDetails } = data
  const props = { data, theme, typography, spacing }
  const sectionHead = headingStyle(typography, theme.heading)

  return (
    <div className="resume-template-root leading-relaxed flex">
      <aside
        className="w-[32%] shrink-0 resume-p flex flex-col"
        style={{ backgroundColor: hexToRgba(theme.heading, 0.08), ...sectionGapStyle(spacing) }}
      >
        <div>
          <h1 className="uppercase" style={nameStyle(typography, theme.heading)}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p className="mt-1" style={subheadingStyle(typography, theme.subheading)}>{personalInfo.jobTitle}</p>
          )}
        </div>

        <section className="resume-section">
          <h3 className="uppercase tracking-wider font-bold mb-2" style={sectionHead}>Contact</h3>
          <div className="flex flex-col" style={itemGapStyle(spacing)}>
            {personalInfo.phone && <p style={bodyStyle(typography, theme.body)}>{personalInfo.phone}</p>}
            {personalInfo.email && <p style={bodyStyle(typography, theme.body)}>{personalInfo.email}</p>}
            {personalInfo.location && <p style={bodyStyle(typography, theme.body)}>{personalInfo.location}</p>}
          </div>
        </section>

        {isSectionEnabled(data, 'skills') && skills.length > 0 && (
          <section className="resume-section">
            <h3 className="uppercase tracking-wider font-bold mb-2" style={sectionHead}>Skills</h3>
            <ul className="flex flex-col" style={itemGapStyle(spacing)}>
              {skills.map((s) => (
                <li key={s.id} style={bodyStyle(typography, theme.body)}>• {s.name}</li>
              ))}
            </ul>
          </section>
        )}

        {fresherDetails.languageKnowledge && (
          <section className="resume-section">
            <h3 className="uppercase tracking-wider font-bold mb-2" style={sectionHead}>Languages</h3>
            <p style={bodyStyle(typography, theme.body)}>{fresherDetails.languageKnowledge}</p>
          </section>
        )}
      </aside>

      <main className="flex-1 resume-p flex flex-col" style={sectionGapStyle(spacing)}>
        <OrderedSectionList
          order={data.sectionOrder}
          enabled={data.sectionEnabled}
          onlySections={getMainSections('fresherClassic')}
          sections={{
            summary: personalInfo.summary ? (
              <section className="resume-section">
                <h3 className="uppercase tracking-wider font-bold mb-2" style={sectionHead}>Career Objective</h3>
                <p style={bodyStyle(typography, theme.body)}>{personalInfo.summary}</p>
              </section>
            ) : null,
            education: education.length > 0 ? (
              <section className="resume-section">
                <h3 className="uppercase tracking-wider font-bold mb-2" style={sectionHead}>Academic Qualification</h3>
                <EducationTable education={education} theme={theme} typography={typography} />
              </section>
            ) : null,
            projects: projects.length > 0 ? (
              <section className="resume-section">
                <h3 className="uppercase tracking-wider font-bold mb-2" style={sectionHead}>Academic Projects</h3>
                <div className="flex flex-col" style={itemGapStyle(spacing)}>
                  {projects.map((p) => (
                    <div key={p.id} className="resume-entry">
                      <p style={subheadingStyle(typography, theme.subheading)}>{p.name}</p>
                      {p.description && <p style={bodyStyle(typography, theme.body)}>{p.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            ) : null,
            experience: experiences.length > 0 ? (
              <section className="resume-section">
                <h3 className="uppercase tracking-wider font-bold mb-2" style={sectionHead}>Training / Experience</h3>
                <div className="flex flex-col" style={itemGapStyle(spacing)}>
                  {experiences.map((exp) => (
                    <div key={exp.id} className="resume-entry">
                      <p style={subheadingStyle(typography, theme.subheading)}>{exp.position} — {exp.company}</p>
                      {exp.description && <p style={smallBodyStyle(typography, theme.body)}>{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            ) : null,
            personalDetails: personalDetailsBlock(props, sectionHead, 'fresher'),
            declaration: declarationBlock(props, sectionHead, 'fresher'),
          }}
        />
      </main>
    </div>
  )
}
