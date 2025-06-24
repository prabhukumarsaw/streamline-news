'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, User, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getTrendingNews } from '@/services/news-service';
import { formatRelativeTime } from '@/lib/utils';
import { newsData } from '@/data/news-data';
import { HeroCarousel } from './hero-carousel';

export function Hero() {
  const { data: trendingNews = [] } = useQuery({
    queryKey: ['trending-news'],
    queryFn: getTrendingNews,
  });

  // Use API data if available, otherwise fallback to mock data
  const articles = trendingNews.length > 0 ? trendingNews : newsData.articles.slice(0, 4);
  const sideArticles = articles.slice(1, 4);

  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Featured Carousel */}
        <div className="lg:col-span-2">
          <HeroCarousel />
        </div>

        {/* Side Articles */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">
            Latest Updates
          </h2>
          
          {sideArticles.map((article) => {
            const articleAuthor = newsData.authors.find(a => a.id === article.authorId);
            const articleCategory = newsData.categories.find(c => c.id === article.categoryId);
            
            return (
              <Card key={article.id} className="overflow-hidden group hover:shadow-md transition-all duration-300">
                <div className="flex">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {articleCategory?.name}
                      </Badge>
                      {article.trending && (
                        <Badge className="text-xs bg-red-500">Live</Badge>
                      )}
                    </div>
                    <Link href={`/news/${article.slug}`}>
                      <h3 className="font-medium text-sm leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{articleAuthor?.name}</span>
                      <Separator orientation="vertical" className="h-3" />
                      <span>{formatRelativeTime(article.publishedAt)}</span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
          
          {/* View All Button */}
          <Link href="/latest">
            <Card className="p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <p className="text-primary font-medium">View All Latest News →</p>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
}