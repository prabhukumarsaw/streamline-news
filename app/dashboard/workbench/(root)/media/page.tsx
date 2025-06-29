"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  Search,
  Grid3X3,
  List,
  FolderPlus,
  ImageIcon,
  Video,
  FileText,
  MoreHorizontal,
  Download,
  Trash2,
  Edit,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const mediaData = [
  {
    id: "1",
    filename: "tech-conference-2025.jpg",
    originalFilename: "conference.jpg",
    fileUrl: "/placeholder.svg?height=200&width=300",
    thumbnailUrl: "/placeholder.svg?height=150&width=200",
    fileSize: 245760,
    mimeType: "image/jpeg",
    mediaType: "image",
    width: 1920,
    height: 1080,
    altText: "Tech conference 2025",
    folder: { name: "Events" },
    usageCount: 5,
    createdAt: "2025-06-20T09:00:00Z",
  },
  {
    id: "2",
    filename: "company-logo.png",
    originalFilename: "logo.png",
    fileUrl: "/placeholder.svg?height=200&width=200",
    thumbnailUrl: "/placeholder.svg?height=150&width=150",
    fileSize: 45760,
    mimeType: "image/png",
    mediaType: "image",
    width: 800,
    height: 800,
    altText: "Company logo",
    folder: { name: "Branding" },
    usageCount: 12,
    createdAt: "2025-06-18T14:30:00Z",
  },
  {
    id: "3",
    filename: "interview-video.mp4",
    originalFilename: "interview.mp4",
    fileUrl: "/placeholder.svg?height=200&width=300",
    thumbnailUrl: "/placeholder.svg?height=150&width=200",
    fileSize: 15728640,
    mimeType: "video/mp4",
    mediaType: "video",
    width: 1280,
    height: 720,
    altText: "CEO Interview",
    folder: { name: "Videos" },
    usageCount: 3,
    createdAt: "2025-06-15T11:20:00Z",
  },
]

const folders = [
  { id: 1, name: "All Media", itemCount: 156 },
  { id: 2, name: "Images", itemCount: 89 },
  { id: 3, name: "Videos", itemCount: 23 },
  { id: 4, name: "Documents", itemCount: 44 },
  { id: 5, name: "Events", itemCount: 12 },
  { id: 6, name: "Branding", itemCount: 8 },
]

export default function MediaPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFolder, setSelectedFolder] = useState("1")

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Media Library</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for folders */}
        <div className="w-64 border-r bg-muted/50 p-4">
          <h3 className="font-medium mb-4">Folders</h3>
          <div className="space-y-1">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id.toString())}
                className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-background transition-colors ${
                  selectedFolder === folder.id.toString() ? "bg-background shadow-sm" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{folder.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {folder.itemCount}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col gap-4 p-4">
          {/* Search and filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search media files..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="File type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-1 border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk actions */}
          {selectedItems.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{selectedItems.length} item(s) selected</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Media grid/list */}
          <Card>
            <CardHeader>
              <CardTitle>Media Files</CardTitle>
              <CardDescription>
                {folders.find((f) => f.id.toString() === selectedFolder)?.name} - {mediaData.length} files
              </CardDescription>
            </CardHeader>
            <CardContent>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {mediaData.map((item) => (
                    <div
                      key={item.id}
                      className="group relative border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="absolute top-2 left-2 z-10">
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedItems([...selectedItems, item.id])
                            } else {
                              setSelectedItems(selectedItems.filter((id) => id !== item.id))
                            }
                          }}
                          className="bg-white"
                        />
                      </div>
                      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="aspect-square bg-muted flex items-center justify-center">
                        {item.mediaType === "image" ? (
                          <img
                            src={item.thumbnailUrl || "/placeholder.svg"}
                            alt={item.altText}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center text-muted-foreground">
                            {getMediaIcon(item.mediaType)}
                            <span className="text-xs mt-1">{item.mediaType.toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium truncate">{item.filename}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(item.fileSize)}</p>
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.folder.name}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Used {item.usageCount}x</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {mediaData.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-muted/50">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedItems([...selectedItems, item.id])
                          } else {
                            setSelectedItems(selectedItems.filter((id) => id !== item.id))
                          }
                        }}
                      />
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                        {item.mediaType === "image" ? (
                          <img
                            src={item.thumbnailUrl || "/placeholder.svg"}
                            alt={item.altText}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          getMediaIcon(item.mediaType)
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.filename}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(item.fileSize)} • {item.folder.name} • Used {item.usageCount} times
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.mediaType === "image" && `${item.width}×${item.height}`}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
