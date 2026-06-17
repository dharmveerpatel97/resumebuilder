import { PAPER_WIDTH_MM } from '../components/PreviewScaler'
import { getFontOption, type ResumeFontFamilyId } from '../data/typography'

const MM_TO_PX = 96 / 25.4
const COMPACT_PAD_Y_MM = 6
const COMPACT_PAD_X_MM = 8
const STANDARD_PAD_MM = 10

const FALLBACK_FONT_LINK =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'

const EXPORT_BASE = `
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    box-sizing: border-box;
  }
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: auto !important;
    height: auto !important;
    background: #ffffff !important;
  }
  .resume-paper {
    width: ${PAPER_WIDTH_MM}mm !important;
    max-width: ${PAPER_WIDTH_MM}mm !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    overflow: visible !important;
    background: #ffffff !important;
    background-image: none !important;
  }
  .resume-px,
  .resume-py,
  .resume-pt,
  .resume-pb {
    padding: 0 !important;
  }
`

function buildExportStyles(compactLayout: boolean, standardPadded: boolean): string {
  if (compactLayout) {
    return `${EXPORT_BASE}
  .resume-p,
  .resume-px,
  .resume-py,
  .resume-pt,
  .resume-pb {
    padding: 0 !important;
  }
  .resume-p-compact {
    padding: ${COMPACT_PAD_Y_MM}mm ${COMPACT_PAD_X_MM}mm !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }`
  }

  if (standardPadded) {
    return `${EXPORT_BASE}
  .resume-p-compact {
    padding: 0 !important;
  }
  .resume-p {
    padding: ${STANDARD_PAD_MM}mm !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }`
  }

  return `${EXPORT_BASE}
  .resume-p,
  .resume-p-compact {
    padding: 0 !important;
  }`
}

export function cleanResumeClone(paperElement: HTMLElement): HTMLElement {
  const clone = paperElement.cloneNode(true) as HTMLElement
  clone.classList.remove('resume-paper-preview')
  clone.style.boxShadow = 'none'
  clone.style.borderRadius = '0'
  clone.style.backgroundImage = 'none'
  clone.style.width = `${PAPER_WIDTH_MM}mm`
  clone.style.maxWidth = `${PAPER_WIDTH_MM}mm`

  clone.querySelectorAll('[data-page-pad]').forEach((node) => {
    const el = node as HTMLElement
    el.style.marginTop = ''
    el.removeAttribute('data-page-pad')
  })

  return clone
}

function fontLinkTag(fontId: ResumeFontFamilyId): string {
  const url = getFontOption(fontId).googleFontUrl ?? FALLBACK_FONT_LINK
  return `<link rel="stylesheet" href="${url}" />`
}

function collectStylesheets(fontId: ResumeFontFamilyId): string {
  const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .map((link) => {
      const href = (link as HTMLLinkElement).href
      return href ? `<link rel="stylesheet" href="${href}" />` : ''
    })
    .filter(Boolean)
    .join('')

  const inline = Array.from(document.querySelectorAll('style'))
    .map((s) => s.outerHTML)
    .join('')

  return `${links}${fontLinkTag(fontId)}${inline}`
}

function waitForExportReady(doc: Document): Promise<void> {
  const links = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'))

  const linkLoads = links.map(
    (link) =>
      new Promise<void>((resolve) => {
        const el = link as HTMLLinkElement
        if (el.sheet) {
          resolve()
          return
        }
        el.addEventListener('load', () => resolve(), { once: true })
        el.addEventListener('error', () => resolve(), { once: true })
      }),
  )

  return Promise.all(linkLoads).then(async () => {
    await doc.fonts?.ready
    await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)))
    await new Promise((resolve) => setTimeout(resolve, 200))
  })
}

export interface ResumeExportContext {
  clone: HTMLElement
  cleanup: () => void
  /** Padding is baked into the DOM (preview-style) — PDF margin should be 0 */
  paddedLayout: boolean
}

/** Render resume in an isolated iframe so export matches the styled preview. */
export async function prepareResumeExport(paperElement: HTMLElement): Promise<ResumeExportContext> {
  const clone = cleanResumeClone(paperElement)
  const compactLayout = Boolean(paperElement.querySelector('.resume-p-compact'))
  const standardPadded = Boolean(paperElement.querySelector('.resume-template-root.resume-p'))
  const paddedLayout = compactLayout || standardPadded
  const fontId = (paperElement.dataset.font ?? 'inter') as ResumeFontFamilyId

  const iframe = document.createElement('iframe')
  iframe.setAttribute('aria-hidden', 'true')
  iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;'
  document.body.appendChild(iframe)

  const doc = iframe.contentDocument ?? iframe.contentWindow?.document
  if (!doc) {
    document.body.removeChild(iframe)
    throw new Error('Could not create export frame')
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title></title>
  ${collectStylesheets(fontId)}
  <style>${buildExportStyles(compactLayout, standardPadded)}</style>
</head>
<body></body>
</html>`

  doc.open()
  doc.write(html)
  doc.close()
  doc.body.appendChild(clone)

  await waitForExportReady(doc)

  const cleanup = () => {
    if (iframe.parentNode) document.body.removeChild(iframe)
  }

  return { clone, cleanup, paddedLayout }
}

export function getExportWidthPx() {
  return Math.round(PAPER_WIDTH_MM * MM_TO_PX)
}
