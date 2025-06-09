
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { usePerformanceOptimization } from './usePerformanceOptimization';

interface PreloadOptions {
  preloadFeatured?: boolean;
  preloadCategories?: boolean;
  preloadSettings?: boolean;
}

export const useDataPreloader = (options: PreloadOptions = {}) => {
  const queryClient = useQueryClient();
  const { cacheData, getCachedData } = usePerformanceOptimization();

  // Preload featured articles
  const { data: featuredArticles } = useQuery({
    queryKey: ['featured-articles-preload'],
    queryFn: async () => {
      const cached = getCachedData('featured-articles');
      if (cached) return cached;

      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          excerpt,
          featured_image_url,
          slug,
          created_at,
          categories (name),
          profiles (full_name)
        `)
        .eq('published', true)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      cacheData('featured-articles', data, 5 * 60 * 1000); // 5 min cache
      return data;
    },
    enabled: options.preloadFeatured !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Preload categories
  const { data: categories } = useQuery({
    queryKey: ['categories-preload'],
    queryFn: async () => {
      const cached = getCachedData('categories');
      if (cached) return cached;

      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name');

      if (error) throw error;
      
      cacheData('categories', data, 10 * 60 * 1000); // 10 min cache
      return data;
    },
    enabled: options.preloadCategories !== false,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Preload site settings
  const { data: settings } = useQuery({
    queryKey: ['site-settings-preload'],
    queryFn: async () => {
      const cached = getCachedData('site-settings');
      if (cached) return cached;

      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      cacheData('site-settings', data, 15 * 60 * 1000); // 15 min cache
      return data;
    },
    enabled: options.preloadSettings !== false,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  // Preload critical images
  useEffect(() => {
    const preloadImages = async () => {
      if (featuredArticles) {
        featuredArticles.forEach((article: any) => {
          if (article.featured_image_url) {
            const img = new Image();
            img.src = article.featured_image_url;
          }
        });
      }
    };

    preloadImages();
  }, [featuredArticles]);

  return {
    featuredArticles,
    categories,
    settings,
    isPreloading: !featuredArticles && !categories && !settings,
  };
};
