
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { usePerformanceOptimization } from './usePerformanceOptimization';

interface PreloadOptions {
  preloadFeatured?: boolean;
  preloadCategories?: boolean;
  preloadSettings?: boolean;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  featured_image_url: string;
  slug: string;
  created_at: string;
  categories: { name: string } | null;
  profiles: { full_name: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface SiteSettings {
  id: string;
  site_name: string;
  site_description: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string | null;
  primary_color: string;
  secondary_color: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  favicon_url: string;
  logo_url: string;
  social_twitter: string;
  social_facebook: string;
  social_linkedin: string;
  social_instagram: string;
  about_content?: string;
  about_mission?: string;
  about_vision?: string;
  custom_values?: any[];
  custom_team_members?: any[];
  show_default_values?: boolean;
  show_default_team?: boolean;
}

export const useDataPreloader = (options: PreloadOptions = {}) => {
  const queryClient = useQueryClient();
  const { cacheData, getCachedData } = usePerformanceOptimization();

  // Preload featured articles
  const { data: featuredArticles } = useQuery({
    queryKey: ['featured-articles-preload'],
    queryFn: async (): Promise<Article[]> => {
      const cached = getCachedData<Article[]>('featured-articles');
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
      
      const articles = data || [];
      cacheData('featured-articles', articles, 5 * 60 * 1000); // 5 min cache
      return articles;
    },
    enabled: options.preloadFeatured !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Preload categories
  const { data: categories } = useQuery({
    queryKey: ['categories-preload'],
    queryFn: async (): Promise<Category[]> => {
      const cached = getCachedData<Category[]>('categories');
      if (cached) return cached;

      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name');

      if (error) throw error;
      
      const categoryData = data || [];
      cacheData('categories', categoryData, 10 * 60 * 1000); // 10 min cache
      return categoryData;
    },
    enabled: options.preloadCategories !== false,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  // Preload site settings
  const { data: settings } = useQuery({
    queryKey: ['site-settings-preload'],
    queryFn: async (): Promise<SiteSettings | null> => {
      const cached = getCachedData<SiteSettings>('site-settings');
      if (cached) return cached;

      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        cacheData('site-settings', data, 15 * 60 * 1000); // 15 min cache
      }
      return data;
    },
    enabled: options.preloadSettings !== false,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });

  // Preload critical images
  useEffect(() => {
    const preloadImages = async () => {
      if (featuredArticles && Array.isArray(featuredArticles)) {
        featuredArticles.forEach((article: Article) => {
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
    featuredArticles: featuredArticles || [],
    categories: categories || [],
    settings,
    isPreloading: !featuredArticles && !categories && !settings,
  };
};
