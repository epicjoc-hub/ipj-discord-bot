'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export default function EditFAQ() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<FAQItem>>({});

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth !== 'true') {
      router.push('/admin');
      return;
    }
    loadFAQ();
  }, [router]);

  const loadFAQ = async () => {
    try {
      const response = await fetch('/data/faq.json');
      const data = await response.json();
      setFaqs(data);
    } catch (error) {
      console.error('Error loading FAQ:', error);
    }
  };

  const handleSave = () => {
    if (!editingId) return;
    const updated = faqs.map((item) =>
      item.id === editingId ? { ...item, ...formData } : item
    );
    setFaqs(updated);
    setEditingId(null);
    setFormData({});
    alert('Întrebarea a fost salvată!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Sigur doriți să ștergeți această întrebare?')) {
      setFaqs(faqs.filter((item) => item.id !== id));
      alert('Întrebarea a fost ștearsă!');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <header className="glass-navbar sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Editare FAQ</h1>
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
            <h2 className="text-2xl font-bold mb-4">Editează Întrebare</h2>
            <div className="space-y-4">
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
                <label className="block font-semibold mb-2">Întrebare</label>
                <input
                  type="text"
                  value={formData.question || ''}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-4 py-2 rounded-[var(--radius-md)]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Răspuns</label>
                <textarea
                  value={formData.answer || ''}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-4 py-2 rounded-[var(--radius-md)]"
                  rows={6}
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
                  category: '',
                  question: '',
                  answer: '',
                });
              }}
              className="px-6 py-3 rounded-[var(--radius-md)] font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
            >
              + Adaugă Întrebare Nouă
            </button>
          </div>
        )}

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="glass-card p-6">
              <div className="mb-2">
                <span className="bg-[var(--primary)]/20 text-[var(--primary)] px-3 py-1 rounded-full text-sm font-semibold">
                  {faq.category}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
              <p className="text-[var(--text-secondary)] mb-4">{faq.answer}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(faq.id);
                    setFormData(faq);
                  }}
                  className="px-4 py-2 rounded-[var(--radius-md)] bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
                >
                  Editează
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="px-4 py-2 rounded-[var(--radius-md)] bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
                >
                  Șterge
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

