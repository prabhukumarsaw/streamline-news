/**
 * Newsletter Widget Component
 * Created by:  postgres
 * Description: Newsletter subscription widget with categories
 */

'use client';

import { useState } from 'react';
import { Mail, Check, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const categories = [
  { id: 'breaking', label: 'Breaking News', description: 'Urgent updates' },
  { id: 'daily', label: 'Daily Digest', description: 'Top stories summary' },
  { id: 'politics', label: 'Politics', description: 'Political coverage' },
  { id: 'business', label: 'Business', description: 'Market & finance news' },
  { id: 'technology', label: 'Technology', description: 'Tech innovations' },
  { id: 'sports', label: 'Sports', description: 'Sports updates' },
];

export function NewsletterWidget() {
  const [email, setEmail] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'breaking',
    'daily',
  ]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error('Please select at least one category');
      return;
    }

    // Here you would typically send the data to your backend
    toast.success('Successfully subscribed to newsletter!');
    setIsSubscribed(true);
    setEmail('');
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, categoryId]);
    } else {
      setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
    }
  };

  if (isSubscribed) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <Check className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-green-700">
              Successfully Subscribed!
            </h3>
            <p className="text-sm text-muted-foreground">
              You'll receive our newsletter based on your preferences.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsSubscribed(false)}
            className="text-sm"
          >
            Subscribe Another Email
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Mail className="h-5 w-5 text-blue-500" />
          Newsletter
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Stay updated with our latest news and stories
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="newsletter-email">Email Address</Label>
            <Input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">
              Choose your interests:
            </Label>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category.id, checked as boolean)
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={category.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {category.label}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Bell className="mr-2 h-4 w-4" />
            Subscribe Now
          </Button>
        </form>

        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
