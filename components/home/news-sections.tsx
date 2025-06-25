'use client';

import { useQuery } from '@tanstack/react-query';
import { NewsCard } from '@/components/news/news-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { getNewsByCategory, getLatestNews } from '@/services/news-service';
import { newsData } from '@/data/news-data';
import Link from 'next/link';

interface NewsSectionProps {
  title: string;
  categoryId?: string;
  showViewAll?: boolean;
}

function NewsSection({
  title,
  categoryId,
  showViewAll = true,
}: NewsSectionProps) {
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['news-section', categoryId || 'latest'],
    queryFn: () =>
      categoryId ? getNewsByCategory(categoryId) : getLatestNews(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  const displayArticles = articles.slice(0, 4);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        {showViewAll && (
          <Button variant="outline" asChild>
            <Link href={categoryId ? `/category/${categoryId}` : '/latest'}>
              View All
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayArticles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}

export function NewsSections() {
  return (
    <div className="space-y-12">
      <NewsSection title="TOP STORIES" />
      <NewsSection title="LATEST NEWS" categoryId="latest" />
      <NewsSection title="POPULAR ARTICLES" />
      <NewsSection title="SOCIETY" categoryId="society" />
      <NewsSection title="POLITICS" categoryId="politics" />
    </div>
  );
}
