import {
  Children,
  cloneElement,
  isValidElement,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'
import type { ResumePreview } from './ResumePreview'

export const PAPER_WIDTH_MM = 210
export const PAPER_HEIGHT_MM = 297
const PAGE_PAD_MM = 10

const MM_TO_PX = 96 / 25.4

const supportsZoom =
  typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('zoom', '1')

type PreviewChild = ReactElement<React.ComponentProps<typeof ResumePreview>>

interface PreviewScalerProps {
  zoom: number
  children: ReactNode
  onPageCountChange?: (pages: number) => void
}

export function getPageCount(contentHeightPx: number) {
  const pageHeightPx = PAPER_HEIGHT_MM * MM_TO_PX
  const continuationPx = (PAPER_HEIGHT_MM - PAGE_PAD_MM) * MM_TO_PX
  if (contentHeightPx <= pageHeightPx) return 1
  return 1 + Math.ceil((contentHeightPx - pageHeightPx) / continuationPx)
}

function pageTranslateMm(pageIndex: number): string {
  if (pageIndex <= 0) return '0'
  const offsetMm = PAPER_HEIGHT_MM + (pageIndex - 1) * (PAPER_HEIGHT_MM - PAGE_PAD_MM)
  return `-${offsetMm}mm`
}

function ZoomWrapper({
  zoom,
  widthMm,
  children,
}: {
  zoom: number
  widthMm: number
  children: ReactNode
}) {
  if (supportsZoom) {
    return <div style={{ zoom, width: `${widthMm}mm` }}>{children}</div>
  }

  return (
    <div
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: 'top left',
        width: `${widthMm}mm`,
      }}
    >
      {children}
    </div>
  )
}

export function PreviewScaler({ zoom, children, onPageCountChange }: PreviewScalerProps) {
  const measureRef = useRef<HTMLDivElement>(null)
  const [pageCount, setPageCount] = useState(1)

  const child = isValidElement(children) ? (Children.only(children) as PreviewChild) : null
  const childRef = child ? (child.props as { ref?: Ref<HTMLDivElement> }).ref : undefined

  useLayoutEffect(() => {
    const el = measureRef.current
    if (!el) return

    const measure = () => {
      const paper = el.querySelector('.resume-paper') as HTMLElement | null
      const template = el.querySelector('.resume-template-root') as HTMLElement | null
      const height = Math.max(
        template?.scrollHeight ?? 0,
        template?.offsetHeight ?? 0,
        paper?.scrollHeight ?? 0,
        paper?.offsetHeight ?? 0,
        el.scrollHeight,
      )
      const pages = getPageCount(height)
      setPageCount(pages)
      onPageCountChange?.(pages)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [children, zoom, onPageCountChange])

  const scaledWidth = `${PAPER_WIDTH_MM * zoom}mm`

  const measureTree = child
    ? cloneElement(child, {
        embedded: true,
        ref: pageCount > 1 ? childRef : undefined,
      })
    : children

  const hiddenMeasure = (
    <div
      ref={measureRef}
      aria-hidden
      className="pointer-events-none invisible absolute top-0 -left-[9999px]"
      style={{ width: `${PAPER_WIDTH_MM}mm` }}
    >
      <ZoomWrapper zoom={zoom} widthMm={PAPER_WIDTH_MM}>
        {measureTree}
      </ZoomWrapper>
    </div>
  )

  if (!child) {
    return (
      <div className="relative mx-auto shrink-0 max-w-full pb-2" style={{ width: scaledWidth }}>
        {hiddenMeasure}
        <ZoomWrapper zoom={zoom} widthMm={PAPER_WIDTH_MM}>
          {children}
        </ZoomWrapper>
      </div>
    )
  }

  if (pageCount <= 1) {
    return (
      <div className="relative mx-auto shrink-0 max-w-full pb-2" style={{ width: scaledWidth }}>
        {hiddenMeasure}
        <ZoomWrapper zoom={zoom} widthMm={PAPER_WIDTH_MM}>
          {children}
        </ZoomWrapper>
      </div>
    )
  }

  const frameDoc = cloneElement(child, { ref: undefined, embedded: true })

  return (
    <div className="relative mx-auto shrink-0 max-w-full pb-2" style={{ width: scaledWidth }}>
      {hiddenMeasure}

      <ZoomWrapper zoom={zoom} widthMm={PAPER_WIDTH_MM}>
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: pageCount }).map((_, pageIndex) => (
            <div
              key={pageIndex}
              className="resume-page-frame flex flex-col overflow-hidden rounded-sm bg-white shadow-xl"
              style={{
                width: `${PAPER_WIDTH_MM}mm`,
                height: `${PAPER_HEIGHT_MM}mm`,
              }}
            >
              {pageIndex > 0 && (
                <div className="shrink-0" style={{ height: `${PAGE_PAD_MM}mm` }} aria-hidden />
              )}
              <div className="min-h-0 flex-1 overflow-hidden">
                <div style={{ transform: `translateY(${pageTranslateMm(pageIndex)})` }}>
                  {frameDoc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ZoomWrapper>
    </div>
  )
}

export function calcFitZoom(containerWidth: number, padding = 24, min = 0.28, max = 1) {
  const paperPx = PAPER_WIDTH_MM * MM_TO_PX
  const available = Math.max(0, containerWidth - padding)
  return Math.min(max, Math.max(min, available / paperPx))
}
