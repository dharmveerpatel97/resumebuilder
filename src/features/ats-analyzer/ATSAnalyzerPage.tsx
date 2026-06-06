import { ArrowLeft, Rocket, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Textarea } from '../../components/ui'
import { getSavedResumes } from '../resume-builder/utils/savedResumes'
import { ATSReport } from './components/ATSReport'
import { ResumeSourcePicker, type ResumeSource } from './components/ResumeSourcePicker'
import { analyzeResume } from './utils/atsAnalysis'
import { extractTextFromFile, resumeDataToText } from './utils/extractResumeText'

export function ATSAnalyzerPage() {
  const savedResumes = useMemo(() => getSavedResumes(), [])
  const [source, setSource] = useState<ResumeSource | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [report, setReport] = useState<{
    result: ReturnType<typeof analyzeResume>
    resumeName: string
  } | null>(null)

  function getResumeText(): string {
    if (!source) return ''
    if (source.type === 'saved') return resumeDataToText(source.resume.data)
    return source.text
  }

  function getResumeName(): string {
    if (!source) return ''
    if (source.type === 'saved') return source.resume.name
    return source.fileName
  }

  function handleAnalyze() {
    setError(null)
    const resumeText = getResumeText().trim()

    if (!source) {
      setError('Select a saved resume or upload a file to analyze.')
      return
    }

    if (!resumeText) {
      setError('Resume content is empty. Add content or choose another file.')
      return
    }

    setIsAnalyzing(true)
    requestAnimationFrame(() => {
      const resumeData = source.type === 'saved' ? source.resume.data : undefined
      const result = analyzeResume(resumeText, jobDescription, resumeData)
      setReport({ result, resumeName: getResumeName() })
      setIsAnalyzing(false)
    })
  }

  return (
    <div className="min-h-[100dvh] bg-bg-gray">
      <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur-md">
        <div className="section-container flex items-center justify-between py-4 gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm text-text-body hover:text-primary transition-colors shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
            <div className="h-5 w-px bg-border hidden sm:block" />
            <h1 className="text-lg font-bold text-text-dark truncate">
              ATS <span className="text-primary">Analyzer</span>
            </h1>
          </div>
          <Link to="/builder" className="shrink-0">
            <Button size="sm" variant="secondary">
              Resume Builder
            </Button>
          </Link>
        </div>
      </header>

      <main className="section-container py-8 md:py-10">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-text-dark">
            Run ATS Scan
          </h2>
          <p className="text-text-body mt-2 max-w-2xl">
            Select a resume you built in the app or upload a PDF/TXT file, then paste a job
            description to compare keywords and formatting.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ResumeSourcePicker
            savedResumes={savedResumes}
            selectedSource={source}
            onSelectSaved={(resume) => {
              setSource({ type: 'saved', resume })
              setReport(null)
              setError(null)
            }}
            onSelectUpload={(fileName, text) => {
              setSource({ type: 'upload', fileName, text })
              setReport(null)
              setError(null)
            }}
            onUploadError={setError}
            onExtractFile={extractTextFromFile}
          />

          <div className="rounded-2xl border border-border bg-white p-5 flex flex-col">
            <label htmlFor="job-description" className="font-semibold text-text-dark mb-2">
              Job Description
              <span className="text-text-muted font-normal text-sm ml-2">(required for accurate keyword score)</span>
            </label>
            <Textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job posting here to check keyword match against your resume…"
              className="flex-1 min-h-[220px] resize-none"
            />
            {error && (
              <p className="text-sm text-red-500 mt-3" role="alert">
                {error}
              </p>
            )}
            <Button
              className="mt-4 w-full sm:w-auto"
              size="lg"
              disabled={isAnalyzing}
              onClick={handleAnalyze}
            >
              {isAnalyzing ? (
                'Analyzing…'
              ) : (
                <>
                  <Rocket className="h-4 w-4" />
                  Run ATS Scan
                </>
              )}
            </Button>
          </div>
        </div>

        {report ? (
          <ATSReport result={report.result} resumeName={report.resumeName} />
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-white/60 p-10 text-center">
            <Search className="h-10 w-10 text-text-muted mx-auto mb-3" />
            <p className="text-text-body">
              Your ATS report will appear here after you run a scan.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
