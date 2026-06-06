const SECTION_HEADERS =
  /^(?:key\s+|core\s+|main\s+)?(?:requirements?|qualifications?|responsibilities|duties|what you(?:'ll| will) do|what we(?:'re| are) looking for|about (?:the )?role|skills?(?:\s+required)?|must[\s-]haves?|nice[\s-]to[\s-]have|technical skills|job description)\s*[:\-–]?\s*$/i

const GENERIC_JD_WORDS = new Set([
  'strong', 'excellent', 'good', 'great', 'ability', 'understanding', 'knowledge',
  'experience', 'preferred', 'required', 'minimum', 'plus', 'bonus', 'ideally',
  'highly', 'high', 'level', 'years', 'year', 'etc', 'including', 'working', 'work',
  'team', 'environment', 'fast', 'paced', 'detail', 'oriented', 'communication',
  'skills', 'problem', 'solving', 'self', 'motivated', 'passionate', 'looking',
  'join', 'company', 'role', 'candidate', 'opportunity', 'degree', 'bachelor',
  'master', 'equivalent', 'related', 'field', 'least', 'ability', 'proven',
  'demonstrated', 'solid', 'deep', 'well', 'our', 'your', 'you', 'will', 'have',
  'with', 'that', 'this', 'from', 'into', 'across', 'within', 'using', 'used',
])

const ACTION_VERB_START =
  /^(?:develop|design|build|create|manage|lead|implement|maintain|collaborate|deliver|optimize|improve|analyze|coordinate|support|write|test|deploy|integrate|architect|mentor|oversee|execute|drive|ensure|establish|perform|conduct|prepare|research|communicate|work|assist|help|provide|own|handle|participate|contribute|translate|translate|plan|monitor|troubleshoot|document|review|present|report)\b/i

const KNOWN_SKILLS = [
  'react', 'react native', 'node.js', 'nodejs', 'typescript', 'javascript', 'python',
  'java', 'c++', 'c#', 'sql', 'postgresql', 'mongodb', 'mysql', 'aws', 'azure', 'gcp',
  'docker', 'kubernetes', 'git', 'figma', 'photoshop', 'illustrator', 'html', 'css',
  'sass', 'tailwind', 'redux', 'next.js', 'nextjs', 'vue', 'angular', 'graphql', 'rest',
  'api', 'ci/cd', 'agile', 'scrum', 'jira', 'webpack', 'vite', 'express', 'django',
  'flask', 'spring', 'bootstrap', 'material ui', 'ui/ux', 'ux design', 'seo',
  'wordpress', 'shopify', 'firebase', 'linux', 'terraform', 'jenkins', 'swift',
  'kotlin', 'flutter', 'dart', 'php', 'laravel', 'ruby', 'rails', 'go', 'rust',
  'machine learning', 'data analysis', 'excel', 'power bi', 'tableau', 'salesforce',
  'redux toolkit', 'react hook form', 'zustand', 'storybook', 'jest', 'cypress',
]

const VERB_MAP: Record<string, string> = {
  develop: 'Developed', design: 'Designed', build: 'Built', create: 'Created',
  manage: 'Managed', lead: 'Led', implement: 'Implemented', maintain: 'Maintained',
  collaborate: 'Collaborated', deliver: 'Delivered', optimize: 'Optimized',
  improve: 'Improved', analyze: 'Analyzed', coordinate: 'Coordinated',
  support: 'Supported', write: 'Wrote', test: 'Tested', deploy: 'Deployed',
  integrate: 'Integrated', architect: 'Architected', mentor: 'Mentored',
  oversee: 'Oversaw', execute: 'Executed', drive: 'Drove', ensure: 'Ensured',
  establish: 'Established', perform: 'Performed', conduct: 'Conducted',
  prepare: 'Prepared', research: 'Researched', communicate: 'Communicated',
  work: 'Worked', assist: 'Assisted', help: 'Helped', provide: 'Provided',
  own: 'Owned', handle: 'Handled', participate: 'Participated',
  contribute: 'Contributed', plan: 'Planned', monitor: 'Monitored',
  troubleshoot: 'Troubleshot', document: 'Documented', review: 'Reviewed',
  present: 'Presented', report: 'Reported',
}

export interface ParsedJobDescription {
  title: string | null
  requirements: string[]
  responsibilities: string[]
  skills: string[]
  experienceYears: string | null
  topPhrases: string[]
  allLines: string[]
}

function cleanLine(line: string): string {
  return line
    .replace(/^[\s•●▪◦‣⁃\-*–—]+/, '')
    .replace(/^\d+[.)]\s*/, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function isJunkLine(line: string): boolean {
  const lower = line.toLowerCase()
  if (line.length < 12 || line.length > 280) return true
  if (/^(https?:|www\.|apply|salary|benefits|equal opportunity|eeo|location|remote|hybrid|full[\s-]time)/i.test(line)) return true
  if (/^we (are|offer|provide|believe)/i.test(line)) return true
  if (/^about (us|the company)/i.test(line)) return true
  const words = lower.split(/\s+/).filter((w) => w.length > 2)
  if (words.length < 3) return true
  const genericRatio = words.filter((w) => GENERIC_JD_WORDS.has(w)).length / words.length
  return genericRatio > 0.55
}

function uniqueLines(lines: string[]): string[] {
  const seen = new Set<string>()
  return lines.filter((line) => {
    const key = line.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (seen.has(key) || key.length < 10) return false
    seen.add(key)
    return true
  })
}

export function extractAllJobLines(jd: string): string[] {
  const normalized = jd.replace(/\r\n/g, '\n').trim()
  const collected: string[] = []

  const inlineBlocks = normalized.matchAll(
    /(?:key\s+)?(?:responsibilities|requirements|qualifications|what you(?:'ll| will) do|must[\s-]haves?|skills?(?:\s+required)?)\s*[:\-–]\s*([^\n]+(?:\n(?![A-Z][^\n]{2,30}:)[^\n]+)*)/gi,
  )
  for (const match of inlineBlocks) {
    const block = match[1]
    block.split(/[•●▪]|\n\s*[-*]\s+/).forEach((part) => {
      const cleaned = cleanLine(part)
      if (!isJunkLine(cleaned)) collected.push(cleaned)
    })
  }

  normalized.split(/[•●▪]/).forEach((part) => {
    const cleaned = cleanLine(part)
    if (!isJunkLine(cleaned)) collected.push(cleaned)
  })

  normalized.split('\n').forEach((line) => {
    const cleaned = cleanLine(line)
    if (!isJunkLine(cleaned)) collected.push(cleaned)
  })

  normalized.split(/(?<=[.!?])\s+/).forEach((sentence) => {
    const cleaned = cleanLine(sentence)
    if (!isJunkLine(cleaned) && (ACTION_VERB_START.test(cleaned) || cleaned.length >= 40)) {
      collected.push(cleaned)
    }
  })

  return uniqueLines(collected)
}

function splitIntoSections(jd: string): Map<string, string> {
  const sections = new Map<string, string>()
  const lines = jd.split(/\n/)
  let currentKey = 'intro'
  let buffer: string[] = []

  function flush() {
    if (buffer.length > 0) sections.set(currentKey, buffer.join('\n'))
    buffer = []
  }

  for (const raw of lines) {
    const line = raw.trim()
    if (SECTION_HEADERS.test(line)) {
      flush()
      currentKey = line.replace(/[:\-–]/g, '').trim().toLowerCase()
      continue
    }
    if (line) buffer.push(line)
  }
  flush()
  return sections
}

function extractBullets(block: string): string[] {
  const lines: string[] = []
  block.split(/[•●▪]|\n\s*[-*]\s+/).forEach((part) => {
    const cleaned = cleanLine(part)
    if (!isJunkLine(cleaned)) lines.push(cleaned)
  })
  block.split('\n').forEach((line) => {
    const cleaned = cleanLine(line)
    if (!isJunkLine(cleaned)) lines.push(cleaned)
  })
  return uniqueLines(lines)
}

export function extractJobTitle(jd: string): string | null {
  const patterns = [
    /(?:job title|position|role)\s*[:\-–]\s*([^\n]{3,70})/i,
    /(?:hiring|seeking|looking for)\s+(?:a|an)\s+([^.!\n]{4,70})/i,
    /^([A-Z][A-Za-z]*(?:\s+[A-Z][A-Za-z]+){0,5}\s+(?:Developer|Engineer|Designer|Manager|Analyst|Specialist|Lead|Architect|Consultant|Coordinator|Administrator|Intern))/m,
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,4})$/m,
  ]

  for (const pattern of patterns) {
    const match = jd.match(pattern)
    if (match?.[1]) {
      const title = match[1].trim().replace(/\s{2,}/g, ' ')
      if (!/description|responsibilities|requirements|about|apply/i.test(title)) {
        return title.slice(0, 70)
      }
    }
  }

  const firstLine = jd.split('\n').map((l) => l.trim()).find((l) => l.length >= 5 && l.length <= 60)
  if (firstLine && !SECTION_HEADERS.test(firstLine) && !/description|apply now/i.test(firstLine)) {
    return firstLine
  }
  return null
}

function extractExperienceYears(jd: string): string | null {
  const match = jd.match(/(\d+)\+?\s*(?:to\s*\d+\+?\s*)?years?\s+(?:of\s+)?(?:experience|exp)/i)
  return match ? match[0] : null
}

function formatSkill(skill: string): string {
  const lower = skill.toLowerCase().trim()
  const map: Record<string, string> = {
    nodejs: 'Node.js', 'node.js': 'Node.js', nextjs: 'Next.js', 'next.js': 'Next.js',
    react: 'React', 'react native': 'React Native', typescript: 'TypeScript',
    javascript: 'JavaScript', graphql: 'GraphQL', postgresql: 'PostgreSQL',
    mongodb: 'MongoDB', aws: 'AWS', azure: 'Azure', gcp: 'GCP', 'ci/cd': 'CI/CD',
    html: 'HTML', css: 'CSS', sql: 'SQL', api: 'API', rest: 'REST', 'ui/ux': 'UI/UX',
    seo: 'SEO', php: 'PHP', 'c++': 'C++', 'c#': 'C#',
  }
  return map[lower] ?? (lower.length <= 4 ? lower.toUpperCase() : lower.charAt(0).toUpperCase() + lower.slice(1))
}

function extractSkillsFromText(text: string): string[] {
  const found = new Set<string>()

  for (const skill of KNOWN_SKILLS) {
    const pattern = new RegExp(`\\b${skill.replace(/[.+/]/g, '\\$&')}\\b`, 'i')
    if (pattern.test(text)) found.add(formatSkill(skill))
  }

  const listPatterns = [
    /(?:skills?|technologies|tech stack|tools?|proficien(?:t|cy) in|experience with|knowledge of|familiar(?:ity)? with)\s*[:\-–]?\s*([^\n.]{8,250})/gi,
    /(?:including|such as|like)\s+([^\n.]{8,180})/gi,
  ]

  for (const pattern of listPatterns) {
    let match: RegExpExecArray | null
    while ((match = pattern.exec(text)) !== null) {
      match[1].split(/[,;|/•]/).forEach((part) => {
        const cleaned = part.trim().replace(/^(and|or)\s+/i, '')
        if (cleaned.length >= 2 && cleaned.length <= 35 && !GENERIC_JD_WORDS.has(cleaned.toLowerCase())) {
          found.add(formatSkill(cleaned))
        }
      })
    }
  }

  return [...found]
}

export function parseJobDescription(jd: string): ParsedJobDescription {
  const sections = splitIntoSections(jd)
  const allLines = extractAllJobLines(jd)

  const requirements = uniqueLines([
    ...(sections.get('requirements') ? extractBullets(sections.get('requirements')!) : []),
    ...(sections.get('qualifications') ? extractBullets(sections.get('qualifications')!) : []),
    ...(sections.get('must have') ? extractBullets(sections.get('must have')!) : []),
    ...(sections.get('must-have') ? extractBullets(sections.get('must-have')!) : []),
  ])

  const responsibilities = uniqueLines([
    ...(sections.get('responsibilities') ? extractBullets(sections.get('responsibilities')!) : []),
    ...(sections.get('what you will do') ? extractBullets(sections.get('what you will do')!) : []),
    ...(sections.get("what you'll do") ? extractBullets(sections.get("what you'll do")!) : []),
    ...allLines.filter((l) => ACTION_VERB_START.test(l)),
  ])

  const skills = extractSkillsFromText(jd)

  const topPhrases = uniqueLines([
    ...responsibilities,
    ...requirements,
    ...allLines,
  ]).slice(0, 12)

  return {
    title: extractJobTitle(jd),
    requirements: requirements.slice(0, 8),
    responsibilities: responsibilities.slice(0, 8),
    skills: [...new Set(skills)],
    experienceYears: extractExperienceYears(jd),
    topPhrases,
    allLines,
  }
}

export function resumeHasTerm(resumeText: string, term: string): boolean {
  const lower = resumeText.toLowerCase()
  const normalized = term.toLowerCase().replace(/\./g, '')
  return lower.includes(term.toLowerCase()) || lower.replace(/\./g, '').includes(normalized)
}

export function getMissingSkills(jdSkills: string[], resumeText: string): string[] {
  return jdSkills.filter((skill) => !resumeHasTerm(resumeText, skill))
}

function significantWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !GENERIC_JD_WORDS.has(w))
}

export function lineCoveredByResume(line: string, resumeText: string): boolean {
  const words = significantWords(line)
  if (words.length === 0) return false
  const resumeLower = resumeText.toLowerCase()
  const matched = words.filter((w) => resumeLower.includes(w)).length
  return matched / words.length >= 0.45
}

export function getUncoveredJobLines(parsed: ParsedJobDescription, resumeText: string): string[] {
  const pool = uniqueLines([
    ...parsed.responsibilities,
    ...parsed.requirements,
    ...parsed.topPhrases,
    ...parsed.allLines,
  ])
  return pool.filter((line) => !lineCoveredByResume(line, resumeText)).slice(0, 6)
}

function conjugateRestVerbs(text: string): string {
  return text
    .replace(/\band\s+implement\b/gi, 'and implemented')
    .replace(/\band\s+develop\b/gi, 'and developed')
    .replace(/\band\s+design\b/gi, 'and designed')
    .replace(/\band\s+build\b/gi, 'and built')
    .replace(/\band\s+manage\b/gi, 'and managed')
    .replace(/\band\s+maintain\b/gi, 'and maintained')
    .replace(/\band\s+optimize\b/gi, 'and optimized')
    .replace(/\band\s+create\b/gi, 'and created')
    .replace(/\bto\s+ensure\b/gi, 'to ensured')
    .replace(/\busing\b/gi, 'using')
}

function toPastTenseBullet(line: string): string {
  let cleaned = cleanLine(line).replace(/\.$/, '')
  cleaned = cleaned.replace(/^(?:you will|you'll|we need you to|ability to)\s+/i, '')

  const words = cleaned.split(/\s+/)
  const firstRaw = words[0]?.toLowerCase() ?? ''
  const first = firstRaw.replace(/ing$/, '').replace(/e$/, (m) => (firstRaw.endsWith('ing') ? '' : m))

  let verb = VERB_MAP[firstRaw.replace(/ing$/, '')] ?? VERB_MAP[first]
  if (!verb && firstRaw.endsWith('ing')) {
    const base = firstRaw.slice(0, -3)
    verb = VERB_MAP[base] ?? `${base.charAt(0).toUpperCase()}${base.slice(1)}ed`
  }
  if (!verb) verb = 'Delivered'

  const rest = conjugateRestVerbs(words.slice(1).join(' '))
  const sentence = `${verb} ${rest.charAt(0).toLowerCase()}${rest.slice(1)}`
  return sentence.charAt(0).toUpperCase() + sentence.slice(1)
}

function extractTechFromLine(line: string): string[] {
  const found: string[] = []
  for (const skill of KNOWN_SKILLS) {
    const pattern = new RegExp(`\\b${skill.replace(/[.+/]/g, '\\$&')}\\b`, 'i')
    if (pattern.test(line)) found.push(formatSkill(skill))
  }
  return found
}

export function jdLineToResumeBullet(line: string, contextSkills: string[]): string {
  const past = toPastTenseBullet(line)
  const lineTech = extractTechFromLine(line)
  const skills = [...new Set([...lineTech, ...contextSkills])].slice(0, 3)

  let result = past.replace(/\.$/, '')
  if (skills.length > 0 && !skills.some((s) => result.toLowerCase().includes(s.toLowerCase()))) {
    result += ` using ${skills.join(', ')}`
  }

  if (/\d+%|\$\d|\d+\s*(users|clients|customers|projects)/i.test(result)) {
    return result.endsWith('.') ? result : `${result}.`
  }

  return `${result}, achieving [X]% improvement in [metric] and [Y] measurable outcome.`
}

export function buildTailoredSummary(
  title: string,
  missingSkills: string[],
  matchedSkills: string[],
  experienceYears: string | null,
  uncoveredLines: string[],
): string {
  const strengths = matchedSkills.slice(0, 5)
  const toHighlight = missingSkills.slice(0, 3)
  const expPart = experienceYears ? ` with ${experienceYears}` : ''

  let line = `${title}${expPart}.`

  if (strengths.length) {
    line += ` Proficient in ${strengths.join(', ')}.`
  }

  if (uncoveredLines[0]) {
    const phrase = uncoveredLines[0].replace(/\.$/, '').toLowerCase()
    line += ` Experienced in ${phrase}.`
  }

  if (toHighlight.length) {
    line += ` Skilled at applying ${toHighlight.join(', ')} to deliver business results.`
  } else {
    line += ' Committed to delivering measurable results and collaborating with cross-functional teams.'
  }

  return line.replace(/\s{2,}/g, ' ').trim()
}

export function filterQualityKeywords(keywords: string[]): string[] {
  return keywords.filter((kw) => {
    const lower = kw.toLowerCase()
    if (GENERIC_JD_WORDS.has(lower)) return false
    if (lower.length < 4) return false
    if (/^\d+$/.test(lower)) return false
    return true
  })
}
