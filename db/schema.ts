import dotenv from 'dotenv';
dotenv.config();

import {
  pgTable,
  serial,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  pgEnum,
  bigint,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

console.log("DATABASE_URLX:", process.env.DATABASE_URL);

// Enums
export const userStatusEnum = pgEnum("user_status", ["active", "inactive", "suspended", "pending"])
export const contentStatusEnum = pgEnum("content_status", [
  "draft",
  "review",
  "approved",
  "published",
  "archived",
  "rejected",
])
export const contentTypeEnum = pgEnum("content_type", [
  "article",
  "breaking_news",
  "feature",
  "opinion",
  "photo_gallery",
  "video",
])
export const mediaTypeEnum = pgEnum("media_type", ["image", "video", "audio", "document"])
export const notificationTypeEnum = pgEnum("notification_type", ["info", "warning", "error", "success"])
export const commentStatusEnum = pgEnum("comment_status", ["pending", "approved", "rejected", "spam"])

// Roles table
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).unique().notNull(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  description: text("description"),
  permissions: jsonb("permissions").default("{}"),
  isSystemRole: boolean("is_system_role").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
})

// Users table
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    username: varchar("username", { length: 50 }).unique().notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    displayName: varchar("display_name", { length: 200 }),
    bio: text("bio"),
    avatarUrl: varchar("avatar_url", { length: 500 }),
    phone: varchar("phone", { length: 20 }),
    status: userStatusEnum("status").default("pending"),
    emailVerified: boolean("email_verified").default(false),
    emailVerificationToken: varchar("email_verification_token", { length: 255 }),
    passwordResetToken: varchar("password_reset_token", { length: 255 }),
    passwordResetExpires: timestamp("password_reset_expires", { withTimezone: true }),
    lastLogin: timestamp("last_login", { withTimezone: true }),
    loginAttempts: integer("login_attempts").default(0),
    lockedUntil: timestamp("locked_until", { withTimezone: true }),
    timezone: varchar("timezone", { length: 50 }).default("UTC"),
    language: varchar("language", { length: 10 }).default("en"),
    preferences: jsonb("preferences").default("{}"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    emailIdx: index("idx_users_email").on(table.email),
    usernameIdx: index("idx_users_username").on(table.username),
    statusIdx: index("idx_users_status").on(table.status),
  }),
)

// User roles junction table
export const userRoles = pgTable(
  "user_roles",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    roleId: integer("role_id").references(() => roles.id, { onDelete: "cascade" }),
    assignedBy: uuid("assigned_by").references(() => users.id),
    assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
  },
  (table) => ({
    uniqueUserRole: uniqueIndex("unique_user_role").on(table.userId, table.roleId),
  }),
)

// Categories table
export const categories: any = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).unique().notNull(),
    description: text("description"),
    parentId: integer("parent_id").references(() => categories.id),
    sortOrder: integer("sort_order").default(0),
    color: varchar("color", { length: 7 }),
    icon: varchar("icon", { length: 50 }),
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    parentIdx: index("idx_categories_parent").on(table.parentId),
    slugIdx: index("idx_categories_slug").on(table.slug),
  }),
)

// Tags table
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).unique().notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  description: text("description"),
  color: varchar("color", { length: 7 }),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
})

// Content table
export const content = pgTable(
  "content",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 500 }).notNull(),
    slug: varchar("slug", { length: 500 }).unique().notNull(),
    excerpt: text("excerpt"),
    contentBody: text("content_body"),
    contentType: contentTypeEnum("content_type").default("article"),
    status: contentStatusEnum("status").default("draft"),
    featuredImageId: uuid("featured_image_id"),
    authorId: uuid("author_id").references(() => users.id),
    editorId: uuid("editor_id").references(() => users.id),
    categoryId: integer("category_id").references(() => categories.id),
    viewCount: integer("view_count").default(0),
    likeCount: integer("like_count").default(0),
    commentCount: integer("comment_count").default(0),
    shareCount: integer("share_count").default(0),
    readingTime: integer("reading_time"),
    isFeatured: boolean("is_featured").default(false),
    isBreaking: boolean("is_breaking").default(false),
    isPremium: boolean("is_premium").default(false),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),
    metaKeywords: text("meta_keywords"),
    canonicalUrl: varchar("canonical_url", { length: 500 }),
    customFields: jsonb("custom_fields").default("{}"),
    seoScore: integer("seo_score").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    statusIdx: index("idx_content_status").on(table.status),
    authorIdx: index("idx_content_author").on(table.authorId),
    categoryIdx: index("idx_content_category").on(table.categoryId),
    publishedIdx: index("idx_content_published").on(table.publishedAt),
    featuredIdx: index("idx_content_featured").on(table.isFeatured),
    breakingIdx: index("idx_content_breaking").on(table.isBreaking),
    slugIdx: index("idx_content_slug").on(table.slug),
  }),
)

// Content tags junction table
export const contentTags = pgTable(
  "content_tags",
  {
    id: serial("id").primaryKey(),
    contentId: uuid("content_id").references(() => content.id, { onDelete: "cascade" }),
    tagId: integer("tag_id").references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => ({
    uniqueContentTag: uniqueIndex("unique_content_tag").on(table.contentId, table.tagId),
    contentIdx: index("idx_content_tags_content").on(table.contentId),
    tagIdx: index("idx_content_tags_tag").on(table.tagId),
  }),
)

// Media table
export const media = pgTable(
  "media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    filename: varchar("filename", { length: 255 }).notNull(),
    originalFilename: varchar("original_filename", { length: 255 }).notNull(),
    filePath: varchar("file_path", { length: 500 }).notNull(),
    fileUrl: varchar("file_url", { length: 500 }).notNull(),
    fileSize: bigint("file_size", { mode: "number" }).notNull(),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    mediaType: mediaTypeEnum("media_type").notNull(),
    width: integer("width"),
    height: integer("height"),
    duration: integer("duration"),
    altText: text("alt_text"),
    caption: text("caption"),
    description: text("description"),
    copyrightInfo: text("copyright_info"),
    metadata: jsonb("metadata").default("{}"),
    uploadedBy: uuid("uploaded_by").references(() => users.id),
    folderId: integer("folder_id"),
    usageCount: integer("usage_count").default(0),
    isPublic: boolean("is_public").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    typeIdx: index("idx_media_type").on(table.mediaType),
    uploadedByIdx: index("idx_media_uploaded_by").on(table.uploadedBy),
    folderIdx: index("idx_media_folder").on(table.folderId),
  }),
)

// Comments table
export const comments: any = pgTable(
  "comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contentId: uuid("content_id").references(() => content.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id),
    parentId: uuid("parent_id").references(() => comments.id),
    commentText: text("comment_text").notNull(),
    status: commentStatusEnum("status").default("pending"),
    likeCount: integer("like_count").default(0),
    dislikeCount: integer("dislike_count").default(0),
    isFeatured: boolean("is_featured").default(false),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    moderatedBy: uuid("moderated_by").references(() => users.id),
    moderatedAt: timestamp("moderated_at", { withTimezone: true }),
    moderationReason: text("moderation_reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    contentIdx: index("idx_comments_content").on(table.contentId),
    userIdx: index("idx_comments_user").on(table.userId),
    statusIdx: index("idx_comments_status").on(table.status),
    parentIdx: index("idx_comments_parent").on(table.parentId),
  }),
)

// Site settings table
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  settingKey: varchar("setting_key", { length: 100 }).unique().notNull(),
  settingValue: text("setting_value"),
  settingType: varchar("setting_type", { length: 50 }).default("string"),
  description: text("description"),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
})

// Notifications table
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),
    type: notificationTypeEnum("type").default("info"),
    data: jsonb("data").default("{}"),
    isRead: boolean("is_read").default(false),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userIdx: index("idx_notifications_user").on(table.userId),
    unreadIdx: index("idx_notifications_unread").on(table.userId, table.isRead),
  }),
)

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  userRoles: many(userRoles),
  content: many(content),
  comments: many(comments),
  notifications: many(notifications),
}))

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
}))

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}))

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
  content: many(content),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  contentTags: many(contentTags),
}))

export const contentRelations = relations(content, ({ one, many }) => ({
  author: one(users, {
    fields: [content.authorId],
    references: [users.id],
  }),
  editor: one(users, {
    fields: [content.editorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [content.categoryId],
    references: [categories.id],
  }),
  contentTags: many(contentTags),
  comments: many(comments),
}))

export const contentTagsRelations = relations(contentTags, ({ one }) => ({
  content: one(content, {
    fields: [contentTags.contentId],
    references: [content.id],
  }),
  tag: one(tags, {
    fields: [contentTags.tagId],
    references: [tags.id],
  }),
}))

export const commentsRelations = relations(comments, ({ one, many }) => ({
  content: one(content, {
    fields: [comments.contentId],
    references: [content.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  replies: many(comments),
}))

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}))
