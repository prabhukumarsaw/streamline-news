'use client';

import React from 'react';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  memo,
  useMemo,
  Suspense,
  lazy,
} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Sun,
  Moon,
  User,
  Globe,
  ChevronDown,
  Menu,
  Bell,
  Check,
  Zap,
  Film,
  Home,
  AlertCircle,
  Loader2,
  TrendingUp,
  Star,
  Bookmark,
  Settings,
  LogOut,
  FlameIcon as Fire,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from 'next-themes';
import { useDebounce } from '@/hooks/use-debounce';
import { getCategories, getTrendingNews } from '@/services/news-service';
import type { Category } from '@/types/news';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

// Lazy load heavy components
const SearchDialog = dynamic(() => import('./search-dialog'));
const MobileMenu = dynamic(() => import('./mobile-menu'));

// Enhanced static navigation items with better structure
const topNavItems = [
  {
    name: 'होम',
    href: '/',
    icon: Home,
    description: 'मुख्य पृष्ठ',
    ariaLabel: 'Home page',
  },
  {
    name: 'हमारे बारे में',
    href: '/about',
    icon: User,
    ariaLabel: 'About us page',
  },
  {
    name: 'संपर्क',
    href: '/contact',
    icon: Bell,
    ariaLabel: 'Contact page',
  },
  {
    name: 'करियर',
    href: '/careers',
    badge: 'भर्ती',
    icon: TrendingUp,
    ariaLabel: 'Careers page with new openings',
  },
] as const;

const staticMainNavItems = [
  {
    name: 'ताज़ा खबरें',
    href: '/latest',
    icon: Zap,
    description: 'नवीनतम समाचार और अपडेट',
    badge: '',
    isHot: true,
    ariaLabel: 'Latest news with live updates',
  },
] as const;

const languages = [
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳', isDefault: true },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
] as const;

// Enhanced Error Boundary Component
class NavbarErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Navbar Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="h-16 bg-background border-b flex items-center justify-center">
            <div className="text-sm text-muted-foreground flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>Navigation temporarily unavailable</span>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Enhanced Bottom Navigation with better performance
const BottomNavigation = memo(
  ({
    categories,
    isLoading,
    error,
  }: {
    categories: Category[];
    isLoading: boolean;
    error: any;
  }) => {
    const sortedCategories = useMemo(() => {
      return [...categories].sort((a, b) => a.serial - b.serial).slice(0, 15); // Limit for performance
    }, [categories]);

    const moreCategories = useMemo(() => {
      return [...categories].sort((a, b) => a.serial - b.serial).slice(15);
    }, [categories]);

    if (error) {
      return (
        <div className="hidden lg:block border-t bg-gradient-to-r from-red-50/50 to-orange-50/50 dark:from-red-950/50 dark:to-orange-950/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center py-3">
              <div className="text-sm text-red-500 flex items-center space-x-2">
                <AlertCircle className="h-4 w-4" />
                <span>श्रेणियां लोड करने में त्रुटि</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="ml-2"
                >
                  पुनः प्रयास करें
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <nav
        className="hidden lg:block border-t bg-gradient-to-r from-gray-50/80 to-red-50/80 dark:from-gray-900/80 dark:to-red-950/80"
        aria-label="Category navigation"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-1.5">
            {isLoading ? (
              <div className="flex items-center space-x-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-20 rounded-full" />
                ))}
              </div>
            ) : (
              <div className="flex items-center space-x-1 overflow-x-auto max-w-full scrollbar-hide">
                {/* Static Items */}
                {staticMainNavItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-2 px-4 py-1 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      aria-label={item.ariaLabel}
                    >
                      <IconComponent className="h-4 w-4" aria-hidden="true" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

                {/* Separator */}
                <div className="h-6 w-px bg-border mx-2" aria-hidden="true" />

                {/* API Categories */}
                {sortedCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.renderer_code.toLowerCase()}`}
                    className="flex items-center space-x-2 px-4 py-1 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400 transition-colors whitespace-nowrap group focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    aria-label={`${category.category} category`}
                  >
                    <span>{category.category}</span>
                  </Link>
                ))}

                {/* More Categories Dropdown */}
                {moreCategories.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full focus:ring-2 focus:ring-red-500/20"
                        aria-label="More categories"
                      >
                        और भी
                        <ChevronDown
                          className="ml-1 h-3 w-3"
                          aria-hidden="true"
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 max-h-96 overflow-y-auto">
                      <DropdownMenuLabel>अन्य श्रेणियां</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {moreCategories.map((category) => (
                        <DropdownMenuItem key={category.id} asChild>
                          <Link
                            href={`/category/${category.renderer_code.toLowerCase()}`}
                            className="flex items-center justify-between w-full"
                          >
                            <span>{category.category}</span>
                            <Badge variant="outline" className="text-xs">
                              {category.serial}
                            </Badge>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  }
);

BottomNavigation.displayName = 'BottomNavigation';

// Main Enhanced Navbar Component
export function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTopVisible, setIsTopVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [selectedLang, setSelectedLang] = useState(
    languages.find((lang) => lang.isDefault) || languages[0]
  );
  const [notificationCount, setNotificationCount] = useState(3);
  const { theme, setTheme } = useTheme();
  const lastScrollY = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const debouncedScrollY = useDebounce(scrollY, 50);

  // Fetch categories with enhanced React Query configuration
  const {
    data: categories = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  // Optimized scroll handler with RAF and throttling
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Throttle scroll events
    const throttledScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(handleScroll, 16); // ~60fps
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Handle navbar visibility with improved logic
  useEffect(() => {
    const current = debouncedScrollY;
    const last = lastScrollY.current;
    const threshold = 100;

    if (current > last && current > threshold) {
      setIsTopVisible(false);
    } else if (current < last || current <= threshold) {
      setIsTopVisible(true);
    }

    lastScrollY.current = current;
  }, [debouncedScrollY]);

  // Memoized callbacks
  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  const handleNotificationClick = useCallback(() => {
    setNotificationCount(0);
    // Handle notification logic here
  }, []);

  const handleThemeToggle = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const handleLanguageChange = useCallback(
    (lang: (typeof languages)[number]) => {
      setSelectedLang(lang);
      // Add language change logic here
    },
    []
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            setIsSearchOpen(true);
            break;
          case 'm':
            e.preventDefault();
            setIsMobileOpen((prev) => !prev);
            break;
        }
      }

      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <NavbarErrorBoundary>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b shadow-sm">
        {/* Top Navigation Bar */}
        <div
          className={cn(
            'border-b bg-gradient-to-r from-gray-50 to-red-50 dark:from-gray-900 dark:to-red-950 transition-all duration-300',
            isTopVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-full pointer-events-none'
          )}
          role="navigation"
          aria-label="Top navigation"
        >
          <div className="container mx-auto px-4">
            <div className="flex h-10 items-center justify-between text-sm">
              <nav className="hidden md:flex items-center space-x-6">
                {topNavItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1 group focus:outline-none focus:ring-2 focus:ring-red-500/20 rounded px-2 py-1"
                      aria-label={item.ariaLabel}
                    >
                      <IconComponent className="h-4 w-4" aria-hidden="true" />
                      <span>{item.name}</span>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="text-xs px-1.5 py-0.5 group-hover:scale-110 transition-transform"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="flex items-center space-x-3">
                {/* Language Selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs hover:bg-white/50 focus:ring-2 focus:ring-red-500/20"
                      aria-label={`Current language: ${selectedLang.name}`}
                    >
                      <Globe className="h-3 w-3 mr-1" aria-hidden="true" />
                      <span className="hidden sm:inline">
                        {selectedLang.name}
                      </span>
                      <ChevronDown
                        className="h-3 w-3 ml-1"
                        aria-hidden="true"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>भाषा चुनें</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {languages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang)}
                        className="text-sm cursor-pointer"
                      >
                        <span className="mr-2" aria-hidden="true">
                          {lang.flag}
                        </span>
                        {lang.name}
                        {selectedLang.code === lang.code && (
                          <Check
                            className="ml-auto h-3 w-3 text-green-600"
                            aria-label="Selected"
                          />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleThemeToggle}
                  className="h-8 w-8 p-0 hover:bg-white/50 focus:ring-2 focus:ring-red-500/20"
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>

                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 relative hover:bg-white/50 focus:ring-2 focus:ring-red-500/20"
                  onClick={handleNotificationClick}
                  aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount} unread)` : ''}`}
                >
                  <Bell className="h-4 w-4" />
                  {notificationCount > 0 && (
                    <Badge
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 animate-pulse"
                      aria-label={`${notificationCount} unread notifications`}
                    >
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo + Mobile Menu + Search */}
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-red-500/20 rounded-lg p-1"
                aria-label="Naxatra News homepage"
              >
                <div className="relative">
                  <Image
                    src="/logo.webp"
                    alt="Naxatra News logo"
                    width={100}
                    height={66}
                    className="object-contain transition-transform group-hover:scale-105"
                    priority
                  />
                  <div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"
                    aria-hidden="true"
                  />
                </div>
              </Link>

              <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className=" h-9 w-9 p-0 hover:bg-accent focus:ring-2 focus:ring-red-500/20"
                    aria-label="Open navigation menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <Suspense fallback={<div>Loading...</div>}>
                  <MobileMenu
                    isOpen={isMobileOpen}
                    onClose={closeMobile}
                    categories={categories}
                  />
                </Suspense>
              </Sheet>

              {/* Desktop Search */}
              <div className="hidden md:flex relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  placeholder="समाचार, विषय, लेखक खोजें... (Ctrl+K)"
                  className="pl-10 pr-4 h-10 w-64 lg:w-80 text-sm rounded-full bg-muted/50 border-muted focus:bg-background focus:border-border focus:ring-2 focus:ring-red-500/20 transition-all"
                  onClick={() => setIsSearchOpen(true)}
                  readOnly
                  aria-label="Search news, topics, authors"
                />
              </div>

              {/* Mobile Search */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden h-9 w-9 p-0 hover:bg-accent focus:ring-2 focus:ring-red-500/20"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open search"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Right: User + Subscribe */}
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 hover:bg-accent focus:ring-2 focus:ring-red-500/20"
                    aria-label="User menu"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32"
                        alt="User avatar"
                      />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>मेरा खाता</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      साइन इन
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register" className="flex items-center w-full">
                      <Star className="mr-2 h-4 w-4" />
                      खाता बनाएं
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="flex items-center w-full"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      मेरा डैशबोर्ड
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/bookmarks"
                      className="flex items-center w-full"
                    >
                      <Bookmark className="mr-2 h-4 w-4" />
                      सेव किए गए लेख
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      सेटिंग्स
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>लॉग आउट</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                size="sm"
                className="hidden sm:flex h-9 text-sm px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-red-500/20"
                aria-label="Subscribe to newsletter"
              >
                सब्सक्राइब करें
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Navigation */}
        <BottomNavigation
          categories={categories}
          isLoading={isLoading}
          error={error}
        />
      </header>

      {/* Enhanced Search Dialog */}
      <Suspense fallback={null}>
        <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
      </Suspense>
    </NavbarErrorBoundary>
  );
}
