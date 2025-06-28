/**
 * Category News Section Component
 * Created by:  postgres
 * Description: News section organized by categories
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Eye, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCategories, useNewsByCategory } from '@/hooks/use-news-queries';
import { enhancedNewsService } from '@/services/enhanced-news-service';
import { formatRelativeTime } from '@/lib/utils';

interface CategoryNewsSectionProps {
  title?: string;
  showTabs?: boolean;
  defaultCategory?: string;
}

export function CategoryNewsSection({
  title = 'News by Category',
  showTabs = true,
  defaultCategory,
}: CategoryNewsSectionProps) {
  const { data: categoriesResponse } = useCategories();
  const categories = categoriesResponse || [];

  const [selectedCategory, setSelectedCategory] = useState(
    defaultCategory || categories[0]?.id || ''
  );

  const { data: newsResponse, isLoading } = useNewsByCategory(4, {
    per_page: 8,
  });

  const categoryNews = newsResponse;

  if (categories.length === 0) return null;

  const renderNewsGrid = (articles: any[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {articles.map((article, index) => (
        <Card
          key={article.id}
          className={`overflow-hidden group hover:shadow-lg transition-all duration-300 ${
            index === 0 ? 'md:col-span-2 md:row-span-2' : ''
          }`}
        >
          <div
            className={`relative ${index === 0 ? 'aspect-video' : 'aspect-square'}`}
          >
            <Image
              src={article.file_name || '/placeholder.png'}
              alt={article.story_title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {article.trending && (
              <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
                Trending
              </Badge>
            )}
          </div>
          <CardContent className={`p-4 ${index === 0 ? 'p-6' : ''}`}>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {categories.find((cat) => cat.id === selectedCategory)?.name ||
                  'News'}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatRelativeTime(article.publishedAt)}
              </div>
            </div>

            <Link href={`/news/${article.slug}`}>
              <h3
                className={`font-semibold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2 ${
                  index === 0 ? 'text-lg' : 'text-sm'
                }`}
              >
                {article.story_title}
              </h3>
            </Link>

            {index === 0 && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {article.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {/* <span>{article.views.toLocaleString()}</span> */}
              </div>
              <span>{article.readTime} min read</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (showTabs) {
    return (
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-8">
            {categories.slice(0, 6).map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="text-sm"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.slice(0, 6).map((category) => (
            <TabsContent key={category.id} value={category.id}>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <>
                  {renderNewsGrid(categoryNews)}
                  {categoryNews.length > 0 && (
                    <div className="text-center mt-8">
                      <Link href={`/category/${category.slug}`}>
                        <Button variant="outline" className="group">
                          View All {category.name} News
                          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link
          href={`/category/${categories.find((cat) => cat.id === selectedCategory)?.category_id}`}
        >
          <Button variant="outline">View All</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : (
        renderNewsGrid(categoryNews)
      )}
    </section>
  );
}
