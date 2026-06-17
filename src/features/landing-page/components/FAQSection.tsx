import { Accordion, SectionHeading } from '../../../components/ui'

const faqItems = [
  {
    question: 'Is my data secure?',
    answer:
      'Absolutely. We use industry-standard encryption to protect your personal information. Your resume data is stored securely and never shared with third parties without your consent.',
  },
  {
    question: 'Can I export as PDF?',
    answer:
      'Yes! Click "Download PDF" in the builder to save a print-ready file that matches your live preview — no browser headers or URLs.',
  },
  {
    question: 'How does the ATS optimization work?',
    answer:
      'Our system analyzes your resume against common ATS criteria including keyword density, formatting compatibility, section headers, and file structure to maximize your chances of passing automated screening.',
  },
  {
    question: 'Can I switch templates after starting?',
    answer:
      'Yes, you can switch between Classic, Modern, and Professional templates at any time without losing your data. Your content automatically adapts to the new layout.',
  },
  {
    question: 'Is ResumeAI free to use?',
    answer:
      'You can build and preview your resume for free. Premium features like AI rewriting and advanced ATS analysis are available with our Pro plan.',
  },
]

export function FAQSection() {
  return (
    <section className="section-padding bg-bg-white">
      <div className="section-container max-w-3xl">
        <SectionHeading title="Got Questions?" />
        <Accordion items={faqItems} />
      </div>
    </section>
  )
}
