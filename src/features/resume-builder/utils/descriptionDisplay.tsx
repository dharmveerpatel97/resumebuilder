import type { CSSProperties, ReactNode } from 'react'
import type { TemplateId } from '../types/resume.types'

export type DescriptionMarker = 'bullet' | 'arrow' | 'dash' | 'none'

const MARKER_CHAR: Record<Exclude<DescriptionMarker, 'none'>, string> = {
  bullet: '•',
  arrow: '▸',
  dash: '–',
}

/** Split description into list items (newlines, bullets, semicolons, or sentences). */
export function parseDescriptionLines(text: string): string[] {
  const trimmed = text.trim()
  if (!trimmed) return []

  const byNewline = trimmed
    .split(/\n+/)
    .map((l) => l.replace(/^[\s•▸\-–—*]+\s*/, '').trim())
    .filter(Boolean)
  if (byNewline.length > 1) return byNewline

  const bySemi = trimmed.split(/;\s+/).map((s) => s.trim()).filter((s) => s.length > 8)
  if (bySemi.length > 1) return bySemi

  const sentences = trimmed.match(/[^.!?]+[.!?]+/g)
  if (sentences && sentences.length > 1 && trimmed.length > 100) {
    return sentences.map((s) => s.trim())
  }

  return [trimmed]
}

const TEMPLATE_MARKERS: Partial<Record<TemplateId, DescriptionMarker>> = {
  modern: 'arrow',
  professional: 'bullet',
  webDesigner: 'bullet',
  fresherTable: 'arrow',
  fresherSimple: 'arrow',
  fresherModern: 'arrow',
  fresherIntern: 'arrow',
  compactPro: 'bullet',
}

export function getDescriptionMarker(
  templateId: TemplateId,
  useBulletPoints = true,
): DescriptionMarker {
  if (!useBulletPoints) return 'none'
  return TEMPLATE_MARKERS[templateId] ?? 'bullet'
}

export function DescriptionList({
  text,
  style,
  marker,
  accentColor,
}: {
  text: string
  style: CSSProperties
  marker: DescriptionMarker
  accentColor?: string
}): ReactNode {
  if (!text.trim() || marker === 'none') return null

  const items = parseDescriptionLines(text)
  const char = MARKER_CHAR[marker]
  const color = accentColor ?? style.color

  return (
    <ul className="mt-1 flex flex-col gap-0.5" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-1.5 items-start" style={style}>
          <span className="shrink-0" style={{ color, lineHeight: 'inherit' }}>{char}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function renderDescription(
  text: string,
  style: CSSProperties,
  marker: DescriptionMarker,
  accentColor?: string,
  paragraphClassName = 'mt-1',
): ReactNode {
  if (!text.trim()) return null
  if (marker === 'none') {
    return <p className={paragraphClassName} style={style}>{text}</p>
  }
  return <DescriptionList text={text} style={style} marker={marker} accentColor={accentColor} />
}
