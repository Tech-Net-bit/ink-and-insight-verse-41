
import { useEffect, useState } from 'react';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  largestContentfulPaint: number;
}

const PerformanceMonitor = () => {
  const { isOptimized } = usePerformanceOptimization();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    if (!isOptimized) return;

    const measurePerformance = () => {
      try {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paintEntries = performance.getEntriesByType('paint');
        
        let firstPaint = 0;
        let largestContentfulPaint = 0;

        paintEntries.forEach((entry) => {
          if (entry.name === 'first-paint') {
            firstPaint = entry.startTime;
          }
        });

        // Get LCP if available
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          largestContentfulPaint = lastEntry.startTime;
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });

        const metrics: PerformanceMetrics = {
          loadTime: navigation.loadEventEnd - navigation.fetchStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          firstPaint,
          largestContentfulPaint
        };

        setMetrics(metrics);

        // Log performance metrics for monitoring
        console.log('🚀 Performance Metrics:', {
          ...metrics,
          loadTimeGrade: metrics.loadTime < 3000 ? 'Excellent' : metrics.loadTime < 5000 ? 'Good' : 'Needs Improvement'
        });

      } catch (error) {
        console.warn('Performance monitoring not supported in this browser');
      }
    };

    // Measure after load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, [isOptimized]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development' || !metrics) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50 max-w-xs">
      <div className="font-bold mb-2">⚡ Performance</div>
      <div>Load: {Math.round(metrics.loadTime)}ms</div>
      <div>DOM: {Math.round(metrics.domContentLoaded)}ms</div>
      {metrics.firstPaint > 0 && <div>FP: {Math.round(metrics.firstPaint)}ms</div>}
      {metrics.largestContentfulPaint > 0 && <div>LCP: {Math.round(metrics.largestContentfulPaint)}ms</div>}
      <div className={`mt-1 ${metrics.loadTime < 3000 ? 'text-green-400' : metrics.loadTime < 5000 ? 'text-yellow-400' : 'text-red-400'}`}>
        {metrics.loadTime < 3000 ? '🟢 Excellent' : metrics.loadTime < 5000 ? '🟡 Good' : '🔴 Slow'}
      </div>
    </div>
  );
};

export default PerformanceMonitor;
