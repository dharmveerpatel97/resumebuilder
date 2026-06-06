import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui'

export function HeroSection() {
  return (
    <section className="section-padding bg-bg-white overflow-hidden">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-text-dark md:text-5xl lg:text-6xl leading-tight">
              Craft Your Future with{' '}
              <span className="text-primary">AI Precision.</span>
            </h1>
            <p className="mt-6 text-lg text-text-body max-w-lg leading-relaxed">
              Build ATS-optimized resumes that get past the bots and into the hands
              of hiring managers. Our AI engine crafts compelling content tailored
              to your dream role.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/builder">
                <Button size="lg">Build My Resume</Button>
              </Link>
              <a href="#templates">
                <Button variant="outline" size="lg">View Examples</Button>
              </a>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {['SJ', 'AR', 'JC', 'MK'].map((initials) => (
                  <div
                    key={initials}
                    className="h-8 w-8 rounded-full bg-primary/10 border-2 border-white flex items-center justify-center text-xs font-semibold text-primary"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-sm text-text-body">
                <span className="font-semibold text-text-dark">50,000+</span> candidates joined this week
              </p>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="bg-gradient-to-br from-bg-light-blue to-white rounded-2xl p-8 shadow-2xl border border-border/50">
                <div className="bg-white rounded-lg shadow-lg p-6 space-y-3">
                  <div className="h-3 w-2/3 bg-gray-800 rounded" />
                  <div className="h-2 w-full bg-gray-200 rounded" />
                  <div className="h-2 w-5/6 bg-gray-200 rounded" />
                  <div className="mt-4 space-y-2">
                    <div className="h-2 w-full bg-gray-100 rounded" />
                    <div className="h-2 w-full bg-gray-100 rounded" />
                    <div className="h-2 w-4/5 bg-gray-100 rounded" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-1.5 w-1/3 bg-primary/30 rounded" />
                    <div className="h-2 w-full bg-gray-100 rounded" />
                    <div className="h-2 w-full bg-gray-100 rounded" />
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-primary text-white rounded-xl px-4 py-3 shadow-lg">
                <p className="text-xs font-medium opacity-80">ATS Score</p>
                <p className="text-2xl font-bold">92</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
