"use server"

import { db, content, contentTags, tags, categories, users } from "@/db"
import { eq, desc, and, or, like, sql, inArray } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getContent(filters?: {
  status?: string
  category?: string
  author?: string
  search?: string
  page?: number
  limit?: number
}) {
  const page = filters?.page || 1
  const limit = filters?.limit || 10
  const offset = (page - 1) * limit

  let query = db
    .select({
      id: content.id,
      title: content.title,
      slug: content.slug,
      excerpt: content.excerpt,
      status: content.status,
      contentType: content.contentType,
      isFeatured: content.isFeatured,
      isBreaking: content.isBreaking,
      viewCount: content.viewCount,
      commentCount: content.commentCount,
      publishedAt: content.publishedAt,
      createdAt: content.createdAt,
      author: {
        id: users.id,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
      },
      category: {
        id: categories.id,
        name: categories.name,
        color: categories.color,
      },
    })
    .from(content)
    .leftJoin(users, eq(content.authorId, users.id))
    .leftJoin(categories, eq(content.categoryId, categories.id))

  // Apply filters
  const conditions = []

  if (filters?.status && filters.status !== "all") {
    conditions.push(eq(content.status, filters.status as any))
  }

  if (filters?.category && filters.category !== "all") {
    conditions.push(eq(content.categoryId, Number.parseInt(filters.category)))
  }

  if (filters?.author && filters.author !== "all") {
    conditions.push(eq(content.authorId, filters.author))
  }

  if (filters?.search) {
    conditions.push(or(like(content.title, `%${filters.search}%`), like(content.excerpt, `%${filters.search}%`)))
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions))
  }

  const results = await query.orderBy(desc(content.createdAt)).limit(limit).offset(offset)

  return results
}

export async function getContentById(id: string) {
  const result = await db
    .select({
      id: content.id,
      title: content.title,
      slug: content.slug,
      excerpt: content.excerpt,
      contentBody: content.contentBody,
      status: content.status,
      contentType: content.contentType,
      categoryId: content.categoryId,
      isFeatured: content.isFeatured,
      isBreaking: content.isBreaking,
      scheduledAt: content.scheduledAt,
      metaTitle: content.metaTitle,
      metaDescription: content.metaDescription,
      metaKeywords: content.metaKeywords,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      author: {
        id: users.id,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
      },
      category: {
        id: categories.id,
        name: categories.name,
        color: categories.color,
      },
    })
    .from(content)
    .leftJoin(users, eq(content.authorId, users.id))
    .leftJoin(categories, eq(content.categoryId, categories.id))
    .where(eq(content.id, id))
    .limit(1)

  if (result.length === 0) {
    return null
  }

  // Get tags for this content
  const contentTagsResult = await db
    .select({
      id: tags.id,
      name: tags.name,
      color: tags.color,
    })
    .from(contentTags)
    .innerJoin(tags, eq(contentTags.tagId, tags.id))
    .where(eq(contentTags.contentId, id))

  return {
    ...result[0],
    tags: contentTagsResult,
  }
}

export async function createContent(data: {
  title: string
  slug: string
  excerpt?: string
  contentBody?: string
  categoryId?: number
  tagIds?: number[]
  status?: string
  isFeatured?: boolean
  isBreaking?: boolean
  scheduledAt?: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  authorId: string
}) {
  try {
    // Generate slug if not provided
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
    }

    // Create content
    const [newContent] = await db
      .insert(content)
      .values({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        contentBody: data.contentBody,
        categoryId: data.categoryId,
        status: (data.status as any) || "draft",
        isFeatured: data.isFeatured || false,
        isBreaking: data.isBreaking || false,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: data.metaKeywords,
        authorId: data.authorId,
        publishedAt: data.status === "published" ? new Date() : null,
      })
      .returning({ id: content.id })

    // Add tags if provided
    if (data.tagIds && data.tagIds.length > 0) {
      await db.insert(contentTags).values(
        data.tagIds.map((tagId) => ({
          contentId: newContent.id,
          tagId,
        })),
      )

      // Update tag usage counts
      await db
        .update(tags)
        .set({
          usageCount: sql`${tags.usageCount} + 1`,
        })
        .where(inArray(tags.id, data.tagIds))
    }

    revalidatePath("/content")
    return { success: true, id: newContent.id }
  } catch (error) {
    console.error("Error creating content:", error)
    return { success: false, error: "Failed to create content" }
  }
}

export async function updateContent(
  id: string,
  data: {
    title?: string
    slug?: string
    excerpt?: string
    contentBody?: string
    categoryId?: number
    tagIds?: number[]
    status?: string
    isFeatured?: boolean
    isBreaking?: boolean
    scheduledAt?: string
    metaTitle?: string
    metaDescription?: string
    metaKeywords?: string
  },
) {
  try {
    // Get current content to compare tags
    const currentContent = await getContentById(id)
    if (!currentContent) {
      return { success: false, error: "Content not found" }
    }

    // Update content
    await db
      .update(content)
      .set({
        ...data,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        publishedAt: data.status === "published" && currentContent.status !== "published" ? new Date() : undefined,
        updatedAt: new Date(),
      })
      .where(eq(content.id, id))

    // Handle tag updates
    if (data.tagIds !== undefined) {
      const currentTagIds = currentContent.tags.map((tag) => tag.id)

      // Remove old tags
      await db.delete(contentTags).where(eq(contentTags.contentId, id))

      // Decrease usage count for removed tags
      if (currentTagIds.length > 0) {
        await db
          .update(tags)
          .set({
            usageCount: sql`${tags.usageCount} - 1`,
          })
          .where(inArray(tags.id, currentTagIds))
      }

      // Add new tags
      if (data.tagIds.length > 0) {
        await db.insert(contentTags).values(
          data.tagIds.map((tagId) => ({
            contentId: id,
            tagId,
          })),
        )

        // Increase usage count for new tags
        await db
          .update(tags)
          .set({
            usageCount: sql`${tags.usageCount} + 1`,
          })
          .where(inArray(tags.id, data.tagIds))
      }
    }

    revalidatePath("/content")
    revalidatePath(`/content/editor/${id}`)
    return { success: true }
  } catch (error) {
    console.error("Error updating content:", error)
    return { success: false, error: "Failed to update content" }
  }
}

export async function deleteContent(id: string) {
  try {
    // Get content tags to update usage counts
    const contentTagsResult = await db
      .select({ tagId: contentTags.tagId })
      .from(contentTags)
      .where(eq(contentTags.contentId, id))

    // Delete content (cascades to content_tags)
    await db.delete(content).where(eq(content.id, id))

    // Update tag usage counts
    if (contentTagsResult.length > 0) {
      const tagIds = contentTagsResult.map((ct) => ct.tagId)
      await db
        .update(tags)
        .set({
          usageCount: sql`${tags.usageCount} - 1`,
        })
        .where(inArray(tags.id, tagIds))
    }

    revalidatePath("/content")
    return { success: true }
  } catch (error) {
    console.error("Error deleting content:", error)
    return { success: false, error: "Failed to delete content" }
  }
}

export async function publishContent(id: string) {
  try {
    await db
      .update(content)
      .set({
        status: "published",
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(content.id, id))

    revalidatePath("/content")
    return { success: true }
  } catch (error) {
    console.error("Error publishing content:", error)
    return { success: false, error: "Failed to publish content" }
  }
}

export async function getContentStats() {
  const [totalContent] = await db.select({ count: sql<number>`count(*)` }).from(content)

  const [publishedContent] = await db
    .select({ count: sql<number>`count(*)` })
    .from(content)
    .where(eq(content.status, "published"))

  const [draftContent] = await db
    .select({ count: sql<number>`count(*)` })
    .from(content)
    .where(eq(content.status, "draft"))

  const [reviewContent] = await db
    .select({ count: sql<number>`count(*)` })
    .from(content)
    .where(eq(content.status, "review"))

  return {
    total: totalContent.count,
    published: publishedContent.count,
    draft: draftContent.count,
    review: reviewContent.count,
  }
}
