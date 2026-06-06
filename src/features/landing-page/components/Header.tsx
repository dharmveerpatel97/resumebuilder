import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-white/80 backdrop-blur-md">
      <div className="section-container flex items-center justify-between py-4">
        <Link to="/" className="text-xl font-bold text-text-dark">
          Resume<span className="text-primary">AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-text-body hover:text-primary transition-colors">
            Features
          </a>
          <a href="#templates" className="text-sm font-medium text-text-body hover:text-primary transition-colors">
            Templates
          </a>
          <Link to="/ats" className="text-sm font-medium text-text-body hover:text-primary transition-colors">
            ATS Analysis
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/ats" className="hidden sm:block">
            <Button size="sm" variant="outline">
              ATS Check
            </Button>
          </Link>
          <Link to="/builder">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
