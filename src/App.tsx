import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ATSAnalyzerPage } from './features/ats-analyzer/ATSAnalyzerPage'
import { LandingPage } from './features/landing-page/LandingPage'
import { ResumeBuilderPage } from './features/resume-builder/ResumeBuilderPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/builder" element={<ResumeBuilderPage />} />
        <Route path="/ats" element={<ATSAnalyzerPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
