import { Plus, Trash2 } from 'lucide-react'
import { Button, Input, Textarea } from '../../../components/ui'
import type { ResumeTheme } from '../data/themeColors'
import type { ResumeSpacing } from '../data/spacing'
import type { ResumeTypography } from '../data/typography'
import type { FresherDetails, ResumeData, TemplateId } from '../types/resume.types'
import { ColorThemePicker } from './ColorThemePicker'
import { FormSection } from './FormSection'
import { SectionOrderPicker } from './SectionOrderPicker'
import { SpacingPicker } from './SpacingPicker'
import { TypographyPicker } from './TypographyPicker'

interface ResumeFormProps {
  templateId: TemplateId
  data: ResumeData
  onChange: (data: ResumeData) => void
  theme: ResumeTheme
  presetId: string
  typography: ResumeTypography
  spacing: ResumeSpacing
  onPresetChange: (presetId: string) => void
  onThemeChange: (theme: ResumeTheme) => void
  onTypographyChange: (typography: ResumeTypography) => void
  onSpacingChange: (spacing: ResumeSpacing) => void
}

const createId = () => crypto.randomUUID()

export function ResumeForm({
  templateId,
  data,
  onChange,
  theme,
  presetId,
  typography,
  spacing,
  onPresetChange,
  onThemeChange,
  onTypographyChange,
  onSpacingChange,
}: ResumeFormProps) {
  const updateFresher = (field: keyof FresherDetails, value: string) => {
    onChange({ ...data, fresherDetails: { ...data.fresherDetails, [field]: value } })
  }

  const updatePersonal = (field: keyof ResumeData['personalInfo'], value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value },
    })
  }

  const updateExperience = (
    id: string,
    field: keyof ResumeData['experiences'][number],
    value: string | boolean,
  ) => {
    onChange({
      ...data,
      experiences: data.experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp,
      ),
    })
  }

  const addExperience = () => {
    onChange({
      ...data,
      experiences: [
        ...data.experiences,
        {
          id: createId(),
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        },
      ],
    })
  }

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experiences: data.experiences.filter((exp) => exp.id !== id),
    })
  }

  const updateEducation = (
    id: string,
    field: keyof ResumeData['education'][number],
    value: string,
  ) => {
    onChange({
      ...data,
      education: data.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu,
      ),
    })
  }

  const addEducation = () => {
    onChange({
      ...data,
      education: [
        ...data.education,
        {
          id: createId(),
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          gpaOutOf10: '',
          percentage: '',
          division: '',
          description: '',
        },
      ],
    })
  }

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter((edu) => edu.id !== id),
    })
  }

  const updateSkill = (id: string, name: string) => {
    onChange({
      ...data,
      skills: data.skills.map((skill) =>
        skill.id === id ? { ...skill, name } : skill,
      ),
    })
  }

  const addSkill = () => {
    onChange({
      ...data,
      skills: [...data.skills, { id: createId(), name: '' }],
    })
  }

  const removeSkill = (id: string) => {
    onChange({
      ...data,
      skills: data.skills.filter((skill) => skill.id !== id),
    })
  }

  const updateProject = (
    id: string,
    field: keyof ResumeData['projects'][number],
    value: string,
  ) => {
    onChange({
      ...data,
      projects: data.projects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project,
      ),
    })
  }

  const addProject = () => {
    onChange({
      ...data,
      projects: [
        ...data.projects,
        {
          id: createId(),
          name: '',
          description: '',
          technologies: '',
          url: '',
          startDate: '',
          endDate: '',
        },
      ],
    })
  }

  const removeProject = (id: string) => {
    onChange({
      ...data,
      projects: data.projects.filter((project) => project.id !== id),
    })
  }

  return (
    <div className="space-y-4">
      <FormSection
        title="Color Theme"
        subtitle="Presets and custom heading, subheading, body colors"
        defaultOpen={false}
      >
        <ColorThemePicker
          theme={theme}
          presetId={presetId}
          onPresetChange={onPresetChange}
          onThemeChange={onThemeChange}
        />
      </FormSection>

      <FormSection
        title="Typography"
        subtitle="Font size and bold for each text level"
        defaultOpen={false}
      >
        <TypographyPicker typography={typography} onChange={onTypographyChange} />
      </FormSection>

      <FormSection
        title="Spacing"
        subtitle="Gap between main sections and sub-items"
        defaultOpen={false}
      >
        <SpacingPicker spacing={spacing} onChange={onSpacingChange} />
      </FormSection>

      <SectionOrderPicker
        templateId={templateId}
        order={data.sectionOrder}
        enabled={data.sectionEnabled}
        onOrderChange={(sectionOrder) => onChange({ ...data, sectionOrder })}
        onEnabledChange={(sectionEnabled) => onChange({ ...data, sectionEnabled })}
      />

      <FormSection title="Personal Information" defaultOpen>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={data.personalInfo.fullName}
            onChange={(e) => updatePersonal('fullName', e.target.value)}
            placeholder="John Doe"
          />
          <Input
            label="Job Title"
            value={data.personalInfo.jobTitle}
            onChange={(e) => updatePersonal('jobTitle', e.target.value)}
            placeholder="Software Engineer"
          />
          <Input
            label="Email"
            type="email"
            value={data.personalInfo.email}
            onChange={(e) => updatePersonal('email', e.target.value)}
            placeholder="john@email.com"
          />
          <Input
            label="Phone"
            value={data.personalInfo.phone}
            onChange={(e) => updatePersonal('phone', e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
          <Input
            label="Location"
            value={data.personalInfo.location}
            onChange={(e) => updatePersonal('location', e.target.value)}
            placeholder="City, State"
          />
          <Input
            label="LinkedIn"
            value={data.personalInfo.linkedin}
            onChange={(e) => updatePersonal('linkedin', e.target.value)}
            placeholder="linkedin.com/in/username"
          />
          <Input
            label="Website"
            value={data.personalInfo.website}
            onChange={(e) => updatePersonal('website', e.target.value)}
            placeholder="yourwebsite.com"
          />
        </div>
        <Textarea
          label="Professional Summary"
          value={data.personalInfo.summary}
          onChange={(e) => updatePersonal('summary', e.target.value)}
          placeholder="Brief overview of your experience and skills..."
          rows={4}
        />
      </FormSection>

      <FormSection title="Description Format">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.useBulletPoints ?? true}
            onChange={(e) => onChange({ ...data, useBulletPoints: e.target.checked })}
            className="mt-0.5 rounded border-border text-primary focus:ring-primary/20"
          />
          <span>
            <span className="text-sm font-medium text-text-body block">Show bullet points in Experience & Projects</span>
            <span className="text-xs text-text-muted mt-0.5 block">
              When enabled, each line in the description field becomes a separate bullet point in the preview.
            </span>
          </span>
        </label>
      </FormSection>

      <FormSection
        title="Experience"
        subtitle={data.experiences.length > 0 ? `${data.experiences.length} added` : undefined}
        action={
          <Button variant="outline" size="sm" onClick={addExperience}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        }
      >
        {data.experiences.map((exp, index) => (
          <div
            key={exp.id}
            className="rounded-xl border border-border p-4 space-y-3 relative"
          >
            <button
              type="button"
              onClick={() => removeExperience(exp.id)}
              className="absolute top-3 right-3 text-text-muted hover:text-red-500 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <p className="text-sm font-medium text-text-muted">Experience {index + 1}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Position"
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                placeholder="Software Engineer"
              />
              <Input
                label="Company"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                placeholder="Company Name"
              />
              <Input
                label="Start Date"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                placeholder="2020"
              />
              <Input
                label="End Date"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                placeholder="2024"
                disabled={exp.current}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-text-body cursor-pointer">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary/20"
              />
              Currently working here
            </label>
            <Textarea
              label="Description"
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
              placeholder={data.useBulletPoints ? 'One point per line:\nLed a team of 5 developers\nImproved performance by 40%' : 'Describe your responsibilities and achievements...'}
              rows={3}
            />
          </div>
        ))}
        {data.experiences.length === 0 && (
          <p className="text-sm text-text-muted text-center py-4">
            No experience added yet. Click "Add" to get started.
          </p>
        )}
      </FormSection>

      <FormSection
        title="Education"
        subtitle={data.education.length > 0 ? `${data.education.length} added` : undefined}
        action={
          <Button variant="outline" size="sm" onClick={addEducation}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        }
      >
        {data.education.map((edu, index) => (
          <div
            key={edu.id}
            className="rounded-xl border border-border p-4 space-y-3 relative"
          >
            <button
              type="button"
              onClick={() => removeEducation(edu.id)}
              className="absolute top-3 right-3 text-text-muted hover:text-red-500 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <p className="text-sm font-medium text-text-muted">Education {index + 1}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Institution"
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                placeholder="University Name"
              />
              <Input
                label="Degree"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                placeholder="B.S."
              />
              <Input
                label="Field of Study"
                value={edu.field}
                onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                placeholder="Computer Science"
              />
              <Input
                label="Start Date"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                placeholder="2015"
              />
              <Input
                label="End Date"
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                placeholder="2019"
              />
              <Input
                label="CGPA (out of 10)"
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={edu.gpaOutOf10}
                onChange={(e) => updateEducation(edu.id, 'gpaOutOf10', e.target.value)}
                placeholder="8.5"
              />
              <Input
                label="Percentage (out of 100)"
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={edu.percentage}
                onChange={(e) => updateEducation(edu.id, 'percentage', e.target.value)}
                placeholder="85"
              />
              <Input
                label="Division / Class"
                value={edu.division}
                onChange={(e) => updateEducation(edu.id, 'division', e.target.value)}
                placeholder="1st, 2nd, Distinction"
              />
            </div>
          </div>
        ))}
        {data.education.length === 0 && (
          <p className="text-sm text-text-muted text-center py-4">
            No education added yet. Click "Add" to get started.
          </p>
        )}
      </FormSection>

      <FormSection
        title="Fresher / Personal Details"
        subtitle="Father name, DOB, declaration — used in fresher & intern templates"
        defaultOpen={false}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Father Name" value={data.fresherDetails.fatherName} onChange={(e) => updateFresher('fatherName', e.target.value)} />
          <Input label="Mother Name" value={data.fresherDetails.motherName} onChange={(e) => updateFresher('motherName', e.target.value)} />
          <Input label="Gender" value={data.fresherDetails.gender} onChange={(e) => updateFresher('gender', e.target.value)} placeholder="Male / Female" />
          <Input label="Date of Birth" value={data.fresherDetails.dateOfBirth} onChange={(e) => updateFresher('dateOfBirth', e.target.value)} placeholder="DD/MM/YYYY" />
          <Input label="Nationality" value={data.fresherDetails.nationality} onChange={(e) => updateFresher('nationality', e.target.value)} />
          <Input label="Religion" value={data.fresherDetails.religion} onChange={(e) => updateFresher('religion', e.target.value)} />
          <div className="sm:col-span-2">
            <Input label="Language Knowledge" value={data.fresherDetails.languageKnowledge} onChange={(e) => updateFresher('languageKnowledge', e.target.value)} placeholder="Hindi & English" />
          </div>
        </div>
        <Textarea label="Declaration" value={data.fresherDetails.declaration} onChange={(e) => updateFresher('declaration', e.target.value)} rows={3} />
      </FormSection>

      <FormSection
        title="Projects"
        subtitle={data.projects.length > 0 ? `${data.projects.length} added` : undefined}
        action={
          <Button variant="outline" size="sm" onClick={addProject}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        }
      >
        {data.projects.map((project, index) => (
          <div
            key={project.id}
            className="rounded-xl border border-border p-4 space-y-3 relative"
          >
            <button
              type="button"
              onClick={() => removeProject(project.id)}
              className="absolute top-3 right-3 text-text-muted hover:text-red-500 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <p className="text-sm font-medium text-text-muted">Project {index + 1}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Project Name"
                value={project.name}
                onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                placeholder="My Awesome Project"
              />
              <Input
                label="Technologies"
                value={project.technologies}
                onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                placeholder="React, Node.js"
              />
              <Input
                label="Start Date"
                value={project.startDate}
                onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                placeholder="2023"
              />
              <Input
                label="End Date"
                value={project.endDate}
                onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                placeholder="2024"
              />
              <div className="sm:col-span-2">
                <Input
                  label="URL"
                  value={project.url}
                  onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                  placeholder="github.com/username/project"
                />
              </div>
            </div>
            <Textarea
              label="Description"
              value={project.description}
              onChange={(e) => updateProject(project.id, 'description', e.target.value)}
              placeholder={data.useBulletPoints ? 'One point per line:\nBuilt REST APIs with Node.js\nDeployed on AWS' : 'Describe the project and your contributions...'}
              rows={3}
            />
          </div>
        ))}
        {data.projects.length === 0 && (
          <p className="text-sm text-text-muted text-center py-4">
            No projects added yet. Click "Add" to get started.
          </p>
        )}
      </FormSection>

      <FormSection
        title="Skills"
        subtitle={data.skills.length > 0 ? `${data.skills.length} added` : undefined}
        action={
          <Button variant="outline" size="sm" onClick={addSkill}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.skills.map((skill) => (
            <div key={skill.id} className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  label="Skill"
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, e.target.value)}
                  placeholder="e.g. React, Python"
                />
              </div>
              <button
                type="button"
                onClick={() => removeSkill(skill.id)}
                className="mb-2 text-text-muted hover:text-red-500 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        {data.skills.length === 0 && (
          <p className="text-sm text-text-muted text-center py-4">
            No skills added yet. Click "Add" to get started.
          </p>
        )}
      </FormSection>
    </div>
  )
}
