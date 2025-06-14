
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PreloadOptions {
  preloadFeatured?: boolean;
  preloadCategories?: boolean;
  preloadSettings?: boolean;
}

export const useDataPreloader = (options: PreloadOptions = {}) => {
  const {
    preloadFeatured = false,
    preloadCategories = false,
    preloadSettings = false,
  } = options;

  // Preload featured articles
  const { data: featuredArticles } = useQuery({
    queryKey: ['articles', 'featured'],
    queryFn: async () => {
      if (!preloadFeatured) return [];
      
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('featured', true)
          .eq('published', true)
          .limit(5);

        if (error) {
          console.error('Error fetching featured articles:', error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error('Error in featured articles query:', error);
        return [];
      }
    },
    enabled: preloadFeatured,
    staleTime: 5 * 60 * 1000,
  });

  // Preload categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!preloadCategories) return [];
      
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching categories:', error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error('Error in categories query:', error);
        return [];
      }
    },
    enabled: preloadCategories,
    staleTime: 10 * 60 * 1000,
  });

  // Preload site settings
  const { data: siteSettings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      if (!preloadSettings) return null;
      
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .single();

        if (error) {
          console.error('Error fetching site settings:', error);
          return null;
        }

        return data;
      } catch (error) {
        console.error('Error in site settings query:', error);
        return null;
      }
    },
    enabled: preloadSettings,
    staleTime: 15 * 60 * 1000,
  });

  return {
    featuredArticles: featuredArticles || [],
    categories: categories || [],
    siteSettings,
  };
};
