import { AlertCircle, CheckCircle2, Lightbulb } from 'lucide-react'
import type { ATSAnalysisResult } from '../utils/atsAnalysis'
import { scoreColor } from '../utils/atsAnalysis'
import { ScoreRing } from './ScoreRing'
import { TextSuggestionsSection } from './TextSuggestionsSection'

interface ATSReportProps {
  result: ATSAnalysisResult
  resumeName: string
}

const SECTION_METRICS: { key: keyof ATSAnalysisResult; label: string }[] = [
  { key: 'formatting', label: 'Formatting' },
  { key: 'keywords', label: 'Keywords' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
  { key: 'skills', label: 'Skills' },
  { key: 'readability', label: 'Readability' },
  { key: 'impact', label: 'Impact' },
]

function barColor(score: number) {
  if (score >= 85) return 'bg-green-500'
  if (score >= 70) return 'bg-primary'
  if (score >= 50) return 'bg-accent-orange'
  return 'bg-red-500'
}

function MetricBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="rounded-xl border border-border bg-bg-gray/50 p-4">
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <span className="text-sm font-medium text-text-dark">{label}</span>
        <span className={`text-sm font-bold tabular-nums ${scoreColor(score)}`}>
          {score}/100
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-white overflow-hidden border border-border/60">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

export function ATSReport({ result, resumeName }: ATSReportProps) {
  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
      {/* Score header */}
      <div className="bg-footer text-white px-6 py-8 md:px-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-8">
          <ScoreRing score={result.overallScore} variant="dark" size={148} />

          <div className="flex-1 text-center sm:text-left min-w-0 w-full">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-sm font-bold">
                Grade {result.grade}
              </span>
              <span className="text-white/50 text-sm">·</span>
              <span className="text-white/70 text-sm">ATS Scan Results</span>
            </div>

            <h3 className="text-xl md:text-2xl font-semibold truncate">{resumeName}</h3>
            <p className="text-sm text-white/75 mt-3 leading-relaxed max-w-2xl">
              {result.summary}
            </p>
          </div>
        </div>
      </div>

      {result.jobDescriptionRequired && (
        <div className="px-6 md:px-8 py-4 bg-amber-50 border-b border-amber-200">
          <p className="text-sm text-amber-900 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
            Paste a job description above and re-run the scan for accurate keyword matching.
          </p>
        </div>
      )}

      {/* Section scores */}
      <div className="px-6 md:px-8 py-6 md:py-8 border-b border-border">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
          Section Scores
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {SECTION_METRICS.map(({ key, label }) => (
            <MetricBar key={key} label={label} score={result[key] as number} />
          ))}
        </div>
      </div>

      {/* Keywords */}
      <div className="px-6 md:px-8 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 border-b border-border">
        <div>
          <h4 className="font-semibold text-text-dark flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Matched Keywords
            <span className="text-xs font-normal text-text-muted">
              ({result.matchedKeywords.length})
            </span>
          </h4>
          {result.matchedKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.matchedKeywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-sm border border-green-200"
                >
                  {kw}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-body">
              {result.jobDescriptionRequired
                ? 'Paste a job description to see keyword matches.'
                : 'No keyword matches found.'}
            </p>
          )}
        </div>

        <div>
          <h4 className="font-semibold text-text-dark flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-accent-orange" />
            Missing Keywords
            <span className="text-xs font-normal text-text-muted">
              ({result.missingKeywords.length})
            </span>
          </h4>
          {result.missingKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords.slice(0, 15).map((kw) => (
                <span
                  key={kw}
                  className="px-2.5 py-1 rounded-full bg-orange-50 text-accent-orange text-sm border border-orange-200"
                >
                  {kw}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-body">
              {result.jobDescriptionRequired
                ? 'Add a job description to identify gaps.'
                : 'Strong keyword coverage for this posting.'}
            </p>
          )}
        </div>
      </div>

      {/* General tips */}
      <div className="px-6 md:px-8 py-6 md:py-8 border-b border-border">
        <h4 className="font-semibold text-text-dark flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-primary" />
          How to Improve
        </h4>
        <ul className="space-y-3">
          {result.suggestions.map((tip) => (
            <li
              key={tip}
              className="text-sm text-text-body flex items-start gap-3 rounded-lg bg-bg-light-blue px-4 py-3"
            >
              <span className="text-primary font-bold shrink-0">→</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Copy-paste text when job description provided */}
      {!result.jobDescriptionRequired && (
        <TextSuggestionsSection suggestions={result.textSuggestions} />
      )}
    </div>
  )
}
