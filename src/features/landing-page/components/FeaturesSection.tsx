import { Sparkles, Target, Layout } from 'lucide-react'
import { Card, SectionHeading } from '../../../components/ui'

const features = [
  {
    icon: Sparkles,
    iconColor: 'text-primary bg-primary/10',
    title: 'AI Rewrite Engine',
    description:
      'Transform bland bullet points into powerful achievements. Our AI analyzes your experience and crafts compelling, keyword-rich content.',
  },
  {
    icon: Target,
    iconColor: 'text-accent-blue bg-accent-blue/10',
    title: 'ATS Optimizer',
    description:
      'Pass through Applicant Tracking Systems with confidence. Real-time scoring and suggestions ensure your resume reaches human eyes.',
  },
  {
    icon: Layout,
    iconColor: 'text-secondary bg-secondary/10',
    title: 'Smart Templates',
    description:
      'Choose from recruiter-approved layouts designed for every industry. Professional formatting that makes you stand out instantly.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="section-padding bg-bg-gray">
      <div className="section-container">
        <SectionHeading
          title="Master Your Career with"
          highlight="Intelligent Tools"
          subtitle="Everything you need to create a resume that opens doors"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} hover className="text-center">
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconColor} mb-4`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-text-body leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
