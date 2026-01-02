'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

export default function EditGallery() {
  const router = useRouter();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<GalleryItem>>({});

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth !== 'true') {
      router.push('/admin');
      return;
    }
    loadGallery();
  }, [router]);

  const loadGallery = async () => {
    try {
      const response = await fetch('/data/gallery.json');
      const data = await response.json();
      setGallery(data);
    } catch (error) {
      console.error('Error loading gallery:', error);
    }
  };

  const handleSave = () => {
    if (!editingId) return;
    const updated = gallery.map((item) =>
      item.id === editingId ? { ...item, ...formData } : item
    );
    setGallery(updated);
    setEditingId(null);
    setFormData({});
    alert('Imaginea a fost salvată!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Sigur doriți să ștergeți această imagine?')) {
      setGallery(gallery.filter((item) => item.id !== id));
      alert('Imaginea a fost ștearsă!');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <header className="glass-navbar sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Editare Galerie</h1>
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
            <h2 className="text-2xl font-bold mb-4">Editează Imagine</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Titlu</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-[var(--radius-md)]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Categorie</label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-[var(--radius-md)]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">URL Imagine</label>
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 rounded-[var(--radius-md)]"
                  placeholder="/images/gallery/image.jpg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Descriere</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-[var(--radius-md)]"
                  rows={3}
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
                  title: '',
                  category: '',
                  image: '',
                  description: '',
                });
              }}
              className="px-6 py-3 rounded-[var(--radius-md)] font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
            >
              + Adaugă Imagine Nouă
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div key={item.id} className="glass-card overflow-hidden">
              <div className="h-48 bg-[var(--hover-bg)] relative">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">{item.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setFormData(item);
                    }}
                    className="px-4 py-2 rounded-[var(--radius-md)] text-sm bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
                  >
                    Editează
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-2 rounded-[var(--radius-md)] text-sm bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
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

