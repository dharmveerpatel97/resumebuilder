export function Footer() {
  return (
    <footer className="bg-footer text-white">
      <div className="section-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <p className="text-xl font-bold">
              Resume<span className="text-primary-light">AI</span>
            </p>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">
              AI-powered resume builder helping job seekers land their dream careers.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="/builder" className="hover:text-white transition-colors">Builder</a></li>
              <li><a href="#ats" className="hover:text-white transition-colors">ATS Scan</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">AI Writer</a></li>
              <li><a href="#templates" className="hover:text-white transition-colors">Templates</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Career Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Resume Library</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            © 2026 ResumeAI. All rights reserved.
          </p>
          <div className="flex gap-4">
            {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-sm text-white/40 hover:text-white transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
