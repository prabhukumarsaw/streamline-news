'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Eye, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Article } from '@/types/news';
import { formatRelativeTime } from '@/lib/utils';

interface PopularArticlesProps {
  articles: Article[];
}

export function PopularArticles({ articles }: PopularArticlesProps) {
  const popularArticles = articles.slice(0, 3);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Popular Articles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {popularArticles.map((article, index) => (
          <div key={article.id} className="flex gap-3">
            <Badge variant="secondary" className="text-xs">
              {index + 1}
            </Badge>
            <div className="flex-1 space-y-2">
              <Link href={`/news/${article.slug}`}>
                <h4 className="text-sm font-medium leading-tight hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h4>
              </Link>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatRelativeTime(article.publishedAt)}</span>
                <span>•</span>
                <span>{article.views.toLocaleString()} views</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}