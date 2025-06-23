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

export function Hero() {
  const { data: trendingNews = [] } = useQuery({
    queryKey: ['trending-news'],
    queryFn: getTrendingNews,
  });

  const featuredArticle = trendingNews[0];
  const sideArticles = trendingNews.slice(1, 4);

  if (!featuredArticle) return null;

  const author = newsData.authors.find(a => a.id === featuredArticle.authorId);
  const category = newsData.categories.find(c => c.id === featuredArticle.categoryId);

  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Featured Article */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="relative aspect-video">
              <Image
                src={featuredArticle.image}
                alt={featuredArticle.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {featuredArticle.trending && (
                <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
                  Breaking
                </Badge>
              )}
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary">{category?.name}</Badge>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatRelativeTime(featuredArticle.publishedAt)}
                </div>
              </div>
              
              <Link href={`/news/${featuredArticle.slug}`}>
                <h2 className="text-2xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors">
                  {featuredArticle.title}
                </h2>
              </Link>
              
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {featuredArticle.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src={author?.avatar || ''}
                    alt={author?.name || ''}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium">{author?.name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {featuredArticle.views.toLocaleString()} views
                    </div>
                  </div>
                </div>
                <Badge variant="outline">{featuredArticle.readTime} min read</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Articles */}
        <div className="space-y-4">
          {sideArticles.map((article) => {
            const articleAuthor = newsData.authors.find(a => a.id === article.authorId);
            const articleCategory = newsData.categories.find(c => c.id === article.categoryId);
            
            return (
              <Card key={article.id} className="overflow-hidden group hover:shadow-md transition-shadow">
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
        </div>
      </div>
    </section>
  );
}