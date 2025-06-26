/**
 * Advanced News Detail Component
 * Created by: Prabhu
 * Description: Enhanced news article page with rich features
 */

'use client';

import { useState, useEffect } from 'react';
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
  Print,
  Download,
  Facebook,
  Twitter,
  Linkedin,
  Copy
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Article } from '@/types/news';
import { formatRelativeTime, formatDate } from '@/lib/utils';

interface AdvancedNewsDetailProps {
  article: Article;
  relatedArticles?: Article[];
}

export function AdvancedNewsDetail({ article, relatedArticles = [] }: AdvancedNewsDetailProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 100) + 10);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [fontSize, setFontSize] = useState('medium');

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    toast.success(isLiked ? 'Like removed' : 'Article liked');
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = article.title;
    
    switch (platform) {
      case 'copy':
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReport = () => {
    toast.success('Article reported. Thank you for your feedback.');
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !email.trim() || !name.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    toast.success('Comment submitted successfully');
    setComment('');
    setEmail('');
    setName('');
  };

  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary">{article.categoryId}</Badge>
          {article.trending && (
            <Badge className="bg-red-500">Breaking News</Badge>
          )}
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDate(article.publishedAt)}
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
          {article.title}
        </h1>
        
        <p className="text-xl text-muted-foreground leading-relaxed mb-6">
          {article.excerpt}
        </p>
        
        {/* Article Meta */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${article.authorId}`} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Author {article.authorId}</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatRelativeTime(article.publishedAt)}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{article.views.toLocaleString()} views</span>
                </div>
                <span>•</span>
                <span>{article.readTime} min read</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBookmark}
              className={isBookmarked ? 'bg-blue-50 text-blue-600' : ''}
            >
              <Bookmark className={`h-4 w-4 mr-1 ${isBookmarked ? 'fill-current' : ''}`} />
              {isBookmarked ? 'Saved' : 'Save'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleLike}
              className={isLiked ? 'bg-red-50 text-red-600' : ''}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {likes}
            </Button>
            
            <Button variant="outline" size="sm" onClick={() => setShowComments(!showComments)}>
              <MessageCircle className="h-4 w-4 mr-1" />
              Comment
            </Button>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Article Tools */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 border rounded-lg">
        <div className="flex items-center gap-2">
          <Label htmlFor="font-size" className="text-sm">Font Size:</Label>
          <select
            id="font-size"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="xlarge">Extra Large</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Print className="h-4 w-4 mr-1" />
            Print
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleReport}>
            <Flag className="h-4 w-4 mr-1" />
            Report
          </Button>
        </div>
      </div>

      {/* Article Content */}
      <div className={`prose prose-lg max-w-none dark:prose-invert mb-8 ${fontSizeClasses[fontSize as keyof typeof fontSizeClasses]}`}>
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>

      {/* Article Tags */}
      <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-4 w-4" />
          <span className="text-sm font-medium">Tags:</span>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Social Share */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Share this article:
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleShare('facebook')}>
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleShare('twitter')}>
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleShare('linkedin')}>
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleShare('copy')}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Engagement Section */}
      <div className="mb-8 p-6 border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Was this article helpful?</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ThumbsUp className="h-4 w-4 mr-1" />
              Yes
            </Button>
            <Button variant="outline" size="sm">
              <ThumbsDown className="h-4 w-4 mr-1" />
              No
            </Button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Comments</CardTitle>
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
              <Button type="submit">Submit Comment</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedArticles.slice(0, 4).map((relatedArticle) => (
              <Card key={relatedArticle.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-video">
                  <Image
                    src={relatedArticle.image}
                    alt={relatedArticle.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="text-xs mb-2">
                    {relatedArticle.categoryId}
                  </Badge>
                  <Link href={`/news/${relatedArticle.slug}`}>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {relatedArticle.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatRelativeTime(relatedArticle.publishedAt)}</span>
                    <span>•</span>
                    <span>{relatedArticle.readTime} min read</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}