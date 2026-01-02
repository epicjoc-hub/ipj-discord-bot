import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contact - IPJ Los Santos',
  description: 'Contactați Inspectoratul de Poliție Județean Los Santos',
};

export default function ContactPage() {
  return (
    <div className="py-12 bg-[var(--background)]">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="glass-card p-8 text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Contactează-ne</h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Suntem aici pentru a vă ajuta. Contactați-ne folosind formularul de mai jos sau informațiile de contact.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Trimite un mesaj</h2>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Informații de contact</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Urgențe</h3>
                <p className="text-3xl font-bold text-[var(--primary)] mb-1">112</p>
                <p className="text-sm text-[var(--text-secondary)]">Apelați 112 pentru orice urgență</p>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Telefon</h3>
                <p className="text-lg text-[var(--text-primary)] mb-1">+40 XXX XXX XXX</p>
                <p className="text-sm text-[var(--text-secondary)]">Luni - Vineri: 08:00 - 16:00</p>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Email</h3>
                <p className="text-lg text-[var(--text-primary)] mb-1">contact@ipj-los-santos.ro</p>
                <p className="text-sm text-[var(--text-secondary)]">Răspundem în 24-48 de ore</p>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Adresă</h3>
                <p className="text-base text-[var(--text-primary)]">
                  Str. Principală, Nr. 1<br />
                  Los Santos, Județul Los Santos<br />
                  Cod poștal: XXXXX
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Program</h3>
                <div className="text-base text-[var(--text-primary)] space-y-1">
                  <p>Luni - Vineri: 08:00 - 16:00</p>
                  <p>Sâmbătă - Duminică: Închis</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-2">
                    * Pentru urgențe, apelați 112 (disponibil 24/7)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
