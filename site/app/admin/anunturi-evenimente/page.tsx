'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminAnunturiEvenimente() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [anunturi, setAnunturi] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth !== 'true') {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
      loadAnunturi();
    }
  }, [router]);

  const loadAnunturi = async () => {
    try {
      const response = await fetch('/api/anunturi-evenimente', { cache: 'no-store' });
      if (!response.ok) throw new Error('Eroare la încărcare');
      const data = await response.json();
      setAnunturi(data);
      setError(null);
    } catch (error) {
      console.error('Error loading anunturi:', error);
      setError('Nu am putut încărca anunțurile.');
    }
  };

  const handleSave = async () => {
    if (!editingId) return;

    setSaving(true);
    setError(null);

    const payload = {
      ...formData,
    };

    try {
      if (editingId === 'new') {
        const response = await fetch('/api/anunturi-evenimente', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Eroare la creare');
      } else {
        const response = await fetch(`/api/anunturi-evenimente/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Eroare la salvare');
      }

      setEditingId(null);
      setFormData({});
      await loadAnunturi();
    } catch (err) {
      console.error(err);
      setError('Nu am putut salva anunțul.');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="glass-navbar sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Gestionare Anunțuri Evenimente</h1>
              <p className="text-sm text-[var(--text-secondary)]">Administrare anunțuri (dark-only)</p>
            </div>
            <Link
              href="/admin/dashboard"
              className="glass-card px-4 py-2 rounded-[var(--radius-md)] font-semibold hover:bg-[var(--glass-bg-hover)] transition-colors"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 bg-[var(--accent)]/10 text-[var(--text-primary)] border border-[var(--accent)]/30 px-4 py-3 rounded-[var(--radius-md)]">
            {error}
          </div>
        )}
        {editingId ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mb-6"
          >
            <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">Editează Anunț</h2>
            <div className="space-y-4">
              {['titlu', 'data', 'ora', 'locatie', 'descriere', 'status'].map((field) => (
                <div key={field}>
                  <label className="block font-semibold mb-2 text-[var(--text-primary)] capitalize">
                    {field}
                  </label>
                  {field === 'descriere' ? (
                    <textarea
                      value={formData[field] || ''}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full px-4 py-2 rounded-[var(--radius-md)]"
                      rows={5}
                    />
                  ) : (
                    <input
                      type={field === 'data' ? 'date' : field === 'ora' ? 'time' : 'text'}
                      value={formData[field] || ''}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full px-4 py-2 rounded-[var(--radius-md)]"
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-4">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[var(--primary)] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[var(--primary-hover)] disabled:opacity-60"
                >
                    {saving ? 'Se salvează...' : 'Salvează'}
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setFormData({});
                  }}
                  className="bg-[var(--card-bg)] text-[var(--text-primary)] px-6 py-2 rounded-lg font-semibold border border-[var(--border)] hover:bg-[var(--hover-bg)]"
                >
                  Anulează
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="mb-6">
            <button
              onClick={() => {
                setEditingId('new');
                setFormData({
                  titlu: '',
                  data: new Date().toISOString().split('T')[0],
                  ora: '',
                  locatie: '',
                  descriere: '',
                  status: 'aprobat',
                });
              }}
              className="bg-[var(--primary)] text-white px-6 py-3 rounded-[var(--radius-md)] font-semibold hover:bg-[var(--primary-hover)]"
            >
              + Adaugă Anunț Nou
            </button>
          </div>
        )}

        <div className="space-y-4">
          {anunturi.map((anunt) => (
            <motion.div
              key={anunt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 border border-[var(--glass-border)] glass-hover"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">{anunt.titlu}</h3>
                  <p className="text-[var(--text-secondary)] mt-2 whitespace-pre-line">{anunt.descriere}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-[var(--text-secondary)] mt-3">
                    {anunt.data && <span className="px-3 py-1 rounded-full bg-white/5 border border-[var(--glass-border)]">📅 {new Date(anunt.data).toLocaleDateString('ro-RO')}</span>}
                    {anunt.ora && <span className="px-3 py-1 rounded-full bg-white/5 border border-[var(--glass-border)]">🕑 {anunt.ora}</span>}
                    {anunt.locatie && <span className="px-3 py-1 rounded-full bg-white/5 border border-[var(--glass-border)]">📍 {anunt.locatie}</span>}
                    {anunt.status && <span className="px-3 py-1 rounded-full bg-white/5 border border-[var(--glass-border)]">✅ {anunt.status}</span>}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditingId(anunt.id);
                    setFormData(anunt);
                  }}
                  className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary-hover)]"
                >
                  Editează
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

