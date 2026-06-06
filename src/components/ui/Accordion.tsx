import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface AccordionItem {
  question: string
  answer: string
}

interface AccordionProps {
  items: AccordionItem[]
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div
            key={item.question}
            className="rounded-xl border border-border bg-white overflow-hidden"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between px-6 py-4 text-left font-medium text-text-dark hover:bg-bg-gray transition-colors cursor-pointer"
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              {item.question}
              <ChevronDown
                className={`h-5 w-5 text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen && (
              <div className="px-6 pb-4 text-text-body leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
