import type { ResumeData } from '../../resume-builder/types/resume.types'
import { buildTextSuggestions } from './buildTextSuggestions'
import { filterQualityKeywords } from './jobDescriptionParser'

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has',
  'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
  'shall', 'can', 'need', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
  'we', 'they', 'what', 'which', 'who', 'whom', 'when', 'where', 'why', 'how', 'all', 'each',
  'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
  'own', 'same', 'so', 'than', 'too', 'very', 'just', 'about', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once',
  'here', 'there', 'any', 'our', 'your', 'their', 'its', 'my', 'me', 'him', 'her', 'us', 'them',
  'am', 'if', 'while', 'also', 'etc', 'able', 'work', 'working', 'role', 'position', 'job',
  'experience', 'years', 'year', 'including', 'using', 'used', 'use', 'within', 'across',
  'looking', 'seeking', 'join', 'team', 'company', 'candidate', 'responsibilities', 'requirements',
  'preferred', 'qualifications', 'description', 'apply', 'opportunity',
])

const ACTION_VERBS = new Set([
  'achieved', 'built', 'created', 'delivered', 'designed', 'developed', 'drove', 'enhanced',
  'established', 'executed', 'generated', 'grew', 'implemented', 'improved', 'increased',
  'launched', 'led', 'managed', 'optimized', 'organized', 'performed', 'produced', 'reduced',
  'resolved', 'streamlined', 'supervised', 'transformed',
])

const TECH_PATTERNS = [
  /\breact\b/i, /\bnode\.?js\b/i, /\btypescript\b/i, /\bjavascript\b/i, /\bpython\b/i,
  /\bjava\b/i, /\bsql\b/i, /\baws\b/i, /\bazure\b/i, /\bdocker\b/i, /\bkubernetes\b/i,
  /\bfigma\b/i, /\bphotoshop\b/i, /\bhtml\b/i, /\bcss\b/i, /\bapi\b/i, /\brest\b/i,
  /\bgraphql\b/i, /\bmongodb\b/i, /\bpostgresql\b/i, /\bredux\b/i, /\bnext\.?js\b/i,
  /\bvue\b/i, /\bangular\b/i, /\bci\/cd\b/i, /\bagile\b/i, /\bscrum\b/i,
]

export interface ATSTextSuggestion {
  id: string
  section: 'Summary' | 'Skills' | 'Experience' | 'Job Title' | 'Projects'
  title: string
  whereToPut: string
  suggestedText: string
  sourceQuote: string
  hint: string
}

export interface ATSAnalysisResult {
  overallScore: number
  grade: string
  summary: string
  formatting: number
  keywords: number
  experience: number
  education: number
  skills: number
  readability: number
  impact: number
  matchedKeywords: string[]
  missingKeywords: string[]
  suggestions: string[]
  textSuggestions: ATSTextSuggestion[]
  jobDescriptionRequired: boolean
}

function clamp(score: number, min = 0, max = 100) {
  return Math.round(Math.max(min, Math.min(max, score)))
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .split(/\s+/)
    .map((t) => t.replace(/^-+|-+$/g, ''))
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t))
}

function extractJobKeywords(jobDescription: string): string[] {
  const tokens = tokenize(jobDescription)
  const counts = new Map<string, number>()

  for (const token of tokens) {
    const weight = token.length >= 6 || /\d/.test(token) ? 2 : 1
    counts.set(token, (counts.get(token) ?? 0) + weight)
  }

  for (const pattern of TECH_PATTERNS) {
    const match = jobDescription.match(pattern)
    if (match) {
      const term = match[0].toLowerCase().replace(/\./g, '')
      counts.set(term, (counts.get(term) ?? 0) + 5)
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word]) => word)
}

function scoreKeywords(resumeText: string, jobDescription: string) {
  const trimmedJob = jobDescription.trim()

  if (!trimmedJob) {
    return {
      score: 45,
      matched: [] as string[],
      missing: [] as string[],
      jobDescriptionRequired: true,
    }
  }

  const jobKeywords = extractJobKeywords(trimmedJob)
  if (jobKeywords.length === 0) {
    return { score: 50, matched: [], missing: [], jobDescriptionRequired: false }
  }

  const resumeLower = resumeText.toLowerCase()
  const resumeTokens = new Set(tokenize(resumeText))
  const matched: string[] = []
  const missing: string[] = []
  let weightedMatch = 0
  let totalWeight = 0

  for (const keyword of jobKeywords) {
    const isLong = keyword.length >= 6
    const weight = isLong ? 2 : 1
    totalWeight += weight

    const found =
      resumeTokens.has(keyword) ||
      resumeLower.includes(keyword) ||
      (keyword.includes('js') && resumeLower.includes(keyword.replace('js', '.js')))

    if (found) {
      matched.push(keyword)
      weightedMatch += weight
    } else {
      missing.push(keyword)
    }
  }

  const raw = (weightedMatch / totalWeight) * 100
  const penalty = missing.filter((k) => k.length >= 6).length * 3
  const score = clamp(raw - penalty)

  return { score, matched, missing, jobDescriptionRequired: false }
}

function scoreFormatting(resumeText: string, data?: ResumeData): number {
  let score = 55
  const text = resumeText.toLowerCase()

  if (/@/.test(resumeText)) score += 8
  else score -= 12

  if (/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText) || /\+\d/.test(resumeText)) score += 6
  else score -= 8

  const requiredSections = ['experience', 'education', 'skills']
  const optionalSections = ['summary', 'project', 'certification']
  const foundRequired = requiredSections.filter((s) => text.includes(s)).length
  const foundOptional = optionalSections.filter((s) => text.includes(s)).length
  score += foundRequired * 7
  score += foundOptional * 3
  if (foundRequired < 2) score -= 10

  const wordCount = resumeText.split(/\s+/).filter(Boolean).length
  if (wordCount >= 250 && wordCount <= 900) score += 10
  else if (wordCount < 150) score -= 15
  else if (wordCount > 1200) score -= 10

  const hasBullets = /[•\-*]\s/.test(resumeText) || resumeText.includes('\n- ')
  if (hasBullets) score += 6
  else score -= 8

  if (/[|]{2,}|<table|┌|═/.test(resumeText)) score -= 12

  if (data) {
    if (!data.personalInfo.fullName.trim()) score -= 5
    if (!data.personalInfo.jobTitle.trim()) score -= 4
  }

  return clamp(score)
}

function scoreExperience(resumeText: string, data?: ResumeData): number {
  let score = 40

  if (data && data.experiences.length > 0) {
    const entries = data.experiences
    score += Math.min(entries.length * 8, 24)

    const withDescription = entries.filter((e) => e.description.trim().length > 40).length
    score += Math.min(withDescription * 6, 18)

    const withDates = entries.filter((e) => e.startDate.trim()).length
    score += Math.min(withDates * 4, 12)

    const withCompany = entries.filter((e) => e.company.trim()).length
    score += Math.min(withCompany * 3, 9)

    const actionBullets = entries.reduce((count, e) => {
      return count + tokenize(e.description).filter((w) => ACTION_VERBS.has(w)).length
    }, 0)
    score += Math.min(actionBullets * 2, 12)
  } else if (/experience|work history|employment/i.test(resumeText)) {
    score += 25
    const actionCount = tokenize(resumeText).filter((w) => ACTION_VERBS.has(w)).length
    score += Math.min(actionCount * 2, 15)
  } else {
    score -= 10
  }

  return clamp(score)
}

function scoreEducation(resumeText: string, data?: ResumeData): number {
  let score = 45

  if (data && data.education.length > 0) {
    score += Math.min(data.education.length * 12, 24)
    const complete = data.education.filter(
      (e) => e.institution.trim() && (e.degree.trim() || e.field.trim()),
    ).length
    score += Math.min(complete * 10, 20)
  } else if (/education|university|college|bachelor|master|degree/i.test(resumeText)) {
    score += 30
  } else {
    score -= 15
  }

  if (/certification|certified|certificate/i.test(resumeText)) score += 8

  return clamp(score)
}

function scoreSkills(resumeText: string, data?: ResumeData, jobDescription?: string): number {
  let score = 42

  if (data && data.skills.length > 0) {
    score += Math.min(data.skills.length * 4, 28)
  } else {
    const skillLike = (resumeText.match(/skills|technologies|proficient|expertise/gi) ?? []).length
    score += Math.min(skillLike * 8, 20)
  }

  if (jobDescription?.trim()) {
    const jobSkills = extractJobKeywords(jobDescription).filter((k) => k.length >= 4)
    const resumeLower = resumeText.toLowerCase()
    const matchedSkills = jobSkills.filter((k) => resumeLower.includes(k)).length
    const ratio = jobSkills.length ? matchedSkills / jobSkills.length : 0
    score += Math.round(ratio * 25)
  }

  if (data && data.skills.length < 5) score -= 10
  if (data && data.skills.length >= 8) score += 6

  return clamp(score)
}

function scoreReadability(resumeText: string): number {
  let score = 48
  const words = resumeText.split(/\s+/).filter(Boolean)
  if (words.length === 0) return 0

  const actionCount = words.filter((w) => ACTION_VERBS.has(w.toLowerCase())).length
  score += Math.min(actionCount * 2, 16)

  const sentences = resumeText.split(/[.!?\n]+/).filter((s) => s.trim().length > 10)
  if (sentences.length > 0) {
    const avgWords = words.length / sentences.length
    if (avgWords >= 10 && avgWords <= 22) score += 12
    else if (avgWords > 35) score -= 10
    else if (avgWords < 6) score -= 6
  }

  if (/summary|objective|profile/i.test(resumeText)) score += 8

  const longParagraphs = resumeText.split(/\n\n+/).filter((p) => p.split(/\s+/).length > 80).length
  score -= longParagraphs * 5

  return clamp(score)
}

function scoreImpact(resumeText: string, data?: ResumeData): number {
  let score = 35
  const sources = data
    ? [
        ...data.experiences.map((e) => e.description),
        ...data.projects.map((p) => p.description),
        data.personalInfo.summary,
      ].join('\n')
    : resumeText

  const metrics = sources.match(
    /\d+%|\$\d+[\d,]*|\d+\+|\d{1,3}(?:,\d{3})+|\b\d+\s*(?:users|clients|customers|projects|team members|engineers|people)\b/gi,
  )
  const metricCount = metrics?.length ?? 0
  score += Math.min(metricCount * 8, 32)

  const actionWithNumbers = (sources.match(/\b(?:increased|reduced|improved|grew|saved|generated|delivered)\b[^.\n]*\d+/gi) ?? []).length
  score += Math.min(actionWithNumbers * 6, 18)

  if (metricCount === 0) score -= 12
  if (actionWithNumbers === 0) score -= 8

  return clamp(score)
}

function scoreToGrade(score: number): string {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

function buildSummary(
  overall: number,
  keywords: number,
  experience: number,
  impact: number,
  jobDescriptionRequired: boolean,
): string {
  if (jobDescriptionRequired) {
    return 'Paste a job description to get an accurate keyword score. Other sections were scored from your resume content alone.'
  }

  const parts: string[] = []

  if (overall >= 85) {
    parts.push('Solid resume with good ATS compatibility.')
  } else if (overall >= 70) {
    parts.push('Decent resume structure, but there is room to improve ATS performance.')
  } else {
    parts.push('Resume needs meaningful improvements before it will perform well in ATS screening.')
  }

  if (keywords >= 80) parts.push('Keywords align well with the job posting.')
  else if (keywords < 65) parts.push('Several important job keywords are missing from your resume.')

  if (experience >= 80) parts.push('Work experience is well documented.')
  else parts.push('Experience section could be stronger with clearer roles and bullet points.')

  if (impact < 70) parts.push('Add quantified results (%, numbers, revenue, users) to strengthen impact.')

  return parts.join(' ')
}

function buildSuggestions(
  result: Omit<ATSAnalysisResult, 'suggestions' | 'textSuggestions' | 'summary' | 'grade' | 'overallScore'>,
): string[] {
  const suggestions: string[] = []

  if (result.jobDescriptionRequired) {
    suggestions.push('Paste the full job description — keyword scoring is limited without it.')
  }

  if (result.keywords < 75 && result.missingKeywords.length > 0) {
    const quality = filterQualityKeywords(result.missingKeywords).slice(0, 8)
    if (quality.length > 0) {
      suggestions.push(`Add missing job keywords naturally: ${quality.join(', ')}.`)
    }
  }

  if (result.formatting < 80) {
    suggestions.push('Use standard headings (Experience, Education, Skills), bullet points, and complete contact info.')
  }

  if (result.experience < 80) {
    suggestions.push('Expand experience bullets with role, company, dates, and achievement-focused statements.')
  }

  if (result.education < 75) {
    suggestions.push('Include degree, institution, and field of study. Add certifications if you have them.')
  }

  if (result.skills < 80) {
    suggestions.push('List more role-specific skills that appear in the job posting.')
  }

  if (result.impact < 75) {
    suggestions.push('Quantify achievements: e.g. "Increased conversion by 25%" or "Managed team of 8".')
  }

  if (result.readability < 75) {
    suggestions.push('Keep bullets concise, start with action verbs, and avoid long dense paragraphs.')
  }

  if (suggestions.length === 0) {
    suggestions.push('Tailor this resume for each application by matching keywords from the specific job post.')
  }

  return suggestions.slice(0, 6)
}

export function analyzeResume(
  resumeText: string,
  jobDescription: string,
  resumeData?: ResumeData,
): ATSAnalysisResult {
  const trimmedResume = resumeText.trim()

  const keywordResult = scoreKeywords(trimmedResume, jobDescription)
  const formatting = scoreFormatting(trimmedResume, resumeData)
  const keywords = keywordResult.score
  const experience = scoreExperience(trimmedResume, resumeData)
  const education = scoreEducation(trimmedResume, resumeData)
  const skills = scoreSkills(trimmedResume, resumeData, jobDescription)
  const readability = scoreReadability(trimmedResume)
  const impact = scoreImpact(trimmedResume, resumeData)

  const overallScore = clamp(
    keywords * 0.22 +
      formatting * 0.14 +
      experience * 0.16 +
      education * 0.1 +
      skills * 0.14 +
      readability * 0.1 +
      impact * 0.14,
  )

  const partial = {
    formatting,
    keywords,
    experience,
    education,
    skills,
    readability,
    impact,
    matchedKeywords: keywordResult.matched,
    missingKeywords: keywordResult.missing,
    jobDescriptionRequired: keywordResult.jobDescriptionRequired,
  }

  const hasJobDescription = jobDescription.trim().length > 0

  return {
    overallScore,
    grade: scoreToGrade(overallScore),
    summary: buildSummary(overallScore, keywords, experience, impact, keywordResult.jobDescriptionRequired),
    ...partial,
    suggestions: buildSuggestions(partial),
    textSuggestions: hasJobDescription
      ? buildTextSuggestions(
          jobDescription,
          trimmedResume,
          resumeData,
          keywordResult.missing,
        )
      : [],
  }
}

export function scoreLabel(score: number): string {
  if (score >= 85) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Needs Work'
  return 'Poor'
}

export function scoreColor(score: number): string {
  if (score >= 85) return 'text-green-500'
  if (score >= 70) return 'text-primary'
  if (score >= 50) return 'text-accent-orange'
  return 'text-red-500'
}
