'use server';

import { db } from '@/db';
import { content } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function getNews(limit = 15) {
  try {
    console.log('Fetching news from database...');
    const articles = await db
      .select()
      .from(content)
      .orderBy(desc(content.publishedAt))
      .limit(limit);
    
    console.log(`Fetched ${articles.length} articles from database`);
    return articles;
  } catch (error) {
    console.error('Error fetching news from database:', error);
    
    // Return fallback data if database fails
    return [
      {
        id: "1",
        title: "Database Connection Error - Using Fallback Data",
        slug: "database-connection-error",
        excerpt: "Unable to connect to database. Please check your configuration.",
        contentBody: "<p>Database connection failed...</p>",
        contentType: "article" as const,
        status: "published" as const,
        featuredImageId: null,
        authorId: null,
        editorId: null,
        categoryId: null,
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
        readingTime: 1,
        isFeatured: false,
        isBreaking: false,
        isPremium: false,
        scheduledAt: null,
        publishedAt: new Date().toISOString(),
        expiresAt: null,
        metaTitle: null,
        metaDescription: null,
        metaKeywords: null,
        canonicalUrl: null,
        customFields: null,
        seoScore: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
  }
}

export async function getNewsBySlug(slug: string) {
  try {
    console.log(`Fetching article with slug: ${slug}`);
    const articles = await db
      .select()
      .from(content)
      .where(eq(content.slug, slug))
      .limit(1);
    
    if (articles.length === 0) {
      console.log(`No article found with slug: ${slug}`);
      return null;
    }
    
    console.log(`Found article: ${articles[0].title}`);
    return articles[0];
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return null;
  }
}