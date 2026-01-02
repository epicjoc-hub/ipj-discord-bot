import { motion } from 'framer-motion';

export function EmptyState({
  title = 'Nu există anunțuri disponibile',
  description = 'Revenim în curând cu informații actualizate.',
  icon = 'ℹ️',
}: {
  title?: string;
  description?: string;
  icon?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-10 text-center border border-[var(--glass-border)]"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">{description}</p>
    </motion.div>
  );
}
