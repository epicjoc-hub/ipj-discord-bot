'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { apiClient, type AnuntEveniment } from '@/lib/client-api';
import { AnnouncementCard } from '@/components/ui/AnnouncementCard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export default function Home() {
  const [anunturiPolitie, setAnunturiPolitie] = useState<AnuntEveniment[]>([]);
  const [anunturiEvenimente, setAnunturiEvenimente] = useState<AnuntEveniment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [politieData, evenimenteData] = await Promise.all([
          apiClient.getAnunturiPolitie(),
          apiClient.getAnunturiEvenimente(),
        ]);

        if (isMounted) {
          setAnunturiPolitie(politieData || []);
          setAnunturiEvenimente(evenimenteData || []);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setError('Nu am putut încărca ultimele anunțuri.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const recentePolitie = useMemo(
    () => [...anunturiPolitie].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 3),
    [anunturiPolitie]
  );

  const recenteEvenimente = useMemo(
    () => [...anunturiEvenimente].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 3),
    [anunturiEvenimente]
  );

  const hasAnnouncements = recentePolitie.length > 0 || recenteEvenimente.length > 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        duration: 0.35,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,rgba(0,120,212,0.16),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(0,200,255,0.12),transparent_25%),var(--background)]">
      <section className="relative py-16">
        <div className="absolute inset-0 blur-3xl opacity-60" style={{ background: 'linear-gradient(120deg, rgba(0,120,212,0.22), rgba(0,255,255,0.18), transparent)' }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-card p-8 lg:p-10 shadow-2xl border border-[var(--glass-border)]"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0">
                  <Image
                    src="/images/logo-politia.png"
                    alt="Logo Inspectoratul de Poliție Județean Los Santos"
                    fill
                    className="object-contain drop-shadow-lg"
                    sizes="112px"
                  />
                </div>
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">Fluent inspired • Dark native</p>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] leading-[1.1]">
                    Inspectoratul de Poliție
                    <br />
                    <span className="text-[var(--primary)]">Județean Los Santos</span>
                  </h1>
                  <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-3xl">
                    Portal oficial cu anunțuri live, programări și administrare modernă. Interfață Fluent, animații fine și date servite exclusiv din backend.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/anunturi-politie" className="px-5 py-3 bg-[var(--primary)] text-white rounded-[12px] font-semibold shadow-lg shadow-[var(--primary)]/20 hover:bg-[var(--primary-hover)] transition">Anunțuri Poliție</Link>
                    <Link href="/anunturi-evenimente" className="px-5 py-3 glass-card border border-[var(--glass-border)] text-[var(--text-primary)] font-semibold hover:bg-[var(--glass-bg-hover)] transition">Evenimente</Link>
                    <Link href="/ghiduri" className="px-5 py-3 glass-card border border-[var(--glass-border)] text-[var(--text-primary)] font-semibold hover:bg-[var(--glass-bg-hover)] transition">Programări</Link>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: 'Anunțuri Poliție', value: anunturiPolitie.length, icon: '📢', color: 'text-[var(--primary)]' },
                { label: 'Evenimente', value: anunturiEvenimente.length, icon: '📅', color: 'text-[var(--accent)]' },
                { label: 'Disponibilitate', value: '24/7', icon: '🛰️', color: 'text-[var(--text-primary)]' },
                { label: 'Contact rapid', value: '112', icon: '🚨', color: 'text-[var(--accent-warning)]' },
              ].map((stat) => (
                <motion.div key={stat.label} variants={itemVariants} className="glass-card p-4 sm:p-5 border border-[var(--glass-border)] shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{stat.icon}</span>
                    <span className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Live</span>
                  </div>
                  <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-[var(--text-secondary)]">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-secondary)]">Flux live</p>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">Anunțuri Poliție</h2>
                </div>
                <Link href="/anunturi-politie" className="text-sm text-[var(--primary)] font-semibold hover:text-[var(--primary-hover)]">Toate →</Link>
              </div>
              {loading ? (
                <div className="grid md:grid-cols-2 gap-3">
                  <LoadingSkeleton lines={4} />
                  <LoadingSkeleton lines={4} />
                </div>
              ) : error ? (
                <EmptyState title="Eroare la încărcare" description={error} icon="⚠️" />
              ) : recentePolitie.length === 0 ? (
                <EmptyState />
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid md:grid-cols-2 gap-3">
                  {recentePolitie.map((anunt) => (
                    <motion.div key={anunt.id} variants={itemVariants}>
                      <AnnouncementCard
                        data={anunt}
                        href="/anunturi-politie"
                        variant="politie"
                        accent={anunt.categorie === 'Urgente' ? 'warning' : 'primary'}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-secondary)]">Calendar</p>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">Evenimente</h2>
                </div>
                <Link href="/anunturi-evenimente" className="text-sm text-[var(--primary)] font-semibold hover:text-[var(--primary-hover)]">Calendar →</Link>
              </div>
              {loading ? (
                <LoadingSkeleton lines={5} />
              ) : error ? (
                <EmptyState title="Eroare la încărcare" description={error} icon="⚠️" />
              ) : recenteEvenimente.length === 0 ? (
                <EmptyState />
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
                  {recenteEvenimente.map((ev) => (
                    <motion.div key={ev.id} variants={itemVariants}>
                      <AnnouncementCard data={ev} href="/anunturi-evenimente" variant="eveniment" accent="accent" />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[var(--background-secondary)] border-t border-[var(--glass-border)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {[{
              title: 'Depune o cerere',
              desc: 'Trimite rapid o cerere pentru avizarea evenimentelor publice.',
              href: '/cerere-eveniment',
            }, {
              title: 'Programează testarea',
              desc: 'Solicită un test pentru licențe direct din portalul ghiduri.',
              href: '/ghiduri',
            }, {
              title: 'Contact direct',
              desc: 'Canal dedicat pentru sesizări și întrebări urgente.',
              href: '/contact',
            }].map((action) => (
              <Link key={action.href} href={action.href} className="group">
                <div className="glass-card p-6 h-full border border-[var(--glass-border)] group-hover:border-[var(--primary)]/60 transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">{action.title}</h3>
                    <span className="text-[var(--primary)] group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{action.desc}</p>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
