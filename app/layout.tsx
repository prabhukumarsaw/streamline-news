import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display, Source_Sans_3, Noto_Sans_JP } from 'next/font/google';
import { ThemeProvider } from '@/providers/theme-provider';
import { QueryProvider } from '@/providers/query-provider';
import { ReduxProvider } from '@/providers/redux-provider';
import { Toaster } from '@/components/ui/sonner';
import { generateMetadata } from '@/lib/metadata';

// Advanced font configuration
const inter = Inter({ 
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const playfair = Playfair_Display({ 
  subsets: ['latin', 'latin-ext'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const sourceSans = Source_Sans_3({ 
  subsets: ['latin', 'latin-ext'],
  variable: '--font-source-sans',
  display: 'swap',
  weight: ['300', '400', '600', '700'],
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = generateMetadata({
  title: 'The Japan News - Breaking News & Latest Updates',
  description: 'Stay informed with the latest breaking news, trending stories, and in-depth analysis from Japan and around the world.',
  keywords: ['Japan news', 'breaking news', 'latest news', 'world news', 'politics', 'society'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#dc2626" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${sourceSans.variable} ${notoSansJP.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            <QueryProvider>
              {children}
              <Toaster />
            </QueryProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}