import type { CSSProperties } from 'react'
import type { Education, Experience, Project } from '../../types/resume.types'
import type { ResumeTheme } from '../../data/themeColors'
import type { ResumeSpacing } from '../../data/spacing'
import { itemGapStyle } from '../../data/spacing'
import { bodyStyle, smallBodyStyle, subheadingStyle } from '../../data/typography'
import type { ResumeTypography } from '../../data/typography'
import { renderDescription, type DescriptionMarker } from '../../utils/descriptionDisplay'
import { formatEducationGrades } from '../../utils/educationDisplay'
import {
  degreeWithField,
  formatDateRange,
  formatProjectDateRange,
  hasText,
  joinParts,
} from '../../utils/resumeEntryUtils'

type ThemeTypography = { theme: ResumeTheme; typography: ResumeTypography }

export function ExperienceEntryFields({
  exp,
  theme,
  typography,
  descriptionMarker = 'none',
  companyItalic = true,
  positionStyle,
  companyStyle,
  dateStyle,
  bodyStyleOverride,
}: ThemeTypography & {
  exp: Experience
  descriptionMarker?: DescriptionMarker
  companyItalic?: boolean
  positionStyle?: CSSProperties
  companyStyle?: CSSProperties
  dateStyle?: CSSProperties
  bodyStyleOverride?: CSSProperties
}) {
  const dates = formatDateRange(exp.startDate, exp.endDate, exp.current)
  const body = bodyStyleOverride ?? bodyStyle(typography, theme.body)
  const posStyle = positionStyle ?? subheadingStyle(typography, theme.subheading)
  const compStyle = companyStyle ?? body
  const dtStyle = dateStyle ?? { ...smallBodyStyle(typography, theme.body), opacity: 0.75 }

  return (
    <>
      {(hasText(exp.position) || dates) && (
        <div className="flex justify-between items-start gap-2">
          {hasText(exp.position) && <p style={posStyle}>{exp.position}</p>}
          {dates && <p className="whitespace-nowrap shrink-0" style={dtStyle}>{dates}</p>}
        </div>
      )}
      {hasText(exp.company) && (
        <p className={companyItalic ? 'italic' : undefined} style={compStyle}>{exp.company}</p>
      )}
      {renderDescription(exp.description, body, descriptionMarker, theme.heading)}
    </>
  )
}

export function ProjectEntryFields({
  project,
  theme,
  typography,
  descriptionMarker = 'none',
  showTechnologies = true,
  showUrl = false,
}: ThemeTypography & {
  project: Project
  descriptionMarker?: DescriptionMarker
  showTechnologies?: boolean
  showUrl?: boolean
}) {
  const dates = formatProjectDateRange(project)
  const body = bodyStyle(typography, theme.body)

  return (
    <>
      {(hasText(project.name) || dates) && (
        <div className="flex justify-between items-start gap-2">
          {hasText(project.name) && <p style={subheadingStyle(typography, theme.subheading)}>{project.name}</p>}
          {dates && (
            <p className="whitespace-nowrap shrink-0" style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>
              {dates}
            </p>
          )}
        </div>
      )}
      {showTechnologies && hasText(project.technologies) && (
        <p className="italic" style={{ ...subheadingStyle(typography, theme.subheading), opacity: 0.85 }}>
          {project.technologies}
        </p>
      )}
      {renderDescription(project.description, body, descriptionMarker, theme.heading)}
      {showUrl && hasText(project.url) && (
        <p className="mt-0.5 break-all" style={{ ...smallBodyStyle(typography, theme.body), opacity: 0.75 }}>
          {project.url}
        </p>
      )}
    </>
  )
}

export function EducationEntryFields({
  edu,
  theme,
  typography,
  layout = 'standard',
}: ThemeTypography & {
  edu: Education
  layout?: 'standard' | 'sidebar' | 'inline'
}) {
  const grades = formatEducationGrades(edu)
  const degree = degreeWithField(edu)
  const dates = formatDateRange(edu.startDate, edu.endDate)

  if (layout === 'sidebar') {
    return (
      <>
        {degree && <p style={subheadingStyle(typography)}>{degree}</p>}
        {hasText(edu.institution) && (
          <p style={{ ...bodyStyle(typography), opacity: 0.9 }}>{edu.institution}</p>
        )}
        {dates && <p style={{ ...smallBodyStyle(typography), opacity: 0.75 }}>{dates}</p>}
        {grades && <p style={{ ...smallBodyStyle(typography), opacity: 0.75 }}>{grades}</p>}
      </>
    )
  }

  const meta = joinParts([edu.institution, edu.division, grades], layout === 'inline' ? ' | ' : ' · ')

  return (
    <>
      {(degree || dates) && (
        <div className="flex justify-between gap-2 items-start">
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
    </>
  )
}

export function SkillsList({
  skills,
  theme,
  typography,
  spacing,
  variant = 'bullet',
}: ThemeTypography & { spacing: ResumeSpacing; skills: { id: string; name: string }[]; variant?: 'bullet' | 'inline' | 'pill' }) {
  if (skills.length === 0) return null
  if (variant === 'inline') {
    return <p style={bodyStyle(typography, theme.body)}>{skills.map((s) => s.name).join(' · ')}</p>
  }
  if (variant === 'pill') {
    return (
      <div className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <span key={s.id} className="rounded-full px-2.5 py-0.5" style={bodyStyle(typography, theme.body)}>
            {s.name}
          </span>
        ))}
      </div>
    )
  }
  return (
    <ul className="flex flex-col" style={itemGapStyle(spacing)}>
      {skills.map((s) => (
        <li key={s.id} style={bodyStyle(typography, theme.body)}>• {s.name}</li>
      ))}
    </ul>
  )
}
