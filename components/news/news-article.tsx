'use client';

import Image from 'next/image';
import { Clock, User, Eye, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Article } from '@/types/news';
import { formatRelativeTime, formatDate } from '@/lib/utils';
import { newsData } from '@/data/news-data';
import { SocialShare } from '@/components/social/social-share';

interface NewsArticleProps {
  article: Article;
}

export function NewsArticle({ article }: NewsArticleProps) {
  const author = newsData.authors.find(a => a.id === article.authorId);
  const category = newsData.categories.find(c => c.id === article.categoryId);

  return (
    <article className="max-w-4xl mx-auto">
      {/* Article Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary">{category?.name}</Badge>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatRelativeTime(article.publishedAt)}
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-headline font-bold leading-tight mb-4">
          {article.title}
        </h1>
        
        <p className="text-xl text-muted-foreground leading-relaxed mb-6">
          {article.excerpt}
        </p>
        
        {/* Article Meta */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Image
              src={author?.avatar || ''}
              alt={author?.name || ''}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <p className="font-medium">{author?.name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{formatDate(article.publishedAt)}</span>
                <Separator orientation="vertical" className="h-3" />
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {article.views.toLocaleString()} views
                </div>
                <Separator orientation="vertical" className="h-3" />
                <span>{article.readTime} min read</span>
              </div>
            </div>
          </div>
          
          <SocialShare article={article} />
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Article Content */}
      <div 
        className="prose prose-lg max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Article Tags */}
      <div className="mt-8 pt-6 border-t">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium">Tags:</span>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <SocialShare article={article} className="justify-center" />
      </div>
    </article>
  );
}