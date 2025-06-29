"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, UserPlus, Shield, Mail, Calendar, Edit, Trash2, Ban } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"

const userData = [
  {
    id: "1",
    username: "johndoe",
    email: "john@example.com",
    displayName: "John Doe",
    firstName: "John",
    lastName: "Doe",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    status: "active",
    roles: [{ name: "author", displayName: "Author" }],
    lastLogin: "2025-06-27T08:30:00Z",
    contentCount: 25,
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "2",
    username: "janesmith",
    email: "jane@example.com",
    displayName: "Jane Smith",
    firstName: "Jane",
    lastName: "Smith",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    status: "active",
    roles: [{ name: "editor", displayName: "Editor" }],
    lastLogin: "2025-06-26T15:20:00Z",
    contentCount: 45,
    createdAt: "2025-02-10T14:30:00Z",
  },
  {
    id: "3",
    username: "mikejohnson",
    email: "mike@example.com",
    displayName: "Mike Johnson",
    firstName: "Mike",
    lastName: "Johnson",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    status: "inactive",
    roles: [{ name: "contributor", displayName: "Contributor" }],
    lastLogin: "2025-06-20T09:15:00Z",
    contentCount: 8,
    createdAt: "2025-03-05T11:00:00Z",
  },
  {
    id: "4",
    username: "admin",
    email: "admin@example.com",
    displayName: "System Admin",
    firstName: "System",
    lastName: "Admin",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    status: "active",
    roles: [{ name: "super_admin", displayName: "Super Admin" }],
    lastLogin: "2025-06-27T10:45:00Z",
    contentCount: 0,
    createdAt: "2025-01-01T00:00:00Z",
  },
]

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  suspended: "bg-red-100 text-red-800",
}

const roleColors = {
  super_admin: "bg-purple-100 text-purple-800",
  editor: "bg-blue-100 text-blue-800",
  author: "bg-green-100 text-green-800",
  contributor: "bg-yellow-100 text-yellow-800",
}

export default function UsersPage() {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} days ago`
    }
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">User Management</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Roles & Permissions
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">200</div>
              <p className="text-xs text-muted-foreground">+12 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">180</div>
              <p className="text-xs text-muted-foreground">90% of total users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Authors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">Content creators</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="author">Author</SelectItem>
                  <SelectItem value="contributor">Contributor</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{selectedItems.length} user(s) selected</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline" size="sm">
                    Change Role
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Ban className="h-4 w-4 mr-2" />
                    Suspend
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Table Header */}
              <div className="flex items-center space-x-4 pb-2 border-b">
                <Checkbox
                  checked={selectedItems.length === userData.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedItems(userData.map((user) => user.id))
                    } else {
                      setSelectedItems([])
                    }
                  }}
                />
                <div className="flex-1 font-medium">User</div>
                <div className="w-32 font-medium">Role</div>
                <div className="w-24 font-medium">Status</div>
                <div className="w-24 font-medium">Articles</div>
                <div className="w-32 font-medium">Last Login</div>
                <div className="w-32 font-medium">Joined</div>
                <div className="w-16"></div>
              </div>

              {/* User Rows */}
              {userData.map((user) => (
                <div key={user.id} className="flex items-center space-x-4 py-3 border-b last:border-b-0">
                  <Checkbox
                    checked={selectedItems.includes(user.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedItems([...selectedItems, user.id])
                      } else {
                        setSelectedItems(selectedItems.filter((id) => id !== user.id))
                      }
                    }}
                  />
                  <div className="flex-1 flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatarUrl || "/placeholder.svg"} />
                      <AvatarFallback>
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.displayName}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="w-32">
                    {user.roles.map((role) => (
                      <Badge key={role.name} className={roleColors[role.name as keyof typeof roleColors]}>
                        {role.displayName}
                      </Badge>
                    ))}
                  </div>
                  <div className="w-24">
                    <Badge className={statusColors[user.status as keyof typeof statusColors]}>{user.status}</Badge>
                  </div>
                  <div className="w-24 text-sm text-muted-foreground">{user.contentCount}</div>
                  <div className="w-32 text-sm text-muted-foreground">{formatLastLogin(user.lastLogin)}</div>
                  <div className="w-32 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(user.createdAt)}
                    </div>
                  </div>
                  <div className="w-16">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Ban className="h-4 w-4 mr-2" />
                          Suspend
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
      </div>
    </SidebarInset>
  )
}
