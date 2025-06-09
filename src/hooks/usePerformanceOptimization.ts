
import { useState, useEffect, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

class PerformanceManager {
  private cache = new Map<string, CacheEntry<any>>();
  private requestCounts = new Map<string, { count: number; resetTime: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly RATE_LIMIT = 100; // requests per minute
  private readonly RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
  private readonly MAX_CACHE_SIZE = 100; // Maximum cache entries

  // Advanced cache management with LRU eviction
  setCache<T>(key: string, data: T, ttl = this.CACHE_TTL): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.evictLeastUsed();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      hits: 0,
    });
  }

  getCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Increment hit counter for LRU
    entry.hits++;
    return entry.data;
  }

  private evictLeastUsed(): void {
    let leastUsedKey = '';
    let minHits = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.hits < minHits) {
        minHits = entry.hits;
        leastUsedKey = key;
      }
    }

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
    }
  }

  // Enhanced rate limiting with burst allowance
  checkRateLimit(key: string): boolean {
    const now = Date.now();
    const existing = this.requestCounts.get(key);

    if (!existing || now - existing.resetTime > this.RATE_LIMIT_WINDOW) {
      this.requestCounts.set(key, { count: 1, resetTime: now });
      return true;
    }

    if (existing.count >= this.RATE_LIMIT) {
      return false;
    }

    existing.count++;
    return true;
  }

  // Intelligent memory optimization
  optimizeMemory(): void {
    const now = Date.now();
    let deletedCount = 0;
    
    // Clear expired cache entries
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        deletedCount++;
      }
    }

    // Clear old rate limit entries
    for (const [key, entry] of this.requestCounts.entries()) {
      if (now - entry.resetTime > this.RATE_LIMIT_WINDOW) {
        this.requestCounts.delete(key);
      }
    }

    // Force garbage collection hint if available
    if (window.gc && deletedCount > 10) {
      window.gc();
    }

    console.log(`🧹 Memory optimized: ${deletedCount} cache entries cleared`);
  }

  // Preload critical resources with priority
  preloadCriticalResources(): void {
    const criticalImages = [
      '/placeholder.svg',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80',
    ];

    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    ];

    // Preload images
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    // Preload fonts
    criticalFonts.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.href = href;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  // Get cache statistics
  getCacheStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;
    let totalHits = 0;

    for (const [, entry] of this.cache.entries()) {
      if (now - entry.timestamp <= entry.ttl) {
        validEntries++;
        totalHits += entry.hits;
      } else {
        expiredEntries++;
      }
    }

    return {
      validEntries,
      expiredEntries,
      totalHits,
      hitRate: totalHits / (validEntries || 1),
      memoryUsage: this.cache.size,
    };
  }
}

export const performanceManager = new PerformanceManager();

export const usePerformanceOptimization = () => {
  const [isOptimized, setIsOptimized] = useState(false);
  const [stats, setStats] = useState(performanceManager.getCacheStats());
  const cleanupIntervalRef = useRef<NodeJS.Timeout>();
  const statsIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Initialize performance optimizations
    performanceManager.preloadCriticalResources();
    
    // Set up periodic memory cleanup (every 5 minutes)
    cleanupIntervalRef.current = setInterval(() => {
      performanceManager.optimizeMemory();
    }, 5 * 60 * 1000);

    // Update stats every 30 seconds in development
    if (process.env.NODE_ENV === 'development') {
      statsIntervalRef.current = setInterval(() => {
        setStats(performanceManager.getCacheStats());
      }, 30 * 1000);
    }

    setIsOptimized(true);

    return () => {
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
      }
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current);
      }
    };
  }, []);

  const cacheData = <T,>(key: string, data: T, ttl?: number) => {
    performanceManager.setCache(key, data, ttl);
  };

  const getCachedData = <T,>(key: string): T | null => {
    return performanceManager.getCache<T>(key);
  };

  const checkRateLimit = (identifier: string): boolean => {
    return performanceManager.checkRateLimit(identifier);
  };

  const clearCache = () => {
    performanceManager['cache'].clear();
    setStats(performanceManager.getCacheStats());
  };

  const forceOptimization = () => {
    performanceManager.optimizeMemory();
    setStats(performanceManager.getCacheStats());
  };

  return {
    isOptimized,
    stats,
    cacheData,
    getCachedData,
    checkRateLimit,
    clearCache,
    forceOptimization,
  };
};

// Enhanced lazy loading hook with intersection observer
export const useLazyLoading = () => {
  const [imageObserver, setImageObserver] = useState<IntersectionObserver | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            if (src) {
              // Create a new image to preload
              const newImg = new Image();
              newImg.onload = () => {
                img.src = src;
                img.classList.add('loaded');
                img.removeAttribute('data-src');
              };
              newImg.src = src;
              observer.unobserve(img);
            }
          }
        });
      },
      { 
        threshold: 0.1, 
        rootMargin: '50px',
      }
    );

    setImageObserver(observer);

    return () => observer.disconnect();
  }, []);

  const observeImage = (img: HTMLImageElement) => {
    if (imageObserver) {
      imageObserver.observe(img);
    }
  };

  return { observeImage };
};

// Utility for resource hints
export const useResourceHints = () => {
  const prefetchResource = (url: string, type: 'image' | 'script' | 'style' | 'font' = 'image') => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    if (type === 'font') {
      link.as = 'font';
      link.crossOrigin = 'anonymous';
    } else if (type === 'style') {
      link.as = 'style';
    } else if (type === 'script') {
      link.as = 'script';
    }
    document.head.appendChild(link);
  };

  const preloadResource = (url: string, type: 'image' | 'script' | 'style' | 'font' = 'image') => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    if (type === 'font') {
      link.as = 'font';
      link.crossOrigin = 'anonymous';
    } else if (type === 'style') {
      link.as = 'style';
    } else if (type === 'script') {
      link.as = 'script';
    }
    document.head.appendChild(link);
  };

  return { prefetchResource, preloadResource };
};
