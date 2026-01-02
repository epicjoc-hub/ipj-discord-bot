'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verifică dacă există token în URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      if (token) {
        handleTokenAuth(token);
      }
    }
  }, []);

  const handleTokenAuth = async (token: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/auth/discord/verify?token=${token}`);
      const data = await response.json();

      if (response.ok && data.success) {
        // Obține datele utilizatorului
        const userResponse = await fetch(`/api/discord/user?discordId=${data.discordId}`);
        const userData = await userResponse.json();

        if (userResponse.ok && userData.success) {
          sessionStorage.setItem('admin_authenticated', 'true');
          sessionStorage.setItem('admin_user', JSON.stringify({
            discordId: data.discordId,
            grad: userData.user.grad,
            nume: userData.user.nume
          }));
          router.push('/admin/dashboard');
        } else {
          setError('Date utilizator negăsite. Te rugăm să-ți setezi gradul și numele în Discord.');
        }
      } else {
        setError(data.error || 'Token invalid sau expirat');
      }
    } catch (error) {
      console.error('Token auth error:', error);
      setError('Eroare la autentificare');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass-card p-8"
      >
        <div className="text-center mb-8">
          <div className="bg-[var(--primary)] text-white px-6 py-3 rounded-lg inline-block mb-4">
            <span className="font-bold text-2xl">IPJ</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin Panel</h1>
          <p className="text-[var(--text-secondary)] mt-2">Acces restricționat</p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
            <p className="mt-4 text-[var(--text-secondary)]">Se autentifică...</p>
          </div>
        ) : error ? (
          <div className="bg-[var(--accent-warning)]/10 border border-[var(--accent-warning)] text-[var(--accent-warning)] px-4 py-3 rounded-lg mb-4">
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-[var(--text-secondary)]">
              Pentru a accesa panoul de administrare, folosește butonul <strong>"Accesează Panel Admin"</strong> din Discord.
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              Link-ul de autentificare va fi trimis în mesaj privat pe Discord.
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <a href="/" className="text-[var(--primary)] hover:text-[var(--primary-hover)] text-sm">
            ← Înapoi la site
          </a>
        </div>
      </motion.div>
    </div>
  );
}
