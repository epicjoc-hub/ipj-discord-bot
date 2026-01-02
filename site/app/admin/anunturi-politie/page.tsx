'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminAnunturiPolitie() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [anunturi, setAnunturi] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

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
      const response = await fetch('/data/anunturi-politie.json');
      const data = await response.json();
      setAnunturi(data);
    } catch (error) {
      console.error('Error loading anunturi:', error);
    }
  };

  const handleSave = () => {
    if (editingId) {
      const updated = anunturi.map((a) =>
        a.id === editingId ? { ...a, ...formData } : a
      );
      setAnunturi(updated);
      setEditingId(null);
      setFormData({});
      alert('Modificările au fost salvate!');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="bg-[var(--primary)] text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Gestionare Anunțuri Poliție</h1>
            </div>
            <Link
              href="/admin/dashboard"
              className="bg-[var(--accent)] text-[var(--primary)] px-4 py-2 rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {editingId ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--card-bg)] rounded-xl shadow-md p-6 mb-6 border border-[var(--border)]"
          >
            <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">Editează Anunț</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2 text-[var(--text-primary)]">Categorie</label>
                <select
                  value={formData.categorie || ''}
                  onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)]"
                >
                  <option value="Comunicate">Comunicate</option>
                  <option value="Urgente">Urgente</option>
                  <option value="Raport Săptămânal">Raport Săptămânal</option>
                </select>
              </div>
              {['titlu', 'data', 'conținut', 'prioritate'].map((field) => (
                <div key={field}>
                  <label className="block font-semibold mb-2 text-[var(--text-primary)] capitalize">
                    {field}
                  </label>
                  {field === 'conținut' ? (
                    <textarea
                      value={formData[field] || ''}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)]"
                      rows={8}
                    />
                  ) : (
                    <input
                      type={field === 'data' ? 'date' : 'text'}
                      value={formData[field] || ''}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)]"
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="bg-[var(--primary)] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[var(--primary-hover)]"
                >
                  Salvează
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
                const newId = Date.now().toString();
                setEditingId(newId);
                setFormData({
                  id: newId,
                  categorie: 'Comunicate',
                  titlu: '',
                  data: new Date().toISOString().split('T')[0],
                  conținut: '',
                  prioritate: 'normal',
                });
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
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
              className="bg-[var(--card-bg)] rounded-xl shadow-md p-6 border border-[var(--border)]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold mb-2 inline-block ${
                      anunt.categorie === 'Urgente'
                        ? 'bg-[var(--accent-warning)]/20 text-[var(--accent-warning)]'
                        : anunt.categorie === 'Comunicate'
                          ? 'bg-[var(--primary)]/20 text-[var(--primary)]'
                          : 'bg-[var(--text-secondary)]/15 text-[var(--text-secondary)]'
                    }`}
                  >
                    {anunt.categorie}
                  </span>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">{anunt.titlu}</h3>
                  <p className="text-[var(--text-secondary)] mt-2 whitespace-pre-line">
                    {anunt.conținut}
                  </p>
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

