'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { apiClient, type AnuntEveniment } from '@/lib/client-api';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

export default function AnunturiEvenimentePage() {
  const [anunturi, setAnunturi] = useState<AnuntEveniment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await apiClient.getAnunturiEvenimente();
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

  const aprobate = useMemo(() => anunturi.filter((a) => a.status === 'aprobat').length, [anunturi]);
  const inAsteptare = useMemo(() => anunturi.filter((a) => a.status !== 'aprobat').length, [anunturi]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="py-12 min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 space-y-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-10 text-center border border-[var(--glass-border)]">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-secondary)] mb-3">Flux live</p>
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-3">Anunțuri Evenimente</h1>
          <p className="text-base text-[var(--text-secondary)] max-w-2xl mx-auto">
            Toate evenimentele aprobate sunt încărcate exclusiv din API-ul botului. Niciun conținut hardcodat.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[{ label: 'Total', value: anunturi.length, color: 'text-[var(--primary)]' }, { label: 'Aprobate', value: aprobate, color: 'text-[var(--accent)]' }, { label: 'În așteptare', value: inAsteptare, color: 'text-[var(--accent-warning)]' }].map((stat) => (
            <div key={stat.label} className="glass-card p-5 text-center border border-[var(--glass-border)]">
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-[var(--text-secondary)]">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {loading ? (
          <div className="space-y-3">
            <LoadingSkeleton lines={5} />
            <LoadingSkeleton lines={5} />
          </div>
        ) : error ? (
          <EmptyState title="Eroare" description={error} icon="⚠️" />
        ) : anunturi.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
            {anunturi.map((anunt) => (
              <motion.div key={anunt.id} variants={itemVariants} className="glass-card p-6 border border-[var(--glass-border)] glass-hover">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-[var(--text-primary)]">{anunt.titlu}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-[var(--text-secondary)]">
                      {anunt.data && <span>📅 {new Date(anunt.data).toLocaleDateString('ro-RO')}</span>}
                      {anunt.ora && <span>🕑 {anunt.ora}</span>}
                      {anunt.locatie && <span>📍 {anunt.locatie}</span>}
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-xs font-semibold border ${anunt.status === 'aprobat' ? 'bg-[var(--primary)]/15 text-[var(--primary)] border-[var(--primary)]/40' : 'bg-[var(--accent-warning)]/15 text-[var(--accent-warning)] border-[var(--accent-warning)]/50'}`}>
                    {anunt.status === 'aprobat' ? 'Aprobat' : 'În așteptare'}
                  </span>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed">{anunt.descriere}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
