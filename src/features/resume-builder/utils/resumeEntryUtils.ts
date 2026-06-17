import type { Education, Experience, Project, ResumeData, Skill } from '../types/resume.types'

export function hasText(value: string | undefined | null): boolean {
  return Boolean(value?.trim())
}

export function formatDateRange(
  start: string,
  end: string,
  current?: boolean,
): string | null {
  const s = start.trim()
  const e = end.trim()
  if (current && s) return `${s} – Present`
  if (s && e) return `${s} – ${e}`
  if (s) return s
  if (e) return e
  if (current) return 'Present'
  return null
}

export function formatProjectDateRange(project: Project): string | null {
  const start = project.startDate.trim()
  const end = project.endDate.trim()
  if (start && end) return `${start} – ${end}`
  if (start) return start
  if (end) return end
  return null
}

export function degreeWithField(edu: Education): string | null {
  const degree = edu.degree.trim()
  const field = edu.field.trim()
  if (degree && field) return `${degree} in ${field}`
  if (degree) return degree
  if (field) return field
  return null
}

export function isExperienceFilled(exp: Experience): boolean {
  return (
    hasText(exp.position) ||
    hasText(exp.company) ||
    hasText(exp.description) ||
    hasText(exp.startDate) ||
    hasText(exp.endDate) ||
    exp.current
  )
}

export function isEducationFilled(edu: Education): boolean {
  return (
    hasText(edu.degree) ||
    hasText(edu.field) ||
    hasText(edu.institution) ||
    hasText(edu.startDate) ||
    hasText(edu.endDate) ||
    hasText(edu.gpaOutOf10) ||
    hasText(edu.percentage) ||
    hasText(edu.division) ||
    hasText(edu.description)
  )
}

export function isProjectFilled(p: Project): boolean {
  return (
    hasText(p.name) ||
    hasText(p.description) ||
    hasText(p.technologies) ||
    hasText(p.url) ||
    hasText(p.startDate) ||
    hasText(p.endDate)
  )
}

export function isSkillFilled(s: Skill): boolean {
  return hasText(s.name)
}

export function filledExperiences(experiences: Experience[]): Experience[] {
  return experiences.filter(isExperienceFilled)
}

export function filledEducation(education: Education[]): Education[] {
  return education.filter(isEducationFilled)
}

export function filledProjects(projects: Project[]): Project[] {
  return projects.filter(isProjectFilled)
}

export function filledSkills(skills: Skill[]): Skill[] {
  return skills.filter(isSkillFilled)
}

export function hasFilledExperiences(data: ResumeData): boolean {
  return filledExperiences(data.experiences).length > 0
}

export function hasFilledEducation(data: ResumeData): boolean {
  return filledEducation(data.education).length > 0
}

export function hasFilledProjects(data: ResumeData): boolean {
  return filledProjects(data.projects).length > 0
}

export function hasFilledSkills(data: ResumeData): boolean {
  return filledSkills(data.skills).length > 0
}

/** Join non-empty parts with a separator; returns null if nothing to show. */
export function joinParts(parts: (string | null | undefined)[], separator: string): string | null {
  const resolved = parts.map((p) => p?.trim()).filter((p): p is string => Boolean(p))
  return resolved.length > 0 ? resolved.join(separator) : null
}
