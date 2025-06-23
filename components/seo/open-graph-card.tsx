'use client';

import { Article } from '@/types/news';
import { generateOpenGraphImage } from '@/lib/og-image';

interface OpenGraphCardProps {
  article: Article;
  variant?: 'twitter' | 'facebook' | 'linkedin' | 'whatsapp';
}

export function OpenGraphCard({ article, variant = 'twitter' }: OpenGraphCardProps) {
  const ogImage = generateOpenGraphImage(article);
  
  const cardData = {
    title: article.title,
    description: article.excerpt,
    image: ogImage,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/news/${article.slug}`,
    siteName: 'Advanced News Platform',
    type: 'article',
    publishedTime: article.publishedAt,
    author: article.authorId,
    tags: article.tags,
  };

  const getCardHTML = () => {
    switch (variant) {
      case 'twitter':
        return `
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@newsplatform" />
          <meta name="twitter:creator" content="@newsplatform" />
          <meta name="twitter:title" content="${cardData.title}" />
          <meta name="twitter:description" content="${cardData.description}" />
          <meta name="twitter:image" content="${cardData.image}" />
          <meta name="twitter:url" content="${cardData.url}" />
        `;
      
      case 'facebook':
        return `
          <meta property="og:type" content="article" />
          <meta property="og:title" content="${cardData.title}" />
          <meta property="og:description" content="${cardData.description}" />
          <meta property="og:image" content="${cardData.image}" />
          <meta property="og:url" content="${cardData.url}" />
          <meta property="og:site_name" content="${cardData.siteName}" />
          <meta property="article:published_time" content="${cardData.publishedTime}" />
          <meta property="article:author" content="${cardData.author}" />
          ${cardData.tags.map(tag => `<meta property="article:tag" content="${tag}" />`).join('\n')}
        `;
      
      case 'linkedin':
        return `
          <meta property="og:type" content="article" />
          <meta property="og:title" content="${cardData.title}" />
          <meta property="og:description" content="${cardData.description}" />
          <meta property="og:image" content="${cardData.image}" />
          <meta property="og:url" content="${cardData.url}" />
        `;
      
      default:
        return '';
    }
  };

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: getCardHTML() }}
      style={{ display: 'none' }}
    />
  );
}