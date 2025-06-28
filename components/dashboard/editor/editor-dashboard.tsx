/**
 * Editor Dashboard Component
 * Created by:  postgres
 * Description: Editor-specific dashboard with content management metrics
 */

'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { fetchEditorDashboard } from '@/store/slices/dashboardSlice';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Clock, CheckCircle, Edit } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

/**
 * Editor dashboard component
 * Displays editor-specific metrics and content management tools
 */
export function EditorDashboard() {
  const dispatch = useAppDispatch();
  const { editorData, selectedDateRange, isLoading, error } = useAppSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    // Fetch editor dashboard data on component mount
    dispatch(fetchEditorDashboard(selectedDateRange));
  }, [dispatch, selectedDateRange]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !editorData) {
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
                  dispatch(fetchEditorDashboard(selectedDateRange))
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
        <h1 className="text-3xl font-bold tracking-tight">Editor Dashboard</h1>
        <p className="text-muted-foreground">
          Manage and review content across the platform
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assigned Articles
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {editorData.assignedArticles}
            </div>
            <p className="text-xs text-muted-foreground">
              Articles assigned to you
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reviews
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {editorData.pendingReviews}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting your review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Published Today
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {editorData.publishedToday}
            </div>
            <p className="text-xs text-muted-foreground">
              Articles published today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Draft Articles
            </CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{editorData.draftArticles}</div>
            <p className="text-xs text-muted-foreground">Articles in draft</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common editorial tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center">
              <FileText className="h-6 w-6 mb-2" />
              Review Articles
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
            >
              <Edit className="h-6 w-6 mb-2" />
              Create Article
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
            >
              <CheckCircle className="h-6 w-6 mb-2" />
              Publish Queue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
