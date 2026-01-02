'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const ghiduri = [
  {
    id: '1',
    titlu: 'Ghid Port-Armă',
    descriere: 'Ghid complet pentru obținerea permisului de port-armă',
    link: 'https://docs.google.com/document/d/1I1awgGJB7KrKekI34_7_dgDcEnnFt3wpv7OBvsMcuxU/edit?usp=sharing',
  },
  {
    id: '2',
    titlu: 'Ghid Licență Tractări',
    descriere: 'Ghid complet pentru obținerea licenței de tractări',
    link: 'https://docs.google.com/document/d/1HWfuM39pjLjjvJiC_LcsukLtKF_NTCZ52wSp6TQKdD4/edit?usp=sharing',
  },
];

export default function GhiduriPage() {
  const [formularDeschis, setFormularDeschis] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nume: '',
    prenume: '',
    email: '',
    telefon: '',
    tipTest: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleOpenForm = (ghidId: string, tipTest: string) => {
    setFormularDeschis(ghidId);
    setFormData({ ...formData, tipTest });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/programari-teste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'pending',
          dataCreare: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ nume: '', prenume: '', email: '', telefon: '', tipTest: '' });
        setTimeout(() => {
          setFormularDeschis(null);
          setSubmitStatus('idle');
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="glass-card p-8 text-center">
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Ghid-uri</h1>
            <p className="text-base text-[var(--text-secondary)] max-w-2xl mx-auto">
              Ghiduri utile și programare pentru teste
            </p>
          </div>
        </motion.div>

        <div className="space-y-4">
          {ghiduri.map((ghid, index) => (
            <motion.div
              key={ghid.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              className="glass-card p-6 glass-hover"
            >
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                {ghid.titlu}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mb-4">{ghid.descriere}</p>

              <div className="flex flex-wrap gap-3">
                <a
                  href={ghid.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[var(--primary)] text-white px-4 py-2 rounded text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors duration-200 inline-block"
                >
                  Vezi Ghid →
                </a>
                <button
                  onClick={() =>
                    handleOpenForm(
                      ghid.id,
                      ghid.id === '1' ? 'Port-Armă' : 'Licență Tractări'
                    )
                  }
                  className="bg-[var(--accent)] text-white px-4 py-2 rounded text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors duration-200"
                >
                  Programează-ți testarea
                </button>
              </div>

              {/* Formular Programare */}
              {formularDeschis === ghid.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 pt-4 border-t border-[var(--border)]"
                >
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">
                    Formular Programare Testare
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                          Nume *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.nume}
                          onChange={(e) => setFormData({ ...formData, nume: e.target.value })}
                          className="w-full px-4 py-3 border border-[var(--glass-border)] rounded-lg bg-[var(--glass-bg)] backdrop-filter backdrop-blur-sm text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                          Prenume *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.prenume}
                          onChange={(e) => setFormData({ ...formData, prenume: e.target.value })}
                          className="w-full px-4 py-3 border border-[var(--glass-border)] rounded-lg bg-[var(--glass-bg)] backdrop-filter backdrop-blur-sm text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-[var(--glass-border)] rounded-lg bg-[var(--glass-bg)] backdrop-filter backdrop-blur-sm text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.telefon}
                        onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                        className="w-full px-4 py-3 border border-[var(--glass-border)] rounded-lg bg-[var(--glass-bg)] backdrop-filter backdrop-blur-sm text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                      />
                    </div>

                    {submitStatus === 'success' && (
                      <div className="bg-[var(--primary)]/15 border border-[var(--glass-border)] text-[var(--text-primary)] px-4 py-3 rounded-[var(--radius-md)]">
                        Cererea a fost trimisă! Veți fi contactat pentru programare.
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="bg-[var(--accent)]/12 border border-[var(--glass-border)] text-[var(--text-primary)] px-4 py-3 rounded-[var(--radius-md)]">
                        Eroare la trimitere. Încercați din nou.
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[var(--primary)] text-white px-4 py-2 rounded text-sm font-semibold hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-colors duration-200"
                      >
                        {isSubmitting ? 'Se trimite...' : 'Trimite Cererea'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormularDeschis(null);
                          setSubmitStatus('idle');
                        }}
                        className="bg-[var(--card-bg)] text-[var(--text-primary)] px-6 py-2 rounded-lg font-semibold border border-[var(--border)] hover:bg-[var(--hover-bg)]"
                      >
                        Anulează
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

