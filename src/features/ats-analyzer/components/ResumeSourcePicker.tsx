import { FileUp, FolderOpen, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '../../../components/ui'
import { predefinedTemplates } from '../../resume-builder/data/templates'
import type { SavedResume } from '../../resume-builder/types/resume.types'

export type ResumeSource =
  | { type: 'saved'; resume: SavedResume }
  | { type: 'upload'; fileName: string; text: string }

interface ResumeSourcePickerProps {
  savedResumes: SavedResume[]
  selectedSource: ResumeSource | null
  onSelectSaved: (resume: SavedResume) => void
  onSelectUpload: (fileName: string, text: string) => void
  onUploadError: (message: string) => void
  onExtractFile: (file: File) => Promise<string>
}

function getTemplateName(templateId: SavedResume['templateId']) {
  return predefinedTemplates.find((t) => t.id === templateId)?.name ?? templateId
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function ResumeSourcePicker({
  savedResumes,
  selectedSource,
  onSelectSaved,
  onSelectUpload,
  onUploadError,
  onExtractFile,
}: ResumeSourcePickerProps) {
  const [mode, setMode] = useState<'saved' | 'upload'>('saved')
  const [isDragging, setIsDragging] = useState(false)
  const [isReading, setIsReading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setIsReading(true)
    try {
      const text = await onExtractFile(file)
      if (!text.trim()) {
        onUploadError('Could not extract text from this file. Try a different PDF or TXT file.')
        return
      }
      onSelectUpload(file.name, text)
    } catch {
      onUploadError('Failed to read file. Please upload a PDF or TXT resume.')
    } finally {
      setIsReading(false)
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) void handleFile(file)
  }

  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden">
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => setMode('saved')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-colors cursor-pointer ${
            mode === 'saved'
              ? 'bg-bg-light-blue text-primary border-b-2 border-primary'
              : 'text-text-body hover:bg-bg-gray'
          }`}
        >
          <FolderOpen className="h-4 w-4" />
          My Saved Resumes
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-colors cursor-pointer ${
            mode === 'upload'
              ? 'bg-bg-light-blue text-primary border-b-2 border-primary'
              : 'text-text-body hover:bg-bg-gray'
          }`}
        >
          <Upload className="h-4 w-4" />
          Upload Resume
        </button>
      </div>

      <div className="p-5">
        {mode === 'saved' ? (
          savedResumes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <p className="text-text-body">No saved resumes yet.</p>
              <p className="text-sm text-text-muted mt-1">
                Create one in the builder, save it, then run an ATS scan here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
              {savedResumes.map((resume) => {
                const isSelected =
                  selectedSource?.type === 'saved' && selectedSource.resume.id === resume.id

                return (
                  <button
                    key={resume.id}
                    type="button"
                    onClick={() => onSelectSaved(resume)}
                    className={`text-left rounded-xl border p-4 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-bg-light-blue ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/40 hover:shadow-sm'
                    }`}
                  >
                    <p className="font-semibold text-text-dark truncate">{resume.name}</p>
                    <p className="text-sm text-text-body mt-0.5">
                      {getTemplateName(resume.templateId)}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      Updated {formatDate(resume.updatedAt)}
                    </p>
                  </button>
                )
              })}
            </div>
          )
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
              isDragging ? 'border-primary bg-bg-light-blue' : 'border-border'
            }`}
          >
            <FileUp className="h-10 w-10 text-primary mx-auto mb-3" />
            <p className="font-medium text-text-dark">Drop your resume here</p>
            <p className="text-sm text-text-body mt-1">PDF or TXT · max 10 MB</p>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.txt,text/plain,application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void handleFile(file)
                e.target.value = ''
              }}
            />
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              disabled={isReading}
              onClick={() => inputRef.current?.click()}
            >
              {isReading ? 'Reading file…' : 'Browse files'}
            </Button>
            {selectedSource?.type === 'upload' && (
              <p className="text-sm text-primary font-medium mt-4">
                Selected: {selectedSource.fileName}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
