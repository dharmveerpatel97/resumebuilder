export interface PersonalInfo {
  fullName: string
  jobTitle: string
  email: string
  phone: string
  location: string
  linkedin: string
  website: string
  summary: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpaOutOf10: string
  percentage: string
  division: string
  description: string
}

export interface FresherDetails {
  fatherName: string
  motherName: string
  gender: string
  dateOfBirth: string
  nationality: string
  religion: string
  languageKnowledge: string
  declaration: string
}

export interface Skill {
  id: string
  name: string
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string
  url: string
  startDate: string
  endDate: string
}

export type ResumeSectionId =
  | 'summary'
  | 'education'
  | 'experience'
  | 'skills'
  | 'projects'
  | 'personalDetails'
  | 'declaration'

export interface ResumeData {
  personalInfo: PersonalInfo
  experiences: Experience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  fresherDetails: FresherDetails
  sectionOrder: ResumeSectionId[]
  sectionEnabled: Record<ResumeSectionId, boolean>
}

export type TemplateId =
  | 'classic'
  | 'modern'
  | 'professional'
  | 'webDesigner'
  | 'graphicDesigner'
  | 'marketingTimeline'
  | 'executiveNavy'
  | 'gridInterior'
  | 'studentPurple'
  | 'accountant'
  | 'fresherTable'
  | 'fresherSimple'
  | 'fresherModern'
  | 'fresherClassic'
  | 'fresherIntern'

export type TemplateCategory = 'professional' | 'fresher'

export interface ResumeTemplate {
  id: TemplateId
  name: string
  description: string
  category: TemplateCategory
  previewColor: string
  defaultThemeId: string
  data: ResumeData
}

export interface SavedResume {
  id: string
  name: string
  templateId: TemplateId
  presetId: string
  theme: {
    heading: string
    subheading: string
    body: string
  }
  typography?: {
    heading: { fontSize: number; bold: boolean }
    subheading: { fontSize: number; bold: boolean }
    body: { fontSize: number; bold: boolean }
  }
  spacing?: {
    sectionGap: number
    itemGap: number
  }
  data: ResumeData
  savedAt: string
  updatedAt: string
}
