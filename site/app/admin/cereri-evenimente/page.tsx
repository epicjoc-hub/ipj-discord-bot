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
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

  const buildEmail = (cerere: any, actiune: 'aprobare' | 'respingere', customMessage?: string) => {
    const now = new Date();
    const greeting = now.getHours() >= 18 ? 'Bună seara' : 'Bună ziua';
    const solicitant = `${cerere.prenume} ${cerere.nume}`.trim();
    const dataGenerarii = now.toLocaleDateString('ro-RO');
    const dataEveniment = cerere.data ? new Date(cerere.data).toLocaleDateString('ro-RO') : '—';
    const corpMesaj =
      customMessage?.trim() ||
      (actiune === 'aprobare'
        ? `Cererea pentru evenimentul "${cerere.tipEveniment === 'Altul' ? cerere.tipCustom : cerere.tipEveniment}" a fost APROBATĂ.\n📅 Data: ${dataEveniment} \n🕑 Ora: ${cerere.ora || '—'}\n📍 Locație: ${cerere.locatie || 'Los Santos'}\n\nVă rugăm să respectați indicațiile primite și să colaborați cu echipajele desemnate.`
        : `Cererea pentru evenimentul "${cerere.tipEveniment === 'Altul' ? cerere.tipCustom : cerere.tipEveniment}" a fost RESPINSĂ.\nMotiv: ${customMessage || 'Neconformități identificate în documentație.'}`);

    return [
      '📧 MODEL E-MAIL',
      '',
      '📤 Expeditor: relatiipublice@ipjbz.ro',
      `📅 Data: ${dataGenerarii}`,
      `📎 Către: ${solicitant} @ Discord (${cerere.discordTag || 'fără tag'})`,
      `📌 Subiect: ${actiune === 'aprobare' ? 'APROBARE' : 'RESPINGERE'} EVENIMENT`,
      '-------------------------------------------------------------',
      '',
      'Mesaj:',
      `${greeting}, ${solicitant},`,
      '',
      corpMesaj,
      '',
      '-------------------------------------------------------------',
      '',
      'Cu stimă,',
      `${adminUser?.grad || ''} ${adminUser?.nume || 'Admin'}`.trim(),
      'Biroul Relații Publice',
      '',
      '🔁 Răspunde | ➡️ Redirecționează',
    ].join('\n');
  };

  const sendMail = async (cerere: any, actiune: 'aprobare' | 'respingere', mesajCurent?: string) => {
    if (!cerere?.discordTag) {
      setToast({ type: 'error', message: 'Discord Tag lipsește pentru această cerere.' });
      return;
    }

    setSendingId(cerere.id);
    setToast(null);

    try {
      const emailContent = buildEmail(cerere, actiune, mesajCurent || mesaj);
      const res = await fetch('/api/discord/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discordTag: cerere.discordTag, message: emailContent }),
      });

      if (!res.ok) throw new Error('Eroare la trimiterea mesajului');

      setToast({ type: 'success', message: 'Mesaj trimis cu succes către Discord.' });
    } catch (error) {
      console.error(error);
      setToast({ type: 'error', message: 'Nu am putut trimite mesajul. Verifică Discord Tag-ul.' });
    } finally {
      setSendingId(null);
    }
  };

  const handleAction = async (shouldNotify = false) => {
    if (!selectedCerere || !actionModal || !mesaj.trim()) return;

    try {
      const cerereCurenta = selectedCerere;
      const response = await fetch(`/api/cereri-evenimente/${cerereCurenta.id}/${actionModal}` ,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mesaj, adminUser }),
      });

      if (response.ok) {
        if (shouldNotify) {
          await sendMail(cerereCurenta, actionModal, mesaj);
        }
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
                  <div className="mt-4 p-4 bg-[var(--hover-bg)] rounded-[var(--radius-md)] border border-[var(--glass-border)] space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-[var(--text-primary)]">📧 Previzualizare mesaj</h4>
                      <div className="flex gap-2">
                        {(() => {
                          const lastEntry = cerere.istoric[cerere.istoric.length - 1];
                          return (
                            <>
                              <button
                                onClick={() => sendMail(cerere, cerere.status === 'approved' ? 'aprobare' : 'respingere', lastEntry?.mesaj)}
                                disabled={sendingId === cerere.id}
                                className="bg-[var(--primary)] text-white px-4 py-2 rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] font-semibold text-sm disabled:opacity-60"
                              >
                                {sendingId === cerere.id ? 'Se trimite...' : 'Trimite mail'}
                              </button>
                              <button
                                onClick={() => navigator.clipboard.writeText(buildEmail(cerere, cerere.status === 'approved' ? 'aprobare' : 'respingere', lastEntry?.mesaj))}
                                className="glass-card px-4 py-2 rounded-[var(--radius-md)] font-semibold text-sm border border-[var(--glass-border)]"
                              >
                                📋 Copiază
                              </button>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    {(() => {
                      const lastEntry = cerere.istoric[cerere.istoric.length - 1];
                      return (
                        <pre className="text-xs bg-[var(--glass-bg)] p-3 rounded-[var(--radius-md)] border border-[var(--glass-border)] overflow-x-auto whitespace-pre-wrap">
{buildEmail(cerere, cerere.status === 'approved' ? 'aprobare' : 'respingere', lastEntry?.mesaj)}
                        </pre>
                      );
                    })()}
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
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction()}
                    disabled={!mesaj.trim()}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold ${actionModal === 'aprobare' ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]' : 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'} disabled:opacity-50`}
                  >
                    Confirmă
                  </button>
                  <button
                    onClick={() => handleAction(true)}
                    disabled={!mesaj.trim() || sendingId === selectedCerere?.id}
                    className="flex-1 py-2 px-4 rounded-lg font-semibold bg-[var(--primary)]/15 text-[var(--text-primary)] border border-[var(--primary)]/30 hover:bg-[var(--primary)]/25 disabled:opacity-50"
                  >
                    {sendingId === selectedCerere?.id ? 'Se trimite...' : 'Trimite mail'}
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

        {toast && (
          <div
            className={`fixed bottom-4 right-4 px-4 py-3 rounded-[var(--radius-md)] shadow-lg border ${
              toast.type === 'success'
                ? 'bg-[var(--primary)]/15 border-[var(--primary)]/40 text-[var(--text-primary)]'
                : 'bg-[var(--accent)]/15 border-[var(--accent)]/40 text-[var(--text-primary)]'
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}

