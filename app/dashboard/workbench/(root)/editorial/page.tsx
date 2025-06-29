"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  Edit,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const calendarData = {
  events: [
    {
      id: "1",
      title: "Article: Tech Trends 2025",
      type: "content",
      status: "scheduled",
      date: "2025-06-28",
      time: "10:00:00",
      author: { id: "1", name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
      category: "Technology",
      url: "/content/edit/1",
      priority: "high",
    },
    {
      id: "2",
      title: "Review: Business Article",
      type: "assignment",
      status: "pending",
      date: "2025-06-29",
      time: "14:00:00",
      assignedTo: "Jane Editor",
      deadline: "2025-06-29T17:00:00Z",
      priority: "medium",
    },
    {
      id: "3",
      title: "Interview: CEO Spotlight",
      type: "content",
      status: "draft",
      date: "2025-06-30",
      time: "09:00:00",
      author: { id: "2", name: "Jane Smith", avatar: "/placeholder.svg?height=32&width=32" },
      category: "Business",
      url: "/content/edit/3",
      priority: "high",
    },
    {
      id: "4",
      title: "Editorial Meeting",
      type: "meeting",
      status: "confirmed",
      date: "2025-07-01",
      time: "15:00:00",
      attendees: ["John Doe", "Jane Smith", "Mike Johnson"],
      priority: "medium",
    },
    {
      id: "5",
      title: "Article: Climate Solutions",
      type: "content",
      status: "published",
      date: "2025-06-27",
      time: "08:00:00",
      author: { id: "3", name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32" },
      category: "Environment",
      url: "/content/edit/5",
      priority: "low",
    },
  ],
  stats: {
    scheduledThisMonth: 25,
    publishedThisMonth: 18,
    pendingAssignments: 8,
    overdueItems: 2,
  },
}

const statusColors = {
  scheduled: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
  draft: "bg-gray-100 text-gray-800",
  published: "bg-green-100 text-green-800",
  confirmed: "bg-purple-100 text-purple-800",
  overdue: "bg-red-100 text-red-800",
}

const priorityColors = {
  high: "border-l-red-500",
  medium: "border-l-yellow-500",
  low: "border-l-green-500",
}

const typeIcons = {
  content: FileText,
  assignment: User,
  meeting: CalendarIcon,
}

export default function EditorialCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState("month")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getEventsForDate = (day: number) => {
    if (!day) return []
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return calendarData.events.filter((event) => event.date === dateStr)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const days = getDaysInMonth(currentDate)
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Editorial Calendar</h1>
        <div className="ml-auto flex items-center gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="politics">Politics</SelectItem>
            </SelectContent>
          </Select>
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="agenda">Agenda</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </header>

      <div className="flex flex-1 gap-4 p-4">
        {/* Main Calendar */}
        <div className="flex-1 space-y-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scheduled This Month</CardTitle>
                <CalendarIcon className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{calendarData.stats.scheduledThisMonth}</div>
                <p className="text-xs text-muted-foreground">Articles & events</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{calendarData.stats.publishedThisMonth}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{calendarData.stats.pendingAssignments}</div>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{calendarData.stats.overdueItems}</div>
                <p className="text-xs text-muted-foreground text-red-600">Requires action</p>
              </CardContent>
            </Card>
          </div>

          {/* Calendar */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{formatDate(currentDate)}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {weekDays.map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-[100px] p-1 border rounded-lg ${
                      day ? "bg-background hover:bg-muted/50" : "bg-muted/20"
                    }`}
                  >
                    {day && (
                      <>
                        <div className="text-sm font-medium mb-1">{day}</div>
                        <div className="space-y-1">
                          {getEventsForDate(day)
                            .slice(0, 3)
                            .map((event) => {
                              const IconComponent = typeIcons[event.type as keyof typeof typeIcons]
                              return (
                                <div
                                  key={event.id}
                                  className={`text-xs p-1 rounded border-l-2 ${priorityColors[event.priority as keyof typeof priorityColors]} bg-muted/50 cursor-pointer hover:bg-muted`}
                                >
                                  <div className="flex items-center gap-1">
                                    <IconComponent className="h-3 w-3" />
                                    <span className="truncate">{event.title}</span>
                                  </div>
                                  <Badge
                                    className={`text-xs ${statusColors[event.status as keyof typeof statusColors]}`}
                                  >
                                    {event.status}
                                  </Badge>
                                </div>
                              )
                            })}
                          {getEventsForDate(day).length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{getEventsForDate(day).length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Upcoming Events */}
        <div className="w-80 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {calendarData.events
                  .filter((event) => new Date(event.date) >= new Date())
                  .slice(0, 5)
                  .map((event) => {
                    const IconComponent = typeIcons[event.type as keyof typeof typeIcons]
                    return (
                      <div key={event.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0">
                          <IconComponent className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{event.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={statusColors[event.status as keyof typeof statusColors]}>
                              {event.status}
                            </Badge>
                            {event.category && <Badge variant="outline">{event.category}</Badge>}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-2">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {new Date(event.date).toLocaleDateString()} at {event.time}
                          </div>
                          {event.author && (
                            <div className="flex items-center mt-2">
                              <Avatar className="h-5 w-5 mr-2">
                                <AvatarImage src={event.author.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {event.author.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">{event.author.name}</span>
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Article
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <User className="h-4 w-4 mr-2" />
                Assign Task
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Book Meeting
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
