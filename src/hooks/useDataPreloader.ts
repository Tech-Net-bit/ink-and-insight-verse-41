
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
  article_type?: string;
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

  // Preload featured articles from database
  const { data: featuredArticles, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-articles-preload'],
    queryFn: async (): Promise<Article[]> => {
      const cached = getCachedData<Article[]>('featured-articles');
      if (cached) return cached;

      try {
        console.log('Preloading featured articles...');
        
        const { data, error } = await supabase
          .from('articles')
          .select(`
            id,
            title,
            excerpt,
            featured_image_url,
            slug,
            created_at,
            article_type,
            categories (name),
            profiles (full_name)
          `)
          .eq('publishe d', true)
          .eq('featured', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) {
          console.error('Error preloading featured articles:', error);
          return [];
        }

        console.log('Featured articles preloaded:', data?.length || 0);
        const articles = data || [];
        cacheData('featured-articles', articles, 60 * 60 * 1000);
        return articles;
      } catch (error) {
        console.error('Error preloading featured articles:', error);
        return [];
      }
    },
    enabled: options.preloadFeatured !== false,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  // Preload all articles from database
  const { data: allArticles } = useQuery({
    queryKey: ['all-articles-preload'],
    queryFn: async (): Promise<Article[]> => {
      const cached = getCachedData<Article[]>('all-articles');
      if (cached) return cached;

      try {
        console.log('Preloading all articles...');
        
        const { data, error } = await supabase
          .from('articles')
          .select(`
            id,
            title,
            excerpt,
            featured_image_url,
            slug,
            created_at,
            article_type,
            categories (name),
            profiles (full_name)
          `)
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(12);

        if (error) {
          console.error('Error preloading all articles:', error);
          return [];
        }

        console.log('All articles preloaded:', data?.length || 0);
        const articles = data || [];
        cacheData('all-articles', articles, 30 * 60 * 1000);
        return articles;
      } catch (error) {
        console.error('Error preloading all articles:', error);
        return [];
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });

  // Preload categories from database
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories-preload'],
    queryFn: async (): Promise<Category[]> => {
      const cached = getCachedData<Category[]>('categories');
      if (cached) return cached;

      try {
        console.log('Preloading categories...');
        
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, slug')
          .order('name');

        if (error) {
          console.error('Error preloading categories:', error);
          return [];
        }
        
        console.log('Categories preloaded:', data?.length || 0);
        const cats = data || [];
        cacheData('categories', cats, 60 * 60 * 1000);
        return cats;
      } catch (error) {
        console.error('Error preloading categories:', error);
        return [];
      }
    },
    enabled: options.preloadCategories !== false,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  // Preload site settings from database
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['site-settings-preload'],
    queryFn: async (): Promise<SiteSettings | null> => {
      const cached = getCachedData<SiteSettings>('site-settings');
      if (cached) return cached;

      try {
        console.log('Preloading site settings...');
        
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error preloading site settings:', error);
          return null;
        }
        
        if (data) {
          const typedSettings: SiteSettings = {
            ...data,
            custom_values: Array.isArray(data.custom_values) ? data.custom_values : [],
            custom_team_members: Array.isArray(data.custom_team_members) ? data.custom_team_members : [],
          };
          console.log('Site settings preloaded');
          cacheData('site-settings', typedSettings, 60 * 60 * 1000);
          return typedSettings;
        }
        return null;
      } catch (error) {
        console.error('Error preloading site settings:', error);
        return null;
      }
    },
    enabled: options.preloadSettings !== false,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  // Preload critical images immediately
  useEffect(() => {
    const preloadImages = async () => {
      const imagesToPreload: string[] = [];
      
      if (featuredArticles && Array.isArray(featuredArticles)) {
        featuredArticles.forEach((article: Article) => {
          if (article.featured_image_url) {
            imagesToPreload.push(article.featured_image_url);
          }
        });
      }

      if (allArticles && Array.isArray(allArticles)) {
        allArticles.slice(0, 10).forEach((article: Article) => {
          if (article.featured_image_url) {
            imagesToPreload.push(article.featured_image_url);
          }
        });
      }

      // Preload images in background
      imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    };

    if (!featuredLoading && !categoriesLoading && !settingsLoading) {
      preloadImages();
    }
  }, [featuredArticles, allArticles, featuredLoading, categoriesLoading, settingsLoading]);

  return {
    featuredArticles: featuredArticles || [],
    allArticles: allArticles || [],
    categories: categories || [],
    settings,
    isPreloading: featuredLoading || categoriesLoading || settingsLoading,
  };
};
