import type { CSSProperties } from 'react'

export interface TextStyle {
  fontSize: number
  bold: boolean
}

export interface ResumeTypography {
  heading: TextStyle
  subheading: TextStyle
  body: TextStyle
}

export const FONT_SIZE_OPTIONS = [8, 9, 10, 11, 12, 13, 14, 16, 18, 20, 22, 24]

export const defaultTypography: ResumeTypography = {
  heading: { fontSize: 14, bold: true },
  subheading: { fontSize: 11, bold: true },
  body: { fontSize: 10, bold: false },
}

export function mergeTypography(
  partial?: Partial<ResumeTypography> | ResumeTypography | null,
): ResumeTypography {
  if (!partial) return structuredClone(defaultTypography)
  return {
    heading: { ...defaultTypography.heading, ...partial.heading },
    subheading: { ...defaultTypography.subheading, ...partial.subheading },
    body: { ...defaultTypography.body, ...partial.body },
  }
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
