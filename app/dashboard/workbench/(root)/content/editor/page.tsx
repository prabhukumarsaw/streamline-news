'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Save,
  Eye,
  Send,
  ImageIcon,
  Bold,
  Italic,
  LinkIcon,
  List,
  Quote,
  Heading1,
  Heading2,
  X,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categories = [
  { id: 1, name: 'Technology', color: '#007bff' },
  { id: 2, name: 'Politics', color: '#dc3545' },
  { id: 3, name: 'Business', color: '#28a745' },
  { id: 4, name: 'Sports', color: '#ffc107' },
  { id: 5, name: 'Entertainment', color: '#6f42c1' },
];

const availableTags = [
  { id: 1, name: 'breaking' },
  { id: 2, name: 'featured' },
  { id: 3, name: 'trending' },
  { id: 4, name: 'analysis' },
  { id: 5, name: 'interview' },
  { id: 6, name: 'opinion' },
];

export default function ContentEditorPage() {
  const [article, setArticle] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    categoryId: '',
    tags: [] as number[],
    featuredImage: '',
    isFeatured: false,
    isBreaking: false,
    scheduledAt: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    status: 'draft',
  });

  const [newTag, setNewTag] = useState('');
  const [autoSaveStatus, setAutoSaveStatus] = useState('Saved');

  const handleTagAdd = (tagId: number) => {
    if (!article.tags.includes(tagId)) {
      setArticle({ ...article, tags: [...article.tags, tagId] });
    }
  };

  const handleTagRemove = (tagId: number) => {
    setArticle({ ...article, tags: article.tags.filter((id) => id !== tagId) });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setArticle({
      ...article,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSave = (status: string) => {
    setArticle({ ...article, status });
    setAutoSaveStatus('Saving...');
    // Simulate save
    setTimeout(() => setAutoSaveStatus('Saved'), 1000);
  };

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Content Editor</h1>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {autoSaveStatus}
          </span>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave('draft')}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button size="sm" onClick={() => handleSave('published')}>
            <Send className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </header>

      <div className="flex flex-1 gap-4 p-4">
        {/* Main Editor */}
        <div className="flex-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Article Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter article title..."
                  value={article.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="text-lg font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  placeholder="article-url-slug"
                  value={article.slug}
                  onChange={(e) =>
                    setArticle({ ...article, slug: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief description of the article..."
                  value={article.excerpt}
                  onChange={(e) =>
                    setArticle({ ...article, excerpt: e.target.value })
                  }
                  rows={3}
                />
              </div>

              {/* Rich Text Editor Toolbar */}
              <div className="border rounded-lg">
                <div className="flex items-center gap-1 p-2 border-b bg-muted/50">
                  <Button variant="ghost" size="sm">
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="ghost" size="sm">
                    <Heading1 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Heading2 className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="ghost" size="sm">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="ghost" size="sm">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Quote className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  placeholder="Write your article content here..."
                  value={article.content}
                  onChange={(e) =>
                    setArticle({ ...article, content: e.target.value })
                  }
                  className="min-h-[400px] border-0 resize-none focus-visible:ring-0"
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Optimize your article for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  placeholder="SEO optimized title..."
                  value={article.metaTitle}
                  onChange={(e) =>
                    setArticle({ ...article, metaTitle: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  {article.metaTitle.length}/60 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  placeholder="Brief description for search results..."
                  value={article.metaDescription}
                  onChange={(e) =>
                    setArticle({ ...article, metaDescription: e.target.value })
                  }
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {article.metaDescription.length}/160 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  placeholder="keyword1, keyword2, keyword3"
                  value={article.metaKeywords}
                  onChange={(e) =>
                    setArticle({ ...article, metaKeywords: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-80 space-y-4">
          {/* Publishing Options */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={article.status}
                  onValueChange={(value) =>
                    setArticle({ ...article, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="review">Under Review</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Schedule Publication</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={article.scheduledAt}
                  onChange={(e) =>
                    setArticle({ ...article, scheduledAt: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured Article</Label>
                <Switch
                  id="featured"
                  checked={article.isFeatured}
                  onCheckedChange={(checked) =>
                    setArticle({ ...article, isFeatured: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="breaking">Breaking News</Label>
                <Switch
                  id="breaking"
                  checked={article.isBreaking}
                  onCheckedChange={(checked) =>
                    setArticle({ ...article, isBreaking: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={article.categoryId}
                onValueChange={(value) =>
                  setArticle({ ...article, categoryId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tagId) => {
                  const tag = availableTags.find((t) => t.id === tagId);
                  return tag ? (
                    <Badge
                      key={tagId}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => handleTagRemove(tagId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ) : null;
                })}
              </div>

              <div className="space-y-2">
                <Label>Available Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {availableTags
                    .filter((tag) => !article.tags.includes(tag.id))
                    .map((tag) => (
                      <Button
                        key={tag.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleTagAdd(tag.id)}
                      >
                        {tag.name}
                      </Button>
                    ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add new tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                />
                <Button variant="outline" size="sm">
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {article.featuredImage ? (
                  <div className="relative">
                    <img
                      src={
                        article.featuredImage ||
                        '/placeholder.svg?height=200&width=300'
                      }
                      alt="Featured"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        setArticle({ ...article, featuredImage: '' })
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No image selected
                    </p>
                  </div>
                )}
                <Button variant="outline" className="w-full bg-transparent">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Select Image
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
}
