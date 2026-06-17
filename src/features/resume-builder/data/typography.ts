import type { CSSProperties } from 'react'

export interface TextStyle {
  fontSize: number
  bold: boolean
}

export type ResumeFontFamilyId =
  | 'inter'
  | 'calibri'
  | 'arial'
  | 'helvetica'
  | 'times'
  | 'georgia'
  | 'garamond'

export interface ResumeFontOption {
  id: ResumeFontFamilyId
  label: string
  stack: string
  /** Google Fonts stylesheet URL (optional) */
  googleFontUrl?: string
}

export const FONT_FAMILY_OPTIONS: ResumeFontOption[] = [
  {
    id: 'inter',
    label: 'Inter',
    stack: "'Inter', system-ui, sans-serif",
    googleFontUrl:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  },
  {
    id: 'calibri',
    label: 'Calibri',
    stack: "'Calibri', 'Carlito', 'Segoe UI', sans-serif",
    googleFontUrl:
      'https://fonts.googleapis.com/css2?family=Carlito:wght@400;700&display=swap',
  },
  {
    id: 'arial',
    label: 'Arial',
    stack: "Arial, Helvetica, sans-serif",
  },
  {
    id: 'helvetica',
    label: 'Helvetica',
    stack: "Helvetica, Arial, sans-serif",
  },
  {
    id: 'times',
    label: 'Times New Roman',
    stack: "'Times New Roman', Times, serif",
  },
  {
    id: 'georgia',
    label: 'Georgia',
    stack: "Georgia, 'Times New Roman', serif",
  },
  {
    id: 'garamond',
    label: 'Garamond',
    stack: "Garamond, 'EB Garamond', 'Times New Roman', serif",
    googleFontUrl:
      'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600;700&display=swap',
  },
]

export interface ResumeTypography {
  fontFamily: ResumeFontFamilyId
  heading: TextStyle
  subheading: TextStyle
  body: TextStyle
}

export const FONT_SIZE_OPTIONS = [8, 9, 10, 11, 12, 13, 14, 16, 18, 20, 22, 24]

export const defaultTypography: ResumeTypography = {
  fontFamily: 'inter',
  heading: { fontSize: 14, bold: true },
  subheading: { fontSize: 11, bold: true },
  body: { fontSize: 10, bold: false },
}

export function getFontOption(id: ResumeFontFamilyId): ResumeFontOption {
  return FONT_FAMILY_OPTIONS.find((f) => f.id === id) ?? FONT_FAMILY_OPTIONS[0]
}

export function mergeTypography(
  partial?: Partial<ResumeTypography> | ResumeTypography | null,
): ResumeTypography {
  if (!partial) return structuredClone(defaultTypography)
  return {
    fontFamily: partial.fontFamily ?? defaultTypography.fontFamily,
    heading: { ...defaultTypography.heading, ...partial.heading },
    subheading: { ...defaultTypography.subheading, ...partial.subheading },
    body: { ...defaultTypography.body, ...partial.body },
  }
}

export function fontFamilyStyle(typography: ResumeTypography): CSSProperties {
  return { fontFamily: getFontOption(typography.fontFamily).stack }
}

export function toTextStyle(style: TextStyle): CSSProperties {
  return {
    fontSize: `${style.fontSize}px`,
    fontWeight: style.bold ? 700 : 400,
  }
}

export function nameStyle(typography: ResumeTypography, color?: string): CSSProperties {
  return {
    fontSize: `${Math.round(typography.heading.fontSize * 1.6)}px`,
    fontWeight: typography.heading.bold ? 700 : 400,
    lineHeight: 1.2,
    ...(color ? { color } : {}),
  }
}

export function headingStyle(typography: ResumeTypography, color?: string): CSSProperties {
  return { ...toTextStyle(typography.heading), ...(color ? { color } : {}) }
}

export function subheadingStyle(typography: ResumeTypography, color?: string): CSSProperties {
  return { ...toTextStyle(typography.subheading), ...(color ? { color } : {}) }
}

export function bodyStyle(typography: ResumeTypography, color?: string): CSSProperties {
  return { ...toTextStyle(typography.body), ...(color ? { color } : {}) }
}

export function smallBodyStyle(typography: ResumeTypography, color?: string): CSSProperties {
  return {
    fontSize: `${Math.max(8, typography.body.fontSize - 1)}px`,
    fontWeight: typography.body.bold ? 700 : 400,
    ...(color ? { color } : {}),
  }
}

export function loadResumeFont(fontId: ResumeFontFamilyId) {
  const url = getFontOption(fontId).googleFontUrl
  if (!url) return
  const id = `resume-font-${fontId}`
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = url
  document.head.appendChild(link)
}
