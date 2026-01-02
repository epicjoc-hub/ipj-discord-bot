'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function AdminProgramariTeste() {
  const router = useRouter();
  const [programari, setProgramari] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [selectedProgramare, setSelectedProgramare] = useState<any>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dataTest, setDataTest] = useState<Date | null>(null);
  const [oraTest, setOraTest] = useState('');
  const [telefon, setTelefon] = useState('');
  const [grad, setGrad] = useState('');
  const [nume, setNume] = useState('');
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
        const user = JSON.parse(userStr);
        setGrad(user.grad || '');
        setNume(user.nume || '');
      }
      loadProgramari();
    }
  }, [router]);

  const loadProgramari = async () => {
    try {
      const response = await fetch('/api/programari-teste');
      const data = await response.json();
      setProgramari(data);
    } catch (error) {
      console.error('Error loading programari:', error);
    }
  };

  const handleSchedule = async () => {
    if (!selectedProgramare || !dataTest || !oraTest || !telefon || !grad || !nume) return;

    try {
      const response = await fetch(`/api/programari-teste/${selectedProgramare.id}/programare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataTest: dataTest.toISOString().split('T')[0],
          oraTest,
          telefon,
          grad,
          nume,
          adminUser,
        }),
      });

      if (response.ok) {
        setShowCalendar(false);
        setSelectedProgramare(null);
        setDataTest(null);
        setOraTest('');
        setTelefon('');
        loadProgramari();
      }
    } catch (error) {
      console.error('Error scheduling test:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const programariPending = programari.filter((p) => p.status === 'pending');
  const programariScheduled = programari.filter((p) => p.status === 'scheduled');

  const buildEmail = (programare: any) => {
    const now = new Date();
    const greeting = now.getHours() >= 18 ? 'Bună seara' : 'Bună ziua';
    const solicitant = `${programare.prenume} ${programare.nume}`.trim();
    const dataGenerarii = now.toLocaleDateString('ro-RO');
    const dataTestStr = programare.dataTest
      ? new Date(programare.dataTest).toLocaleDateString('ro-RO')
      : '—';

    return [
      '📧 MODEL E-MAIL',
      '',
      '📤 Expeditor: relatiipublice@ipjbz.ro',
      `📅 Data: ${dataGenerarii}`,
      `📎 Către: ${solicitant} @ Discord (${programare.discordTag || 'fără tag'})`,
      '📌 Subiect: APROBARE PROGRAMARE',
      '-------------------------------------------------------------',
      '',
      'Mesaj:',
      `${greeting}, ${solicitant},`,
      '',
      `Programarea pentru testul "${programare.tipTest}" a fost CONFIRMATĂ.`,
      `📅 Data: ${dataTestStr}`,
      `🕐 Ora: ${programare.oraTest || '—'}`,
      `📞 Contact: ${programare.telefon || '—'}`,
      '',
      'Vă rugăm să vă prezentați cu 10 minute înainte pentru formalități.',
      '',
      '-------------------------------------------------------------',
      '',
      'Cu stimă,',
      `${grad} ${nume}`.trim(),
      'Biroul Relații Publice',
      '',
      '🔁 Răspunde | ➡️ Redirecționează',
    ].join('\n');
  };

  const sendMail = async (programare: any) => {
    if (!programare?.discordTag) {
      setToast({ type: 'error', message: 'Discord Tag lipsă. Nu putem trimite mesajul.' });
      return;
    }

    setSendingId(programare.id);
    setToast(null);

    try {
      const emailContent = buildEmail(programare);
      const res = await fetch('/api/discord/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discordTag: programare.discordTag, message: emailContent }),
      });

      if (!res.ok) {
        throw new Error('Nu am putut trimite mesajul.');
      }

      setToast({ type: 'success', message: 'Mesaj trimis cu succes către Discord.' });
    } catch (error) {
      console.error(error);
      setToast({ type: 'error', message: 'Trimiterea a eșuat. Verifică Discord Tag-ul.' });
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="glass-navbar sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Programări Teste</h1>
              <p className="text-sm text-[var(--text-secondary)]">Administrare programări (dark-only)</p>
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
        {/* Programări Pending */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            Programări în Așteptare ({programariPending.length})
          </h2>
          <div className="space-y-4">
            {programariPending.map((programare) => (
              <motion.div
                key={programare.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--card-bg)] rounded-xl shadow-md p-6 border border-[var(--border)]"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                      {programare.tipTest}
                    </h3>
                    <div className="text-sm text-[var(--text-secondary)] space-y-1">
                      <p>
                        <strong>Nume:</strong> {programare.prenume} {programare.nume}
                      </p>
                      <p>
                        <strong>Discord Tag:</strong> {programare.discordTag || '—'}
                      </p>
                      <p>
                        <strong>Telefon:</strong> {programare.telefon}
                      </p>
                      <p>
                        <strong>Data cerere:</strong>{' '}
                        {new Date(programare.dataCreare).toLocaleDateString('ro-RO')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedProgramare(programare);
                      setShowCalendar(true);
                    }}
                    className="bg-[var(--primary)] text-white px-6 py-2 rounded-lg hover:bg-[var(--primary-hover)] font-semibold"
                  >
                    Programează
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Programări Scheduled */}
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            Programări Confirmate ({programariScheduled.length})
          </h2>
          <div className="space-y-4">
            {programariScheduled.map((programare) => (
              <motion.div
                key={programare.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--card-bg)] rounded-xl shadow-md p-6 border border-[var(--border)]"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                      {programare.tipTest}
                    </h3>
                    <div className="text-sm text-[var(--text-secondary)] space-y-1">
                      <p>
                        <strong>Nume:</strong> {programare.prenume} {programare.nume}
                      </p>
                      <p>
                        <strong>Data test:</strong> {new Date(programare.dataTest).toLocaleDateString('ro-RO')} la {programare.oraTest}
                      </p>
                      <p>
                        <strong>Contact:</strong> {programare.telefon}
                      </p>
                      <p>
                        <strong>Programat de:</strong> {programare.grad} {programare.nume}
                      </p>
                    </div>
                  </div>
                  <span className="bg-[var(--primary)]/20 text-[var(--primary)] px-3 py-1 rounded-full text-xs font-semibold">
                    Programat
                  </span>
                </div>
                <div className="mt-4 p-4 bg-[var(--hover-bg)] rounded-[var(--radius-md)] border border-[var(--glass-border)]">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-[var(--text-primary)]">📧 Previzualizare mesaj</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => sendMail(programare)}
                        disabled={sendingId === programare.id}
                        className="bg-[var(--primary)] text-white px-4 py-2 rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] font-semibold text-sm disabled:opacity-60"
                      >
                        {sendingId === programare.id ? 'Se trimite...' : 'Trimite mail'}
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(buildEmail(programare))}
                        className="glass-card px-4 py-2 rounded-[var(--radius-md)] font-semibold text-sm border border-[var(--glass-border)]"
                      >
                        📋 Copiază
                      </button>
                    </div>
                  </div>
                  <pre className="text-xs bg-[var(--glass-bg)] p-3 rounded-[var(--radius-md)] border border-[var(--glass-border)] overflow-x-auto whitespace-pre-wrap">
{buildEmail(programare)}
                  </pre>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

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

        {/* Calendar Modal */}
        <AnimatePresence>
          {showCalendar && selectedProgramare && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => {
                setShowCalendar(false);
                setSelectedProgramare(null);
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
                  Programează Test
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                      Data Test *
                    </label>
                    <DatePicker
                      selected={dataTest}
                      onChange={(date: Date | null) => setDataTest(date)}
                      minDate={new Date()}
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)]"
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                      Ora Test *
                    </label>
                    <input
                      type="time"
                      value={oraTest}
                      onChange={(e) => setOraTest(e.target.value)}
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                      Telefon Tester *
                    </label>
                    <input
                      type="tel"
                      value={telefon}
                      onChange={(e) => setTelefon(e.target.value)}
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                      Grad *
                    </label>
                    <input
                      type="text"
                      value={grad}
                      onChange={(e) => setGrad(e.target.value)}
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                      Nume *
                    </label>
                    <input
                      type="text"
                      value={nume}
                      onChange={(e) => setNume(e.target.value)}
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)]"
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleSchedule}
                    disabled={!dataTest || !oraTest || !telefon || !grad || !nume}
                    className="flex-1 bg-[var(--primary)] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[var(--primary-hover)] disabled:opacity-50"
                  >
                    Confirmă Programare
                  </button>
                  <button
                    onClick={() => {
                      setShowCalendar(false);
                      setSelectedProgramare(null);
                    }}
                    className="flex-1 bg-[var(--card-bg)] text-[var(--text-primary)] py-2 px-4 rounded-lg font-semibold border border-[var(--border)] hover:bg-[var(--hover-bg)]"
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

