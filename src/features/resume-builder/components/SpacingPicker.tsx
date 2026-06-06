import { SPACING_OPTIONS } from '../data/spacing'
import type { ResumeSpacing } from '../data/spacing'

interface SpacingPickerProps {
  spacing: ResumeSpacing
  onChange: (spacing: ResumeSpacing) => void
}

const controls: { key: keyof ResumeSpacing; label: string; hint: string }[] = [
  { key: 'sectionGap', label: 'Main Section Spacing', hint: 'Space between Summary, Experience, Education, etc.' },
  { key: 'itemGap', label: 'Sub-section Spacing', hint: 'Space between jobs, degrees, projects within a section' },
]

export function SpacingPicker({ spacing, onChange }: SpacingPickerProps) {
  const update = (key: keyof ResumeSpacing, value: number) => {
    onChange({ ...spacing, [key]: value })
  }

  return (
    <div className="space-y-4">
      {controls.map(({ key, label, hint }) => (
        <div
          key={key}
          className="rounded-xl border border-border bg-bg-gray/40 p-4 space-y-3"
        >
          <div>
            <p className="text-sm font-medium text-text-dark">{label}</p>
            <p className="text-xs text-text-muted">{hint}</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={SPACING_OPTIONS[0]}
              max={SPACING_OPTIONS[SPACING_OPTIONS.length - 1]}
              step={4}
              value={spacing[key]}
              onChange={(e) => update(key, Number(e.target.value))}
              className="flex-1 accent-primary cursor-pointer"
            />
            <select
              value={spacing[key]}
              onChange={(e) => update(key, Number(e.target.value))}
              className="w-20 rounded-lg border border-border bg-white px-2 py-1.5 text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              {SPACING_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}px
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  )
}
