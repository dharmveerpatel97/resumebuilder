import { Check, ClipboardCopy, FileText, MapPin, Quote } from 'lucide-react'
import { useState } from 'react'
import type { ATSTextSuggestion } from '../utils/atsAnalysis'

const SECTION_COLORS: Record<ATSTextSuggestion['section'], string> = {
  Summary: 'bg-purple-50 text-purple-700 border-purple-200',
  Skills: 'bg-blue-50 text-blue-700 border-blue-200',
  Experience: 'bg-green-50 text-green-700 border-green-200',
  'Job Title': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Projects: 'bg-teal-50 text-teal-700 border-teal-200',
}

interface TextSuggestionsSectionProps {
  suggestions: ATSTextSuggestion[]
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-dark hover:border-primary hover:text-primary transition-colors cursor-pointer shrink-0"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-green-500" />
          Copied
        </>
      ) : (
        <>
          <ClipboardCopy className="h-3.5 w-3.5" />
          Copy text
        </>
      )}
    </button>
  )
}

export function TextSuggestionsSection({ suggestions }: TextSuggestionsSectionProps) {
  if (suggestions.length === 0) {
    return (
      <div className="px-6 md:px-8 py-6 md:py-8 bg-bg-light-blue/40 border-t border-border">
        <p className="text-sm text-text-body text-center">
          No copy suggestions generated. Try pasting a longer job description with bullet points
          for responsibilities and required skills.
        </p>
      </div>
    )
  }

  return (
    <div className="px-6 md:px-8 py-6 md:py-8 bg-bg-light-blue/40 border-t border-border">
      <div className="flex items-start gap-3 mb-5">
        <div className="rounded-lg bg-primary/10 p-2 shrink-0">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold text-text-dark text-lg">
            What to Add — Copy & Use
          </h4>
          <p className="text-sm text-text-body mt-1">
            Each card shows where to paste in your resume and gives ready text based on the job post.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {suggestions.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-border bg-white overflow-hidden shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border bg-bg-gray/40">
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${SECTION_COLORS[item.section]}`}
                >
                  {item.section}
                </span>
                <span className="text-sm font-semibold text-text-dark">{item.title}</span>
              </div>
              <CopyButton text={item.suggestedText} />
            </div>

            <div className="px-4 py-4 space-y-3">
              <div className="flex items-start gap-2 text-xs text-primary font-medium bg-primary/5 rounded-lg px-3 py-2 border border-primary/15">
                <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>
                  <span className="text-text-muted font-normal">Where to put: </span>
                  {item.whereToPut}
                </span>
              </div>

              {item.sourceQuote && item.sourceQuote !== item.suggestedText && (
                <div className="flex items-start gap-2 text-xs text-text-body bg-amber-50 rounded-lg px-3 py-2 border border-amber-200/80">
                  <Quote className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" />
                  <span>
                    <span className="font-medium text-amber-900">From job post: </span>
                    &ldquo;{item.sourceQuote.length > 200 ? `${item.sourceQuote.slice(0, 200)}…` : item.sourceQuote}&rdquo;
                  </span>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5">
                  Paste this text
                </p>
                <p className="text-sm text-text-dark leading-relaxed whitespace-pre-wrap bg-bg-gray/50 rounded-lg px-4 py-3 border border-border/60">
                  {item.suggestedText}
                </p>
              </div>

              <p className="text-xs text-text-muted flex items-start gap-1.5">
                <span className="text-primary shrink-0 font-semibold">Tip:</span>
                {item.hint}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
