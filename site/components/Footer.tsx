export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass-footer mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-2">
          <p className="text-sm text-[var(--text-secondary)]">
            © {currentYear} Inspectoratul de Poliție Județean Los Santos. Toate drepturile rezervate.
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            Creeat de Victor Popescu [6067]
          </p>
        </div>
      </div>
    </footer>
  );
}
