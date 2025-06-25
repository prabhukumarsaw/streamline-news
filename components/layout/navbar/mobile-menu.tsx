'use client';

import { useState, useCallback, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sun,
  Moon,
  Bell,
  TrendingUp,
  User,
  Bookmark,
  ChevronRight,
  Home,
  Zap,
  Film,
  FlameIcon as Fire,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import type { Category } from '@/types/news';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

const MobileMenu = memo(({ isOpen, onClose, categories }: MobileMenuProps) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  const toggleSubmenu = useCallback((name: string) => {
    setOpenSubmenu((prev) => (prev === name ? null : name));
  }, []);

  const handleThemeToggle = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const handleLinkClick = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <SheetContent side="left" className="w-80 p-0">
      <div className="flex flex-col h-full">
        {/* Mobile Header */}
        <SheetHeader className="p-4 border-b bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
          <div className="flex items-center space-x-3">
            <Image
              src="/logo.webp"
              alt="Naxatra News"
              width={48}
              height={48}
              className="object-contain rounded-sm"
            />
            <div className="text-left">
              <SheetTitle className="text-sm">Naxatra News</SheetTitle>
              <div className="text-xs text-muted-foreground">सच की आवाज़</div>
            </div>
          </div>
        </SheetHeader>

        {/* Mobile Navigation */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-1">
            {/* Categories Section */}
            <div>
              <div className="space-y-1">
                {categories
                  .sort((a, b) => a.serial - b.serial)
                  .map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.renderer_code.toLowerCase()}`}
                      className="flex items-center justify-between p-3 text-sm hover:bg-accent rounded-lg transition-colors group"
                      onClick={handleLinkClick}
                    >
                      <span className="font-medium">{category.category}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {category.serial}
                        </Badge>
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

            <Separator className="my-4" />

            {/* User Actions */}
            <div className="space-y-1">
              <h3 className="px-3 py-2 text-sm font-semibold text-muted-foreground">
                खाता
              </h3>
              <Link
                href="/login"
                className="flex items-center space-x-3 p-3 text-sm hover:bg-accent rounded-lg transition-colors"
                onClick={handleLinkClick}
              >
                <User className="h-4 w-4" />
                <span>साइन इन</span>
              </Link>
              <Link
                href="/bookmarks"
                className="flex items-center space-x-3 p-3 text-sm hover:bg-accent rounded-lg transition-colors"
                onClick={handleLinkClick}
              >
                <Bookmark className="h-4 w-4" />
                <span>सेव किए गए</span>
              </Link>
            </div>
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        <div className="p-4 border-b bg-muted/30">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleThemeToggle}
              className="justify-start"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 mr-2" />
              ) : (
                <Moon className="h-4 w-4 mr-2" />
              )}
              {theme === 'dark' ? 'लाइट मोड' : 'डार्क मोड'}
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Bell className="h-4 w-4 mr-2" />
              सूचनाएं
            </Button>
          </div>
        </div>
      </div>
    </SheetContent>
  );
});

MobileMenu.displayName = 'MobileMenu';

export default MobileMenu;
