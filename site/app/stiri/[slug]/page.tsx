import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import newsData from '@/data/news.json';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return newsData.map((news) => ({
    slug: news.slug,
  }));
}

export default function NewsDetailPage({ params }: PageProps) {
  const news = newsData.find((n) => n.slug === params.slug);

  if (!news) {
    notFound();
  }

  const formattedDate = new Date(news.date).toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/stiri"
          className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-semibold mb-6 inline-block"
        >
          ← Înapoi la știri
        </Link>

        <article className="glass-card p-6">
          <div className="mb-6">
            <span className="bg-[var(--primary)]/20 text-[var(--primary)] px-4 py-2 rounded-full text-sm font-semibold">
              {news.category}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">{news.title}</h1>

          <div className="text-[var(--text-secondary)] mb-8">
            <p>
              {formattedDate} • {news.author}
            </p>
          </div>

          <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={news.image}
              alt={news.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
              {news.content}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

