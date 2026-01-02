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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Editare FAQ</h1>
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
            <h2 className="text-2xl font-bold mb-4">Editează Întrebare</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Categorie</label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Întrebare</label>
                <input
                  type="text"
                  value={formData.question || ''}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Răspuns</label>
                <textarea
                  value={formData.answer || ''}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={6}
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
                  category: '',
                  question: '',
                  answer: '',
                });
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
            >
              + Adaugă Întrebare Nouă
            </button>
          </div>
        )}

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-2">
                <span className="bg-blue-100 text-blue-900 px-3 py-1 rounded text-sm font-semibold">
                  {faq.category}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
              <p className="text-gray-600 mb-4">{faq.answer}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(faq.id);
                    setFormData(faq);
                  }}
                  className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
                >
                  Editează
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
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

