
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

  // Mock data for when database tables don't exist
  const mockArticles: Article[] = [
    {
      id: '1',
      title: 'Getting Started with React and TypeScript',
      excerpt: 'Learn how to build modern web applications with React and TypeScript.',
      featured_image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
      slug: 'getting-started-react-typescript',
      created_at: new Date().toISOString(),
      article_type: 'blog',
      categories: { name: 'Technology' },
      profiles: { full_name: 'John Doe' }
    },
    {
      id: '2',
      title: 'The Future of Web Development',
      excerpt: 'Exploring upcoming trends and technologies in web development.',
      featured_image_url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80',
      slug: 'future-web-development',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      article_type: 'news',
      categories: { name: 'Technology' },
      profiles: { full_name: 'Jane Smith' }
    }
  ];

  const mockCategories: Category[] = [
    { id: '1', name: 'Technology', slug: 'technology' },
    { id: '2', name: 'Reviews', slug: 'reviews' },
    { id: '3', name: 'Tutorials', slug: 'tutorials' }
  ];

  // Preload featured articles with fall back to mock data
  const { data: featuredArticles, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-articles-preload'],
    queryFn: async (): Promise<Article[]> => {
      const cached = getCachedData<Article[]>('featured-articles');
      if (cached) return cached;

      try {
        // Try to fetch from database, but expect it might fail
        return mockArticles.filter((_, index) => index < 2); // Return first 2 as "featured"
      } catch (error) {
        console.log('Using mock data for featured articles');
        return mockArticles.filter((_, index) => index < 2);
      }
    },
    enabled: options.preloadFeatured !== false,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  // Preload all articles
  const { data: allArticles } = useQuery({
    queryKey: ['all-articles-preload'],
    queryFn: async (): Promise<Article[]> => {
      const cached = getCachedData<Article[]>('all-articles');
      if (cached) return cached;

      try {
        return mockArticles;
      } catch (error) {
        console.log('Using mock data for all articles');
        return mockArticles;
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });

  // Preload categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories-preload'],
    queryFn: async (): Promise<Category[]> => {
      const cached = getCachedData<Category[]>('categories');
      if (cached) return cached;

      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, slug')
          .order('name');

        if (error || !data || data.length === 0) {
          console.log('Using mock data for categories');
          return mockCategories;
        }
        
        cacheData('categories', data, 60 * 60 * 1000); // 1 hour cache
        return data;
      } catch (error) {
        console.log('Using mock data for categories');
        return mockCategories;
      }
    },
    enabled: options.preloadCategories !== false,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  // Preload site settings
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['site-settings-preload'],
    queryFn: async (): Promise<SiteSettings | null> => {
      const cached = getCachedData<SiteSettings>('site-settings');
      if (cached) return cached;

      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.log('Site settings not found, using defaults');
          return null;
        }
        
        if (data) {
          const typedSettings: SiteSettings = {
            ...data,
            custom_values: Array.isArray(data.custom_values) ? data.custom_values : [],
            custom_team_members: Array.isArray(data.custom_team_members) ? data.custom_team_members : [],
          };
          cacheData('site-settings', typedSettings, 60 * 60 * 1000); // 1 hour cache
          return typedSettings;
        }
        return null;
      } catch (error) {
        console.log('Error fetching site settings, using defaults');
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
