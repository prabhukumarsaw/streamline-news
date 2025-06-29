"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Users, Eye, Clock, MousePointer, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const analyticsData = {
  summary: {
    totalPageViews: 125000,
    uniqueVisitors: 45000,
    bounceRate: 65.5,
    avgSessionDuration: 180,
    pageViewsChange: 12.5,
    visitorsChange: -3.2,
  },
  trafficSources: [
    { source: "Direct", visitors: 15000, percentage: 33.3 },
    { source: "Google", visitors: 18000, percentage: 40.0 },
    { source: "Social Media", visitors: 12000, percentage: 26.7 },
  ],
  topPages: [
    {
      url: "/article/tech-trends-2025",
      title: "Tech Trends 2025",
      pageViews: 8500,
      uniqueViews: 6200,
      avgTime: 240,
    },
    {
      url: "/article/climate-solutions",
      title: "Climate Solutions",
      pageViews: 7200,
      uniqueViews: 5800,
      avgTime: 195,
    },
    {
      url: "/article/ai-revolution",
      title: "AI Revolution",
      pageViews: 6800,
      uniqueViews: 5200,
      avgTime: 220,
    },
  ],
}

export default function AnalyticsPage() {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Analytics & Reports</h1>
        <div className="ml-auto flex items-center gap-2">
          <Select defaultValue="30d">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analyticsData.summary.totalPageViews)}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                <span className="text-green-600">+{analyticsData.summary.pageViewsChange}%</span>
                <span className="ml-1">from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analyticsData.summary.uniqueVisitors)}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                <span className="text-red-600">{analyticsData.summary.visitorsChange}%</span>
                <span className="ml-1">from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
              <MousePointer className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.summary.bounceRate}%</div>
              <p className="text-xs text-muted-foreground">Visitors who left after one page</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(analyticsData.summary.avgSessionDuration)}</div>
              <p className="text-xs text-muted-foreground">Average time spent on site</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Traffic Chart */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Traffic Overview</CardTitle>
              <CardDescription>Page views and visitors over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Traffic chart visualization would go here</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Line chart showing daily page views and unique visitors
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors come from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.trafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full bg-primary"
                        style={{
                          backgroundColor: index === 0 ? "#3b82f6" : index === 1 ? "#10b981" : "#f59e0b",
                        }}
                      />
                      <span className="text-sm font-medium">{source.source}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{formatNumber(source.visitors)}</div>
                      <div className="text-xs text-muted-foreground">{source.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Pages</CardTitle>
            <CardDescription>Your most popular content this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <h4 className="font-medium">{page.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{page.url}</p>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <div className="text-center">
                      <div className="font-medium text-foreground">{formatNumber(page.pageViews)}</div>
                      <div className="text-xs">Page Views</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-foreground">{formatNumber(page.uniqueViews)}</div>
                      <div className="text-xs">Unique Views</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-foreground">{formatDuration(page.avgTime)}</div>
                      <div className="text-xs">Avg. Time</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Analytics Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
              <CardDescription>How your content is performing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Articles Published</span>
                  <span className="font-medium">45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Engagement Rate</span>
                  <span className="font-medium">7.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Comments</span>
                  <span className="font-medium">1,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Social Shares</span>
                  <span className="font-medium">2,567</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
              <CardDescription>How users interact with your site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Return Visitors</span>
                  <span className="font-medium">34.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pages per Session</span>
                  <span className="font-medium">2.8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Newsletter Signups</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mobile Traffic</span>
                  <span className="font-medium">68.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
