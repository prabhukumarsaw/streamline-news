"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, MoreHorizontal, Tag, Search, Merge, TrendingUp, Hash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const tagsData = [
  {
    id: 1,
    name: "technology",
    slug: "technology",
    description: "Technology related content",
    color: "#007bff",
    usageCount: 156,
    createdAt: "2025-01-01T00:00:00Z",
    trending: true,
  },
  {
    id: 2,
    name: "artificial-intelligence",
    slug: "artificial-intelligence",
    description: "AI and machine learning topics",
    color: "#28a745",
    usageCount: 89,
    createdAt: "2025-01-15T00:00:00Z",
    trending: true,
  },
  {
    id: 3,
    name: "business",
    slug: "business",
    description: "Business and finance content",
    color: "#ffc107",
    usageCount: 134,
    createdAt: "2025-01-10T00:00:00Z",
    trending: false,
  },
  {
    id: 4,
    name: "startup",
    slug: "startup",
    description: "Startup and entrepreneurship",
    color: "#6f42c1",
    usageCount: 67,
    createdAt: "2025-02-01T00:00:00Z",
    trending: false,
  },
  {
    id: 5,
    name: "innovation",
    slug: "innovation",
    description: "Innovation and new ideas",
    color: "#fd7e14",
    usageCount: 45,
    createdAt: "2025-02-15T00:00:00Z",
    trending: false,
  },
  {
    id: 6,
    name: "climate-change",
    slug: "climate-change",
    description: "Environmental and climate topics",
    color: "#20c997",
    usageCount: 78,
    createdAt: "2025-01-20T00:00:00Z",
    trending: true,
  },
]

const colorOptions = [
  "#007bff",
  "#28a745",
  "#dc3545",
  "#ffc107",
  "#6f42c1",
  "#fd7e14",
  "#20c997",
  "#6c757d",
  "#343a40",
  "#17a2b8",
]

export default function TagsPage() {
  const [tags, setTags] = useState(tagsData)
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("usage_count")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isMergeDialogOpen, setIsMergeDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#007bff",
  })

  const handleEdit = (tag: any) => {
    setEditingTag(tag)
    setFormData({
      name: tag.name,
      slug: tag.slug,
      description: tag.description || "",
      color: tag.color,
    })
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingTag(null)
    setFormData({
      name: "",
      slug: "",
      description: "",
      color: "#007bff",
    })
    setIsDialogOpen(true)
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    })
  }

  const handleSelectTag = (tagId: number, checked: boolean) => {
    if (checked) {
      setSelectedTags([...selectedTags, tagId])
    } else {
      setSelectedTags(selectedTags.filter((id) => id !== tagId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTags(tags.map((tag) => tag.id))
    } else {
      setSelectedTags([])
    }
  }

  const sortedTags = [...tags].sort((a, b) => {
    switch (sortBy) {
      case "usage_count":
        return b.usageCount - a.usageCount
      case "name":
        return a.name.localeCompare(b.name)
      case "created_at":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return 0
    }
  })

  const filteredTags = sortedTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Tags Management</h1>
        <div className="ml-auto flex items-center gap-2">
          {selectedTags.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => setIsMergeDialogOpen(true)}>
              <Merge className="h-4 w-4 mr-2" />
              Merge Tags
            </Button>
          )}
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Tag
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
              <Hash className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tags.length}</div>
              <p className="text-xs text-muted-foreground">Active tags</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Used</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.max(...tags.map((t) => t.usageCount))}</div>
              <p className="text-xs text-muted-foreground">Usage count</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trending Tags</CardTitle>
              <Tag className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tags.filter((t) => t.trending).length}</div>
              <p className="text-xs text-muted-foreground">Currently trending</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
              <Tag className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tags.reduce((sum, tag) => sum + tag.usageCount, 0)}</div>
              <p className="text-xs text-muted-foreground">Across all content</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usage_count">Most Used</SelectItem>
                  <SelectItem value="name">Alphabetical</SelectItem>
                  <SelectItem value="created_at">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedTags.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{selectedTags.length} tag(s) selected</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsMergeDialogOpen(true)}>
                    <Merge className="h-4 w-4 mr-2" />
                    Merge Tags
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tags List */}
        <Card>
          <CardHeader>
            <CardTitle>All Tags</CardTitle>
            <CardDescription>Manage your content tags and their usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Table Header */}
              <div className="flex items-center space-x-4 pb-2 border-b">
                <Checkbox checked={selectedTags.length === tags.length} onCheckedChange={handleSelectAll} />
                <div className="flex-1 font-medium">Tag</div>
                <div className="w-24 font-medium">Usage</div>
                <div className="w-24 font-medium">Status</div>
                <div className="w-32 font-medium">Created</div>
                <div className="w-16"></div>
              </div>

              {/* Tag Rows */}
              {filteredTags.map((tag) => (
                <div key={tag.id} className="flex items-center space-x-4 py-3 border-b last:border-b-0">
                  <Checkbox
                    checked={selectedTags.includes(tag.id)}
                    onCheckedChange={(checked) => handleSelectTag(tag.id, checked as boolean)}
                  />
                  <div className="flex-1 flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tag.color }} />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">#{tag.name}</h4>
                        {tag.trending && (
                          <Badge variant="secondary" className="text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{tag.description}</p>
                    </div>
                  </div>
                  <div className="w-24">
                    <Badge variant="outline">{tag.usageCount}</Badge>
                  </div>
                  <div className="w-24">
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="w-32 text-sm text-muted-foreground">
                    {new Date(tag.createdAt).toLocaleDateString()}
                  </div>
                  <div className="w-16">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(tag)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Tag className="h-4 w-4 mr-2" />
                          View Content
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Tag Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTag ? "Edit Tag" : "Add New Tag"}</DialogTitle>
              <DialogDescription>
                {editingTag ? "Update the tag information below." : "Create a new tag for organizing your content."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tag Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter tag name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="tag-url-slug"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this tag"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Tag Color</Label>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: formData.color }}
                  />
                  <div className="flex flex-wrap gap-1">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        className="w-6 h-6 rounded-full border border-gray-200 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData({ ...formData, color })}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>{editingTag ? "Update Tag" : "Create Tag"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Merge Tags Dialog */}
        <Dialog open={isMergeDialogOpen} onOpenChange={setIsMergeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Merge Tags</DialogTitle>
              <DialogDescription>
                Select a target tag to merge the selected tags into. All content will be updated to use the target tag.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Selected Tags to Merge</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tagId) => {
                    const tag = tags.find((t) => t.id === tagId)
                    return tag ? (
                      <Badge key={tagId} variant="secondary">
                        #{tag.name} ({tag.usageCount})
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Target Tag</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags
                      .filter((tag) => !selectedTags.includes(tag.id))
                      .map((tag) => (
                        <SelectItem key={tag.id} value={tag.id.toString()}>
                          #{tag.name} ({tag.usageCount} uses)
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsMergeDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsMergeDialogOpen(false)}>Merge Tags</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarInset>
  )
}
