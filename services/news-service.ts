import { newsData } from '@/data/news-data';
import { Article, Category, Author } from '@/types/news';

export async function getAllNewsArticles(): Promise<Article[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return newsData.articles;
}

export async function getNewsArticle(slug: string): Promise<Article | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return newsData.articles.find(article => article.slug === slug) || null;
}

export async function getTrendingNews(): Promise<Article[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return newsData.articles.filter(article => article.trending).slice(0, 5);
}

export async function getLatestNews(page = 1, limit = 10, category?: string): Promise<Article[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  let articles = newsData.articles;
  
  if (category) {
    articles = articles.filter(article => article.categoryId === category);
  }
  
  return articles
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice((page - 1) * limit, page * limit);
}

export async function getNewsByCategory(categoryId: string): Promise<Article[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return newsData.articles.filter(article => article.categoryId === categoryId);
}

export async function getRelatedNews(categoryId: string, currentSlug: string): Promise<Article[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return newsData.articles
    .filter(article => article.categoryId === categoryId && article.slug !== currentSlug)
    .slice(0, 4);
}

export async function searchNews(query: string): Promise<Article[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const lowercaseQuery = query.toLowerCase();
  return newsData.articles.filter(article =>
    article.title.toLowerCase().includes(lowercaseQuery) ||
    article.excerpt.toLowerCase().includes(lowercaseQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}