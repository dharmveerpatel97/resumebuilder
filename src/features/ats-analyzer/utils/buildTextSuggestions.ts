import type { ResumeData } from '../../resume-builder/types/resume.types'
import type { ATSTextSuggestion } from './atsAnalysis'
import {
  buildTailoredSummary,
  filterQualityKeywords,
  getMissingSkills,
  getUncoveredJobLines,
  jdLineToResumeBullet,
  parseJobDescription,
  resumeHasTerm,
} from './jobDescriptionParser'

function capitalizeKeyword(kw: string): string {
  if (kw.length <= 4) return kw.toUpperCase()
  return kw.charAt(0).toUpperCase() + kw.slice(1)
}

function getPlacementLabel(section: ATSTextSuggestion['section'], resumeData?: ResumeData): string {
  switch (section) {
    case 'Job Title':
      return 'Resume header → Job Title field'
    case 'Summary':
      return 'Resume → Summary / Professional Summary'
    case 'Skills':
      return 'Resume → Skills section'
    case 'Projects':
      return 'Resume → Projects section'
    case 'Experience': {
      const latest = resumeData?.experiences.find((e) => e.company.trim() || e.position.trim())
      if (latest?.company && latest?.position) {
        return `Experience → ${latest.position} at ${latest.company}`
      }
      if (latest?.position) return `Experience → ${latest.position}`
      return 'Experience → your most recent role'
    }
    default:
      return 'Resume'
  }
}

function extractSkillsFromKeywords(keywords: string[]): string[] {
  return filterQualityKeywords(keywords).map(capitalizeKeyword)
}

export function buildTextSuggestions(
  jobDescription: string,
  resumeText: string,
  resumeData: ResumeData | undefined,
  missingKeywords: string[],
): ATSTextSuggestion[] {
  const parsed = parseJobDescription(jobDescription)
  const suggestions: ATSTextSuggestion[] = []

  const jdSkills = parsed.skills
  const missingSkills = getMissingSkills(jdSkills, resumeText)
  const matchedSkills = jdSkills.filter((s) => resumeHasTerm(resumeText, s))
  const keywordSkills = extractSkillsFromKeywords(missingKeywords)
  const allMissingSkills = [...new Set([...missingSkills, ...keywordSkills])].slice(0, 12)

  const uncoveredLines = getUncoveredJobLines(parsed, resumeText)
  const contextSkills = allMissingSkills.length ? allMissingSkills : matchedSkills

  const jobTitle =
    parsed.title ??
    resumeData?.personalInfo.jobTitle.trim() ??
    'Professional'

  const currentTitle = resumeData?.personalInfo.jobTitle.trim()

  if (parsed.title && (!currentTitle || !resumeHasTerm(currentTitle, parsed.title))) {
    suggestions.push({
      id: 'job-title',
      section: 'Job Title',
      title: 'Set your headline to match the posting',
      whereToPut: getPlacementLabel('Job Title', resumeData),
      suggestedText: parsed.title,
      sourceQuote: parsed.title,
      hint: 'ATS filters often search for exact title matches first.',
    })
  }

  if (allMissingSkills.length > 0) {
    const existing = resumeData?.skills.map((s) => s.name.trim()).filter(Boolean) ?? []
    const newOnly = allMissingSkills.filter(
      (s) => !existing.some((e) => e.toLowerCase() === s.toLowerCase()),
    )
    if (newOnly.length > 0) {
      suggestions.push({
        id: 'skills-add',
        section: 'Skills',
        title: `Add ${newOnly.length} missing skill${newOnly.length > 1 ? 's' : ''} from the job post`,
        whereToPut: getPlacementLabel('Skills', resumeData),
        suggestedText: [...existing, ...newOnly].join(', '),
        sourceQuote: `Job requires: ${newOnly.join(', ')}`,
        hint: 'Only add skills you actually know. Paste the full line into your Skills section.',
      })
    }
  }

  const summaryText = buildTailoredSummary(
    jobTitle,
    allMissingSkills,
    matchedSkills,
    parsed.experienceYears,
    uncoveredLines,
  )

  suggestions.push({
    id: 'summary',
    section: 'Summary',
    title: 'Replace or update your professional summary',
    whereToPut: getPlacementLabel('Summary', resumeData),
    suggestedText: summaryText,
    sourceQuote: uncoveredLines[0] ?? parsed.requirements[0] ?? 'Job posting keywords',
    hint: uncoveredLines[0]
      ? `Addresses this gap from the job post: "${uncoveredLines[0].slice(0, 120)}${uncoveredLines[0].length > 120 ? '…' : ''}"`
      : 'Weave in keywords from the job description naturally.',
  })

  const linesToRewrite = uncoveredLines.length > 0
    ? uncoveredLines
    : parsed.topPhrases.slice(0, 4)

  const latestExp = resumeData?.experiences.find((e) => e.position.trim() || e.company.trim())

  linesToRewrite.slice(0, 5).forEach((line, index) => {
    const bullet = jdLineToResumeBullet(line, contextSkills)
    suggestions.push({
      id: `exp-bullet-${index}`,
      section: 'Experience',
      title: latestExp
        ? `Add bullet #${index + 1} under ${latestExp.position || 'your role'}${latestExp.company ? ` @ ${latestExp.company}` : ''}`
        : `Experience bullet #${index + 1} from job post`,
      whereToPut: getPlacementLabel('Experience', resumeData),
      suggestedText: bullet,
      sourceQuote: line,
      hint: 'Job posting says: "' + line.slice(0, 130) + (line.length > 130 ? '…' : '') + '" — replace [X] and [metric] with your real numbers.',
    })
  })

  if (resumeData) {
    const thinExperiences = resumeData.experiences.filter(
      (e) => e.description.trim().length < 80,
    )
    thinExperiences.slice(0, 2).forEach((exp, index) => {
      const sourceLine = uncoveredLines[index] ?? parsed.responsibilities[index]
      if (!sourceLine) return

      const existing = exp.description.trim()
      const newBullet = jdLineToResumeBullet(sourceLine, contextSkills)
      suggestions.push({
        id: `exp-expand-${exp.id}`,
        section: 'Experience',
        title: `Expand "${exp.position || 'Role'}" at ${exp.company || 'Company'}`,
        whereToPut: `Experience → ${exp.position || 'Role'} @ ${exp.company || 'Company'}`,
        suggestedText: existing ? `${existing}\n• ${newBullet}` : `• ${newBullet}`,
        sourceQuote: sourceLine,
        hint: 'Your current description is thin. Append this bullet to strengthen ATS match.',
      })
    })
  }

  const hasMetrics = /\d+%|\$\d|\d+\+/.test(resumeText)
  if (!hasMetrics && contextSkills.length > 0) {
    const skill = contextSkills[0]
    suggestions.push({
      id: 'impact',
      section: 'Experience',
      title: 'Add numbers — your resume has no metrics yet',
      whereToPut: getPlacementLabel('Experience', resumeData),
      suggestedText: [
        `• Improved [feature/process] with ${skill}, increasing [metric] by [X]%.`,
        `• Reduced [bugs/downtime/cost] by [X]% through ${skill} optimization.`,
        `• Delivered [N] releases/features on time, supporting [N] users/customers.`,
      ].join('\n'),
      sourceQuote: 'Quantified achievements',
      hint: 'Pick one bullet, fill brackets with real data, and paste under your latest job.',
    })
  }

  if (resumeData && resumeData.projects.length === 0 && allMissingSkills.length >= 2) {
    const sourceLine = uncoveredLines[0] ?? `experience with ${allMissingSkills.slice(0, 3).join(', ')}`
    suggestions.push({
      id: 'project',
      section: 'Projects',
      title: 'Add a project that proves required skills',
      whereToPut: getPlacementLabel('Projects', resumeData),
      suggestedText: [
        `Project Name: [Your App / Portfolio Project]`,
        `Technologies: ${allMissingSkills.slice(0, 5).join(', ')}`,
        `Description: ${jdLineToResumeBullet(sourceLine, allMissingSkills)}`,
      ].join('\n'),
      sourceQuote: sourceLine,
      hint: 'Use a real GitHub, freelance, or personal project that uses these technologies.',
    })
  }

  const seen = new Set<string>()
  return suggestions
    .filter((s) => {
      const key = `${s.section}-${s.suggestedText.slice(0, 50)}`
      if (seen.has(key)) return false
      seen.add(key)
      return s.suggestedText.trim().length > 10
    })
    .slice(0, 12)
}
