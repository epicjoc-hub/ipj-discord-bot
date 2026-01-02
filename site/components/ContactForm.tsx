'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const contactSchema = z.object({
  name: z.string().min(2, 'Numele trebuie să aibă minim 2 caractere'),
  email: z.string().email('Email invalid'),
  subject: z.string().min(5, 'Subiectul trebuie să aibă minim 5 caractere'),
  message: z.string().min(10, 'Mesajul trebuie să aibă minim 10 caractere'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Form data:', data);
      setSubmitStatus('success');
      reset();
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
          Nume complet *
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="w-full px-4 py-3 border border-[var(--glass-border)] rounded-lg bg-[var(--glass-bg)] backdrop-filter backdrop-blur-sm text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
          placeholder="Introduceți numele dvs."
        />
        {errors.name && (
          <p className="mt-1 text-sm text-[var(--accent-warning)]">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className="w-full px-4 py-3 border border-[var(--glass-border)] rounded-lg bg-[var(--glass-bg)] backdrop-filter backdrop-blur-sm text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
          placeholder="exemplu@email.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-[var(--accent-warning)]">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
          Subiect *
        </label>
        <input
          type="text"
          id="subject"
          {...register('subject')}
          className="w-full px-4 py-3 border border-[var(--glass-border)] rounded-lg bg-[var(--glass-bg)] backdrop-filter backdrop-blur-sm text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
          placeholder="Subiectul mesajului"
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-[var(--accent-warning)]">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
          Mesaj *
        </label>
        <textarea
          id="message"
          {...register('message')}
          rows={6}
          className="w-full px-4 py-3 border border-[var(--glass-border)] rounded-lg bg-[var(--glass-bg)] backdrop-filter backdrop-blur-sm text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors resize-none"
          placeholder="Scrieți mesajul dvs. aici..."
        />
        {errors.message && (
          <p className="mt-1 text-sm text-[var(--accent-warning)]">{errors.message.message}</p>
        )}
      </div>

      {submitStatus === 'success' && (
        <div className="glass-card p-4 bg-[var(--accent)]/10 border-[var(--accent)]">
          <p className="text-sm text-[var(--accent)]">
            Mesajul a fost trimis cu succes! Vă vom contacta în cel mai scurt timp.
          </p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="glass-card p-4 bg-[var(--accent-warning)]/10 border-[var(--accent-warning)]">
          <p className="text-sm text-[var(--accent-warning)]">
            A apărut o eroare la trimiterea mesajului. Vă rugăm să încercați din nou.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[var(--primary)] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[var(--primary-hover)] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Se trimite...' : 'Trimite Mesaj'}
      </button>
    </form>
  );
}
