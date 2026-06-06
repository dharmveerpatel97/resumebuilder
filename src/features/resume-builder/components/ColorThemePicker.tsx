import type { ResumeTheme } from '../data/themeColors'
import { themePresets } from '../data/themeColors'

interface ColorThemePickerProps {
  theme: ResumeTheme
  presetId: string
  onPresetChange: (presetId: string) => void
  onThemeChange: (theme: ResumeTheme) => void
}

const colorFields: { key: keyof ResumeTheme; label: string; hint: string }[] = [
  { key: 'heading', label: 'Heading', hint: 'Name, section titles, accents' },
  { key: 'subheading', label: 'Subheading', hint: 'Job titles, companies, dates' },
  { key: 'body', label: 'Body', hint: 'Descriptions and paragraph text' },
]

export function ColorThemePicker({
  theme,
  presetId,
  onPresetChange,
  onThemeChange,
}: ColorThemePickerProps) {
  const updateColor = (key: keyof ResumeTheme, value: string) => {
    onThemeChange({ ...theme, [key]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-text-dark mb-2">Presets</p>
        <div className="flex flex-wrap gap-2">
          {themePresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onPresetChange(preset.id)}
              title={preset.name}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all cursor-pointer ${
                presetId === preset.id
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-border bg-white hover:border-primary/30'
              }`}
            >
              <span className="flex -space-x-1">
                <span
                  className="h-4 w-4 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: preset.theme.heading }}
                />
                <span
                  className="h-4 w-4 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: preset.theme.subheading }}
                />
                <span
                  className="h-4 w-4 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: preset.theme.body }}
                />
              </span>
              <span className="text-text-dark font-medium">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-text-dark mb-2">Custom Colors</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {colorFields.map(({ key, label, hint }) => (
            <label
              key={key}
              className="flex items-center gap-3 rounded-xl border border-border bg-white p-3 cursor-pointer hover:border-primary/30 transition-colors"
            >
              <input
                type="color"
                value={theme[key]}
                onChange={(e) => updateColor(key, e.target.value)}
                className="h-10 w-10 shrink-0 rounded-lg border border-border cursor-pointer p-0.5"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-dark">{label}</p>
                <p className="text-xs text-text-muted truncate">{hint}</p>
                <p className="text-xs text-text-body font-mono mt-0.5 uppercase">
                  {theme[key]}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
