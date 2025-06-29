"use server"

import { db, content, users, comments } from "@/db"
import { eq, desc, sql } from "drizzle-orm"

export async function getDashboardStats() {
  // Get content stats
  const [totalArticles] = await db.select({ count: sql<number>`count(*)` }).from(content)

  const [publishedArticles] = await db
    .select({ count: sql<number>`count(*)` })
    .from(content)
    .where(eq(content.status, "published"))

  // Get user stats
  const [activeUsers] = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.status, "active"))

  // Get comment stats
  const [totalComments] = await db.select({ count: sql<number>`count(*)` }).from(comments)

  // Get total page views (sum from content)
  const [pageViews] = await db.select({ total: sql<number>`sum(${content.viewCount})` }).from(content)

  // Calculate changes (mock data for now)
  const changes = {
    articles: 12,
    users: 5,
    pageViews: 18,
    comments: 7,
  }

  return {
    totalArticles: totalArticles.count,
    publishedArticles: publishedArticles.count,
    activeUsers: activeUsers.count,
    totalComments: totalComments.count,
    pageViews: pageViews.total || 0,
    changes,
  }
}

export async function getTopContent(limit = 10) {
  return await db
    .select({
      id: content.id,
      title: content.title,
      slug: content.slug,
      viewCount: content.viewCount,
      commentCount: content.commentCount,
      author: {
        displayName: users.displayName,
      },
    })
    .from(content)
    .leftJoin(users, eq(content.authorId, users.id))
    .where(eq(content.status, "published"))
    .orderBy(desc(content.viewCount))
    .limit(limit)
}

export async function getRecentActivity() {
  // Get recent content
  const recentContent = await db
    .select({
      id: content.id,
      title: content.title,
      status: content.status,
      createdAt: content.createdAt,
      author: {
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(content)
    .leftJoin(users, eq(content.authorId, users.id))
    .orderBy(desc(content.createdAt))
    .limit(5)

  // Format as activity items
  return recentContent.map((item) => ({
    id: item.id,
    user: item.author?.displayName || "Unknown",
    action: item.status === "published" ? "published article" : "created draft",
    item: item.title,
    time: item.createdAt,
    avatar: item.author?.avatarUrl,
  }))
}

export async function getContentPerformance() {
  return await db
    .select({
      id: content.id,
      title: content.title,
      viewCount: content.viewCount,
      likeCount: content.likeCount,
      commentCount: content.commentCount,
      shareCount: content.shareCount,
      publishedAt: content.publishedAt,
    })
    .from(content)
    .where(eq(content.status, "published"))
    .orderBy(desc(content.viewCount))
    .limit(20)
}

export async function getAnalyticsSummary() {
  // Mock analytics data - in a real app, this would come from analytics tables
  return {
    totalPageViews: 125000,
    uniqueVisitors: 45000,
    bounceRate: 65.5,
    avgSessionDuration: 180,
    pageViewsChange: 12.5,
    visitorsChange: -3.2,
    trafficSources: [
      { source: "Direct", visitors: 15000, percentage: 33.3 },
      { source: "Google", visitors: 18000, percentage: 40.0 },
      { source: "Social Media", visitors: 12000, percentage: 26.7 },
    ],
  }
}
