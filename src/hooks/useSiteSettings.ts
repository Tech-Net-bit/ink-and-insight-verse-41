
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SiteSettings {
  site_name?: string;
  site_description?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_image_url?: string;
  hero_layout?: string;
  primary_color?: string;
  secondary_color?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  favicon_url?: string;
  logo_url?: string;
  social_twitter?: string;
  social_facebook?: string;
  social_linkedin?: string;
  social_instagram?: string;
  about_content?: string;
  about_mission?: string;
  about_vision?: string;
  show_default_values?: boolean;
  custom_values?: any[];
  show_default_team?: boolean;
  custom_team_members?: any[];
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load site settings',
          variant: 'destructive',
        });
        return;
      }

      if (data) {
        setSettings({
          site_name: data.site_name || '',
          site_description: data.site_description || '',
          hero_title: data.hero_title || '',
          hero_subtitle: data.hero_subtitle || '',
          hero_image_url: data.hero_image_url || '',
          hero_layout: data.hero_layout || 'default',
          primary_color: data.primary_color || '#000000',
          secondary_color: data.secondary_color || '#ffffff',
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          meta_keywords: data.meta_keywords || '',
          favicon_url: data.favicon_url || '',
          logo_url: data.logo_url || '',
          social_twitter: data.social_twitter || '',
          social_facebook: data.social_facebook || '',
          social_linkedin: data.social_linkedin || '',
          social_instagram: data.social_instagram || '',
          about_content: data.about_content || '',
          about_mission: data.about_mission || '',
          about_vision: data.about_vision || '',
          show_default_values: data.show_default_values ?? true,
          custom_values: Array.isArray(data.custom_values) ? data.custom_values : [],
          show_default_team: data.show_default_team ?? true,
          custom_team_members: Array.isArray(data.custom_team_members) ? data.custom_team_members : [],
        });
      } else {
        // Set default settings if none exist
        setSettings({
          site_name: 'My Site',
          site_description: 'Welcome to my site',
          hero_title: 'Welcome',
          hero_subtitle: 'This is the hero section',
          hero_image_url: '',
          hero_layout: 'default',
          primary_color: '#000000',
          secondary_color: '#ffffff',
          meta_title: '',
          meta_description: '',
          meta_keywords: '',
          favicon_url: '',
          logo_url: '',
          social_twitter: '',
          social_facebook: '',
          social_linkedin: '',
          social_instagram: '',
          about_content: '',
          about_mission: '',
          about_vision: '',
          show_default_values: true,
          custom_values: [],
          show_default_team: true,
          custom_team_members: [],
        });
      }
    } catch (error) {
      console.error('Error in fetchSettings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load site settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: SiteSettings) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert(newSettings, { onConflict: 'id' });

      if (error) {
        console.error('Error updating settings:', error);
        throw error;
      }

      setSettings(newSettings);
      toast({
        title: 'Success',
        description: 'Settings updated successfully',
      });
    } catch (error) {
      console.error('Error in updateSettings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update settings',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    updateSettings,
    refetch: fetchSettings,
  };
};
