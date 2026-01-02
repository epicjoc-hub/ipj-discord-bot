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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Editare Echipă</h1>
            <Link
              href="/admin/dashboard"
              className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {editingId ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Editează Ofițer</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Nume</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Funcție</label>
                <input
                  type="text"
                  value={formData.position || ''}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Departament</label>
                <input
                  type="text"
                  value={formData.department || ''}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Descriere</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={5}
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="bg-blue-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800"
                >
                  Salvează
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setFormData({});
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold"
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
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
            >
              + Adaugă Ofițer Nou
            </button>
          </div>
        )}

        <div className="space-y-4">
          {officers.map((officer) => (
            <div key={officer.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{officer.name}</h3>
                  <p className="text-blue-900 font-semibold">{officer.position}</p>
                  <p className="text-gray-600">{officer.department}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(officer.id);
                      setFormData(officer);
                    }}
                    className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
                  >
                    Editează
                  </button>
                  <button
                    onClick={() => handleDelete(officer.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
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

