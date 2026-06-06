import { FolderOpen, Trash2 } from 'lucide-react'
import { Button } from '../../../components/ui'
import { predefinedTemplates } from '../data/templates'
import type { SavedResume } from '../types/resume.types'

function getTemplateName(templateId: SavedResume['templateId']) {
  return predefinedTemplates.find((t) => t.id === templateId)?.name ?? templateId
}

interface SavedResumesListProps {
  resumes: SavedResume[]
  onOpen: (resume: SavedResume) => void
  onDelete: (id: string) => void
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function SavedResumesList({ resumes, onOpen, onDelete }: SavedResumesListProps) {
  if (resumes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center">
        <p className="text-text-body">No saved resumes yet.</p>
        <p className="text-sm text-text-muted mt-1">
          Build a resume and click Save to store it here.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {resumes.map((resume) => (
        <div
          key={resume.id}
          className="rounded-xl border border-border bg-white p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
        >
          <div className="min-w-0">
            <h3 className="font-semibold text-text-dark truncate">{resume.name}</h3>
            <p className="text-sm text-text-body mt-0.5">
              {getTemplateName(resume.templateId)} template
            </p>
            <p className="text-xs text-text-muted mt-1">
              Updated {formatDate(resume.updatedAt)}
            </p>
          </div>
          <div className="flex gap-2 mt-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onOpen(resume)}
            >
              <FolderOpen className="h-4 w-4" />
              Open
            </Button>
            <button
              type="button"
              onClick={() => onDelete(resume.id)}
              className="p-2 rounded-lg border border-border text-text-muted hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
