'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Officer {
  id: string;
  name: string;
  position: string;
  department: string;
  description: string;
  image: string;
  email: string;
}

export default function EditOfficers() {
  const router = useRouter();
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Officer>>({});

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth !== 'true') {
      router.push('/admin');
      return;
    }
    loadOfficers();
  }, [router]);

  const loadOfficers = async () => {
    try {
      const response = await fetch('/data/officers.json');
      const data = await response.json();
      setOfficers(data);
    } catch (error) {
      console.error('Error loading officers:', error);
    }
  };

  const handleSave = () => {
    if (!editingId) return;
    const updated = officers.map((o) =>
      o.id === editingId ? { ...o, ...formData } : o
    );
    setOfficers(updated);
    setEditingId(null);
    setFormData({});
    alert('Ofițerul a fost salvat!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Sigur doriți să ștergeți acest ofițer?')) {
      setOfficers(officers.filter((o) => o.id !== id));
      alert('Ofițerul a fost șters!');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <header className="glass-navbar sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Editare Echipă</h1>
              <p className="text-sm text-[var(--text-secondary)]">Administrare conținut (fără a modifica funcționalități)</p>
            </div>
            <Link
              href="/admin/dashboard"
              className="glass-card px-4 py-2 rounded-[var(--radius-md)] font-semibold hover:bg-[var(--glass-bg-hover)]"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {editingId ? (
          <div className="glass-card p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Editează Ofițer</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Nume</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-[var(--radius-md)]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Funcție</label>
                <input
                  type="text"
                  value={formData.position || ''}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-2 rounded-[var(--radius-md)]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Departament</label>
                <input
                  type="text"
                  value={formData.department || ''}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2 rounded-[var(--radius-md)]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-[var(--radius-md)]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Descriere</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-[var(--radius-md)]"
                  rows={5}
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 rounded-[var(--radius-md)] font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
                >
                  Salvează
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setFormData({});
                  }}
                  className="px-6 py-2 rounded-[var(--radius-md)] font-semibold glass-card hover:bg-[var(--glass-bg-hover)]"
                >
                  Anulează
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <button
              onClick={() => {
                const newId = Date.now().toString();
                setEditingId(newId);
                setFormData({
                  id: newId,
                  name: '',
                  position: '',
                  department: '',
                  description: '',
                  email: '',
                  image: '/images/officers/default.jpg',
                });
              }}
              className="px-6 py-3 rounded-[var(--radius-md)] font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
            >
              + Adaugă Ofițer Nou
            </button>
          </div>
        )}

        <div className="space-y-4">
          {officers.map((officer) => (
            <div key={officer.id} className="glass-card p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{officer.name}</h3>
                  <p className="text-[var(--primary)] font-semibold">{officer.position}</p>
                  <p className="text-[var(--text-secondary)]">{officer.department}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(officer.id);
                      setFormData(officer);
                    }}
                    className="px-4 py-2 rounded-[var(--radius-md)] bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
                  >
                    Editează
                  </button>
                  <button
                    onClick={() => handleDelete(officer.id)}
                    className="px-4 py-2 rounded-[var(--radius-md)] bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
                  >
                    Șterge
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

