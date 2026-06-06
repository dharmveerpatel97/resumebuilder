import { useState } from 'react'
import { ChevronDown, ChevronUp, GripVertical } from 'lucide-react'
import type { ResumeSectionId, TemplateId } from '../types/resume.types'
import {
  DEFAULT_SECTION_ENABLED,
  DEFAULT_SECTION_ORDER,
  SECTION_LABELS,
  normalizeSectionEnabled,
  normalizeSectionOrder,
} from '../data/sectionOrder'
import { getReorderableSections, hasSidebarLayout } from '../data/templateLayout'
import { FormSection } from './FormSection'

interface SectionOrderPickerProps {
  templateId: TemplateId
  order: ResumeSectionId[] | undefined
  enabled: Partial<Record<ResumeSectionId, boolean>> | undefined
  onOrderChange: (order: ResumeSectionId[]) => void
  onEnabledChange: (enabled: Record<ResumeSectionId, boolean>) => void
}

export function SectionOrderPicker({
  templateId,
  order,
  enabled,
  onOrderChange,
  onEnabledChange,
}: SectionOrderPickerProps) {
  const reorderable = getReorderableSections(templateId)
  const fullOrder = normalizeSectionOrder(order)
  const flags = normalizeSectionEnabled(enabled)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const resolved = [
    ...fullOrder.filter((id) => reorderable.includes(id)),
    ...reorderable.filter((id) => !fullOrder.includes(id)),
  ]

  const move = (from: number, to: number) => {
    if (to < 0 || to >= resolved.length || from === to) return
    const nextMain = [...resolved]
    const [item] = nextMain.splice(from, 1)
    nextMain.splice(to, 0, item)
    const sidebar = fullOrder.filter((id) => !reorderable.includes(id))
    onOrderChange([...sidebar, ...nextMain])
  }

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null)
      return
    }
    move(dragIndex, targetIndex)
    setDragIndex(null)
  }

  const toggle = (id: ResumeSectionId) => {
    onEnabledChange({ ...flags, [id]: !flags[id] })
  }

  const sidebarNote = hasSidebarLayout(templateId)

  return (
    <FormSection
      title="Section Order"
      subtitle={
        sidebarNote
          ? 'Left column is fixed for this template. Reorder & toggle right-side sections below.'
          : 'Check sections to show, drag to reorder on your resume'
      }
      defaultOpen
    >
      <ul className="space-y-2">
        {resolved.map((id, index) => (
          <li
            key={id}
            draggable={flags[id]}
            onDragStart={() => flags[id] && setDragIndex(index)}
            onDragEnd={() => setDragIndex(null)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(index)}
            className={`flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5 transition-colors ${
              flags[id] ? 'cursor-grab active:cursor-grabbing' : 'opacity-50'
            } ${dragIndex === index ? 'border-primary bg-bg-light-blue/40' : 'border-border'}`}
          >
            <input
              type="checkbox"
              checked={flags[id]}
              onChange={() => toggle(id)}
              className="h-4 w-4 shrink-0 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
            />
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-bg-gray text-xs font-bold text-text-dark">
              {index + 1}
            </span>
            <GripVertical className={`h-4 w-4 shrink-0 ${flags[id] ? 'text-text-muted' : 'text-text-muted/40'}`} />
            <span className="flex-1 text-sm font-medium text-text-dark">{SECTION_LABELS[id]}</span>
            <div className="flex shrink-0 gap-0.5">
              <button type="button" onClick={() => move(index, index - 1)} disabled={index === 0} className="p-1 rounded text-text-muted hover:text-primary disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed" title="Move up">
                <ChevronUp className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => move(index, index + 1)} disabled={index === resolved.length - 1} className="p-1 rounded text-text-muted hover:text-primary disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed" title="Move down">
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-3">
        <button type="button" onClick={() => onOrderChange([...DEFAULT_SECTION_ORDER])} className="text-xs text-text-muted hover:text-primary transition-colors cursor-pointer">Reset order</button>
        <button type="button" onClick={() => onEnabledChange({ ...DEFAULT_SECTION_ENABLED })} className="text-xs text-text-muted hover:text-primary transition-colors cursor-pointer">Enable all sections</button>
      </div>
    </FormSection>
  )
}
