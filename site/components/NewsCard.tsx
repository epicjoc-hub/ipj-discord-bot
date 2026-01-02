import Link from 'next/link';
import Image from 'next/image';

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  image: string;
}

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  const formattedDate = new Date(news.date).toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/stiri/${news.slug}`}>
      <article className="glass-card overflow-hidden glass-hover h-full flex flex-col">
        <div className="relative h-48 bg-[var(--background-secondary)]">
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-[var(--primary)] text-white px-3 py-1.5 rounded-full text-xs font-semibold">
              {news.category}
            </span>
          </div>
        </div>
        <div className="p-6 flex-grow flex flex-col">
          <div className="text-xs text-[var(--text-secondary)] mb-3">
            {formattedDate} • {news.author}
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 line-clamp-2">
            {news.title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-3 flex-grow">
            {news.excerpt}
          </p>
          <div className="text-[var(--primary)] text-sm font-semibold hover:text-[var(--primary-hover)] transition-colors">
            Citește mai mult →
          </div>
        </div>
      </article>
    </Link>
  );
}
