import { useEffect, useRef, useState, type ReactNode } from 'react'

export const PAPER_WIDTH_MM = 210
export const PAPER_HEIGHT_MM = 297

const supportsZoom =
  typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('zoom', '1')

interface PreviewScalerProps {
  zoom: number
  children: ReactNode
  onPageCountChange?: (pages: number) => void
}

export function getPageCount(contentHeightPx: number) {
  const mmToPx = 96 / 25.4
  const pageHeightPx = PAPER_HEIGHT_MM * mmToPx
  return Math.max(1, Math.ceil(contentHeightPx / pageHeightPx))
}

export function PreviewScaler({ zoom, children, onPageCountChange }: PreviewScalerProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    const update = () => {
      const height = el.scrollHeight
      setContentHeight(height)
      onPageCountChange?.(getPageCount(height))
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)

    return () => observer.disconnect()
  }, [children, zoom, onPageCountChange])

  const scaledWidth = `${PAPER_WIDTH_MM * zoom}mm`

  if (supportsZoom) {
    return (
      <div className="mx-auto shrink-0 max-w-full pb-2" style={{ width: scaledWidth }}>
        <div ref={contentRef} style={{ zoom, width: `${PAPER_WIDTH_MM}mm` }}>
          {children}
        </div>
      </div>
    )
  }

  const scaledHeight = contentHeight > 0 ? contentHeight * zoom : undefined

  return (
    <div
      className="mx-auto shrink-0 max-w-full pb-2"
      style={{ width: scaledWidth, height: scaledHeight }}
    >
      <div
        ref={contentRef}
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
          width: `${PAPER_WIDTH_MM}mm`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export function calcFitZoom(containerWidth: number, padding = 24, min = 0.28, max = 1) {
  const mmToPx = 96 / 25.4
  const paperPx = PAPER_WIDTH_MM * mmToPx
  const available = Math.max(0, containerWidth - padding)
  return Math.min(max, Math.max(min, available / paperPx))
}
