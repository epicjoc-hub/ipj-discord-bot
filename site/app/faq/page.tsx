import FAQAccordion from '@/components/FAQAccordion';
import faqData from '@/data/faq.json';

export const metadata = {
  title: 'Întrebări Frecvente - IPJ Los Santos',
  description: 'Răspunsuri la întrebările frecvente despre Inspectoratul de Poliție Județean Los Santos',
};

export default function FAQPage() {
  return (
    <div className="py-12 bg-[var(--background)]">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="glass-card p-8 text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Întrebări Frecvente</h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Găsiți răspunsuri la cele mai frecvente întrebări despre serviciile și activitățile noastre.
          </p>
        </div>

        <div className="glass-card p-6 mb-8">
          <FAQAccordion faqs={faqData} />
        </div>

        {faqData.length === 0 && (
          <div className="glass-card p-12 text-center">
            <p className="text-[var(--text-secondary)]">Nu există întrebări disponibile momentan.</p>
          </div>
        )}

        <div className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            Nu găsiți răspunsul căutat?
          </h2>
          <p className="text-base text-[var(--text-secondary)] mb-6">
            Contactați-ne direct și vă vom răspunde la toate întrebările dvs.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[var(--primary)] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors duration-300"
          >
            Contactează-ne
          </a>
        </div>
      </div>
    </div>
  );
}
