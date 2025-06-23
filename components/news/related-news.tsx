'use client';

import { useQuery } from '@tanstack/react-query';
import { NewsCard } from './news-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { getRelatedNews } from '@/services/news-service';

interface RelatedNewsProps {
  categoryId: string;
  currentSlug: string;
}

export function RelatedNews({ categoryId, currentSlug }: RelatedNewsProps) {
  const { data: relatedArticles = [], isLoading } = useQuery({
    queryKey: ['related-news', categoryId, currentSlug],
    queryFn: () => getRelatedNews(categoryId, currentSlug),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relatedArticles.map((article) => (
          <NewsCard key={article.id} article={article} variant="compact" />
        ))}
      </div>
    </section>
  );
}