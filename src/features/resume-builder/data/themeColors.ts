export interface ResumeTheme {
  heading: string
  subheading: string
  body: string
}

export interface ThemePreset {
  id: string
  name: string
  theme: ResumeTheme
}

export const themePresets: ThemePreset[] = [
  {
    id: 'teal',
    name: 'Teal',
    theme: { heading: '#0f766e', subheading: '#374151', body: '#4b5563' },
  },
  {
    id: 'blue',
    name: 'Blue',
    theme: { heading: '#1d4ed8', subheading: '#374151', body: '#4b5563' },
  },
  {
    id: 'indigo',
    name: 'Indigo',
    theme: { heading: '#4338ca', subheading: '#374151', body: '#4b5563' },
  },
  {
    id: 'purple',
    name: 'Purple',
    theme: { heading: '#6d28d9', subheading: '#374151', body: '#4b5563' },
  },
  {
    id: 'rose',
    name: 'Rose',
    theme: { heading: '#be123c', subheading: '#374151', body: '#4b5563' },
  },
  {
    id: 'orange',
    name: 'Orange',
    theme: { heading: '#c2410c', subheading: '#374151', body: '#4b5563' },
  },
  {
    id: 'green',
    name: 'Green',
    theme: { heading: '#15803d', subheading: '#374151', body: '#4b5563' },
  },
  {
    id: 'navy',
    name: 'Navy',
    theme: { heading: '#0f172a', subheading: '#475569', body: '#64748b' },
  },
  {
    id: 'charcoal',
    name: 'Charcoal',
    theme: { heading: '#1f2937', subheading: '#4b5563', body: '#6b7280' },
  },
]

export function getThemePresetById(id: string): ThemePreset {
  return themePresets.find((p) => p.id === id) ?? themePresets[0]
}

export function getThemeFromPresetId(id: string): ResumeTheme {
  return { ...getThemePresetById(id).theme }
}

export function hexToRgba(hex: string, alpha: number): string {
  const value = hex.replace('#', '')
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function themeLightBg(theme: ResumeTheme): string {
  return hexToRgba(theme.heading, 0.12)
}
