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

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="bg-[var(--primary)] text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Programări Teste</h1>
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
                        <strong>Email:</strong> {programare.email}
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
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                    Programat
                  </span>
                </div>
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-[var(--text-primary)]">📧 Model E-mail</h4>
                    <button
                      onClick={() => {
                        const email = `${programare.nume.toLowerCase()}.${programare.prenume.toLowerCase()}@bzone.ro`;
                        const data = new Date().toLocaleDateString('ro-RO');
                        const dataTest = new Date(programare.dataTest).toLocaleDateString('ro-RO');
                        const emailContent = `📧 MODEL E-MAIL

📤 Expeditor: relatiipublice@ipjbz.ro
📅 Data: ${data}
📎 Către: ${email}
📌 Subiect: PROGRAMARE TEST ${programare.tipTest}

-------------------------------------------------------------

Mesaj:

Testarea dvs. pentru ${programare.tipTest} a fost programată pentru:
📅 Data: ${dataTest}
🕐 Ora: ${programare.oraTest}
📞 Contact: ${programare.telefon}

Vă rugăm să vă prezentați la timp.

-------------------------------------------------------------

Cu stimă,
${programare.grad} ${programare.nume}
Biroul Relații Publice

🔁 Răspunde | ➡️ Redirecționează`;
                        navigator.clipboard.writeText(emailContent);
                        alert('Email copiat în clipboard!');
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold text-sm"
                    >
                      📋 Copiază Email
                    </button>
                  </div>
                  <pre className="text-xs bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto whitespace-pre-wrap">
{`📧 MODEL E-MAIL

📤 Expeditor: relatiipublice@ipjbz.ro
📅 Data: ${new Date().toLocaleDateString('ro-RO')}
📎 Către: ${programare.nume.toLowerCase()}.${programare.prenume.toLowerCase()}@bzone.ro
📌 Subiect: PROGRAMARE TEST ${programare.tipTest}

-------------------------------------------------------------

Mesaj:

Testarea dvs. pentru ${programare.tipTest} a fost programată pentru:
📅 Data: ${new Date(programare.dataTest).toLocaleDateString('ro-RO')}
🕐 Ora: ${programare.oraTest}
📞 Contact: ${programare.telefon}

Vă rugăm să vă prezentați la timp.

-------------------------------------------------------------

Cu stimă,
${programare.grad} ${programare.nume}
Biroul Relații Publice

🔁 Răspunde | ➡️ Redirecționează`}
                  </pre>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

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

