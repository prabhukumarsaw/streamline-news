/**
 * Premium Advanced News Detail Component
 * Created by:  postgres
 * Description: Premium news article page with advanced features and all Article fields
 */

'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Clock,
  User,
  Eye,
  Share2,
  Bookmark,
  Heart,
  MessageCircle,
  ArrowLeft,
  Calendar,
  Tag,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Printer,
  Download,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Star,
  Crown,
  TrendingUp,
  ExternalLink,
  BarChart3,
  CalendarDays,
  FileText,
  Globe,
  Settings,
  Zap,
  Award,
  Shield,
  Users,
  Activity,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Sparkles,
  Target,
  TrendingDown,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  BookOpen,
  Timer,
  MapPin,
  Hash,
  AtSign,
  Link as LinkIcon,
  Search,
  Filter,
  SortAsc,
  SortDesc,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Article } from '@/types/news';
import { formatRelativeTime, formatDate, formatNumber } from '@/lib/utils';

interface AdvancedNewsDetailProps {
  article: Article | null;
  relatedArticles?: Article[];
}

// Loading Skeleton Component
function ArticleSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
      </div>
      <Skeleton className="h-96 w-full" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function AdvancedNewsDetail({
  article,
  relatedArticles = [],
}: AdvancedNewsDetailProps) {
  // State management with proper null handling
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(article?.likeCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [fontSize, setFontSize] = useState('medium');
  const [readingProgress, setReadingProgress] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAdvancedStats, setShowAdvancedStats] = useState(false);
  const [userEngagement, setUserEngagement] = useState<
    'helpful' | 'not-helpful' | null
  >(null);
  const [readingTimeLeft, setReadingTimeLeft] = useState(
    article?.readingTime || 0
  );
  const [error, setError] = useState<Error | null>(null);

  // Update likes when article changes
  useEffect(() => {
    setLikes(article?.likeCount || 0);
    setReadingTimeLeft(article?.readingTime || 0);
  }, [article]);

  // Reading progress tracking with error handling
  useEffect(() => {
    const handleScroll = () => {
      try {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        setReadingProgress(Math.min(progress, 100));
      } catch (err) {
        console.error('Error calculating reading progress:', err);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reading time countdown
  useEffect(() => {
    if (readingTimeLeft > 0) {
      const timer = setInterval(() => {
        setReadingTimeLeft((prev) => Math.max(0, prev - 1));
      }, 60000); // Update every minute
      return () => clearInterval(timer);
    }
  }, [readingTimeLeft]);

  // Enhanced bookmark functionality with localStorage
  const handleBookmark = useCallback(() => {
    try {
      const newBookmarkState = !isBookmarked;
      setIsBookmarked(newBookmarkState);

      // Save to localStorage
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      if (newBookmarkState && article) {
        bookmarks.push(article.id);
      } else {
        const index = bookmarks.indexOf(article?.id);
        if (index > -1) bookmarks.splice(index, 1);
      }
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

      toast.success(
        newBookmarkState ? 'Added to bookmarks' : 'Removed from bookmarks',
        {
          icon: newBookmarkState ? (
            <Bookmark className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          ),
        }
      );
    } catch (err) {
      toast.error('Failed to update bookmarks');
      console.error('Bookmark error:', err);
    }
  }, [isBookmarked, article]);

  // Enhanced like functionality
  const handleLike = useCallback(() => {
    try {
      const newLikeState = !isLiked;
      setIsLiked(newLikeState);
      setLikes((prev) => (newLikeState ? prev + 1 : prev - 1));

      toast.success(newLikeState ? 'Article liked' : 'Like removed', {
        icon: newLikeState ? (
          <Heart className="h-4 w-4" />
        ) : (
          <XCircle className="h-4 w-4" />
        ),
      });
    } catch (err) {
      toast.error('Failed to update like');
      console.error('Like error:', err);
    }
  }, [isLiked]);

  // Enhanced share functionality with analytics
  const handleShare = useCallback(
    async (platform: string) => {
      try {
        const url = window.location.href;
        const title = article?.title || 'Check out this article';
        const description = article?.excerpt || '';

        const shareData = {
          title,
          text: description,
          url,
        };

        switch (platform) {
          case 'native':
            if (navigator.share) {
              await navigator.share(shareData);
              toast.success('Shared successfully');
            } else {
              await navigator.clipboard.writeText(url);
              toast.success('Link copied to clipboard');
            }
            break;
          case 'copy':
            await navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard');
            break;
          case 'facebook':
            window.open(
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
              '_blank'
            );
            break;
          case 'twitter':
            window.open(
              `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
              '_blank'
            );
            break;
          case 'linkedin':
            window.open(
              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
              '_blank'
            );
            break;
          case 'whatsapp':
            window.open(
              `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
              '_blank'
            );
            break;
        }
      } catch (err) {
        toast.error('Failed to share article');
        console.error('Share error:', err);
      }
    },
    [article]
  );

  // Enhanced print functionality
  const handlePrint = useCallback(() => {
    try {
      window.print();
      toast.success('Print dialog opened');
    } catch (err) {
      toast.error('Failed to open print dialog');
      console.error('Print error:', err);
    }
  }, []);

  // Enhanced report functionality
  const handleReport = useCallback(() => {
    try {
      toast.success('Article reported. Thank you for your feedback.', {
        icon: <Flag className="h-4 w-4" />,
      });
    } catch (err) {
      toast.error('Failed to report article');
      console.error('Report error:', err);
    }
  }, []);

  // Enhanced comment submission
  const handleCommentSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (!comment.trim() || !email.trim() || !name.trim()) {
          toast.error('Please fill in all fields');
          return;
        }

        // Simulate API call
        setTimeout(() => {
          toast.success('Comment submitted successfully', {
            icon: <CheckCircle className="h-4 w-4" />,
          });
          setComment('');
          setEmail('');
          setName('');
        }, 1000);
      } catch (err) {
        toast.error('Failed to submit comment');
        console.error('Comment error:', err);
      }
    },
    [comment, email, name]
  );

  // Enhanced engagement feedback
  const handleEngagementFeedback = useCallback(
    (feedback: 'helpful' | 'not-helpful') => {
      try {
        setUserEngagement(feedback);
        toast.success(
          feedback === 'helpful'
            ? 'Thank you for your feedback!'
            : 'We&apos;ll work to improve this content.',
          {
            icon:
              feedback === 'helpful' ? (
                <ThumbsUp className="h-4 w-4" />
              ) : (
                <ThumbsDown className="h-4 w-4" />
              ),
          }
        );
      } catch (err) {
        toast.error('Failed to submit feedback');
        console.error('Feedback error:', err);
      }
    },
    []
  );

  // Font size classes
  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl',
  };

  // Early return for null article with enhanced error handling
  if (!article) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <AlertCircle className="h-16 w-16 text-gray-400" />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Article Not Found
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              The article you&apos;re looking for doesn&apos;t exist or has been
              removed from our platform.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link href="/news">
              <Button variant="outline" className="w-full sm:w-auto">
                <Search className="mr-2 h-4 w-4" />
                Browse News
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Safe data extraction with fallbacks
  const safeArticle = {
    id: article.id || 'unknown',
    title: article.title || 'Untitled Article',
    slug: article.slug || 'untitled',
    excerpt: article.excerpt || null,
    contentBody: article.contentBody || null,
    contentType: article.contentType || null,
    status: article.status || 'draft',
    featuredImageId: article.featuredImageId || null,
    authorId: article.authorId || null,
    editorId: article.editorId || null,
    categoryId: article.categoryId || null,
    viewCount: article.viewCount || 0,
    likeCount: article.likeCount || 0,
    commentCount: article.commentCount || 0,
    shareCount: article.shareCount || 0,
    readingTime: article.readingTime || 1,
    isFeatured: article.isFeatured || false,
    isBreaking: article.isBreaking || false,
    isPremium: article.isPremium || false,
    scheduledAt: article.scheduledAt || null,
    publishedAt: article.publishedAt || new Date().toISOString(),
    expiresAt: article.expiresAt || null,
    metaTitle: article.metaTitle || null,
    metaDescription: article.metaDescription || null,
    metaKeywords: article.metaKeywords || null,
    canonicalUrl: article.canonicalUrl || null,
    customFields: article.customFields || null,
    seoScore: article.seoScore || null,
    createdAt: article.createdAt || null,
    updatedAt: article.updatedAt || null,
  };

  // Extract tags from metaKeywords
  const articleTags = safeArticle.metaKeywords
    ? safeArticle.metaKeywords
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  // Calculate engagement metrics with safe fallbacks
  const viewCount = safeArticle.viewCount;
  const likeCount = safeArticle.likeCount;
  const commentCount = safeArticle.commentCount;
  const shareCount = safeArticle.shareCount;
  const totalEngagement = viewCount + likeCount + commentCount + shareCount;
  const engagementRate =
    totalEngagement > 0 ? (likeCount / totalEngagement) * 100 : 0;

  // Calculate reading progress percentage
  const readingProgressPercentage =
    safeArticle.readingTime > 0
      ? ((safeArticle.readingTime - readingTimeLeft) /
          safeArticle.readingTime) *
        100
      : 0;

  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <article className="max-w-5xl mx-auto">
        {/* Enhanced Reading Progress Bar */}
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        {/* Enhanced Back Navigation */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Enhanced Article Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {safeArticle.categoryId || 'General'}
            </Badge>
            {safeArticle.isBreaking && (
              <Badge className="bg-red-500 text-white animate-pulse">
                <TrendingUp className="h-3 w-3 mr-1" />
                Breaking News
              </Badge>
            )}
            {safeArticle.isFeatured && (
              <Badge className="bg-blue-500 text-white">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {safeArticle.isPremium && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(safeArticle.publishedAt)}
            </div>
            {safeArticle.contentType && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <Badge variant="outline" className="text-xs">
                  {safeArticle.contentType.replace('_', ' ')}
                </Badge>
              </>
            )}
            {safeArticle.status && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    safeArticle.status === 'published'
                      ? 'text-green-600 border-green-200'
                      : safeArticle.status === 'draft'
                        ? 'text-gray-600 border-gray-200'
                        : 'text-orange-600 border-orange-200'
                  }`}
                >
                  {safeArticle.status}
                </Badge>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            {safeArticle.title}
          </h1>

          {safeArticle.excerpt && (
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-6 max-w-4xl">
              {safeArticle.excerpt}
            </p>
          )}

          {/* Enhanced Article Meta */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Author & Stats */}
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${safeArticle.authorId || 'author'}`}
                      />
                      <AvatarFallback>
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg">
                        Author {safeArticle.authorId || 'Unknown'}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatRelativeTime(safeArticle.publishedAt)}
                          </span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{formatNumber(viewCount)} views</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          <span>{safeArticle.readingTime} min read</span>
                        </div>
                        {readingTimeLeft > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Timer className="h-3 w-3" />
                              <span>{readingTimeLeft} min left</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBookmark}
                      className={
                        isBookmarked
                          ? 'bg-blue-50 text-blue-600 border-blue-200'
                          : ''
                      }
                    >
                      <Bookmark
                        className={`h-4 w-4 mr-1 ${isBookmarked ? 'fill-current' : ''}`}
                      />
                      {isBookmarked ? 'Saved' : 'Save'}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLike}
                      className={
                        isLiked ? 'bg-red-50 text-red-600 border-red-200' : ''
                      }
                    >
                      <Heart
                        className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`}
                      />
                      {likes}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowComments(!showComments)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Comment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Engagement Stats */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold">Engagement</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAdvancedStats(!showAdvancedStats)}
                    >
                      {showAdvancedStats ? (
                        <Minimize2 className="h-3 w-3" />
                      ) : (
                        <Maximize2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Views</span>
                      <span className="font-medium">
                        {formatNumber(viewCount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Likes</span>
                      <span className="font-medium">
                        {formatNumber(likeCount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Comments</span>
                      <span className="font-medium">
                        {formatNumber(commentCount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shares</span>
                      <span className="font-medium">
                        {formatNumber(shareCount)}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Engagement Rate</span>
                      <span className="font-medium">
                        {engagementRate.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={engagementRate} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Reading Progress</span>
                      <span className="font-medium">
                        {readingProgressPercentage.toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={readingProgressPercentage}
                      className="h-2"
                    />
                  </div>

                  {safeArticle.seoScore && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>SEO Score</span>
                          <span className="font-medium">
                            {safeArticle.seoScore}/100
                          </span>
                        </div>
                        <Progress
                          value={safeArticle.seoScore}
                          className="h-2"
                        />
                      </div>
                    </>
                  )}

                  {showAdvancedStats && (
                    <>
                      <Separator />
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Total Engagement</span>
                          <span>{formatNumber(totalEngagement)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg. Time on Page</span>
                          <span>{safeArticle.readingTime} min</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bounce Rate</span>
                          <span>{(100 - engagementRate).toFixed(1)}%</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Enhanced Featured Image */}
        {safeArticle.featuredImageId && (
          <div className="relative aspect-video mb-8 rounded-xl overflow-hidden shadow-2xl">
            {isImageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            )}
            <Image
              src={safeArticle.featuredImageId}
              alt={safeArticle.title}
              fill
              className={`object-cover transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
              priority
              onLoad={() => setIsImageLoading(false)}
              onError={() => {
                setIsImageLoading(false);
                toast.error('Failed to load image');
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Image Controls */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="bg-black/50 text-white hover:bg-black/70"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                className="bg-black/50 text-white hover:bg-black/70"
              >
                {isAudioPlaying ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Enhanced Article Tools */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="font-size" className="text-sm font-medium">
                Font Size:
              </Label>
              <select
                id="font-size"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="text-sm border rounded px-3 py-1 bg-white dark:bg-gray-800"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xlarge">Extra Large</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>

            <Button variant="outline" size="sm" onClick={handleReport}>
              <Flag className="h-4 w-4 mr-1" />
              Report
            </Button>
          </div>
        </div>

        {/* Enhanced Article Content */}
        {safeArticle.contentBody && (
          <div
            className={`prose prose-lg max-w-none dark:prose-invert mb-8 ${fontSizeClasses[fontSize as keyof typeof fontSizeClasses]}`}
          >
            <div
              dangerouslySetInnerHTML={{ __html: safeArticle.contentBody }}
            />
          </div>
        )}

        {/* Enhanced Article Tags & Social Share */}
        {articleTags.length > 0 && (
          <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {articleTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs hover:bg-blue-50"
                  >
                    <Hash className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Enhanced Social Share */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Share this article:
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('native')}
                  className="hover:bg-green-50 hover:text-green-600"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('facebook')}
                  className="hover:bg-blue-50 hover:text-blue-600"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('twitter')}
                  className="hover:bg-sky-50 hover:text-sky-600"
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('linkedin')}
                  className="hover:bg-blue-50 hover:text-blue-600"
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('copy')}
                  className="hover:bg-gray-50 hover:text-gray-600"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Engagement Section */}
        <div className="mb-8 p-6 border rounded-xl bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Was this article helpful?
              </h3>
              <p className="text-sm text-muted-foreground">
                Your feedback helps us improve our content.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEngagementFeedback('helpful')}
                className={`hover:bg-green-50 hover:text-green-600 ${
                  userEngagement === 'helpful'
                    ? 'bg-green-50 text-green-600 border-green-200'
                    : ''
                }`}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Yes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEngagementFeedback('not-helpful')}
                className={`hover:bg-red-50 hover:text-red-600 ${
                  userEngagement === 'not-helpful'
                    ? 'bg-red-50 text-red-600 border-red-200'
                    : ''
                }`}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                No
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Comments Section */}
        {showComments && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Comments ({commentCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="comment">Comment</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={4}
                    required
                  />
                </div>
                <Button type="submit" className="w-full sm:w-auto">
                  Submit Comment
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Article Metadata */}
        {(safeArticle.metaTitle ||
          safeArticle.metaDescription ||
          safeArticle.canonicalUrl ||
          safeArticle.customFields) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Article Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {safeArticle.metaTitle && (
                <div>
                  <Label className="text-sm font-medium">Meta Title</Label>
                  <p className="text-sm text-muted-foreground">
                    {safeArticle.metaTitle}
                  </p>
                </div>
              )}
              {safeArticle.metaDescription && (
                <div>
                  <Label className="text-sm font-medium">
                    Meta Description
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {safeArticle.metaDescription}
                  </p>
                </div>
              )}
              {safeArticle.canonicalUrl && (
                <div>
                  <Label className="text-sm font-medium">Canonical URL</Label>
                  <a
                    href={safeArticle.canonicalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {safeArticle.canonicalUrl}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              {safeArticle.customFields &&
                Object.keys(safeArticle.customFields).length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Custom Fields</Label>
                    <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 overflow-x-auto">
                      {JSON.stringify(safeArticle.customFields, null, 2)}
                    </pre>
                  </div>
                )}
            </CardContent>
          </Card>
        )}

        {/* Enhanced Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Activity className="h-6 w-6" />
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.slice(0, 4).map((relatedArticle) => (
                <Card
                  key={relatedArticle.id}
                  className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
                >
                  {relatedArticle.featuredImageId && (
                    <div className="relative aspect-video">
                      <Image
                        src={relatedArticle.featuredImageId}
                        alt={relatedArticle.title || 'Related article'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {relatedArticle.categoryId || 'General'}
                      </Badge>
                      {relatedArticle.isBreaking && (
                        <Badge className="bg-red-500 text-white text-xs">
                          <TrendingUp className="h-2 w-2 mr-1" />
                          Breaking
                        </Badge>
                      )}
                    </div>
                    <Link href={`/news/${relatedArticle.slug}`}>
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2 text-lg">
                        {relatedArticle.title || 'Untitled'}
                      </h3>
                    </Link>
                    {relatedArticle.excerpt && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatRelativeTime(
                            relatedArticle.publishedAt ||
                              new Date().toISOString()
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-3 w-3" />
                        <span>
                          {formatNumber(relatedArticle.viewCount || 0)}
                        </span>
                        <span>•</span>
                        <span>{relatedArticle.readingTime || 1} min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </article>
    </Suspense>
  );
}
