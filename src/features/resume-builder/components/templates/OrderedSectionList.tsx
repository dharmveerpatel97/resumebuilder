import { Fragment, type CSSProperties, type ReactNode } from 'react'
import type { ResumeSectionId } from '../../types/resume.types'
import { normalizeSectionEnabled, normalizeSectionOrder } from '../../data/sectionOrder'

export function OrderedSectionList({
  order,
  enabled,
  onlySections,
  sections,
  className,
  style,
}: {
  order: ResumeSectionId[] | undefined
  enabled?: Partial<Record<ResumeSectionId, boolean>>
  onlySections?: ResumeSectionId[]
  sections: Partial<Record<ResumeSectionId, ReactNode>>
  className?: string
  style?: CSSProperties
}) {
  const flags = normalizeSectionEnabled(enabled)
  let resolved = normalizeSectionOrder(order)
  if (onlySections?.length) {
    const allowed = new Set(onlySections)
    resolved = resolved.filter((id) => allowed.has(id))
    for (const id of onlySections) {
      if (!resolved.includes(id)) resolved.push(id)
    }
  }

  return (
    <div className={className} style={style}>
      {resolved.map((id) => {
        if (!flags[id]) return null
        const node = sections[id]
        if (!node) return null
        return <Fragment key={id}>{node}</Fragment>
      })}
    </div>
  )
}
