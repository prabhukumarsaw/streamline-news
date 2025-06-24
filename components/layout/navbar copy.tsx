'use client';

import type React from 'react';

import { useCallback, useEffect, useRef, useState, memo } from 'react';
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
  Clock,
  ChevronUp,
  Check,
  X,
  Zap,
  TrendingUp,
  Building,
  Trophy,
  Laptop,
  Film,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTheme } from 'next-themes';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { SearchDialog } from './search-dialog';

// Enhanced navigation structure
const topNavItems = [
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Careers', href: '/careers', badge: 'Hiring' },
  { name: 'Privacy Policy', href: '/privacy' },
];

const mainNavItems = [
  {
    name: 'Latest News',
    href: '/latest',
    icon: <Zap className="h-4 w-4" />,
    description: 'Breaking news and latest updates',
    featured: {
      title: 'Breaking News Center',
      description:
        'Stay updated with real-time breaking news from around the world',
      href: '/latest/breaking',
    },
    items: [
      {
        name: 'Breaking News',
        href: '/latest/breaking',
        description: 'Live breaking news updates',
        badge: 'Live',
      },
      {
        name: 'Top Stories',
        href: '/latest/top',
        description: 'Most important stories today',
      },
      {
        name: 'Trending Now',
        href: '/latest/trending',
        description: "What's trending right now",
      },
      {
        name: "Editor's Choice",
        href: '/latest/editors',
        description: 'Curated by our editorial team',
      },
    ],
  },
  {
    name: 'Politics',
    href: '/politics',
    icon: <TrendingUp className="h-4 w-4" />,
    description: 'Political news and analysis',
    items: [
      {
        name: 'National Politics',
        href: '/politics/national',
        description: 'Domestic political coverage',
      },
      {
        name: 'State Politics',
        href: '/politics/state',
        description: 'Regional political news',
      },
      {
        name: 'International',
        href: '/politics/international',
        description: 'Global political affairs',
      },
      {
        name: 'Elections 2024',
        href: '/politics/elections',
        description: 'Election coverage and analysis',
        badge: '2024',
      },
      {
        name: 'Policy & Governance',
        href: '/politics/policy',
        description: 'Government policies and decisions',
      },
    ],
  },
  {
    name: 'Business',
    href: '/business',
    icon: <Building className="h-4 w-4" />,
    description: 'Business news and market updates',
    items: [
      {
        name: 'Stock Markets',
        href: '/business/markets',
        description: 'Live market updates and analysis',
      },
      {
        name: 'Economy',
        href: '/business/economy',
        description: 'Economic indicators and trends',
      },
      {
        name: 'Corporate News',
        href: '/business/corporate',
        description: 'Company news and announcements',
      },
      {
        name: 'Startups',
        href: '/business/startups',
        description: 'Startup ecosystem and funding news',
      },
      {
        name: 'Banking & Finance',
        href: '/business/banking',
        description: 'Financial sector updates',
      },
    ],
  },
  {
    name: 'Sports',
    href: '/sports',
    icon: <Trophy className="h-4 w-4" />,
    description: 'Sports news and live scores',
    items: [
      {
        name: 'Cricket',
        href: '/sports/cricket',
        description: 'Cricket matches and tournaments',
      },
      {
        name: 'Football',
        href: '/sports/football',
        description: 'Football leagues and matches',
      },
      {
        name: 'Olympics',
        href: '/sports/olympics',
        description: 'Olympic games coverage',
      },
      {
        name: 'Other Sports',
        href: '/sports/other',
        description: 'Tennis, badminton, and more',
      },
    ],
  },
  {
    name: 'Technology',
    href: '/technology',
    icon: <Laptop className="h-4 w-4" />,
    description: 'Tech news and innovations',
    items: [
      {
        name: 'AI & Machine Learning',
        href: '/tech/ai',
        description: 'Artificial intelligence developments',
        badge: 'Hot',
      },
      {
        name: 'Gadgets & Reviews',
        href: '/tech/gadgets',
        description: 'Latest gadgets and tech reviews',
      },
      {
        name: 'Cybersecurity',
        href: '/tech/security',
        description: 'Digital security and privacy',
      },
      {
        name: 'Space & Science',
        href: '/tech/science',
        description: 'Space exploration and scientific discoveries',
      },
    ],
  },
  {
    name: 'Entertainment',
    href: '/entertainment',
    icon: <Film className="h-4 w-4" />,
    description: 'Entertainment and lifestyle news',
    items: [
      {
        name: 'Bollywood',
        href: '/entertainment/bollywood',
        description: 'Hindi film industry news',
      },
      {
        name: 'Hollywood',
        href: '/entertainment/hollywood',
        description: 'International entertainment',
      },
      {
        name: 'Music',
        href: '/entertainment/music',
        description: 'Music industry updates',
      },
      {
        name: 'Celebrity News',
        href: '/entertainment/celebrity',
        description: 'Celebrity gossip and updates',
      },
    ],
  },
];

const languages = [
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
];

// Breaking news data
const breakingNews = [
  {
    id: 1,
    title: 'Major Economic Summit Concludes with Historic Trade Agreement',
    href: '/breaking/economic-summit',
    time: new Date(),
  },
  {
    id: 2,
    title: 'Technology Giants Announce Revolutionary AI Safety Initiative',
    href: '/breaking/ai-safety',
    time: new Date(Date.now() - 15 * 60 * 1000),
  },
];

// Mobile Menu Component
const MobileMenu = memo(
  ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    const toggleSubmenu = useCallback((name: string) => {
      setOpenSubmenu((prev) => (prev === name ? null : name));
    }, []);

    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-80 p-0">
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-red-50 dark:from-blue-950 dark:to-red-950">
              <div className="flex items-center space-x-3">
                <Image
                  src="/logo.webp"
                  alt="Naxatra News"
                  width={48}
                  height={32}
                  className="object-contain"
                />
                <div>
                  <div className="font-semibold text-sm">Naxatra News</div>
                  <div className="text-xs text-muted-foreground">
                    सच की आवाज़
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-1">
                {/* Home Link */}
                <Link
                  href="/"
                  className="flex items-center space-x-3 p-3 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
                  onClick={onClose}
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Home</span>
                </Link>

                {/* Main Navigation Items */}
                {mainNavItems.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Link
                        href={item.href}
                        className="flex-1 flex items-center space-x-3 p-3 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
                        onClick={onClose}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                      {item.items && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSubmenu(item.name)}
                          className="h-8 w-8 p-0 mr-2"
                        >
                          {openSubmenu === item.name ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>

                    {item.items && openSubmenu === item.name && (
                      <div className="ml-6 space-y-1 border-l-2 border-muted pl-4">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                            onClick={onClose}
                          >
                            <div className="flex items-center justify-between">
                              <span>{subItem.name}</span>
                              {subItem.badge && (
                                <Badge variant="secondary" className="text-xs">
                                  {subItem.badge}
                                </Badge>
                              )}
                            </div>
                            {subItem.description && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {subItem.description}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
);

MobileMenu.displayName = 'MobileMenu';

// List Item Component for Navigation
const ListItem = memo(
  ({
    className,
    title,
    children,
    href,
    ...props
  }: React.ComponentPropsWithoutRef<'li'> & {
    href: string;
    title: string;
  }) => {
    return (
      <li {...props}>
        <NavigationMenuLink asChild>
          <Link
            href={href}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  }
);

ListItem.displayName = 'ListItem';

// Main Navbar Component
export function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTopVisible, setIsTopVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const { theme, setTheme } = useTheme();
  const lastScrollY = useRef(0);

  const debouncedScrollY = useDebounce(scrollY, 100);

  // Optimized scroll handler
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle navbar visibility
  useEffect(() => {
    const current = scrollY;
    const last = lastScrollY.current;

    if (current > last && current > 100) {
      setIsTopVisible(false);
    } else if (current < last || current <= 100) {
      setIsTopVisible(true);
    }

    lastScrollY.current = debouncedScrollY;
  }, [debouncedScrollY, scrollY]);

  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b shadow-sm">
        {/* Top Navigation Bar */}
        <div
          className={`border-b bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 transition-all duration-300 ${
            isTopVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-full'
          }`}
          style={{ display: isTopVisible ? 'block' : 'none' }}
        >
          <div className="container mx-auto px-4">
            <div className="flex h-9 items-center justify-between text-sm">
              <nav className="hidden md:flex items-center space-x-6">
                {topNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
                  >
                    <span>{item.name}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-1.5 py-0.5"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center space-x-3">
                {/* Language Selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      <Globe className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">
                        {selectedLang.name}
                      </span>
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {languages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setSelectedLang(lang)}
                        className="text-sm"
                      >
                        <span className="mr-2">{lang.flag}</span>
                        {lang.name}
                        {selectedLang.code === lang.code && (
                          <Check className="ml-auto h-3 w-3" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="h-7 w-7 p-0"
                >
                  <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>

                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 relative"
                >
                  <Bell className="h-3.5 w-3.5" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs bg-red-500">
                    3
                  </Badge>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo + Mobile Menu + Search */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <Image
                    src="/logo.webp"
                    alt="Naxatra News"
                    width={100}
                    height={66}
                    className="object-contain transition-transform group-hover:scale-105"
                    priority
                  />
                </div>
                <div className="hidden sm:block">
                  <div className="text-lg font-bold text-foreground">
                    Naxatra News
                  </div>
                  <div className="text-xs text-muted-foreground -mt-1">
                    सच की आवाज़
                  </div>
                </div>
              </Link>

              <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className=" h-9 w-9 p-0">
                    <Menu className="h-5 w-5" />
                    <VisuallyHidden>Open navigation menu</VisuallyHidden>
                  </Button>
                </SheetTrigger>
                <MobileMenu isOpen={isMobileOpen} onClose={closeMobile} />
              </Sheet>

              {/* Desktop Search */}
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search news, topics, authors..."
                  className="pl-10 pr-4 h-9 w-64 lg:w-80 text-sm rounded-full bg-muted/50 border-muted focus:bg-background focus:border-border"
                />
              </div>

              {/* Mobile Search */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden h-9 w-9 p-0"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
                <VisuallyHidden>Open search</VisuallyHidden>
              </Button>
            </div>

            {/* Right: User + Subscribe */}
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <User className="h-4 w-4" />
                    <VisuallyHidden>User menu</VisuallyHidden>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Link href="/login" className="w-full">
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/register" className="w-full">
                      Create Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/dashboard" className="w-full">
                      My Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/bookmarks" className="w-full">
                      Saved Articles
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                size="sm"
                className="hidden sm:flex h-9 text-sm px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium shadow-sm"
              >
                SUBSCRIBE
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation - Desktop Only */}
        <div className="hidden lg:block border-t bg-gradient-to-r from-gray-50/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-950/50">
          <div className="container mx-auto px-4">
            <NavigationMenu className="w-full">
              <NavigationMenuList className="flex items-center justify-center space-x-1 w-full">
                {mainNavItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    {item.items ? (
                      <>
                        <NavigationMenuTrigger className="h-12 px-4 text-sm font-medium hover:text-red-600 data-[active]:text-red-600 data-[state=open]:text-red-600 transition-colors flex items-center space-x-1">
                          {item.icon}
                          <span>{item.name}</span>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          {item.featured ? (
                            <ul className="grid  gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                              <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                  <Link
                                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                    href={item.featured.href}
                                  >
                                    <div className="mb-2 mt-4 text-lg font-medium">
                                      {item.featured.title}
                                    </div>
                                    <p className="text-sm leading-tight text-muted-foreground">
                                      {item.featured.description}
                                    </p>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                              {item.items.slice(0, 3).map((subItem) => (
                                <ListItem
                                  key={subItem.name}
                                  href={subItem.href}
                                  title={subItem.name}
                                >
                                  {subItem.description}
                                </ListItem>
                              ))}
                            </ul>
                          ) : (
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                              {item.items.map((subItem) => (
                                <ListItem
                                  key={subItem.name}
                                  title={subItem.name}
                                  href={subItem.href}
                                >
                                  <div className="flex items-center justify-between">
                                    <span>{subItem.description}</span>
                                    {subItem.badge && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs ml-2"
                                      >
                                        {subItem.badge}
                                      </Badge>
                                    )}
                                  </div>
                                </ListItem>
                              ))}
                            </ul>
                          )}
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle()}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center space-x-1"
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </header>

      {/* Mobile Search Dialog */}
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
}
