import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Download, FileText, Save, ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from '../../components/ui'
import { calcFitZoom, PreviewScaler } from './components/PreviewScaler'
import { ResumeForm } from './components/ResumeForm'
import { ResumePreview } from './components/ResumePreview'
import { SavedResumesList } from './components/SavedResumesList'
import { TemplateThumbnail } from './components/TemplateThumbnail'
import { emptyResumeData, predefinedTemplates, templatesByCategory } from './data/templates'
import { normalizeSectionEnabled, normalizeSectionOrder } from './data/sectionOrder'
import { normalizeResumeData } from './utils/normalizeResumeData'
import { getThemeFromPresetId } from './data/themeColors'
import type { ResumeTheme } from './data/themeColors'
import { defaultSpacing } from './data/spacing'
import type { ResumeSpacing } from './data/spacing'
import { defaultTypography, loadResumeFont, mergeTypography } from './data/typography'
import type { ResumeTypography } from './data/typography'
import type { ResumeData, SavedResume, TemplateId } from './types/resume.types'
import { downloadResumePdf } from './utils/downloadResumePdf'
import {
  deleteSavedResume,
  getSavedResumes,
  saveResume,
} from './utils/savedResumes'

export function ResumeBuilderPage() {
  const [templateId, setTemplateId] = useState<TemplateId>('classic')
  const [theme, setTheme] = useState<ResumeTheme>(() => getThemeFromPresetId('teal'))
  const [presetId, setPresetId] = useState('teal')
  const [typography, setTypography] = useState<ResumeTypography>(() => structuredClone(defaultTypography))
  const [spacing, setSpacing] = useState<ResumeSpacing>(() => structuredClone(defaultSpacing))
  const [resumeData, setResumeData] = useState<ResumeData>(emptyResumeData)
  const [showTemplatePicker, setShowTemplatePicker] = useState(true)
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>(() => getSavedResumes())
  const [currentSavedId, setCurrentSavedId] = useState<string | null>(null)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [zoom, setZoom] = useState(0.45)
  const [userAdjustedZoom, setUserAdjustedZoom] = useState(false)
  const [previewPageCount, setPreviewPageCount] = useState(1)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit')
  const exportRef = useRef<HTMLDivElement>(null)
  const previewContainerRef = useRef<HTMLDivElement>(null)

  const ZOOM_MIN = 0.28
  const ZOOM_MAX = 1.0
  const ZOOM_STEP = 0.05

  const applyFitZoom = useCallback(() => {
    const el = previewContainerRef.current
    if (!el) return
    setZoom(calcFitZoom(el.clientWidth, 24, ZOOM_MIN, ZOOM_MAX))
  }, [])

  useEffect(() => {
    const el = previewContainerRef.current
    if (!el) return

    const update = () => {
      if (!userAdjustedZoom) applyFitZoom()
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    window.addEventListener('orientationchange', update)

    return () => {
      observer.disconnect()
      window.removeEventListener('orientationchange', update)
    }
  }, [userAdjustedZoom, mobileTab, applyFitZoom])

  useEffect(() => {
    if (!saveMessage) return
    const timer = setTimeout(() => setSaveMessage(null), 2500)
    return () => clearTimeout(timer)
  }, [saveMessage])

  useEffect(() => {
    loadResumeFont(typography.fontFamily)
  }, [typography.fontFamily])

  useEffect(() => {
    if (showTemplatePicker) {
      setSavedResumes(getSavedResumes())
    }
  }, [showTemplatePicker])

  const zoomIn = () => {
    setUserAdjustedZoom(true)
    setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)))
  }
  const zoomOut = () => {
    setUserAdjustedZoom(true)
    setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)))
  }
  const resetZoom = () => {
    setUserAdjustedZoom(false)
    applyFitZoom()
  }

  const currentTemplate = predefinedTemplates.find((t) => t.id === templateId)

  const applyPreset = (id: string) => {
    setPresetId(id)
    setTheme(getThemeFromPresetId(id))
  }

  const handleTemplateChange = (id: TemplateId) => {
    setTemplateId(id)
    const template = predefinedTemplates.find((t) => t.id === id)
    if (template) {
      applyPreset(template.defaultThemeId)
      if (template.defaultFontFamily) {
        setTypography((prev) => ({ ...prev, fontFamily: template.defaultFontFamily! }))
      }
    }
  }

  const handleDownloadPdf = async () => {
    const el = exportRef.current
    if (!el || downloadingPdf) return
    setDownloadingPdf(true)
    try {
      const baseName = resumeData.personalInfo.fullName.trim() || 'Resume'
      await downloadResumePdf(el, `${baseName}.pdf`)
    } catch {
      setSaveMessage('PDF download failed. Please try again.')
    } finally {
      setDownloadingPdf(false)
    }
  }

  const loadTemplate = (id: TemplateId) => {
    const template = predefinedTemplates.find((t) => t.id === id)
    if (template) {
      setResumeData(normalizeResumeData({
        ...structuredClone(template.data),
        sectionOrder: normalizeSectionOrder(template.data.sectionOrder),
        sectionEnabled: normalizeSectionEnabled(template.data.sectionEnabled),
      }))
      setTemplateId(id)
      applyPreset(template.defaultThemeId)
      setTypography({
        ...structuredClone(defaultTypography),
        fontFamily: template.defaultFontFamily ?? defaultTypography.fontFamily,
      })
      setSpacing(structuredClone(defaultSpacing))
      setCurrentSavedId(null)
      setShowTemplatePicker(false)
    }
  }

  const startBlank = () => {
    setResumeData(emptyResumeData)
    applyPreset('teal')
    setTypography(structuredClone(defaultTypography))
    setSpacing(structuredClone(defaultSpacing))
    setCurrentSavedId(null)
    setShowTemplatePicker(false)
  }

  const loadSavedResume = (saved: SavedResume) => {
    setResumeData(structuredClone(saved.data))
    setTemplateId(saved.templateId)
    setTheme({ ...saved.theme })
    setPresetId(saved.presetId)
    setTypography(mergeTypography(saved.typography))
    setSpacing(structuredClone(saved.spacing ?? defaultSpacing))
    setCurrentSavedId(saved.id)
    setShowTemplatePicker(false)
  }

  const handleSave = () => {
    const saved = saveResume({
      id: currentSavedId,
      name: resumeData.personalInfo.fullName.trim() || 'Untitled Resume',
      templateId,
      presetId,
      theme,
      typography,
      spacing,
      data: resumeData,
    })
    setCurrentSavedId(saved.id)
    setSavedResumes(getSavedResumes())
    setSaveMessage(currentSavedId ? 'Resume updated!' : 'Resume saved!')
  }

  const handleDeleteSaved = (id: string) => {
    deleteSavedResume(id)
    if (currentSavedId === id) setCurrentSavedId(null)
    setSavedResumes(getSavedResumes())
  }

  if (showTemplatePicker) {
    return (
      <div className="min-h-screen bg-bg-gray">
        <header className="border-b border-border bg-white">
          <div className="section-container flex items-center justify-between py-4">
            <Link to="/" className="flex items-center gap-2 text-text-dark hover:text-primary transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-xl font-bold">Resume<span className="text-primary">AI</span></span>
            </Link>
          </div>
        </header>

        <div className="section-container section-padding">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-text-dark md:text-4xl">
              Choose a Template
            </h1>
            <p className="mt-3 text-text-body text-lg">
              Start with a pre-filled template or build from scratch
            </p>
          </div>

          {([
            {
              title: 'For Freshers & Interns',
              subtitle: 'Templates for students and entry-level candidates — education tables, career objectives & personal details',
              templates: templatesByCategory('fresher'),
            },
            {
              title: 'Professional Templates',
              subtitle: 'All existing templates for experienced professionals — nothing removed',
              templates: templatesByCategory('professional'),
            },
          ] as const).map((section) => (
            <div key={section.title} className="mb-14">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-text-dark">{section.title}</h2>
                <p className="text-text-body mt-1">{section.subtitle}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {section.templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => loadTemplate(template.id)}
                    className="group rounded-2xl border border-border bg-white overflow-hidden text-left transition-all duration-200 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <TemplateThumbnail
                      templateId={template.id}
                      data={template.data}
                      theme={getThemeFromPresetId(template.defaultThemeId)}
                    />
                    <div className="p-4 border-t border-border">
                      <h3 className="font-semibold text-text-dark text-lg">{template.name}</h3>
                      <p className="text-sm text-text-body mt-1 line-clamp-2">{template.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center mb-16">
            <Button variant="outline" size="lg" onClick={startBlank}>
              <FileText className="h-5 w-5" />
              Start from Blank
            </Button>
          </div>

          <div className="border-t border-border pt-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-text-dark">My Saved Resumes</h2>
              <p className="text-text-body mt-1">
                Open a resume you saved earlier — stored locally in your browser.
              </p>
            </div>
            <SavedResumesList
              resumes={savedResumes}
              onOpen={loadSavedResume}
              onDelete={handleDeleteSaved}
            />
          </div>
        </div>
      </div>
    )
  }

  const zoomControls = (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={zoomOut}
        disabled={zoom <= ZOOM_MIN}
        className="p-1.5 rounded-md border border-border bg-white text-text-body hover:text-primary hover:border-primary/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        title="Zoom out"
      >
        <ZoomOut className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={resetZoom}
        className="px-2 py-1 rounded-md border border-border bg-white text-xs text-text-body hover:text-primary hover:border-primary/30 transition-colors min-w-[48px] cursor-pointer"
        title="Reset zoom"
      >
        {Math.round(zoom * 100)}%
      </button>
      <button
        type="button"
        onClick={zoomIn}
        disabled={zoom >= ZOOM_MAX}
        className="p-1.5 rounded-md border border-border bg-white text-text-body hover:text-primary hover:border-primary/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        title="Zoom in"
      >
        <ZoomIn className="h-4 w-4" />
      </button>
    </div>
  )

  return (
    <div className="h-[100dvh] bg-bg-gray flex flex-col overflow-hidden">
      <header className="shrink-0 border-b border-border bg-white z-20">
        <div className="section-container flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              type="button"
              onClick={() => setShowTemplatePicker(true)}
              className="flex shrink-0 items-center gap-1 text-sm text-text-body hover:text-primary transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Templates
            </button>
            <span className="text-text-muted hidden sm:inline">|</span>
            <span className="text-sm font-medium text-text-dark truncate">
              {currentTemplate?.name ?? 'Template'}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
            {saveMessage && (
              <span className="text-sm text-green-600 font-medium w-full sm:w-auto text-center sm:text-left">
                {saveMessage}
              </span>
            )}
            <select
              value={templateId}
              onChange={(e) => handleTemplateChange(e.target.value as TemplateId)}
              className="flex-1 sm:flex-none rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer min-w-0"
            >
              {predefinedTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
            <Button variant="outline" onClick={handleSave} className="shrink-0">
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">
                {currentSavedId ? 'Update' : 'Save'}
              </span>
              <span className="sm:hidden">Save</span>
            </Button>
            <Button onClick={handleDownloadPdf} disabled={downloadingPdf} className="shrink-0">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">{downloadingPdf ? 'Generating…' : 'Download PDF'}</span>
              <span className="sm:hidden">{downloadingPdf ? '…' : 'PDF'}</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="lg:hidden shrink-0 flex border-b border-border bg-white">
        <button
          type="button"
          onClick={() => setMobileTab('edit')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors cursor-pointer ${
            mobileTab === 'edit'
              ? 'text-primary border-b-2 border-primary bg-bg-light-blue/50'
              : 'text-text-body'
          }`}
        >
          Edit Resume
        </button>
        <button
          type="button"
          onClick={() => {
            setMobileTab('preview')
            setUserAdjustedZoom(false)
          }}
          className={`flex-1 py-3 text-sm font-semibold transition-colors cursor-pointer ${
            mobileTab === 'preview'
              ? 'text-primary border-b-2 border-primary bg-bg-light-blue/50'
              : 'text-text-body'
          }`}
        >
          Preview
        </button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
        {/* Preview — full screen tab on mobile, right panel on desktop */}
        <div
          className={`order-1 lg:order-2 flex-col min-h-0 bg-bg-light-blue lg:border-l border-border lg:w-1/2 lg:h-full overflow-hidden ${
            mobileTab === 'preview' ? 'flex flex-1' : 'hidden lg:flex'
          }`}
        >
          <div className="shrink-0 flex items-center justify-between px-4 lg:px-6 py-2 lg:py-3 border-b border-border/60 bg-bg-light-blue">
            <p className="text-xs text-text-muted uppercase tracking-wider font-medium">
              Live Preview
              {previewPageCount > 1 && (
                <span className="normal-case ml-2 text-primary font-semibold">
                  · {previewPageCount} pages — scroll to see all
                </span>
              )}
            </p>
            {zoomControls}
          </div>

          <div
            ref={previewContainerRef}
            className="flex-1 min-h-0 overflow-auto overscroll-contain p-3 sm:p-4 lg:p-6 w-full"
          >
            <PreviewScaler zoom={zoom} onPageCountChange={setPreviewPageCount}>
              <ResumePreview
                ref={exportRef}
                data={resumeData}
                templateId={templateId}
                theme={theme}
                typography={typography}
                spacing={spacing}
              />
            </PreviewScaler>
          </div>
        </div>

        {/* Form — full screen tab on mobile, left panel on desktop */}
        <div
          className={`order-2 lg:order-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 lg:w-1/2 lg:border-r border-border bg-white ${
            mobileTab === 'edit' ? 'flex flex-1 flex-col' : 'hidden lg:flex lg:flex-1 lg:flex-col'
          }`}
        >
          <ResumeForm
            templateId={templateId}
            data={resumeData}
            onChange={setResumeData}
            theme={theme}
            presetId={presetId}
            typography={typography}
            onPresetChange={applyPreset}
            onThemeChange={(next) => {
              setTheme(next)
              setPresetId('custom')
            }}
            onTypographyChange={setTypography}
            spacing={spacing}
            onSpacingChange={setSpacing}
          />
        </div>
      </div>
    </div>
  )
}
