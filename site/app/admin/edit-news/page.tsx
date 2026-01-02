'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
}

export default function EditNews() {
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<NewsItem>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth !== 'true') {
      router.push('/admin');
      return;
    }
    loadNews();
  }, [router]);

  const loadNews = async () => {
    try {
      const response = await fetch('/data/news.json');
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleSave = async () => {
    if (!editingId) return;

    try {
      // În producție, aici ai face un API call pentru a salva datele
      // Pentru moment, doar actualizăm starea locală
      const updatedNews = news.map((item) =>
        item.id === editingId ? { ...item, ...formData } : item
      );
      setNews(updatedNews);
      setEditingId(null);
      setFormData({});
      alert('Știrea a fost salvată! (Notă: În producție, datele vor fi salvate permanent)');
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Eroare la salvare');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Sigur doriți să ștergeți această știre?')) {
      setNews(news.filter((item) => item.id !== id));
      alert('Știrea a fost ștearsă! (Notă: În producție, ștergerea va fi permanentă)');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Se încarcă...</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <header className="glass-navbar sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Editare Știri</h1>
              <p className="text-sm text-[var(--text-secondary)]">Administrare conținut (fără a modifica funcționalități)</p>
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
        {editingId ? (
          <div className="glass-card p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">Editează Știre</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2 text-[var(--text-primary)]">Titlu</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-[var(--radius-md)]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-[var(--text-primary)]">Data</label>
                <input
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 rounded-[var(--radius-md)]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-[var(--text-primary)]">Autor</label>
                <input
                  type="text"
                  value={formData.author || ''}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 rounded-[var(--radius-md)]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-[var(--text-primary)]">Categorie</label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-[var(--radius-md)]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-[var(--text-primary)]">Rezumat</label>
                <textarea
                  value={formData.excerpt || ''}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2 rounded-[var(--radius-md)]"
                  rows={3}
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-[var(--text-primary)]">Conținut</label>
                <textarea
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 rounded-[var(--radius-md)]"
                  rows={10}
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
                  slug: '',
                  title: '',
                  date: new Date().toISOString().split('T')[0],
                  author: 'Inspectoratul de Poliție Județean Los Santos',
                  category: '',
                  excerpt: '',
                  content: '',
                  image: '/images/news/default.jpg',
                });
              }}
              className="px-6 py-3 rounded-[var(--radius-md)] font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
            >
              + Adaugă Știre Nouă
            </button>
          </div>
        )}

        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.id} className="glass-card p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">{item.title}</h3>
                  <p className="text-[var(--text-secondary)] mb-2">{item.excerpt}</p>
                  <div className="text-sm text-[var(--text-secondary)]">
                    {item.date} • {item.category}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-4 py-2 rounded-[var(--radius-md)] bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
                  >
                    Editează
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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

