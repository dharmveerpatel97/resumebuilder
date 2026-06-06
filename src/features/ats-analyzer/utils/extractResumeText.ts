import * as pdfjs from 'pdfjs-dist'
import type { ResumeData } from '../../resume-builder/types/resume.types'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

export function resumeDataToText(data: ResumeData): string {
  const parts: string[] = []

  const { personalInfo } = data
  if (personalInfo.fullName) parts.push(personalInfo.fullName)
  if (personalInfo.jobTitle) parts.push(personalInfo.jobTitle)
  if (personalInfo.email) parts.push(personalInfo.email)
  if (personalInfo.phone) parts.push(personalInfo.phone)
  if (personalInfo.location) parts.push(personalInfo.location)
  if (personalInfo.linkedin) parts.push(personalInfo.linkedin)
  if (personalInfo.website) parts.push(personalInfo.website)
  if (personalInfo.summary) parts.push(personalInfo.summary)

  for (const exp of data.experiences) {
    parts.push(exp.position, exp.company, exp.startDate, exp.endDate, exp.description)
  }

  for (const edu of data.education) {
    parts.push(edu.degree, edu.field, edu.institution, edu.description)
    if (edu.gpaOutOf10) parts.push(`CGPA ${edu.gpaOutOf10}/10`)
    if (edu.percentage) parts.push(`${edu.percentage}%`)
    if (edu.division) parts.push(edu.division)
  }

  const fd = data.fresherDetails
  if (fd) {
    parts.push(fd.fatherName, fd.motherName, fd.gender, fd.dateOfBirth, fd.nationality, fd.religion, fd.languageKnowledge, fd.declaration)
  }

  for (const skill of data.skills) {
    parts.push(skill.name)
  }

  for (const project of data.projects) {
    parts.push(project.name, project.description, project.technologies, project.url)
  }

  return parts.filter(Boolean).join('\n')
}

export async function readTextFile(file: File): Promise<string> {
  return file.text()
}

export async function readPdfFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: buffer }).promise
  const pages: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
    pages.push(text)
  }

  return pages.join('\n')
}

export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase()

  if (name.endsWith('.pdf')) {
    return readPdfFile(file)
  }

  if (name.endsWith('.txt') || file.type.startsWith('text/')) {
    return readTextFile(file)
  }

  throw new Error('Unsupported file type. Please upload a PDF or TXT file.')
}
