'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, User, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Article } from '@/types/news';
import { formatRelativeTime } from '@/lib/utils';
import { newsData } from '@/data/news-data';

interface NewsCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export function NewsCard({ article, variant = 'default', className }: NewsCardProps) {
  const author = newsData.authors.find(a => a.id === article.authorId);
  const category = newsData.categories.find(c => c.id === article.categoryId);

  if (variant === 'featured') {
    return (
      <Card className={`overflow-hidden group hover:shadow-lg transition-all duration-300 news-card-hover ${className}`}>
        <div className="relative aspect-video">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {article.trending && (
            <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
              Breaking
            </Badge>
          )}
        </div>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary">{category?.name}</Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(article.publishedAt)}
            </div>
          </div>
          
          <Link href={`/news/${article.slug}`}>
            <h2 className="text-xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h2>
          </Link>
          
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {article.excerpt}
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
                  {article.views.toLocaleString()} views
                </div>
              </div>
            </div>
            <Badge variant="outline">{article.readTime} min read</Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className={`overflow-hidden group hover:shadow-md transition-all duration-300 ${className}`}>
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
                {category?.name}
              </Badge>
            </div>
            <Link href={`/news/${article.slug}`}>
              <h3 className="font-medium text-sm leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
            </Link>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{author?.name}</span>
              <span>•</span>
              <span>{formatRelativeTime(article.publishedAt)}</span>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden group hover:shadow-lg transition-all duration-300 news-card-hover ${className}`}>
      <div className="relative aspect-video">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {article.trending && (
          <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
            Trending
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {category?.name}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatRelativeTime(article.publishedAt)}
          </div>
        </div>
        
        <Link href={`/news/${article.slug}`}>
          <h3 className="font-semibold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{author?.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{article.views.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}