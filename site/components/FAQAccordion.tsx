'use client';

import { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQItem[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(faqs.map((faq) => faq.category)))];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Căutați întrebări..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-[var(--glass-border)] rounded-lg bg-[var(--glass-bg)] backdrop-filter backdrop-blur-sm text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'glass-card bg-[var(--primary)]/20 text-[var(--primary)] border-[var(--primary)]'
                  : 'glass-card text-[var(--text-primary)] hover:bg-[var(--glass-bg-hover)]'
              }`}
            >
              {category === 'all' ? 'Toate' : category}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-[var(--text-secondary)]">
              Nu s-au găsit întrebări care să corespundă criteriilor de căutare.
            </p>
          </div>
        ) : (
          filteredFaqs.map((faq) => (
            <Disclosure key={faq.id}>
              {({ open }) => (
                <div className="glass-card overflow-hidden">
                  <Disclosure.Button className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-[var(--glass-bg-hover)] transition-colors duration-300">
                    <div className="flex-1">
                      <div className="text-xs text-[var(--primary)] font-semibold mb-2">
                        {faq.category}
                      </div>
                      <div className="text-lg font-semibold text-[var(--text-primary)]">
                        {faq.question}
                      </div>
                    </div>
                    <ChevronDownIcon
                      className={`w-5 h-5 text-[var(--text-secondary)] transition-transform duration-300 ${
                        open ? 'transform rotate-180' : ''
                      }`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-6 py-4 bg-[var(--background-secondary)]/50 text-[var(--text-secondary)] text-sm">
                    {faq.answer}
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
          ))
        )}
      </div>
    </div>
  );
}
