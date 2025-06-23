'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdvertisementProps {
  slot: string;
  size: 'banner' | 'rectangle' | 'leaderboard' | 'skyscraper';
  className?: string;
  closeable?: boolean;
}

const adSizes = {
  banner: { width: 728, height: 90 },
  rectangle: { width: 300, height: 250 },
  leaderboard: { width: 970, height: 250 },
  skyscraper: { width: 160, height: 600 },
};

export function Advertisement({ slot, size, className, closeable = false }: AdvertisementProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [adLoaded, setAdLoaded] = useState(false);
  const dimensions = adSizes[size];

  useEffect(() => {
    // Google AdSense integration
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdLoaded(true);
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, []);

  if (!isVisible) return null;

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {closeable && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 z-10 h-6 w-6 p-0"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
      
      <div className="flex items-center justify-center p-4">
        {adLoaded ? (
          <ins
            className="adsbygoogle"
            style={{
              display: 'inline-block',
              width: dimensions.width,
              height: dimensions.height,
            }}
            data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
            data-ad-slot={slot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <div
            className="bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center"
            style={{
              width: dimensions.width,
              height: dimensions.height,
            }}
          >
            <span className="text-gray-500 text-sm">Advertisement</span>
          </div>
        )}
      </div>
    </Card>
  );
}

// Custom Advertisement Component
export function CustomAdvertisement({ 
  title, 
  description, 
  image, 
  link, 
  size,
  className 
}: {
  title: string;
  description: string;
  image: string;
  link: string;
  size: 'banner' | 'rectangle' | 'leaderboard' | 'skyscraper';
  className?: string;
}) {
  const dimensions = adSizes[size];

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer sponsored"
        className="block"
      >
        <div 
          className="relative"
          style={{
            width: dimensions.width,
            height: dimensions.height,
          }}
        >
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-semibold text-sm mb-1">{title}</h3>
            <p className="text-xs opacity-90 line-clamp-2">{description}</p>
            <span className="text-xs opacity-75 mt-1 block">Sponsored</span>
          </div>
        </div>
      </a>
    </Card>
  );
}