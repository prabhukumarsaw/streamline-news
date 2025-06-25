import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, User, Eye, Share2, ArrowLeft, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SocialShare } from '@/components/social/social-share';
import { TrendingSidebar } from '@/components/home/trending-sidebar';
import { enhancedNewsService } from '@/services/enhanced-news-service';
import { formatRelativeTime, formatDate } from '@/lib/utils';
import { generateMetadata as generateMeta } from '@/lib/metadata';

interface NewsPageProps {
  params: {
    slug: string;
  };
}

// This would be replaced with actual API call
async function getArticle(slug: string) {
  try {
    const response = await enhancedNewsService.getNewsArticle({ slug });
    if (response.status && response.data) {
      return enhancedNewsService.transformArticle(response.data);
    }
    return null;
  } catch (error) {
    return null;
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/news" className="hover:text-primary">News</Link>
          <span>/</span>
          <span className="text-foreground">{article.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Article */}
          <div className="lg:col-span-3">
            <article className="max-w-4xl">
              {/* Back Button */}
              <Link href="/">
                <Button variant="ghost" className="mb-6 group">
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Home
                </Button>
              </Link>

              {/* Article Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">News</Badge>
                  {article.trending && (
                    <Badge className="bg-red-500">Trending</Badge>
                  )}
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(article.publishedAt)}
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                  {article.title}
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                  {article.excerpt}
                </p>
                
                {/* Article Meta */}
                <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{formatRelativeTime(article.publishedAt)}</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>{article.views.toLocaleString()} views</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{article.readTime} min read</span>
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
              <div className="prose prose-lg max-w-none dark:prose-invert mb-8">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>

              {/* Article Tags */}
              <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
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
                
                <Separator className="my-4" />
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Share this article:
                  </div>
                  <SocialShare article={article} />
                </div>
              </div>

              {/* Related Articles */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <Suspense fallback={<LoadingSpinner />}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* This would be populated with related articles */}
                    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                      <div className="relative aspect-video">
                        <Image
                          src="https://images.pexels.com/photos/3825572/pexels-photo-3825572.jpeg?auto=compress&cs=tinysrgb&w=600"
                          alt="Related article"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                          Related Article Title
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Brief description of the related article...
                        </p>
                        <div className="text-xs text-muted-foreground">
                          2 hours ago • 3 min read
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </Suspense>
              </div>
            </article>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={<LoadingSpinner />}>
              <TrendingSidebar />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}