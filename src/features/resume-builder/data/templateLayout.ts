import type { ResumeSectionId, TemplateId } from '../types/resume.types'
import { DEFAULT_SECTION_ORDER } from './sectionOrder'

/** Sections fixed in the left/sidebar column — not reorderable */
export const TEMPLATE_SIDEBAR_SECTIONS: Partial<Record<TemplateId, ResumeSectionId[]>> = {
  classic: ['skills', 'education'],
  marketingTimeline: ['summary', 'skills'],
  executiveNavy: ['skills'],
  studentPurple: ['skills'],
  accountant: ['skills'],
  fresherClassic: ['skills'],
  gridInterior: ['summary', 'skills', 'education'],
  graphicDesigner: ['education', 'skills'],
}

/** Sections in the main/right column — user can reorder these */
export function getMainSections(templateId: TemplateId): ResumeSectionId[] {
  const sidebar = new Set(TEMPLATE_SIDEBAR_SECTIONS[templateId] ?? [])
  return DEFAULT_SECTION_ORDER.filter((id) => !sidebar.has(id))
}

export function getReorderableSections(templateId: TemplateId): ResumeSectionId[] {
  return getMainSections(templateId)
}

export function hasSidebarLayout(templateId: TemplateId): boolean {
  return Boolean(TEMPLATE_SIDEBAR_SECTIONS[templateId]?.length)
}

export function filterOrderForMain(
  order: ResumeSectionId[] | undefined,
  templateId: TemplateId,
): ResumeSectionId[] {
  const main = new Set(getMainSections(templateId))
  const result: ResumeSectionId[] = []
  const seen = new Set<ResumeSectionId>()
  for (const id of order ?? []) {
    if (main.has(id) && !seen.has(id)) {
      seen.add(id)
      result.push(id)
    }
  }
  for (const id of getMainSections(templateId)) {
    if (!seen.has(id)) {
      seen.add(id)
      result.push(id)
    }
  }
  return result
}
