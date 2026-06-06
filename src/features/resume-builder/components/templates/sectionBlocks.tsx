import type { CSSProperties, ReactNode } from 'react'
import type { ResumeData } from '../../types/resume.types'
import type { ResumeTheme } from '../../data/themeColors'
import type { ResumeSpacing } from '../../data/spacing'
import { itemGapStyle } from '../../data/spacing'
import { bodyStyle, headingStyle as headingStyleFn, smallBodyStyle, subheadingStyle } from '../../data/typography'
import type { ResumeTypography } from '../../data/typography'
import { formatEducationGrades } from '../../utils/educationDisplay'
import { EducationTable, FresherSectionHeading } from './templateParts'

export type SectionHeadingVariant = 'standard' | 'fresher'

type BlockProps = {
  data: ResumeData
  theme: ResumeTheme
  typography: ResumeTypography
  spacing: ResumeSpacing
}

type BuildOptions = {
  educationTable?: boolean
  experienceBullets?: boolean
  skillsBullets?: boolean
  headingVariant?: SectionHeadingVariant
}

function SectionHeading({
  title,
  headStyle,
  variant,
}: {
  title: string
  headStyle: CSSProperties
  variant: SectionHeadingVariant
}) {
  if (variant === 'fresher') {
    return <FresherSectionHeading title={title} headingStyle={headStyle} />
  }
  return <h3 className="uppercase tracking-widest mb-2 font-bold" style={headStyle}>{title}</h3>
}

function DetailRow({ label, value, style }: { label: string; value: string; style: CSSProperties }) {
  if (!value) return null
  return <p style={style}><span className="font-semibold">{label}:</span> {value}</p>
}

export function summaryBlock(
  { data, theme, typography }: BlockProps,
  title = 'Summary',
  headStyle?: CSSProperties,
  variant: SectionHeadingVariant = 'standard',
): ReactNode {
  if (!data.personalInfo.summary) return null
  const head = headStyle ?? headingStyleFn(typography, theme.heading)
  return (
    <section className="resume-section">
      <SectionHeading title={title} headStyle={head} variant={variant} />
      <p style={bodyStyle(typography, theme.body)}>{data.personalInfo.summary}</p>
    </section>
  )
}

export function educationBlock(
  { data, theme, typography, spacing }: BlockProps,
  title = 'Education',
  headStyle?: CSSProperties,
  useTable = false,
  variant: SectionHeadingVariant = 'standard',
): ReactNode {
  if (data.education.length === 0) return null
  const head = headStyle ?? headingStyleFn(typography, theme.heading)
  return (
    <section className="resume-section">
      <SectionHeading title={title} headStyle={head} variant={variant} />
      {useTable ? (
        <EducationTable education={data.education} theme={theme} typography={typography} />
      ) : (
        <div className="flex flex-col" style={itemGapStyle(spacing)}>
          {data.education.map((edu) => {
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
                <p style={bodyStyle(typography, theme.body)}>
                  {edu.institution}
                  {edu.division ? ` · ${edu.division}` : ''}
                  {grades ? ` · ${grades}` : ''}
                </p>
                {edu.description && <p className="mt-0.5" style={smallBodyStyle(typography, theme.body)}>{edu.description}</p>}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export function experienceBlock(
  { data, theme, typography, spacing }: BlockProps,
  title = 'Experience',
  headStyle?: CSSProperties,
  bulletList = false,
  variant: SectionHeadingVariant = 'standard',
): ReactNode {
  if (data.experiences.length === 0) return null
  const head = headStyle ?? headingStyleFn(typography, theme.heading)
  const body = bodyStyle(typography, theme.body)
  return (
    <section className="resume-section">
      <SectionHeading title={title} headStyle={head} variant={variant} />
      {bulletList ? (
        <ul className="list-disc pl-5 flex flex-col" style={itemGapStyle(spacing)}>
          {data.experiences.map((exp) => (
            <li key={exp.id} style={body}>{exp.description || `${exp.position} at ${exp.company}`}</li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col" style={itemGapStyle(spacing)}>
          {data.experiences.map((exp) => (
            <div key={exp.id} className="resume-entry">
              <div className="flex justify-between gap-2">
                <p style={subheadingStyle(typography, theme.subheading)}>{exp.position}</p>
                <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </p>
              </div>
              <p className="italic" style={body}>{exp.company}</p>
              {exp.description && <p className="mt-1" style={body}>{exp.description}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export function skillsBlock(
  { data, theme, typography, spacing }: BlockProps,
  title = 'Skills',
  headStyle?: CSSProperties,
  listStyle: 'inline' | 'bullet' = 'inline',
  variant: SectionHeadingVariant = 'standard',
): ReactNode {
  if (data.skills.length === 0) return null
  const head = headStyle ?? headingStyleFn(typography, theme.heading)
  return (
    <section className="resume-section">
      <SectionHeading title={title} headStyle={head} variant={variant} />
      {listStyle === 'bullet' ? (
        <ul className="list-disc pl-5 flex flex-col" style={itemGapStyle(spacing)}>
          {data.skills.map((s) => <li key={s.id} style={bodyStyle(typography, theme.body)}>{s.name}</li>)}
        </ul>
      ) : (
        <p style={bodyStyle(typography, theme.body)}>{data.skills.map((s) => s.name).join(' · ')}</p>
      )}
    </section>
  )
}

export function projectsBlock(
  { data, theme, typography, spacing }: BlockProps,
  title = 'Projects',
  headStyle?: CSSProperties,
  variant: SectionHeadingVariant = 'standard',
): ReactNode {
  if (data.projects.length === 0) return null
  const head = headStyle ?? headingStyleFn(typography, theme.heading)
  return (
    <section className="resume-section">
      <SectionHeading title={title} headStyle={head} variant={variant} />
      <div className="flex flex-col" style={itemGapStyle(spacing)}>
        {data.projects.map((p) => (
          <div key={p.id} className="resume-entry">
            <div className="flex justify-between gap-2">
              <p style={subheadingStyle(typography, theme.subheading)}>{p.name}</p>
              <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>
                {p.startDate}{p.endDate ? ` – ${p.endDate}` : ''}
              </p>
            </div>
            {p.technologies && <p className="italic" style={smallBodyStyle(typography, theme.body)}>Technologies: {p.technologies}</p>}
            {p.description && <p className="mt-1" style={bodyStyle(typography, theme.body)}>{p.description}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}

export function personalDetailsBlock(
  { data, theme, typography, spacing }: BlockProps,
  headStyle?: CSSProperties,
  variant: SectionHeadingVariant = 'standard',
): ReactNode {
  const fd = data.fresherDetails
  const hasAny = fd.fatherName || fd.motherName || fd.gender || fd.dateOfBirth || fd.nationality || fd.religion || fd.languageKnowledge
  if (!hasAny) return null
  const head = headStyle ?? headingStyleFn(typography, theme.heading)
  const body = bodyStyle(typography, theme.body)

  return (
    <section className="resume-section">
      <SectionHeading title="Personal Details" headStyle={head} variant={variant} />
      {variant === 'fresher' ? (
        <div className="flex flex-col" style={itemGapStyle(spacing)}>
          <DetailRow label="Father Name" value={fd.fatherName} style={body} />
          <DetailRow label="Mother Name" value={fd.motherName} style={body} />
          <DetailRow label="Gender" value={fd.gender} style={body} />
          <DetailRow label="DOB" value={fd.dateOfBirth} style={body} />
          <DetailRow label="Nationality" value={fd.nationality} style={body} />
          <DetailRow label="Religion" value={fd.religion} style={body} />
          <DetailRow label="Language Knowledge" value={fd.languageKnowledge} style={body} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          <DetailRow label="Father Name" value={fd.fatherName} style={body} />
          <DetailRow label="Mother Name" value={fd.motherName} style={body} />
          <DetailRow label="Gender" value={fd.gender} style={body} />
          <DetailRow label="DOB" value={fd.dateOfBirth} style={body} />
          <DetailRow label="Nationality" value={fd.nationality} style={body} />
          <DetailRow label="Religion" value={fd.religion} style={body} />
          <DetailRow label="Languages" value={fd.languageKnowledge} style={body} />
        </div>
      )}
    </section>
  )
}

export function declarationBlock(
  { data, theme, typography }: BlockProps,
  headStyle?: CSSProperties,
  variant: SectionHeadingVariant = 'standard',
): ReactNode {
  if (!data.fresherDetails.declaration) return null
  const head = headStyle ?? headingStyleFn(typography, theme.heading)
  return (
    <section className="resume-section">
      <SectionHeading title="Declaration" headStyle={head} variant={variant} />
      <p
        className={variant === 'standard' ? 'italic' : undefined}
        style={{ ...bodyStyle(typography, theme.body), lineHeight: 1.5 }}
      >
        {data.fresherDetails.declaration}
      </p>
    </section>
  )
}

export function buildStandardSections(
  props: BlockProps,
  titles?: Partial<Record<'summary' | 'education' | 'experience' | 'skills' | 'projects', string>>,
  options?: BuildOptions,
) {
  const variant = options?.headingVariant ?? 'standard'
  const p = props
  return {
    summary: summaryBlock(p, titles?.summary, undefined, variant),
    education: educationBlock(p, titles?.education ?? 'Education', undefined, options?.educationTable, variant),
    experience: experienceBlock(p, titles?.experience ?? 'Experience', undefined, options?.experienceBullets, variant),
    skills: skillsBlock(p, titles?.skills ?? 'Skills', undefined, options?.skillsBullets ? 'bullet' : 'inline', variant),
    projects: projectsBlock(p, titles?.projects, undefined, variant),
    personalDetails: personalDetailsBlock(p, undefined, variant),
    declaration: declarationBlock(p, undefined, variant),
  }
}
