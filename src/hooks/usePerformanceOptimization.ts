
import { useState, useEffect, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class PerformanceManager {
  private cache = new Map<string, CacheEntry<any>>();
  private requestCounts = new Map<string, { count: number; resetTime: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly RATE_LIMIT = 100; // requests per minute
  private readonly RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

  // Cache management
  setCache<T>(key: string, data: T, ttl = this.CACHE_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
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

    return entry.data;
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Rate limiting
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

  // Memory optimization
  optimizeMemory(): void {
    const now = Date.now();
    
    // Clear expired cache entries
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }

    // Clear old rate limit entries
    for (const [key, entry] of this.requestCounts.entries()) {
      if (now - entry.resetTime > this.RATE_LIMIT_WINDOW) {
        this.requestCounts.delete(key);
      }
    }
  }

  // Preload critical resources
  preloadCriticalResources(): void {
    const criticalImages = [
      '/placeholder.svg',
      // Add other critical images here
    ];

    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }
}

export const performanceManager = new PerformanceManager();

export const usePerformanceOptimization = () => {
  const [isOptimized, setIsOptimized] = useState(false);
  const cleanupIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Initialize performance optimizations
    performanceManager.preloadCriticalResources();
    
    // Set up periodic memory cleanup
    cleanupIntervalRef.current = setInterval(() => {
      performanceManager.optimizeMemory();
    }, 5 * 60 * 1000); // Every 5 minutes

    setIsOptimized(true);

    return () => {
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
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
    performanceManager.clearCache();
  };

  return {
    isOptimized,
    cacheData,
    getCachedData,
    checkRateLimit,
    clearCache,
  };
};

// Utility for lazy loading images
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
              img.src = src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
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
