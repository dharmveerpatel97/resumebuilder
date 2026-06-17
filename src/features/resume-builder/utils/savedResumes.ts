import type { ResumeTheme } from '../data/themeColors'
import { mergeSpacing } from '../data/spacing'
import type { ResumeSpacing } from '../data/spacing'
import { mergeTypography } from '../data/typography'
import type { ResumeTypography } from '../data/typography'
import { defaultFresherDetails } from '../data/fresherDefaults'
import { normalizeSectionEnabled, normalizeSectionOrder } from '../data/sectionOrder'
import { normalizeResumeData } from './normalizeResumeData'
import type { ResumeData, SavedResume, TemplateId } from '../types/resume.types'

const STORAGE_KEY = 'resume-builder-saved'

function readAll(): SavedResume[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SavedResume[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(resumes: SavedResume[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes))
}

export function getSavedResumes(): SavedResume[] {
  return readAll()
    .map(normalizeSavedResume)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

export function getSavedResumeById(id: string): SavedResume | undefined {
  const resume = readAll().find((r) => r.id === id)
  return resume ? normalizeSavedResume(resume) : undefined
}

export interface SaveResumeInput {
  id?: string | null
  name: string
  templateId: TemplateId
  presetId: string
  theme: ResumeTheme
  typography: ResumeTypography
  spacing: ResumeSpacing
  data: ResumeData
}

function normalizeSavedResume(resume: SavedResume): SavedResume {
  return {
    ...resume,
    typography: mergeTypography(resume.typography),
    spacing: mergeSpacing(resume.spacing),
    data: normalizeResumeData({
      ...resume.data,
      education: resume.data.education.map((edu) => ({
        ...edu,
        gpaOutOf10: edu.gpaOutOf10 ?? '',
        percentage: edu.percentage ?? '',
        division: edu.division ?? '',
      })),
      fresherDetails: { ...defaultFresherDetails, ...resume.data.fresherDetails },
      sectionOrder: normalizeSectionOrder(resume.data.sectionOrder),
      sectionEnabled: normalizeSectionEnabled(resume.data.sectionEnabled),
    }),
  }
}

export function saveResume(input: SaveResumeInput): SavedResume {
  const now = new Date().toISOString()
  const resumes = readAll()

  if (input.id) {
    const index = resumes.findIndex((r) => r.id === input.id)
    if (index !== -1) {
      const updated: SavedResume = {
        ...resumes[index],
        name: input.name,
        templateId: input.templateId,
        presetId: input.presetId,
        theme: { ...input.theme },
        typography: structuredClone(input.typography),
        spacing: structuredClone(input.spacing),
        data: structuredClone(input.data),
        updatedAt: now,
      }
      resumes[index] = updated
      writeAll(resumes)
      return updated
    }
  }

  const created: SavedResume = {
    id: crypto.randomUUID(),
    name: input.name,
    templateId: input.templateId,
    presetId: input.presetId,
    theme: { ...input.theme },
    typography: structuredClone(input.typography),
    spacing: structuredClone(input.spacing),
    data: structuredClone(input.data),
    savedAt: now,
    updatedAt: now,
  }
  writeAll([created, ...resumes])
  return created
}

export function deleteSavedResume(id: string) {
  writeAll(readAll().filter((r) => r.id !== id))
}
