'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';

const cerereSchema = z.object({
  // Informații Organizator
  nume: z.string().min(2, 'Numele trebuie să aibă minim 2 caractere'),
  prenume: z.string().min(2, 'Prenumele trebuie să aibă minim 2 caractere'),
  telefon: z.string().regex(/^\d{3}-\d{4}$/, 'Format telefon: xxx-xxxx'),
  discordTag: z.string().min(3, 'Discord tag invalid'),

  // Informații Eveniment
  tipEveniment: z.enum(['Cursa', 'Mars', 'Protest', 'Caritabil', 'Altul']),
  tipCustom: z.string().optional(),
  data: z.string().min(1, 'Selectează data'),
  ora: z.string().min(1, 'Selectează ora'),
  numarParticipanti: z.string().min(1, 'Introdu numărul de participanți'),
  asistentaMedicala: z.boolean(),
  organePolitie: z.boolean(),
  descriere: z.string().min(10, 'Descrierea trebuie să aibă minim 10 caractere'),
});

type CerereFormData = z.infer<typeof cerereSchema>;

export default function CerereEvenimentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<CerereFormData>({
    resolver: zodResolver(cerereSchema),
    defaultValues: {
      asistentaMedicala: false,
      organePolitie: false,
    },
  });

  const tipEveniment = watch('tipEveniment');

  const onSubmit = async (data: CerereFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/cereri-evenimente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          status: 'pending',
          dataCreare: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="glass-card p-8 text-center">
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
              Cerere Eveniment
            </h1>
            <p className="text-lg text-[var(--text-secondary)]">
              Completează formularul pentru a solicita aprobarea unui eveniment
            </p>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit(onSubmit)}
          className="glass-card p-8 space-y-8"
        >
          {/* Secțiune: Informații Organizator */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
              1. Informații Organizator
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                  Nume *
                </label>
                <input
                  type="text"
                  {...register('nume')}
                  className="w-full px-4 py-3 border border-[var(--glass-border)] rounded-lg bg-[var(--glass-bg)] backdrop-filter backdrop-blur-sm text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                />
                {errors.nume && (
                  <p className="mt-1 text-sm text-red-600">{errors.nume.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                  Prenume *
                </label>
                <input
                  type="text"
                  {...register('prenume')}
                  className="w-full px-4 py-3 border border-[var(--glass-border)] rounded-lg bg-[var(--glass-bg)] backdrop-filter backdrop-blur-sm text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                />
                {errors.prenume && (
                  <p className="mt-1 text-sm text-red-600">{errors.prenume.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                  Număr Telefon * (format: xxx-xxxx)
                </label>
                <input
                  type="text"
                  placeholder="123-4567"
                  {...register('telefon')}
                  className="w-full px-4 py-3 border border-[var(--glass-border)] rounded-lg bg-[var(--glass-bg)] backdrop-filter backdrop-blur-sm text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                />
                {errors.telefon && (
                  <p className="mt-1 text-sm text-red-600">{errors.telefon.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                  Discord Tag *
                </label>
                <input
                  type="text"
                  placeholder="@username"
                  {...register('discordTag')}
                  className="w-full px-4 py-3 border border-[var(--glass-border)] rounded-lg bg-[var(--glass-bg)] backdrop-filter backdrop-blur-sm text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                />
                {errors.discordTag && (
                  <p className="mt-1 text-sm text-red-600">{errors.discordTag.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Secțiune: Informații Eveniment */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
              2. Informații Eveniment
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                  Tip Eveniment *
                </label>
                <select
                  {...register('tipEveniment')}
                  className="w-full px-4 py-3 border border-[var(--glass-border)] rounded-lg bg-[var(--glass-bg)] backdrop-filter backdrop-blur-sm text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                >
                  <option value="">Selectează tipul</option>
                  <option value="Cursa">Cursă</option>
                  <option value="Mars">Marș</option>
                  <option value="Protest">Protest</option>
                  <option value="Caritabil">Caritabil</option>
                  <option value="Altul">Altul</option>
                </select>
                {errors.tipEveniment && (
                  <p className="mt-1 text-sm text-red-600">{errors.tipEveniment.message}</p>
                )}
              </div>

              {tipEveniment === 'Altul' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                    Specifică tipul evenimentului *
                  </label>
                  <input
                    type="text"
                    {...register('tipCustom')}
                    className="w-full px-4 py-3 border border-[var(--glass-border)] rounded-lg bg-[var(--glass-bg)] backdrop-filter backdrop-blur-sm text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                  />
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                    Data *
                  </label>
                  <input
                    type="date"
                    {...register('data')}
                    className="w-full px-4 py-3 border border-[var(--glass-border)] rounded-lg bg-[var(--glass-bg)] backdrop-filter backdrop-blur-sm text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                  />
                  {errors.data && (
                    <p className="mt-1 text-sm text-red-600">{errors.data.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                    Ora *
                  </label>
                  <input
                    type="time"
                    {...register('ora')}
                    className="w-full px-4 py-3 border border-[var(--glass-border)] rounded-lg bg-[var(--glass-bg)] backdrop-filter backdrop-blur-sm text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                  />
                  {errors.ora && (
                    <p className="mt-1 text-sm text-red-600">{errors.ora.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                  Număr Aproximativ Participanți *
                </label>
                <input
                  type="number"
                  min="1"
                  {...register('numarParticipanti')}
                  className="w-full px-4 py-3 border border-[var(--glass-border)] rounded-lg bg-[var(--glass-bg)] backdrop-filter backdrop-blur-sm text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                />
                {errors.numarParticipanti && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.numarParticipanti.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-4">
                  Necesități (opțional)
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('asistentaMedicala')}
                      className="w-5 h-5 text-[var(--primary)] rounded focus:ring-[var(--primary)]"
                    />
                    <span className="text-[var(--text-primary)]">Asistență Medicală</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('organePolitie')}
                      className="w-5 h-5 text-[var(--primary)] rounded focus:ring-[var(--primary)]"
                    />
                    <span className="text-[var(--text-primary)]">Organe de Poliție</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                  Descriere *
                </label>
                <textarea
                  rows={6}
                  {...register('descriere')}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
                  placeholder="Descrie evenimentul în detaliu..."
                />
                {errors.descriere && (
                  <p className="mt-1 text-sm text-red-600">{errors.descriere.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-200 px-4 py-3 rounded-lg"
            >
              Cererea a fost trimisă cu succes! Veți fi contactat în cel mai scurt timp.
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg"
            >
              A apărut o eroare la trimiterea cererii. Vă rugăm să încercați din nou.
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[var(--primary)] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[var(--primary-hover)] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Se trimite...' : 'Trimite Cererea'}
          </button>
        </motion.form>
      </div>
    </div>
  );
}

