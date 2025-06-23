'use client';

import { useState, useEffect } from 'react';
import { Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VisitorStats {
  current: number;
  today: number;
  total: number;
}

export function VisitorCountWidget() {
  const [stats, setStats] = useState<VisitorStats>({
    current: 1247,
    today: 8456,
    total: 1234567,
  });

  useEffect(() => {
    // Simulate live visitor count updates
    const interval = setInterval(() => {
      setStats(prev => ({
        current: prev.current + Math.floor(Math.random() * 5) - 2, // Random change ±2
        today: prev.today + Math.floor(Math.random() * 3),
        total: prev.total + Math.floor(Math.random() * 3),
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Users className="h-4 w-4" />
          Visitors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Online Now</span>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">{stats.current.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Today</span>
            <span className="font-medium">{stats.today.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-medium">{stats.total.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-green-600">
          <TrendingUp className="h-3 w-3" />
          <span>+12% from yesterday</span>
        </div>
      </CardContent>
    </Card>
  );
}