import Image from 'next/image';

interface Officer {
  id: string;
  name: string;
  position: string;
  department: string;
  description: string;
  image: string;
  email: string;
}

interface OfficerCardProps {
  officer: Officer;
}

export default function OfficerCard({ officer }: OfficerCardProps) {
  return (
    <div className="glass-card overflow-hidden glass-hover">
      <div className="relative h-64 bg-[var(--background-secondary)]">
        <Image
          src={officer.image}
          alt={officer.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <div className="mb-3">
          <span className="bg-[var(--primary)]/20 text-[var(--primary)] px-3 py-1.5 rounded-full text-xs font-semibold">
            {officer.department}
          </span>
        </div>
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{officer.name}</h3>
        <p className="text-[var(--primary)] text-sm font-semibold mb-3">{officer.position}</p>
        <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-3">
          {officer.description}
        </p>
        <a
          href={`mailto:${officer.email}`}
          className="text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors text-sm font-semibold inline-flex items-center gap-1"
        >
          Contactează →
        </a>
      </div>
    </div>
  );
}
