import { FONT_FAMILY_OPTIONS, FONT_SIZE_OPTIONS } from '../data/typography'
import type { ResumeFontFamilyId, ResumeTypography, TextStyle } from '../data/typography'

interface TypographyPickerProps {
  typography: ResumeTypography
  onChange: (typography: ResumeTypography) => void
}

const roles: { key: keyof Pick<ResumeTypography, 'heading' | 'subheading' | 'body'>; label: string; hint: string }[] = [
  { key: 'heading', label: 'Heading', hint: 'Name and section titles' },
  { key: 'subheading', label: 'Subheading', hint: 'Roles, companies, degrees' },
  { key: 'body', label: 'Body', hint: 'Descriptions and details' },
]

export function TypographyPicker({ typography, onChange }: TypographyPickerProps) {
  const updateRole = (key: keyof Pick<ResumeTypography, 'heading' | 'subheading' | 'body'>, patch: Partial<TextStyle>) => {
    onChange({
      ...typography,
      [key]: { ...typography[key], ...patch },
    })
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-white p-4">
        <p className="text-sm font-medium text-text-dark">Font family</p>
        <p className="text-xs text-text-muted mb-3">Applied to the entire resume — preview and PDF</p>
        <select
          value={typography.fontFamily}
          onChange={(e) =>
            onChange({ ...typography, fontFamily: e.target.value as ResumeFontFamilyId })
          }
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          style={{ fontFamily: FONT_FAMILY_OPTIONS.find((f) => f.id === typography.fontFamily)?.stack }}
        >
          {FONT_FAMILY_OPTIONS.map((font) => (
            <option key={font.id} value={font.id} style={{ fontFamily: font.stack }}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {roles.map(({ key, label, hint }) => (
        <div
          key={key}
          className="rounded-xl border border-border bg-white p-4 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 sm:items-center"
        >
          <div>
            <p className="text-sm font-medium text-text-dark">{label}</p>
            <p className="text-xs text-text-muted">{hint}</p>
          </div>

          <label className="flex items-center gap-2 text-sm text-text-body">
            <span className="text-text-muted shrink-0">Size</span>
            <select
              value={typography[key].fontSize}
              onChange={(e) => updateRole(key, { fontSize: Number(e.target.value) })}
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              {FONT_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}px
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm text-text-body cursor-pointer justify-start sm:justify-end">
            <input
              type="checkbox"
              checked={typography[key].bold}
              onChange={(e) => updateRole(key, { bold: e.target.checked })}
              className="rounded border-border text-primary focus:ring-primary/20"
            />
            Bold
          </label>
        </div>
      ))}
    </div>
  )
}
