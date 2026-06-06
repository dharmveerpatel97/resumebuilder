import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '../../../components/ui'

const templatePreviews = [
  { name: 'Classic', color: 'bg-accent-teal', id: 'classic' },
  { name: 'Modern', color: 'bg-accent-orange', id: 'modern' },
  { name: 'Professional', color: 'bg-footer', id: 'professional' },
]

export function TemplatesSection() {
  return (
    <section id="templates" className="section-padding bg-bg-gray">
      <div className="section-container">
        <SectionHeading
          title="Built for Every"
          highlight="Industry."
          subtitle="From tech startups to Fortune 500 companies, we have the perfect template for your career path."
        />

        <div className="text-center mb-10">
          <Link
            to="/builder"
            className="inline-flex items-center gap-1 text-primary font-semibold hover:gap-2 transition-all"
          >
            Browse all 50 templates <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {templatePreviews.map((template) => (
            <Link
              key={template.id}
              to="/builder"
              className="group cursor-pointer"
            >
              <div className={`${template.color} rounded-2xl p-8 flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.02]`}>
                <div className="w-full max-w-[200px]">
                  <div className="bg-gray-800 rounded-t-lg px-4 py-2 flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="bg-white rounded-b-lg shadow-xl p-4 space-y-2">
                    <div className="h-2.5 w-3/4 bg-gray-800 rounded" />
                    <div className="h-1.5 w-full bg-gray-200 rounded" />
                    <div className="h-1.5 w-5/6 bg-gray-200 rounded" />
                    <div className="h-1.5 w-full bg-gray-100 rounded mt-3" />
                    <div className="h-1.5 w-full bg-gray-100 rounded" />
                    <div className="h-1.5 w-3/4 bg-gray-100 rounded" />
                  </div>
                </div>
              </div>
              <p className="text-center mt-3 font-medium text-text-dark">
                {template.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
