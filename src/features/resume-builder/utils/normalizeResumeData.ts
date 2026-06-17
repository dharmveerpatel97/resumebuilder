import type { ResumeData } from '../types/resume.types'

export function normalizeResumeData(data: ResumeData): ResumeData {
  return {
    ...data,
    useBulletPoints: data.useBulletPoints ?? true,
  }
}
