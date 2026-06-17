import html2pdf from 'html2pdf.js'
import { getExportWidthPx, prepareResumeExport } from './prepareResumeExport'

const PAGE_MARGIN_MM = 10

/** Download resume as PDF — matches preview layout, no browser print headers. */
export async function downloadResumePdf(
  paperElement: HTMLElement,
  filename: string,
): Promise<void> {
  const { clone, cleanup, paddedLayout } = await prepareResumeExport(paperElement)
  const widthPx = getExportWidthPx()

  // Padded templates: spacing lives inside the DOM (same as preview). Others use PDF margins.
  const margin = paddedLayout ? 0 : PAGE_MARGIN_MM

  try {
    await html2pdf()
      .set({
        margin,
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          width: widthPx,
          windowWidth: widthPx,
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(clone)
      .save()
  } finally {
    cleanup()
  }
}
