import { CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, SectionHeading } from '../../../components/ui'

const atsFeatures = [
  'Keyword matching against job descriptions',
  'Semantic analysis for context relevance',
  'File compatibility with all major ATS platforms',
]

export function ATSSection() {
  return (
    <section id="ats" className="section-padding bg-bg-white">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading
              title="Don't Get Ghosted by"
              highlight="Robots."
              subtitle="75% of resumes never reach a human. Our ATS optimization ensures yours does."
              align="left"
            />
            <ul className="space-y-4">
              {atsFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-text-body">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-footer rounded-2xl p-8 text-white shadow-2xl">
            <h4 className="text-lg font-semibold mb-6">Resume Report</h4>
            <div className="flex items-center justify-center mb-6">
              <div className="relative h-32 w-32">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-white/10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${72 * 3.27} ${100 * 3.27}`}
                    strokeLinecap="round"
                    className="text-primary"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">72</span>
                  <span className="text-xs text-white/60">ATS Score</span>
                </div>
              </div>
            </div>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Keywords</span>
                <span className="text-yellow-400">Needs Work</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Formatting</span>
                <span className="text-green-400">Good</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Readability</span>
                <span className="text-green-400">Excellent</span>
              </div>
            </div>
            <Link to="/ats" className="block">
              <Button className="w-full">Run ATS Check</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
