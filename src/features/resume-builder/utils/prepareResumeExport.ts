import { PAPER_HEIGHT_MM, PAPER_WIDTH_MM } from '../components/PreviewScaler'
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
    box-sizing: border-box !important;
  }
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: ${PAPER_WIDTH_MM}mm !important;
    min-width: ${PAPER_WIDTH_MM}mm !important;
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
`

function buildExportStyles(compactLayout: boolean, standardPadded: boolean): string {
  if (compactLayout) {
    return `${EXPORT_BASE}
  .resume-p-compact {
    padding: ${COMPACT_PAD_Y_MM}mm ${COMPACT_PAD_X_MM}mm !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }`
  }

  if (standardPadded) {
    return `${EXPORT_BASE}
  .resume-p {
    padding: ${STANDARD_PAD_MM}mm !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }
  .resume-px {
    padding-left: ${STANDARD_PAD_MM}mm !important;
    padding-right: ${STANDARD_PAD_MM}mm !important;
  }
  .resume-py {
    padding-top: ${STANDARD_PAD_MM}mm !important;
    padding-bottom: ${STANDARD_PAD_MM}mm !important;
  }
  .resume-pt { padding-top: ${STANDARD_PAD_MM}mm !important; }
  .resume-pb { padding-bottom: ${STANDARD_PAD_MM}mm !important; }`
  }

  return `${EXPORT_BASE}`
}

/** Bake padding + font as inline styles so PDF capture matches preview exactly. */
export function cleanResumeClone(paperElement: HTMLElement): HTMLElement {
  const clone = paperElement.cloneNode(true) as HTMLElement
  clone.classList.remove('resume-paper-preview')
  clone.style.boxShadow = 'none'
  clone.style.borderRadius = '0'
  clone.style.backgroundImage = 'none'
  clone.style.width = `${PAPER_WIDTH_MM}mm`
  clone.style.maxWidth = `${PAPER_WIDTH_MM}mm`
  clone.style.margin = '0'
  clone.style.padding = '0'
  clone.style.background = '#ffffff'

  const fontFamily = paperElement.style.fontFamily || getComputedStyle(paperElement).fontFamily
  if (fontFamily) clone.style.fontFamily = fontFamily

  clone.querySelectorAll('[data-page-pad]').forEach((node) => {
    const el = node as HTMLElement
    el.style.marginTop = ''
    el.removeAttribute('data-page-pad')
  })

  const compactRoot = clone.querySelector('.resume-p-compact') as HTMLElement | null
  if (compactRoot) {
    compactRoot.style.padding = `${COMPACT_PAD_Y_MM}mm ${COMPACT_PAD_X_MM}mm`
    compactRoot.style.boxSizing = 'border-box'
    compactRoot.style.width = '100%'
  }

  clone.querySelectorAll('.resume-template-root.resume-p').forEach((node) => {
    const el = node as HTMLElement
    if (el.classList.contains('resume-p-compact')) return
    el.style.padding = `${STANDARD_PAD_MM}mm`
    el.style.boxSizing = 'border-box'
    el.style.width = '100%'
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
    try {
      await doc.fonts?.ready
    } catch {
      /* ignore */
    }
    await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)))
    await new Promise((resolve) => setTimeout(resolve, 350))
  })
}

export interface ResumeExportContext {
  clone: HTMLElement
  cleanup: () => void
}

/** Render resume in a full-width offscreen iframe so layout matches the live preview. */
export async function prepareResumeExport(paperElement: HTMLElement): Promise<ResumeExportContext> {
  const clone = cleanResumeClone(paperElement)
  const compactLayout = Boolean(paperElement.querySelector('.resume-p-compact'))
  const standardPadded = Boolean(paperElement.querySelector('.resume-template-root.resume-p'))
  const fontId = (paperElement.dataset.font ?? 'inter') as ResumeFontFamilyId

  const iframe = document.createElement('iframe')
  iframe.setAttribute('aria-hidden', 'true')
  // Must have real width — 0×0 iframes break mm-based padding/layout
  iframe.style.cssText = [
    'position:fixed',
    'left:-12000px',
    'top:0',
    `width:${PAPER_WIDTH_MM}mm`,
    'min-height:297mm',
    'height:auto',
    'border:0',
    'opacity:0',
    'pointer-events:none',
  ].join(';')
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
  <meta name="viewport" content="width=${PAPER_WIDTH_MM}mm" />
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

  // Sync iframe height to full content so html2canvas captures everything
  const contentHeight = Math.max(clone.scrollHeight, clone.offsetHeight, PAPER_HEIGHT_MM * MM_TO_PX)
  iframe.style.height = `${contentHeight + 40}px`

  await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)))

  const cleanup = () => {
    if (iframe.parentNode) document.body.removeChild(iframe)
  }

  return { clone, cleanup }
}

export function getExportWidthPx() {
  return Math.round(PAPER_WIDTH_MM * MM_TO_PX)
}

export { COMPACT_PAD_X_MM, COMPACT_PAD_Y_MM, STANDARD_PAD_MM }
