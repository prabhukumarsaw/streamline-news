/**
 * Report News Widget Component
 * Created by:  postgres
 * Description: Widget for users to report news or submit tips
 */

'use client';

import { useState } from 'react';
import { AlertTriangle, Send, Camera, FileText, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export function ReportNewsWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    location: '',
    contact: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.type || !formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Here you would typically send the data to your backend
    toast.success("News tip submitted successfully! We'll review it shortly.");

    // Reset form
    setFormData({
      type: '',
      title: '',
      description: '',
      location: '',
      contact: '',
      email: '',
    });
    setIsOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) {
    return (
      <Card className="sticky top-4">
        <CardContent className="p-4">
          <Button
            onClick={() => setIsOpen(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Report Breaking News
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Have a news tip? Let us know!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Report News
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Type of News *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select news type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breaking">Breaking News</SelectItem>
                <SelectItem value="politics">Politics</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">News Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Brief headline of the news"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Provide details about the news..."
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Where did this happen?"
            />
          </div>

          <div>
            <Label htmlFor="contact">Contact Number</Label>
            <Input
              id="contact"
              value={formData.contact}
              onChange={(e) => handleInputChange('contact', e.target.value)}
              placeholder="Your phone number (optional)"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Your email (optional)"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              <Send className="mr-2 h-4 w-4" />
              Submit
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">
            You can also reach us at:
          </p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-3 w-3" />
              <span>tips@newsplatform.com</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
