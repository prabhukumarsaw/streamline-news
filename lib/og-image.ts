import { Article } from '@/types/news';

export function generateOpenGraphImage(article: Article): string {
  // Generate dynamic OG image URL
  const params = new URLSearchParams({
    title: article.title,
    excerpt: article.excerpt.substring(0, 100),
    image: article.image,
    author: article.authorId,
    category: article.categoryId,
  });

  return `${process.env.NEXT_PUBLIC_SITE_URL}/api/og?${params.toString()}`;
}

export function generateTwitterCard(article: Article) {
  return {
    card: 'summary_large_image',
    site: '@newsplatform',
    creator: '@newsplatform',
    title: article.title,
    description: article.excerpt,
    image: generateOpenGraphImage(article),
  };
}

export function generateFacebookCard(article: Article) {
  return {
    type: 'article',
    title: article.title,
    description: article.excerpt,
    image: generateOpenGraphImage(article),
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/news/${article.slug}`,
    site_name: 'Advanced News Platform',
    published_time: article.publishedAt,
    author: article.authorId,
    tags: article.tags,
  };
}