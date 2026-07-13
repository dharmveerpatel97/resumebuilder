import html2pdf from 'html2pdf.js'
import { getExportWidthPx, prepareResumeExport } from './prepareResumeExport'

/** Download resume as PDF — same layout/padding as live preview, no browser headers. */
export async function downloadResumePdf(
  paperElement: HTMLElement,
  filename: string,
): Promise<void> {
  const { clone, cleanup } = await prepareResumeExport(paperElement)
  const widthPx = getExportWidthPx()

  try {
    await html2pdf()
      .set({
        // Padding is already in the resume DOM (same as preview) — do not add PDF margins
        margin: 0,
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: widthPx,
          windowWidth: widthPx,
          scrollX: 0,
          scrollY: 0,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        },
      })
      .from(clone)
      .save()
  } finally {
    cleanup()
  }
}
