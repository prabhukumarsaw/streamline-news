import { Metadata } from 'next';

interface MetadataProps {
  title: string;
  description: string;
  keywords?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    images?: string[];
    type?: string;
    publishedTime?: string;
    authors?: string[];
  };
  robots?: string;
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  openGraph,
  robots = 'index, follow',
}: MetadataProps): Metadata {
  const baseUrl = 'https://your-domain.com';
  const defaultImage = `${baseUrl}/og-image.jpg`;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    robots,
    openGraph: {
      title: openGraph?.title || title,
      description: openGraph?.description || description,
      url: baseUrl,
      siteName: 'Advanced News Platform',
      images: openGraph?.images || [defaultImage],
      locale: 'en_US',
      type: openGraph?.type as any || 'website',
      ...(openGraph?.publishedTime && { publishedTime: openGraph.publishedTime }),
      ...(openGraph?.authors && { authors: openGraph.authors }),
    },
    twitter: {
      card: 'summary_large_image',
      title: openGraph?.title || title,
      description: openGraph?.description || description,
      images: openGraph?.images || [defaultImage],
      creator: '@newsplatform',
    },
    alternates: {
      canonical: baseUrl,
    },
  };
}