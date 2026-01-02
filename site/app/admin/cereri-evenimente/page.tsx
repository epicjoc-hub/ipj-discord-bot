'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminCereriEvenimente() {
  const router = useRouter();
  const [cereri, setCereri] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [selectedCerere, setSelectedCerere] = useState<any>(null);
  const [actionModal, setActionModal] = useState<'aprobare' | 'respingere' | null>(null);
  const [mesaj, setMesaj] = useState('');

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
      loadCereri();
    }
  }, [router]);

  const loadCereri = async () => {
    try {
      const response = await fetch('/api/cereri-evenimente');
      const data = await response.json();
      setCereri(data);
    } catch (error) {
      console.error('Error loading cereri:', error);
    }
  };

  const handleAction = async () => {
    if (!selectedCerere || !actionModal || !mesaj.trim()) return;

    try {
      const response = await fetch(
        `/api/cereri-evenimente/${selectedCerere.id}/${actionModal}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mesaj,
            adminUser,
          }),
        }
      );

      if (response.ok) {
        setActionModal(null);
        setSelectedCerere(null);
        setMesaj('');
        loadCereri();
      }
    } catch (error) {
      console.error('Error processing cerere:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const cereriPending = cereri.filter((c) => c.status === 'pending');
  const cereriProcesate = cereri.filter((c) => c.status !== 'pending');

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="glass-navbar sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Cereri Evenimente</h1>
              <p className="text-sm text-[var(--text-secondary)]">Administrare cereri (dark-only)</p>
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
        {/* Cereri Pending */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            Cereri în Așteptare ({cereriPending.length})
          </h2>
          <div className="space-y-4">
            {cereriPending.map((cerere) => (
              <motion.div
                key={cerere.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--card-bg)] rounded-xl shadow-md p-6 border border-[var(--border)]"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                      {cerere.tipEveniment === 'Altul' ? cerere.tipCustom : cerere.tipEveniment}
                    </h3>
                    <div className="text-sm text-[var(--text-secondary)] space-y-1">
                      <p>
                        <strong>Organizator:</strong> {cerere.prenume} {cerere.nume}
                      </p>
                      <p>
                        <strong>Contact:</strong> {cerere.telefon} | {cerere.discordTag}
                      </p>
                      <p>
                        <strong>Data:</strong> {new Date(cerere.data).toLocaleDateString('ro-RO')} la{' '}
                        {cerere.ora}
                      </p>
                      <p>
                        <strong>Participanți:</strong> ~{cerere.numarParticipanti}
                      </p>
                      {cerere.asistentaMedicala && (
                        <span className="inline-block bg-[var(--accent-warning)]/20 text-[var(--accent-warning)] px-2 py-1 rounded-full text-xs mr-2">
                          Asistență Medicală
                        </span>
                      )}
                      {cerere.organePolitie && (
                        <span className="inline-block bg-[var(--primary)]/20 text-[var(--primary)] px-2 py-1 rounded-full text-xs">
                          Organe de Poliție
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedCerere(cerere);
                        setActionModal('aprobare');
                      }}
                      className="bg-[var(--primary)] text-white px-4 py-2 rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] font-semibold"
                    >
                      Aprobă
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCerere(cerere);
                        setActionModal('respingere');
                      }}
                      className="bg-[var(--accent)] text-white px-4 py-2 rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] font-semibold"
                    >
                      Respinge
                    </button>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-[var(--background)] rounded-lg">
                  <p className="text-[var(--text-secondary)] whitespace-pre-line">
                    {cerere.descriere}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Istoric */}
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Istoric</h2>
          <div className="space-y-4">
            {cereriProcesate.map((cerere) => (
              <motion.div
                key={cerere.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--card-bg)] rounded-xl shadow-md p-6 border border-[var(--border)]"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-[var(--text-primary)]">
                        {cerere.tipEveniment === 'Altul' ? cerere.tipCustom : cerere.tipEveniment}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          cerere.status === 'approved'
                            ? 'bg-[var(--primary)]/20 text-[var(--primary)]'
                            : 'bg-[var(--accent)]/20 text-[var(--accent)]'
                        }`}
                      >
                        {cerere.status === 'approved' ? 'Aprobat' : 'Respins'}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {cerere.prenume} {cerere.nume} • {new Date(cerere.data).toLocaleDateString('ro-RO')}
                    </p>
                  </div>
                </div>
                {cerere.istoric && cerere.istoric.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {cerere.istoric.map((entry: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 bg-[var(--background)] rounded-lg text-sm text-[var(--text-secondary)]"
                      >
                        <p>
                          <strong>{entry.actiune === 'aprobare' ? 'Aprobat' : 'Respins'}</strong> de{' '}
                          {entry.admin?.grad} {entry.admin?.nume} pe{' '}
                          {new Date(entry.data).toLocaleDateString('ro-RO')}
                        </p>
                        {entry.mesaj && <p className="mt-1">{entry.mesaj}</p>}
                      </div>
                    ))}
                  </div>
                )}
                {cerere.status !== 'pending' && cerere.istoric && cerere.istoric.length > 0 && (
                  <div className="mt-4 p-4 bg-[var(--hover-bg)] rounded-[var(--radius-md)] border border-[var(--glass-border)]">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-[var(--text-primary)]">📧 Model E-mail</h4>
                      <button
                        onClick={() => {
                          const istoric = cerere.istoric[cerere.istoric.length - 1];
                          const email = `${cerere.nume.toLowerCase()}.${cerere.prenume.toLowerCase()}@bzone.ro`;
                          const data = new Date().toLocaleDateString('ro-RO');
                          const subiect = cerere.status === 'approved' ? 'APROBARE' : 'RESPINGERE';
                          const emailContent = `📧 MODEL E-MAIL

📤 Expeditor: relatiipublice@ipjbz.ro
📅 Data: ${data}
📎 Către: ${email}
📌 Subiect: ${subiect} CERERE EVENIMENT

-------------------------------------------------------------

Mesaj:

${istoric.mesaj || (cerere.status === 'approved' ? 'Cererea dvs. pentru eveniment a fost aprobată.' : 'Cererea dvs. pentru eveniment a fost respinsă.')}

-------------------------------------------------------------

Cu stimă,
${istoric.admin.grad} ${istoric.admin.nume}
Biroul Relații Publice

🔁 Răspunde | ➡️ Redirecționează`;
                          navigator.clipboard.writeText(emailContent);
                          alert('Email copiat în clipboard!');
                        }}
                        className="bg-[var(--primary)] text-white px-4 py-2 rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] font-semibold text-sm"
                      >
                        📋 Copiază Email
                      </button>
                    </div>
                    <pre className="text-xs bg-[var(--glass-bg)] p-3 rounded-[var(--radius-md)] border border-[var(--glass-border)] overflow-x-auto whitespace-pre-wrap">
{`📧 MODEL E-MAIL

📤 Expeditor: relatiipublice@ipjbz.ro
📅 Data: ${new Date().toLocaleDateString('ro-RO')}
📎 Către: ${cerere.nume.toLowerCase()}.${cerere.prenume.toLowerCase()}@bzone.ro
📌 Subiect: ${cerere.status === 'approved' ? 'APROBARE' : 'RESPINGERE'} CERERE EVENIMENT

-------------------------------------------------------------

Mesaj:

${cerere.istoric[cerere.istoric.length - 1]?.mesaj || (cerere.status === 'approved' ? 'Cererea dvs. pentru eveniment a fost aprobată.' : 'Cererea dvs. pentru eveniment a fost respinsă.')}

-------------------------------------------------------------

Cu stimă,
${cerere.istoric[cerere.istoric.length - 1]?.admin?.grad} ${cerere.istoric[cerere.istoric.length - 1]?.admin?.nume}
Biroul Relații Publice

🔁 Răspunde | ➡️ Redirecționează`}
                    </pre>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Modal Aprobare/Respingere */}
        <AnimatePresence>
          {actionModal && selectedCerere && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => {
                setActionModal(null);
                setSelectedCerere(null);
                setMesaj('');
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[var(--card-bg)] rounded-xl shadow-xl p-6 max-w-md w-full border border-[var(--border)]"
              >
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                  {actionModal === 'aprobare' ? 'Aprobare' : 'Respingere'} Cerere
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    Mesaj *
                  </label>
                  <textarea
                    value={mesaj}
                    onChange={(e) => setMesaj(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)]"
                    placeholder="Introduceți mesajul pentru organizator..."
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleAction}
                    disabled={!mesaj.trim()}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold ${
                      actionModal === 'aprobare'
                        ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]'
                        : 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
                    } disabled:opacity-50`}
                  >
                    Confirmă
                  </button>
                  <button
                    onClick={() => {
                      setActionModal(null);
                      setSelectedCerere(null);
                      setMesaj('');
                    }}
                    className="flex-1 py-2 px-4 rounded-lg font-semibold bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--hover-bg)]"
                  >
                    Anulează
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

