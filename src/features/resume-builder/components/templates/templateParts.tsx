import type { CSSProperties } from 'react'
import type { ResumeTheme } from '../../data/themeColors'
import { hexToRgba } from '../../data/themeColors'
import type { ResumeTypography } from '../../data/typography'
import { bodyStyle, smallBodyStyle } from '../../data/typography'
import type { Education } from '../../types/resume.types'

export function PhotoPlaceholder({
  size = 88,
  theme,
  typography,
  className = '',
}: {
  size?: number
  theme: ResumeTheme
  typography: ResumeTypography
  className?: string
}) {
  return (
    <div
      className={`rounded-full flex items-center justify-center text-white shrink-0 border-4 border-white shadow-sm ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: theme.heading,
        ...smallBodyStyle(typography),
      }}
    >
      Photo
    </div>
  )
}

export function SquarePhotoPlaceholder({
  size = 96,
  theme,
  typography,
  className = '',
}: {
  size?: number
  theme: ResumeTheme
  typography: ResumeTypography
  className?: string
}) {
  return (
    <div
      className={`flex items-center justify-center text-white shrink-0 border-2 border-gray-400 ${className}`}
      style={{ width: size, height: size, backgroundColor: theme.heading, ...smallBodyStyle(typography) }}
    >
      Photo
    </div>
  )
}

export function FresherSectionHeading({ title, headingStyle }: { title: string; headingStyle: CSSProperties }) {
  return (
    <h3
      className="w-full uppercase font-bold mb-2 pb-1 border-b-2 border-gray-800 bg-gray-100 px-2 -mx-0"
      style={headingStyle}
    >
      {title}
    </h3>
  )
}

export function EducationTable({
  education,
  theme,
  typography,
}: {
  education: Education[]
  theme: ResumeTheme
  typography: ResumeTypography
}) {
  const cellStyle = bodyStyle(typography, theme.body)
  const headStyle = { ...cellStyle, fontWeight: 700 as const }

  return (
    <table className="w-full border-collapse border border-gray-800 text-left">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-800 px-2 py-1" style={headStyle}>Sr. No.</th>
          <th className="border border-gray-800 px-2 py-1" style={headStyle}>Class / Degree</th>
          <th className="border border-gray-800 px-2 py-1" style={headStyle}>Board / University</th>
          <th className="border border-gray-800 px-2 py-1" style={headStyle}>Year</th>
          <th className="border border-gray-800 px-2 py-1" style={headStyle}>Division / Grade</th>
        </tr>
      </thead>
      <tbody>
        {education.map((edu, index) => (
          <tr key={edu.id}>
            <td className="border border-gray-800 px-2 py-1 text-center" style={cellStyle}>{index + 1}</td>
            <td className="border border-gray-800 px-2 py-1" style={cellStyle}>
              {edu.degree}{edu.field ? ` (${edu.field})` : ''}
            </td>
            <td className="border border-gray-800 px-2 py-1" style={cellStyle}>{edu.institution}</td>
            <td className="border border-gray-800 px-2 py-1 text-center" style={cellStyle}>{edu.endDate || edu.startDate}</td>
            <td className="border border-gray-800 px-2 py-1 text-center" style={cellStyle}>
              {edu.division || (edu.percentage ? `${edu.percentage}%` : edu.gpaOutOf10 ? `${edu.gpaOutOf10}/10` : '—')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function SectionLine({
  title,
  headingStyle,
  theme,
  className = '',
}: {
  title: string
  headingStyle: CSSProperties
  theme: ResumeTheme
  className?: string
}) {
  return (
    <div className={`mb-2 ${className}`}>
      <h3 className="uppercase tracking-wider font-semibold" style={headingStyle}>
        {title}
      </h3>
      <div className="h-px mt-1.5" style={{ backgroundColor: hexToRgba(theme.heading, 0.35) }} />
    </div>
  )
}
