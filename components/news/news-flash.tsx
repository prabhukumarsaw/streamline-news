"use client"
import { useState, useEffect } from "react"
import { newsData } from '@/data/news-data';
import Link from "next/link";


export function NewsFlash() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { newsFlashItems } = newsData

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsFlashItems.length)
    }, 4000) // Change every 4 seconds

    return () => clearInterval(interval)
  }, [newsFlashItems.length])

  return (
    <div className="bg-red-600 text-white py-0.5 sm:py-0.5 overflow-hidden">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* News Flash Label */}
          <div className="bg-white text-red-600 px-1.5 sm:px-2 py-0.5 text-xs sm:text-sm font-semibold flex-shrink-0 rounded-sm">
            NEWS FLASH
          </div>

          {/* News Content Container */}
          <div className="flex-1 overflow-hidden relative">
            <div className="relative h-6 sm:h-7">
              {newsFlashItems.map((item, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 flex items-center transition-all duration-700 ease-in-out ${
                    index === currentIndex
                      ? "opacity-100 translate-y-0"
                      : index === (currentIndex - 1 + newsFlashItems.length) % newsFlashItems.length
                      ? "opacity-0 -translate-y-full"
                      : "opacity-0 translate-y-full"
                  }`}
                >
                  <Link href="#" className="text-xs sm:text-sm leading-relaxed truncate sm:whitespace-normal pr-4">
                    {item}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex-shrink-0">
            <div className="w-8 sm:w-12 h-1 bg-red-400 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-4000 ease-linear"
                style={{
                  width: '100%',
                  animation: 'progress 4s linear infinite'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}
