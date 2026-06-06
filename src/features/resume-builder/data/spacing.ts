import type { CSSProperties } from 'react'

export interface ResumeSpacing {
  sectionGap: number
  itemGap: number
}

export const SPACING_OPTIONS = [0, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48]

export const defaultSpacing: ResumeSpacing = {
  sectionGap: 16,
  itemGap: 12,
}

export function mergeSpacing(partial?: Partial<ResumeSpacing> | ResumeSpacing | null): ResumeSpacing {
  if (!partial) return { ...defaultSpacing }
  return {
    sectionGap: partial.sectionGap ?? defaultSpacing.sectionGap,
    itemGap: partial.itemGap ?? defaultSpacing.itemGap,
  }
}

export function sectionGapStyle(spacing: ResumeSpacing): CSSProperties {
  return { gap: `${spacing.sectionGap}px` }
}

export function itemGapStyle(spacing: ResumeSpacing): CSSProperties {
  return { gap: `${spacing.itemGap}px` }
}
