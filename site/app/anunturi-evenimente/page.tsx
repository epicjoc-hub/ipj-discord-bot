'use client';

import { motion } from 'framer-motion';
import anunturiData from '@/data/anunturi-evenimente.json';

export default function AnunturiEvenimentePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  const aprobate = anunturiData.filter(a => a.status === 'aprobat').length;
  const inAsteptare = anunturiData.filter(a => a.status === 'in asteptare').length;

  return (
    <div className="py-12 min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="glass-card p-8 text-center">
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
              Anunțuri Evenimente
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Rămâneți la curent cu evenimentele aprobate din comunitate
            </p>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-[var(--primary)] mb-2">{anunturiData.length}</div>
            <div className="text-sm text-[var(--text-secondary)]">Total Evenimente</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-[var(--accent)] mb-2">{aprobate}</div>
            <div className="text-sm text-[var(--text-secondary)]">Aprobate</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-[var(--accent-warning)] mb-2">{inAsteptare}</div>
            <div className="text-sm text-[var(--text-secondary)]">În Așteptare</div>
          </div>
        </motion.div>

        {/* Main Content - Dashboard List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {anunturiData.map((anunt) => (
            <motion.div
              key={anunt.id}
              variants={itemVariants}
              className="glass-card p-6 glass-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
                    {anunt.titlu}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)] mb-3">
                    <span className="flex items-center gap-1">
                      📅 {new Date(anunt.data).toLocaleDateString('ro-RO')}
                    </span>
                    <span className="flex items-center gap-1">
                      🕐 {anunt.ora}
                    </span>
                    <span className="flex items-center gap-1">
                      📍 {anunt.locatie}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-xs font-semibold flex-shrink-0 ${
                    anunt.status === 'aprobat'
                      ? 'bg-[var(--accent)]/20 text-[var(--accent)]'
                      : 'bg-[var(--accent-warning)]/20 text-[var(--accent-warning)]'
                  }`}
                >
                  {anunt.status === 'aprobat' ? '✓ Aprobat' : '⏳ În așteptare'}
                </span>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">{anunt.descriere}</p>
            </motion.div>
          ))}
        </motion.div>

        {anunturiData.length === 0 && (
          <div className="glass-card p-12 text-center">
            <p className="text-[var(--text-secondary)] text-lg">
              Nu există anunțuri de evenimente momentan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
