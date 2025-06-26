import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AdvancedNewsDetail } from '@/components/news/advanced-news-detail';
import { enhancedNewsService } from '@/services/enhanced-news-service';
import { generateMetadata as generateMeta } from '@/lib/metadata';

interface NewsPageProps {
  params: {
    slug: string;
  };
}

// Get article data
async function getArticle(slug: string) {
  try {
    const article = await enhancedNewsService.getNewsArticle({ slug });
    return article;
  } catch (error) {
    return null;
  }
}

// Get related articles
async function getRelatedArticles(categoryId: string, currentSlug: string) {
  try {
    const articles = await enhancedNewsService.getNewsByCategory(parseInt(categoryId));
    return articles.filter(article => article.slug !== currentSlug).slice(0, 4);
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const article = await getArticle(params.slug);
  
  if (!article) {
    return generateMeta({
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    });
  }

  return generateMeta({
    title: `${article.title} | The Japan News`,
    description: article.excerpt,
    keywords: article.tags,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
      type: 'article',
      publishedTime: article.publishedAt,
    },
  });
}

export default async function NewsPage({ params }: NewsPageProps) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article.categoryId, article.slug);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <AdvancedNewsDetail 
            article={article} 
            relatedArticles={relatedArticles}
          />
        </Suspense>
      </div>
    </div>
  );
}