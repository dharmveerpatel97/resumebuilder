import type { CSSProperties, ReactNode } from 'react'
import type { ResumeData, TemplateId } from '../../types/resume.types'
import type { ResumeTheme } from '../../data/themeColors'
import type { ResumeSpacing } from '../../data/spacing'
import { itemGapStyle } from '../../data/spacing'
import { bodyStyle, headingStyle as headingStyleFn, smallBodyStyle, subheadingStyle } from '../../data/typography'
import type { ResumeTypography } from '../../data/typography'
import { getDescriptionMarker, renderDescription, type DescriptionMarker } from '../../utils/descriptionDisplay'
import { formatEducationGrades } from '../../utils/educationDisplay'
import {
  degreeWithField,
  filledEducation,
  filledExperiences,
  filledProjects,
  filledSkills,
  formatDateRange,
  formatProjectDateRange,
  hasText,
  joinParts,
} from '../../utils/resumeEntryUtils'
import { EducationTable, FresherSectionHeading } from './templateParts'

export type SectionHeadingVariant = 'standard' | 'fresher'

type BlockProps = {
  data: ResumeData
  templateId: TemplateId
  theme: ResumeTheme
  typography: ResumeTypography
  spacing: ResumeSpacing
}

type BuildOptions = {
  educationTable?: boolean
  experienceBullets?: boolean
  skillsBullets?: boolean
  headingVariant?: SectionHeadingVariant
  descriptionMarker?: DescriptionMarker
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
  if (!hasText(value)) return null
  return <p style={style}><span className="font-semibold">{label}:</span> {value}</p>
}

export function summaryBlock(
  { data, theme, typography }: BlockProps,
  title = 'Summary',
  headStyle?: CSSProperties,
  variant: SectionHeadingVariant = 'standard',
): ReactNode {
  if (!hasText(data.personalInfo.summary)) return null
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
  const entries = filledEducation(data.education)
  if (entries.length === 0) return null
  const head = headStyle ?? headingStyleFn(typography, theme.heading)
  return (
    <section className="resume-section">
      <SectionHeading title={title} headStyle={head} variant={variant} />
      {useTable ? (
        <EducationTable education={entries} theme={theme} typography={typography} />
      ) : (
        <div className="flex flex-col" style={itemGapStyle(spacing)}>
          {entries.map((edu) => {
            const grades = formatEducationGrades(edu)
            const degree = degreeWithField(edu)
            const dates = formatDateRange(edu.startDate, edu.endDate)
            const meta = joinParts([edu.institution, edu.division, grades], ' · ')
            return (
              <div key={edu.id} className="resume-entry">
                {(degree || dates) && (
                  <div className="flex justify-between gap-2">
                    {degree && <p style={subheadingStyle(typography, theme.subheading)}>{degree}</p>}
                    {dates && (
                      <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>{dates}</p>
                    )}
                  </div>
                )}
                {meta && <p style={bodyStyle(typography, theme.body)}>{meta}</p>}
                {hasText(edu.description) && (
                  <p className="mt-0.5" style={smallBodyStyle(typography, theme.body)}>{edu.description}</p>
                )}
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
  descriptionMarker: DescriptionMarker = 'none',
): ReactNode {
  const entries = filledExperiences(data.experiences)
  if (entries.length === 0) return null
  const head = headStyle ?? headingStyleFn(typography, theme.heading)
  const body = bodyStyle(typography, theme.body)
  return (
    <section className="resume-section">
      <SectionHeading title={title} headStyle={head} variant={variant} />
      {bulletList ? (
        <ul className="list-disc pl-5 flex flex-col" style={itemGapStyle(spacing)}>
          {entries.map((exp) => (
            <li key={exp.id} style={body}>
              {hasText(exp.description)
                ? exp.description
                : joinParts([exp.position, exp.company], ' at ') ?? 'Experience'}
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col" style={itemGapStyle(spacing)}>
          {entries.map((exp) => {
            const dates = formatDateRange(exp.startDate, exp.endDate, exp.current)
            return (
              <div key={exp.id} className="resume-entry">
                {(hasText(exp.position) || dates) && (
                  <div className="flex justify-between gap-2">
                    {hasText(exp.position) && (
                      <p style={subheadingStyle(typography, theme.subheading)}>{exp.position}</p>
                    )}
                    {dates && (
                      <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>{dates}</p>
                    )}
                  </div>
                )}
                {hasText(exp.company) && <p className="italic" style={body}>{exp.company}</p>}
                {renderDescription(exp.description, body, descriptionMarker, theme.heading)}
              </div>
            )
          })}
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
  const entries = filledSkills(data.skills)
  if (entries.length === 0) return null
  const head = headStyle ?? headingStyleFn(typography, theme.heading)
  return (
    <section className="resume-section">
      <SectionHeading title={title} headStyle={head} variant={variant} />
      {listStyle === 'bullet' ? (
        <ul className="list-disc pl-5 flex flex-col" style={itemGapStyle(spacing)}>
          {entries.map((s) => <li key={s.id} style={bodyStyle(typography, theme.body)}>{s.name}</li>)}
        </ul>
      ) : (
        <p style={bodyStyle(typography, theme.body)}>{entries.map((s) => s.name).join(' · ')}</p>
      )}
    </section>
  )
}

export function projectsBlock(
  { data, theme, typography, spacing }: BlockProps,
  title = 'Projects',
  headStyle?: CSSProperties,
  variant: SectionHeadingVariant = 'standard',
  descriptionMarker: DescriptionMarker = 'none',
): ReactNode {
  const entries = filledProjects(data.projects)
  if (entries.length === 0) return null
  const head = headStyle ?? headingStyleFn(typography, theme.heading)
  const body = bodyStyle(typography, theme.body)
  return (
    <section className="resume-section">
      <SectionHeading title={title} headStyle={head} variant={variant} />
      <div className="flex flex-col" style={itemGapStyle(spacing)}>
        {entries.map((p) => {
          const dates = formatProjectDateRange(p)
          return (
            <div key={p.id} className="resume-entry">
              {(hasText(p.name) || dates) && (
                <div className="flex justify-between gap-2">
                  {hasText(p.name) && <p style={subheadingStyle(typography, theme.subheading)}>{p.name}</p>}
                  {dates && (
                    <p style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>{dates}</p>
                  )}
                </div>
              )}
              {hasText(p.technologies) && (
                <p className="italic" style={smallBodyStyle(typography, theme.body)}>Technologies: {p.technologies}</p>
              )}
              {renderDescription(p.description, body, descriptionMarker, theme.heading)}
            </div>
          )
        })}
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
  if (!hasText(data.fresherDetails.declaration)) return null
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
  const marker = options?.descriptionMarker ?? getDescriptionMarker(props.templateId, props.data.useBulletPoints)
  const p = props
  return {
    summary: summaryBlock(p, titles?.summary, undefined, variant),
    education: educationBlock(p, titles?.education ?? 'Education', undefined, options?.educationTable, variant),
    experience: experienceBlock(p, titles?.experience ?? 'Experience', undefined, options?.experienceBullets, variant, marker),
    skills: skillsBlock(p, titles?.skills ?? 'Skills', undefined, options?.skillsBullets ? 'bullet' : 'inline', variant),
    projects: projectsBlock(p, titles?.projects, undefined, variant, marker),
    personalDetails: personalDetailsBlock(p, undefined, variant),
    declaration: declarationBlock(p, undefined, variant),
  }
}
