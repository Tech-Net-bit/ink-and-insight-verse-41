
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  priority?: boolean;
  sizes?: string;
}

const OptimizedImage = ({
  src,
  alt,
  className,
  placeholder = '/placeholder.svg',
  priority = false,
  sizes = '100vw',
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    setIsError(false);
  };

  const handleError = () => {
    setIsError(true);
    setIsLoaded(false);
  };

  // Fallback to placeholder if src is invalid
  const imageSrc = src && src.trim() !== '' ? src : placeholder;

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      <img
        ref={imgRef}
        src={isInView ? imageSrc : placeholder}
        alt={alt}
        className={cn(
          'transition-opacity duration-300 w-full h-full object-cover',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        sizes={sizes}
      />
      
      {isError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
