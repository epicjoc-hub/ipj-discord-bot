import OfficerCard from '@/components/OfficerCard';
import officersData from '@/data/officers.json';

export const metadata = {
  title: 'Echipă - IPJ Los Santos',
  description: 'Cunoașteți echipa Inspectoratului de Poliție Județean Los Santos',
};

export default function EchipaPage() {
  const departments = Array.from(new Set(officersData.map((o) => o.department)));

  return (
    <div className="py-12 bg-[var(--background)]">
      <div className="container mx-auto px-4">
        <div className="glass-card p-8 text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Echipa Noastră</h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            O echipă dedicată de profesioniști, angajați în servirea și protecția comunității noastre.
          </p>
        </div>

        <div className="glass-card p-6 mb-8">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Departamente</h2>
          <div className="flex flex-wrap gap-3">
            {departments.map((dept) => (
              <span
                key={dept}
                className="bg-[var(--primary)]/20 text-[var(--primary)] px-4 py-2 rounded-lg text-sm font-semibold"
              >
                {dept}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {officersData.map((officer) => (
            <OfficerCard key={officer.id} officer={officer} />
          ))}
        </div>

        {officersData.length === 0 && (
          <div className="glass-card p-12 text-center">
            <p className="text-[var(--text-secondary)]">Nu există informații despre echipă momentan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
