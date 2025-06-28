/**
 * Author Dashboard Component
 * Created by:  postgres
 * Description: Author-specific dashboard with content creation metrics
 */

'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { fetchAuthorDashboard } from '@/store/slices/dashboardSlice';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Eye, Star, MessageCircle, Plus } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

/**
 * Author dashboard component
 * Displays author-specific metrics and content creation tools
 */
export function AuthorDashboard() {
  const dispatch = useAppDispatch();
  const { authorData, selectedDateRange, isLoading, error } = useAppSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    // Fetch author dashboard data on component mount
    dispatch(fetchAuthorDashboard(selectedDateRange));
  }, [dispatch, selectedDateRange]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !authorData) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                Error Loading Dashboard
              </h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button
                onClick={() =>
                  dispatch(fetchAuthorDashboard(selectedDateRange))
                }
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Author Dashboard</h1>
        <p className="text-muted-foreground">
          Track your content performance and create new articles
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{authorData.myArticles}</div>
            <p className="text-xs text-muted-foreground">
              Total articles published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {authorData.totalViews.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {authorData.averageRating.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Out of 5.0 stars</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Comments
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {authorData.recentComments}
            </div>
            <p className="text-xs text-muted-foreground">Comments this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Create and manage your content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center">
              <Plus className="h-6 w-6 mb-2" />
              New Article
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
            >
              <FileText className="h-6 w-6 mb-2" />
              My Drafts
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
            >
              <Eye className="h-6 w-6 mb-2" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
