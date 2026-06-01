"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
  generateSchema?: boolean;
}

export function FAQSection({ items, generateSchema = true }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const jsonLd = generateSchema
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;

  return (
    <section className="section-padding bg-muted/30">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <div className="container-site max-w-3xl">
        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-center mb-10">
          Частые вопросы
        </h2>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={item.id} className="card-base">
              <h3 className="m-0 text-base font-semibold leading-snug">
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-3 p-5 text-left font-semibold"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                  data-testid={`faq-item-${i}`}
                >
                  <span className="pr-2">{item.question}</span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-muted-foreground shrink-0 transition-transform",
                      openIndex === i && "rotate-180"
                    )}
                  />
                </button>
              </h3>
              {openIndex === i && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
