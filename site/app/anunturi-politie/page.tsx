'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import anunturiData from '@/data/anunturi-politie.json';

const categorii = ['Toate', 'Comunicate', 'Urgente', 'Raport Săptămânal'];

export default function AnunturiPolitiePage() {
  const [categorieSelectata, setCategorieSelectata] = useState('Toate');

  const anunturiFiltrate =
    categorieSelectata === 'Toate'
      ? anunturiData
      : anunturiData.filter((anunt) => anunt.categorie === categorieSelectata);

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

  const stats = {
    total: anunturiData.length,
    comunicate: anunturiData.filter(a => a.categorie === 'Comunicate').length,
    urgente: anunturiData.filter(a => a.categorie === 'Urgente').length,
    raport: anunturiData.filter(a => a.categorie === 'Raport Săptămânal').length,
  };

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
              Anunțuri Poliție
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Comunicate, anunțuri urgente și rapoarte săptămânale
            </p>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="glass-card p-6 text-center">
            <div className="text-2xl font-bold text-[var(--primary)] mb-1">{stats.total}</div>
            <div className="text-xs text-[var(--text-secondary)]">Total</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-2xl font-bold text-[var(--primary)] mb-1">{stats.comunicate}</div>
            <div className="text-xs text-[var(--text-secondary)]">Comunicate</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-2xl font-bold text-[var(--accent-warning)] mb-1">{stats.urgente}</div>
            <div className="text-xs text-[var(--text-secondary)]">Urgente</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-2xl font-bold text-[var(--accent)] mb-1">{stats.raport}</div>
            <div className="text-xs text-[var(--text-secondary)]">Rapoarte</div>
          </div>
        </motion.div>

        {/* Filtru Categorii */}
        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          {categorii.map((categorie) => (
            <button
              key={categorie}
              onClick={() => setCategorieSelectata(categorie)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                categorieSelectata === categorie
                  ? 'glass-card bg-[var(--primary)]/20 text-[var(--primary)] border-[var(--primary)]'
                  : 'glass-card text-[var(--text-primary)] hover:bg-[var(--glass-bg-hover)]'
              }`}
            >
              {categorie}
            </button>
          ))}
        </div>

        {/* Main Content - Dashboard Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
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
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold mb-3 inline-block ${
                      anunt.categorie === 'Urgente'
                        ? 'bg-[var(--accent-warning)]/20 text-[var(--accent-warning)]'
                        : anunt.categorie === 'Comunicate'
                          ? 'bg-[var(--primary)]/20 text-[var(--primary)]'
                          : 'bg-[var(--accent)]/20 text-[var(--accent)]'
                    }`}
                  >
                    {anunt.categorie}
                  </span>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                    {anunt.titlu}
                  </h3>
                  <span className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
                    📅 {new Date(anunt.data).toLocaleDateString('ro-RO', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                {anunt.conținut}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {anunturiFiltrate.length === 0 && (
          <div className="glass-card p-12 text-center">
            <p className="text-[var(--text-secondary)] text-lg">
              Nu există anunțuri în această categorie momentan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
