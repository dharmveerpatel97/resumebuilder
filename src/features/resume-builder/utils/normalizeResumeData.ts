import type { Project, ResumeData } from '../types/resume.types'

function normalizeProjects(projects: Project[] | undefined): Project[] {
  if (!projects?.length) return []
  return projects.map((project, index) => ({
    ...project,
    serial: typeof project.serial === 'number' && project.serial > 0 ? project.serial : index + 1,
  }))
}

export function normalizeResumeData(data: ResumeData): ResumeData {
  return {
    ...data,
    useBulletPoints: data.useBulletPoints ?? true,
    projects: normalizeProjects(data.projects),
  }
}
