import type { Education } from '../types/resume.types'

export function formatEducationGrades(edu: Education): string | null {
  const parts: string[] = []

  if (edu.gpaOutOf10?.trim()) {
    parts.push(`CGPA: ${edu.gpaOutOf10.trim()}/10`)
  }

  if (edu.percentage?.trim()) {
    const value = edu.percentage.trim().replace(/%$/, '')
    parts.push(`${value}%`)
  }

  return parts.length > 0 ? parts.join(' · ') : null
}
