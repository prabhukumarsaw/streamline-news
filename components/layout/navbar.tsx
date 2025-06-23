"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Search, X, Sun, Moon, User, Globe, ChevronDown, Menu, Check, ChevronUp, MinusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { WeatherWidget } from '@/components/widgets/weather-widget';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { SearchDialog } from './search-dialog';
import { useTheme } from "next-themes"
import { useDebounce } from "@/hooks/use-debounce"

const topNavigation = [
  { name: "Home", href: "/" },
  { name: "Career", href: "/careers" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy", href: "/privacy" },
]

const mainNavigation = [
  {
    name: "Latest News",
    href: "/category/latest",
    items: [
      { name: "Breaking News", href: "/latest/breaking", description: "Latest breaking news updates" },
      { name: "Top Stories", href: "/latest/top", description: "Most important stories today" },
      { name: "Live Updates", href: "/latest/live", description: "Real-time news coverage" },
      { name: "News Analysis", href: "/latest/analysis", description: "In-depth news analysis" },
    ],
  },
  {
    name: "Politics",
    href: "/category/politics",
    items: [
      { name: "National Politics", href: "/politics/national", description: "Domestic political coverage" },
      { name: "International Relations", href: "/politics/international", description: "Global political affairs" },
      { name: "Policy Analysis", href: "/politics/policy", description: "Government policy insights" },
      { name: "Elections", href: "/politics/elections", description: "Election news and coverage" },
    ],
  },
  {
    name: "Society",
    href: "/category/society",
    items: [
      { name: "Social Issues", href: "/society/issues", description: "Current social challenges" },
      { name: "Community News", href: "/society/community", description: "Local community stories" },
      { name: "Demographics", href: "/society/demographics", description: "Population and social trends" },
      { name: "Education", href: "/society/education", description: "Educational developments" },
    ],
  },
  {
    name: "Business",
    href: "/category/business",
    items: [
      { name: "Markets", href: "/business/markets", description: "Stock market and trading" },
      { name: "Corporate News", href: "/business/corporate", description: "Company announcements" },
      { name: "Economy", href: "/business/economy", description: "Economic indicators and trends" },
      { name: "Startups", href: "/business/startups", description: "Startup and innovation news" },
      { name: "Technology", href: "/business/tech", description: "Business technology updates" },
    ],
  },
  {
    name: "World",
    href: "/category/world",
    items: [
      { name: "Asia Pacific", href: "/world/asia-pacific", description: "News from Asia Pacific region" },
      { name: "Europe", href: "/world/europe", description: "European news coverage" },
      { name: "Americas", href: "/world/americas", description: "News from the Americas" },
      { name: "Middle East", href: "/world/middle-east", description: "Middle Eastern developments" },
      { name: "Africa", href: "/world/africa", description: "African continent news" },
    ],
  },
  {
    name: "News Services",
    href: "/news-services",
    items: [
      { name: "Press Releases", href: "/news-services/press", description: "Official press releases" },
      { name: "Wire Services", href: "/news-services/wire", description: "Wire service reports" },
      { name: "Syndicated Content", href: "/news-services/syndicated", description: "Partner content" },
    ],
  },
  {
    name: "Editorial & Columns",
    href: "/editorial",
    items: [
      { name: "Opinion Pieces", href: "/editorial/opinion", description: "Editorial opinions" },
      { name: "Guest Columns", href: "/editorial/guest", description: "Guest writer contributions" },
      { name: "Letters to Editor", href: "/editorial/letters", description: "Reader submissions" },
    ],
  },
  {
    name: "Sports",
    href: "/category/sports",
    items: [
      { name: "Baseball", href: "/sports/baseball", description: "Baseball news and scores" },
      { name: "Soccer", href: "/sports/soccer", description: "Soccer coverage" },
      { name: "Olympics", href: "/sports/olympics", description: "Olympic games coverage" },
      { name: "Other Sports", href: "/sports/other", description: "Various sports coverage" },
    ],
  },
  {
    name: "Science & Nature",
    href: "/category/technology",
    items: [
      { name: "Research", href: "/science/research", description: "Scientific research updates" },
      { name: "Environment", href: "/science/environment", description: "Environmental news" },
      { name: "Technology", href: "/science/technology", description: "Tech innovations" },
      { name: "Health", href: "/science/health", description: "Health and medical news" },
    ],
  },
  {
    name: "Culture",
    href: "/category/culture",
    items: [
      { name: "Arts", href: "/culture/arts", description: "Arts and exhibitions" },
      { name: "Entertainment", href: "/culture/entertainment", description: "Entertainment industry" },
      { name: "Literature", href: "/culture/literature", description: "Books and literature" },
      { name: "Traditional Culture", href: "/culture/traditional", description: "Cultural heritage" },
    ],
  },
  {
    name: "JN Specialties",
    href: "/category/specialties",
    items: [
      { name: "Investigative Reports", href: "/specialties/investigative", description: "In-depth investigations" },
      { name: "Special Features", href: "/specialties/features", description: "Feature stories" },
      { name: "Photo Essays", href: "/specialties/photos", description: "Visual storytelling" },
    ],
  },
  {
    name: "Features",
    href: "/category/features",
    items: [
      { name: "In-Depth Analysis", href: "/features/analysis", description: "Detailed analysis pieces" },
      { name: "Profiles", href: "/features/profiles", description: "People and personality profiles" },
      { name: "Lifestyle", href: "/features/lifestyle", description: "Lifestyle and culture features" },
    ],
  },
]

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "hi", name: "हिंदी", flag: "🇮🇳" },
]

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme();
  const [showSearch, setShowSearch] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const [isVisible, setIsVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const lastScrollYRef = useRef(0);

// Memoize toggleSubmenu to prevent unnecessary re-creations
const toggleSubmenu = useCallback((name: string | number) => {
  setOpenSubmenus((prev) => ({
    ...prev,
    [name]: !prev[name],
  }));
}, []);

// Debounce scrollY
const debouncedScrollY = useDebounce(scrollY, 100);

// Handle scroll events with passive listener
useEffect(() => {
  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

// Update visibility based on debounced scroll
useEffect(() => {
  const currentScrollY = scrollY;
  const lastScrollY = lastScrollYRef.current;

  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    setIsVisible(false);
  } else if (currentScrollY < lastScrollY || currentScrollY <= 100) {
    setIsVisible(true);
  }

  lastScrollYRef.current = debouncedScrollY;
}, [debouncedScrollY, scrollY]);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm">

      {/* Top Navigation Bar */}
      <div
      className={`border-b bg-gray-50/50 dark:bg-gray-900/50 transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-full pointer-events-none"
      }`}
      style={{ display: isVisible ? "block" : "none" }} // Use style to control display
    >
        <div className="container mx-auto px-4">
          <div className="flex h-10 items-center justify-between text-sm">
            <nav className="hidden md:flex items-center space-x-6">
              {topNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">हिंदी</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {languages.map((lang) => (
                    <DropdownMenuItem key={lang.code} className="gap-2">
                      <span>{lang.flag}</span>
                      {lang.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-8 w-8 p-0"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              

            
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="flex relative"> 
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
      <div className="grid grid-cols-1 gap-4">
      <WeatherWidget />
    </div>
        <div className="flex h-full flex-col overflow-y-auto py-6">
          {/* Home Page (special case, no submenu) */}
          <div className="px-4">
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home Page
            </Link>
          </div>

          <nav className="flex-1 space-y-1 px-4">
            {mainNavigation.map((item) => {
              const isSubmenuOpen = openSubmenus[item.name];
              const hasItems = item.items && item.items.length > 0;

              return (
                <div key={item.name} className="space-y-1 pt-2">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      className={`text-sm font-medium hover:text-primary`}
                      onClick={(e) => {
                        if (!hasItems) {
                          setIsMobileMenuOpen(false);
                        } else {
                          e.preventDefault();
                        }
                      }}
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-2">
                      {hasItems && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSubmenu(item.name);
                          }}
                          className="p-1"
                        >
                          {isSubmenuOpen ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  {hasItems && isSubmenuOpen && (
  <div className="ml-4 grid grid-cols-1 md:grid-cols-2 gap-2 border-l pl-4 w-full">
    {item.items.map((subItem) => (
      <Link
        key={subItem.name}
        href={subItem.href}
        className="block p-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors duration-200"
        onClick={() => setIsMobileMenuOpen(false)}
      >
       - {subItem.name}
      </Link>
    ))}
  </div>
)}
                </div>
              );
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>

            {/* Search */}
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-10 pr-4 h-9 w-64 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 rounded-full focus:outline-none"
              />
            </div>


            {/* Mobile Search */}
            <div className="md:hidden">
                <Button variant="ghost" size="sm" onClick={() => setShowSearch(true)} className="h-8 w-8 p-0">
                  <Search className="h-4 w-4" />
                </Button>
            </div>
          </div>
         
          

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold tracking-tight">
              <span className="text-blue-600">THE</span>
              <span className="ml-1 text-gray-900 dark:text-white">STREAM</span>
              <span className="ml-1 text-red-600">LINE</span>
            </div>
            <div className="hidden sm:block text-xs text-muted-foreground border-l pl-2 ml-2">
              BY THE YOMIURI SHIMBUN
            </div>
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">

            {/* User Profile */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <Link href="/auth/login" className="w-full">
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/auth/register" className="w-full">
                      Create Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/dashboard" className="w-full">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

              {/* Subscribe Button */}
             <Button size="sm" className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white font-medium">
                SUBSCRIBE
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar with Hover Dropdowns */}
      <div className="border-t bg-background dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <NavigationMenu className="hidden lg:flex w-full justify-center">
            <NavigationMenuList className="flex items-center space-x-1">
              {mainNavigation.map((item) => (
                <NavigationMenuItem key={item.name}>
                  {item.items ? (
                    <>
                      <NavigationMenuTrigger className="h-12 px-4 text-sm font-medium transition-colors hover:text-blue-600 data-[active]:text-blue-600 data-[state=open]:text-blue-600">
                        {item.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid w-[600px] gap-3 p-6 md:w-[500px] lg:w-[600px] lg:grid-cols-2">
                          {item.items.map((subItem) => (
                            <NavigationMenuLink key={subItem.name} asChild>
                              <Link
                                href={subItem.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">{subItem.name}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {subItem.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground h-12 px-4 text-sm font-medium transition-colors hover:text-blue-600"
                      >
                        {item.name}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
      <SearchDialog open={showSearch} onOpenChange={setShowSearch} />
    </header>
  )
}
