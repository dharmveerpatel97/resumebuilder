import { SectionHeading } from '../../../components/ui'

export function TestimonialSection() {
  return (
    <section className="section-padding bg-primary">
      <div className="section-container">
        <SectionHeading
          title="Loved by 50,000+"
          highlight="job seekers."
          light
        />

        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-xl">
          <p className="text-lg text-text-body leading-relaxed italic">
            "ResumeAI completely transformed my job search. Within two weeks of using
            their ATS-optimized template, I landed interviews at three top companies.
            The AI rewrite feature turned my boring bullet points into compelling
            achievements."
          </p>
          <div className="mt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              SJ
            </div>
            <div>
              <p className="font-semibold text-text-dark">Sarah Jenkins</p>
              <p className="text-sm text-text-body">Product Manager at Meta</p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 max-w-lg mx-auto text-center">
          <div>
            <p className="text-3xl font-bold text-white">90%</p>
            <p className="text-sm text-white/70 mt-1">Success Rate</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">1.5M+</p>
            <p className="text-sm text-white/70 mt-1">Resumes Scanned</p>
          </div>
        </div>
      </div>
    </section>
  )
}
