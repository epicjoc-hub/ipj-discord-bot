'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import anunturiPolitieData from '@/data/anunturi-politie.json';

export default function Home() {
  // Obține primele 3 anunțuri recente
  const recentAnunturi = anunturiPolitieData
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 3);

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

  return (
    <div className="min-h-screen">
      {/* Hero Dashboard */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 via-transparent to-[var(--accent)]/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-12"
          >
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32">
                <Image
                  src="/images/logo-politia.png"
                  alt="Logo Inspectoratul de Poliție Județean Los Santos"
                  fill
                  className="object-contain drop-shadow-lg"
                  sizes="128px"
                />
              </div>
            </div>

            {/* Welcome Message */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--text-primary)] leading-tight">
                Inspectoratul de Poliție
                <br />
                <span className="text-[var(--primary)]">Județean Los Santos</span>
              </h1>
              <p className="text-lg md:text-xl mb-6 text-[var(--text-secondary)] max-w-2xl mx-auto lg:mx-0">
                Servim și protejăm comunitatea noastră cu dedicare și profesionalism. 
                Suntem aici pentru siguranța și bunăstarea ta.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href="/cerere-eveniment"
                  className="glass-card px-6 py-3 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--glass-bg-hover)] text-center inline-block"
                >
                  Cerere Eveniment
                </Link>
                <Link
                  href="/anunturi-politie"
                  className="glass-card px-6 py-3 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--glass-bg-hover)] text-center inline-block"
                >
                  Vezi Anunțurile
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stats Dashboard */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {[
              { value: '24/7', label: 'Disponibilitate', icon: '🕐' },
              { value: '112', label: 'Număr Urgențe', icon: '🚨' },
              { value: '100%', label: 'Dedicare', icon: '💯' },
              { value: '2008', label: 'Anul Înființării', icon: '📅' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glass-card p-6 text-center glass-hover"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-[var(--primary)] mb-2">{stat.value}</div>
                <div className="text-sm text-[var(--text-secondary)] font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Widgets Grid */}
      <section className="py-12 bg-[var(--background-secondary)]">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8 text-center text-[var(--text-primary)]"
          >
            Servicii și Informații
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { href: '/anunturi-evenimente', icon: '📅', label: 'Anunțuri Evenimente', desc: 'Evenimente aprobate' },
              { href: '/anunturi-politie', icon: '📢', label: 'Anunțuri Poliție', desc: 'Comunicate oficiale' },
              { href: '/ghiduri', icon: '📚', label: 'Ghid-uri', desc: 'Ghiduri și documentație' },
            ].map((link, index) => (
              <motion.div key={link.href} variants={itemVariants}>
                <Link
                  href={link.href}
                  className="glass-card p-6 block text-center glass-hover h-full"
                >
                  <div className="text-5xl mb-4">{link.icon}</div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{link.label}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{link.desc}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Recent Activity */}
      {recentAnunturi.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-8 text-center text-[var(--text-primary)]"
            >
              Anunțuri Recente
            </motion.h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {recentAnunturi.map((anunt, index) => (
                <motion.div
                  key={anunt.id}
                  variants={itemVariants}
                  className="glass-card p-6 glass-hover"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      anunt.categorie === 'Urgente'
                        ? 'bg-[var(--accent-warning)]/20 text-[var(--accent-warning)]'
                        : anunt.categorie === 'Comunicate'
                        ? 'bg-[var(--primary)]/20 text-[var(--primary)]'
                        : 'bg-[var(--accent)]/20 text-[var(--accent)]'
                    }`}>
                      {anunt.categorie}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">
                      {new Date(anunt.data).toLocaleDateString('ro-RO')}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 line-clamp-2">
                    {anunt.titlu}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-4">
                    {anunt.conținut}
                  </p>
                  <Link
                    href="/anunturi-politie"
                    className="text-sm text-[var(--primary)] hover:text-[var(--primary-hover)] font-semibold"
                  >
                    Citește mai mult →
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            <div className="text-center mt-8">
              <Link
                href="/anunturi-politie"
                className="glass-card px-6 py-3 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--glass-bg-hover)] inline-block"
              >
                Vezi toate anunțurile
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Quick Actions Dashboard */}
      <section className="py-12 bg-[var(--background-secondary)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="glass-card p-8 text-center">
              <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">
                Despre Inspectoratul de Poliție Județean Los Santos
              </h2>
              <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-6 max-w-2xl mx-auto">
                Inspectoratul de Poliție Județean Los Santos este dedicat serviciului public și protecției comunității noastre. 
                Oferim servicii de calitate și menținem un standard înalt de profesionalism în toate activitățile noastre.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cerere-eveniment"
                  className="glass-card px-6 py-3 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--glass-bg-hover)] inline-block"
                >
                  Depune o Cerere
                </Link>
                <Link
                  href="/contact"
                  className="glass-card px-6 py-3 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--glass-bg-hover)] inline-block"
                >
                  Contactează-ne
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
