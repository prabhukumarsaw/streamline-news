import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { NewsArticle } from '@/components/news/news-article';
import { RelatedNews } from '@/components/news/related-news';
import { Sidebar } from '@/components/layout/sidebar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { getNewsArticle } from '@/services/news-service';
import { generateMetadata as generateMeta } from '@/lib/metadata';

interface NewsPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const article = await getNewsArticle(params.slug);
  
  if (!article) {
    return generateMeta({
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    });
  }

  return generateMeta({
    title: `${article.title} | Advanced News Platform`,
    description: article.excerpt,
    keywords: article.tags,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
    },
  });
}

export default async function NewsPage({ params }: NewsPageProps) {
  const article = await getNewsArticle(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Suspense fallback={<LoadingSpinner />}>
              <NewsArticle article={article} />
            </Suspense>
            
            <div className="mt-12">
              <Suspense fallback={<LoadingSpinner />}>
                <RelatedNews categoryId={article.categoryId} currentSlug={params.slug} />
              </Suspense>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <Suspense fallback={<LoadingSpinner />}>
              <Sidebar />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  // In a real app, this would fetch all article slugs from your API
  return [
    { slug: 'breaking-news-technology-advancement' },
    { slug: 'world-politics-latest-developments' },
    { slug: 'sports-championship-results' },
  ];
}