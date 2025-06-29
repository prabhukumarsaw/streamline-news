"use server"

import { db, categories } from "@/db"
import { eq, asc, like, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getCategories(search?: string) {
  let query = db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      parentId: categories.parentId,
      sortOrder: categories.sortOrder,
      color: categories.color,
      icon: categories.icon,
      metaTitle: categories.metaTitle,
      metaDescription: categories.metaDescription,
      isActive: categories.isActive,
      createdAt: categories.createdAt,
      updatedAt: categories.updatedAt,
    })
    .from(categories)

  if (search) {
    query = query.where(like(categories.name, `%${search}%`))
  }

  const results = await query.orderBy(asc(categories.sortOrder), asc(categories.name))

  // Get content count for each category
  const categoriesWithCount = await Promise.all(
    results.map(async (category) => {
      const [contentCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(db.select().from(db.schema.content).where(eq(db.schema.content.categoryId, category.id)))

      return {
        ...category,
        contentCount: contentCount?.count || 0,
      }
    }),
  )

  return categoriesWithCount
}

export async function getCategoryById(id: number) {
  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1)

  return result[0] || null
}

export async function createCategory(data: {
  name: string
  slug: string
  description?: string
  parentId?: number
  color?: string
  icon?: string
  metaTitle?: string
  metaDescription?: string
  isActive?: boolean
}) {
  try {
    // Generate slug if not provided
    if (!data.slug) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
    }

    const [newCategory] = await db
      .insert(categories)
      .values({
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId || null,
        color: data.color,
        icon: data.icon,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        isActive: data.isActive ?? true,
      })
      .returning({ id: categories.id })

    revalidatePath("/categories")
    return { success: true, id: newCategory.id }
  } catch (error) {
    console.error("Error creating category:", error)
    return { success: false, error: "Failed to create category" }
  }
}

export async function updateCategory(
  id: number,
  data: {
    name?: string
    slug?: string
    description?: string
    parentId?: number
    color?: string
    icon?: string
    metaTitle?: string
    metaDescription?: string
    isActive?: boolean
  },
) {
  try {
    await db
      .update(categories)
      .set({
        ...data,
        parentId: data.parentId || null,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))

    revalidatePath("/categories")
    return { success: true }
  } catch (error) {
    console.error("Error updating category:", error)
    return { success: false, error: "Failed to update category" }
  }
}

export async function deleteCategory(id: number) {
  try {
    // Check if category has content
    const [contentCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(db.schema.content)
      .where(eq(db.schema.content.categoryId, id))

    if (contentCount.count > 0) {
      return { success: false, error: "Cannot delete category with existing content" }
    }

    // Check if category has children
    const [childrenCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(categories)
      .where(eq(categories.parentId, id))

    if (childrenCount.count > 0) {
      return { success: false, error: "Cannot delete category with subcategories" }
    }

    await db.delete(categories).where(eq(categories.id, id))

    revalidatePath("/categories")
    return { success: true }
  } catch (error) {
    console.error("Error deleting category:", error)
    return { success: false, error: "Failed to delete category" }
  }
}

export async function getCategoryHierarchy() {
  const allCategories = await getCategories()

  // Build hierarchy
  const categoryMap = new Map()
  const rootCategories: any[] = []

  // First pass: create map and identify root categories
  allCategories.forEach((category) => {
    categoryMap.set(category.id, { ...category, children: [] })
    if (!category.parentId) {
      rootCategories.push(categoryMap.get(category.id))
    }
  })

  // Second pass: build parent-child relationships
  allCategories.forEach((category) => {
    if (category.parentId) {
      const parent = categoryMap.get(category.parentId)
      if (parent) {
        parent.children.push(categoryMap.get(category.id))
      }
    }
  })

  return rootCategories
}

export async function updateCategoryOrder(categoryId: number, newOrder: number) {
  try {
    await db.update(categories).set({ sortOrder: newOrder, updatedAt: new Date() }).where(eq(categories.id, categoryId))

    revalidatePath("/categories")
    return { success: true }
  } catch (error) {
    console.error("Error updating category order:", error)
    return { success: false, error: "Failed to update category order" }
  }
}
