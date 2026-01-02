import Link from 'next/link';
import { motion } from 'framer-motion';
import { AnuntEveniment } from '@/lib/client-api';

export function AnnouncementCard({
  data,
  href,
  accent,
  variant = 'politie',
}: {
  data: AnuntEveniment;
  href?: string;
  accent?: 'primary' | 'warning' | 'accent';
  variant?: 'politie' | 'eveniment';
}) {
  const accentClasses = {
    primary: 'border-[var(--primary)]/60 bg-[var(--primary)]/10',
    warning: 'border-[var(--accent-warning)]/60 bg-[var(--accent-warning)]/10',
    accent: 'border-[var(--accent)]/60 bg-[var(--accent)]/10',
  }[accent || 'primary'];

  const content = (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`glass-card h-full p-6 border-l-4 ${accentClasses}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
            {variant === 'politie' ? data.categorie || 'Anunț' : 'Eveniment'}
          </div>
          <h3 className="text-xl font-semibold text-[var(--text-primary)] leading-tight line-clamp-2">
            {data.titlu}
          </h3>
          <div className="text-sm text-[var(--text-secondary)] flex flex-wrap gap-3">
            {data.data && <span>📅 {new Date(data.data).toLocaleDateString('ro-RO')}</span>}
            {variant === 'eveniment' && data.ora && <span>🕑 {data.ora}</span>}
            {variant === 'eveniment' && data.locatie && <span>📍 {data.locatie}</span>}
          </div>
        </div>
        <div className="text-xs px-3 py-1 rounded-full bg-white/10 text-[var(--text-primary)] border border-[var(--glass-border)]">
          {variant === 'politie' ? data.prioritate || data.categorie || 'info' : data.status || 'aprobat'}
        </div>
      </div>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
        {(data['conținut'] || data.continut || data.descriere || '').trim()}
      </p>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}
