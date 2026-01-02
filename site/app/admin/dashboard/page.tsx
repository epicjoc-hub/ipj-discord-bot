'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [stats, setStats] = useState({
    cereriPending: 0,
    programariPending: 0,
    anunturi: 0,
  });

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_authenticated');
    const userStr = sessionStorage.getItem('admin_user');
    if (auth !== 'true') {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
      if (userStr) {
        setAdminUser(JSON.parse(userStr));
      }
      loadStats();
    }
  }, [router]);

  const loadStats = async () => {
    try {
      const [cereriRes, programariRes] = await Promise.all([
        fetch('/api/cereri-evenimente'),
        fetch('/api/programari-teste'),
      ]);
      const cereri = await cereriRes.json();
      const programari = await programariRes.json();
      setStats({
        cereriPending: cereri.filter((c: any) => c.status === 'pending').length,
        programariPending: programari.filter((p: any) => p.status === 'pending').length,
        anunturi: 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_user');
    router.push('/admin');
  };

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    { href: '/admin/anunturi-evenimente', icon: '📅', label: 'Anunțuri Evenimente', color: 'green' },
    { href: '/admin/anunturi-politie', icon: '📢', label: 'Anunțuri Poliție', color: 'purple' },
    { href: '/admin/cereri-evenimente', icon: '📝', label: 'Cereri Evenimente', color: 'yellow', badge: stats.cereriPending },
    { href: '/admin/programari-teste', icon: '📚', label: 'Programări Teste', color: 'orange', badge: stats.programariPending },
    { href: '/admin/edit-news', icon: '📰', label: 'Știri', color: 'red' },
    { href: '/admin/edit-officers', icon: '👥', label: 'Echipă', color: 'indigo' },
    { href: '/admin/edit-gallery', icon: '📸', label: 'Galerie', color: 'pink' },
    { href: '/admin/edit-faq', icon: '❓', label: 'FAQ', color: 'teal' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--background)] via-[var(--background)] to-black/20">
      <header className="glass-navbar border-b border-[var(--glass-border)] backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">Admin IPJ</p>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">Panou de Control</h1>
              <p className="text-sm text-[var(--text-secondary)]">
                {adminUser ? `${adminUser.grad} ${adminUser.nume}` : 'Utilizator' }
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="glass-card px-6 py-2.5 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--glass-bg-hover)] transition-colors duration-300"
            >
              Deconectare
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 space-y-8">
        <div className="glass-card p-8 border border-[var(--glass-border)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/10 via-transparent to-[var(--accent)]/10 pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-3">
            <h2 className="text-3xl font-bold text-[var(--text-primary)]">Bun venit în consolă</h2>
            <p className="text-base text-[var(--text-secondary)]">Accesează rapid zonele cheie și monitorizează cererile și programările.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{
            label: 'Cereri în așteptare',
            value: stats.cereriPending,
            icon: '📝',
          }, {
            label: 'Programări în așteptare',
            value: stats.programariPending,
            icon: '📚',
          }, {
            label: 'Anunțuri active',
            value: stats.anunturi,
            icon: '📢',
          }].map((stat) => (
            <div key={stat.label} className="glass-card p-6 border border-[var(--glass-border)] glass-hover">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
                  <div className="text-4xl font-bold text-[var(--primary)]">{stat.value}</div>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, idx) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <Link
                href={item.href}
                className="glass-card p-6 glass-hover block relative border border-[var(--glass-border)]"
              >
                {item.badge && item.badge > 0 && (
                  <span className="absolute top-4 right-4 bg-[var(--accent-warning)] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">{item.label}</h3>
                <p className="text-sm text-[var(--text-secondary)]">Gestionare {item.label.toLowerCase()}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="pt-2">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 text-sm text-[var(--primary)] hover:text-[var(--primary-hover)] font-semibold transition-colors duration-300"
          >
            🌐 Vizualizează Site
          </Link>
        </div>
      </div>
    </div>
  );
}
