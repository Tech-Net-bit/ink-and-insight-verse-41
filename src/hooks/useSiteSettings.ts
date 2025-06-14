
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: any = null;

    const setupSubscription = async () => {
      // Initial fetch
      await fetchSiteSettings();

      // Create a unique channel name to avoid conflicts
      const channelName = `site-settings-${Date.now()}-${Math.random()}`;
      
      // Listen for real-time updates to site settings
      channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'site_settings'
          },
          (payload) => {
            console.log('Site settings updated:', payload);
            // Properly type the payload data
            const newData = payload.new as any;
            const typedSettings: SiteSettings = {
              ...newData,
              custom_values: Array.isArray(newData.custom_values) ? newData.custom_values : [],
              custom_team_members: Array.isArray(newData.custom_team_members) ? newData.custom_team_members : [],
            };
            setSettings(typedSettings);
          }
        )
        .subscribe();

      // Listen for custom events from the admin panel
      const handleSettingsUpdate = () => {
        fetchSiteSettings();
      };

      window.addEventListener('site-settings-updated', handleSettingsUpdate);

      // Return cleanup function
      return () => {
        window.removeEventListener('site-settings-updated', handleSettingsUpdate);
      };
    };

    const cleanup = setupSubscription();

    return () => {
      // Clean up channel subscription
      if (channel) {
        supabase.removeChannel(channel);
      }
      // Clean up event listeners
      cleanup.then(cleanupFn => cleanupFn && cleanupFn());
    };
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching site settings:', error);
        return;
      }

      // Properly type and handle the data
      const typedSettings: SiteSettings = {
        ...data,
        custom_values: Array.isArray(data.custom_values) ? data.custom_values : [],
        custom_team_members: Array.isArray(data.custom_team_members) ? data.custom_team_members : [],
      };

      setSettings(typedSettings);
    } catch (error) {
      console.error('Error fetching site settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<SiteSettings>) => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .update(updates)
        .eq('id', settings?.id)
        .select()
        .single();

      if (error) throw error;

      const typedSettings: SiteSettings = {
        ...data,
        custom_values: Array.isArray(data.custom_values) ? data.custom_values : [],
        custom_team_members: Array.isArray(data.custom_team_members) ? data.custom_team_members : [],
      };

      setSettings(typedSettings);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('site-settings-updated'));
      
      return { error: null };
    } catch (error) {
      console.error('Error updating site settings:', error);
      return { error };
    }
  };

  return { settings, loading, refetch: fetchSiteSettings, updateSettings };
};
