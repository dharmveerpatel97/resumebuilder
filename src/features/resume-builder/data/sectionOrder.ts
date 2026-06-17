import type { FresherDetails, ResumeData, ResumeSectionId } from '../types/resume.types'
import {
  hasFilledEducation,
  hasFilledExperiences,
  hasFilledProjects,
  hasFilledSkills,
} from '../utils/resumeEntryUtils'

export const DEFAULT_SECTION_ORDER: ResumeSectionId[] = [
  'summary',
  'education',
  'experience',
  'skills',
  'projects',
  'personalDetails',
  'declaration',
]

export const DEFAULT_SECTION_ENABLED: Record<ResumeSectionId, boolean> = {
  summary: true,
  education: true,
  experience: true,
  skills: true,
  projects: true,
  personalDetails: false,
  declaration: false,
}

export const FRESHER_SECTION_ENABLED: Record<ResumeSectionId, boolean> = {
  ...DEFAULT_SECTION_ENABLED,
  personalDetails: true,
  declaration: true,
}

export const SECTION_LABELS: Record<ResumeSectionId, string> = {
  summary: 'Summary / Career Objective',
  education: 'Education',
  experience: 'Experience',
  skills: 'Skills',
  projects: 'Projects',
  personalDetails: 'Personal Details',
  declaration: 'Declaration',
}

export function normalizeSectionOrder(order?: ResumeSectionId[]): ResumeSectionId[] {
  const result: ResumeSectionId[] = []
  const seen = new Set<ResumeSectionId>()

  for (const id of order ?? []) {
    if (!seen.has(id)) {
      seen.add(id)
      result.push(id)
    }
  }

  for (const id of DEFAULT_SECTION_ORDER) {
    if (!seen.has(id)) {
      seen.add(id)
      result.push(id)
    }
  }

  return result
}

function hasPersonalDetails(fd: FresherDetails) {
  return Boolean(
    fd.fatherName ||
      fd.motherName ||
      fd.gender ||
      fd.dateOfBirth ||
      fd.nationality ||
      fd.religion ||
      fd.languageKnowledge,
  )
}

export function normalizeSectionEnabled(
  enabled?: Partial<Record<ResumeSectionId, boolean>>,
): Record<ResumeSectionId, boolean> {
  return { ...DEFAULT_SECTION_ENABLED, ...enabled }
}

export function isSectionEnabled(
  data: ResumeData,
  id: ResumeSectionId,
): boolean {
  const flags = normalizeSectionEnabled(data.sectionEnabled)
  return flags[id] !== false
}

export function isSectionVisible(data: ResumeData, id: ResumeSectionId): boolean {
  if (!isSectionEnabled(data, id)) return false
  switch (id) {
    case 'summary':
      return Boolean(data.personalInfo.summary.trim())
    case 'education':
      return hasFilledEducation(data)
    case 'experience':
      return hasFilledExperiences(data)
    case 'skills':
      return hasFilledSkills(data)
    case 'projects':
      return hasFilledProjects(data)
    case 'personalDetails':
      return hasPersonalDetails(data.fresherDetails)
    case 'declaration':
      return Boolean(data.fresherDetails.declaration.trim())
    default:
      return false
  }
}
