'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { apiClient, type AnuntEveniment } from '@/lib/client-api';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

const categorii = ['Toate', 'Comunicate', 'Urgente', 'Raport Săptămânal'];

export default function AnunturiPolitiePage() {
  const [categorieSelectata, setCategorieSelectata] = useState('Toate');
  const [anunturi, setAnunturi] = useState<AnuntEveniment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await apiClient.getAnunturiPolitie();
        if (mounted) setAnunturi(data || []);
      } catch (err) {
        console.error(err);
        if (mounted) setError('Nu am putut încărca anunțurile.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const anunturiFiltrate = useMemo(() => {
    return categorieSelectata === 'Toate'
      ? anunturi
      : anunturi.filter((anunt) => anunt.categorie === categorieSelectata);
  }, [anunturi, categorieSelectata]);

  const stats = useMemo(
    () => ({
      total: anunturi.length,
      comunicate: anunturi.filter((a) => a.categorie === 'Comunicate').length,
      urgente: anunturi.filter((a) => a.categorie === 'Urgente').length,
      raport: anunturi.filter((a) => a.categorie === 'Raport Săptămânal').length,
    }),
    [anunturi]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="py-12 min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-10 text-center border border-[var(--glass-border)]">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-secondary)] mb-3">Conținut live</p>
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-3">Anunțuri Poliție</h1>
          <p className="text-base text-[var(--text-secondary)] max-w-2xl mx-auto">
            Comunicate oficiale, alerte și rapoarte publicate exclusiv din backend. Dacă nu există date, afișăm transparent statusul curent.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{ label: 'Total', value: stats.total }, { label: 'Comunicate', value: stats.comunicate }, { label: 'Urgente', value: stats.urgente }, { label: 'Rapoarte', value: stats.raport }].map((stat) => (
            <div key={stat.label} className="glass-card p-5 text-center border border-[var(--glass-border)]">
              <div className="text-3xl font-bold text-[var(--primary)]">{stat.value}</div>
              <div className="text-xs text-[var(--text-secondary)]">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="mb-4 flex flex-wrap gap-3 justify-center">
          {categorii.map((categorie) => (
            <button
              key={categorie}
              onClick={() => setCategorieSelectata(categorie)}
              className={`px-4 py-2 rounded-[12px] text-sm font-semibold transition-all duration-300 border ${
                categorieSelectata === categorie
                  ? 'bg-[var(--primary)]/20 text-[var(--primary)] border-[var(--primary)]/50'
                  : 'glass-card text-[var(--text-primary)] border-[var(--glass-border)] hover:border-[var(--primary)]/30'
              }`}
            >
              {categorie}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            <LoadingSkeleton lines={5} />
            <LoadingSkeleton lines={5} />
          </div>
        ) : error ? (
          <EmptyState title="Eroare" description={error} icon="⚠️" />
        ) : anunturiFiltrate.length === 0 ? (
          <EmptyState title="Nu există anunțuri disponibile" description="Nu există anunțuri în această categorie momentan." />
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
            {anunturiFiltrate.map((anunt) => (
              <motion.div
                key={anunt.id}
                variants={itemVariants}
                className={`glass-card p-6 glass-hover border-l-4 ${
                  anunt.categorie === 'Urgente'
                    ? 'border-[var(--accent-warning)]'
                    : anunt.categorie === 'Comunicate'
                      ? 'border-[var(--primary)]'
                      : 'border-[var(--accent)]'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 space-y-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                        anunt.categorie === 'Urgente'
                          ? 'bg-[var(--accent-warning)]/20 text-[var(--accent-warning)]'
                          : anunt.categorie === 'Comunicate'
                            ? 'bg-[var(--primary)]/20 text-[var(--primary)]'
                            : 'bg-[var(--accent)]/20 text-[var(--accent)]'
                      }`}
                    >
                      {anunt.categorie}
                    </span>
                    <h3 className="text-2xl font-semibold text-[var(--text-primary)]">{anunt.titlu}</h3>
                    <span className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
                      📅 {anunt.data ? new Date(anunt.data).toLocaleDateString('ro-RO', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                    </span>
                  </div>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                  {(anunt['conținut'] || (anunt as any).continut || '').trim()}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
