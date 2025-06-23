'use client';

import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Article } from '@/types/news';
import { getLatestNews } from '@/services/news-service';
import { NewsCard } from '@/components/news/news-card';

interface InfiniteNewsListProps {
  initialArticles?: Article[];
  category?: string;
}

export function InfiniteNewsList({ initialArticles = [], category }: InfiniteNewsListProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const { data: newArticles, isLoading } = useQuery({
    queryKey: ['infinite-news', page, category],
    queryFn: () => getLatestNews(page, 10, category),
    enabled: page > 1,
  });

  useEffect(() => {
    if (newArticles && newArticles.length > 0) {
      setArticles(prev => [...prev, ...newArticles]);
      if (newArticles.length < 10) {
        setHasMore(false);
      }
    } else if (newArticles && newArticles.length === 0) {
      setHasMore(false);
    }
  }, [newArticles]);

  const fetchMoreData = () => {
    if (!isLoading) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <InfiniteScroll
      dataLength={articles.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      }
      endMessage={
        <Card className="mt-8">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              You've reached the end of the news feed!
            </p>
          </CardContent>
        </Card>
      }
      refreshFunction={() => {
        setPage(1);
        setArticles(initialArticles);
        setHasMore(true);
      }}
      pullDownToRefresh
      pullDownToRefreshThreshold={50}
      pullDownToRefreshContent={
        <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
      }
      releaseToRefreshContent={
        <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <NewsCard key={`${article.id}-${index}`} article={article} />
        ))}
      </div>
    </InfiniteScroll>
  );
}