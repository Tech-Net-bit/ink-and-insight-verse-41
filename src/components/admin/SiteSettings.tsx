
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SiteSettingsData {
  id: string;
  site_name: string;
  site_description: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
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
}

const SiteSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error fetching site settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch site settings',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settings.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Site settings updated successfully. Changes will reflect across the site.',
      });

      // Trigger a small delay to ensure the update propagates
      setTimeout(() => {
        window.dispatchEvent(new Event('site-settings-updated'));
      }, 500);

    } catch (error) {
      console.error('Error updating site settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update site settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: keyof SiteSettingsData, value: string) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  const refreshPreview = () => {
    // Open the homepage in a new tab to preview changes
    window.open('/', '_blank');
  };

  if (!settings) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
          <p className="text-muted-foreground">Customize your website appearance and SEO</p>
        </div>
        <Button variant="outline" onClick={refreshPreview}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Preview Site
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic site information that appears throughout your website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input
                    id="site_name"
                    value={settings.site_name}
                    onChange={(e) => updateSetting('site_name', e.target.value)}
                    placeholder="Your Site Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site_description">Site Description</Label>
                  <Textarea
                    id="site_description"
                    value={settings.site_description}
                    onChange={(e) => updateSetting('site_description', e.target.value)}
                    placeholder="Brief description of your site"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary_color">Primary Color</Label>
                    <Input
                      id="primary_color"
                      type="color"
                      value={settings.primary_color}
                      onChange={(e) => updateSetting('primary_color', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondary_color">Secondary Color</Label>
                    <Input
                      id="secondary_color"
                      type="color"
                      value={settings.secondary_color}
                      onChange={(e) => updateSetting('secondary_color', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>Customize your homepage hero section content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hero_title">Hero Title</Label>
                  <Input
                    id="hero_title"
                    value={settings.hero_title}
                    onChange={(e) => updateSetting('hero_title', e.target.value)}
                    placeholder="Main hero title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                  <Textarea
                    id="hero_subtitle"
                    value={settings.hero_subtitle}
                    onChange={(e) => updateSetting('hero_subtitle', e.target.value)}
                    placeholder="Hero subtitle or description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero_image_url">Hero Image URL</Label>
                  <Input
                    id="hero_image_url"
                    value={settings.hero_image_url}
                    onChange={(e) => updateSetting('hero_image_url', e.target.value)}
                    placeholder="https://example.com/hero-image.jpg"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO & Meta Tags</CardTitle>
                <CardDescription>Optimize your site for search engines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={settings.meta_title}
                    onChange={(e) => updateSetting('meta_title', e.target.value)}
                    placeholder="SEO title for your site"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={settings.meta_description}
                    onChange={(e) => updateSetting('meta_description', e.target.value)}
                    placeholder="SEO description for your site"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_keywords">Meta Keywords</Label>
                  <Input
                    id="meta_keywords"
                    value={settings.meta_keywords}
                    onChange={(e) => updateSetting('meta_keywords', e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>Connect your social media accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="social_twitter">Twitter/X URL</Label>
                  <Input
                    id="social_twitter"
                    value={settings.social_twitter}
                    onChange={(e) => updateSetting('social_twitter', e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social_facebook">Facebook URL</Label>
                  <Input
                    id="social_facebook"
                    value={settings.social_facebook}
                    onChange={(e) => updateSetting('social_facebook', e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social_linkedin">LinkedIn URL</Label>
                  <Input
                    id="social_linkedin"
                    value={settings.social_linkedin}
                    onChange={(e) => updateSetting('social_linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social_instagram">Instagram URL</Label>
                  <Input
                    id="social_instagram"
                    value={settings.social_instagram}
                    onChange={(e) => updateSetting('social_instagram', e.target.value)}
                    placeholder="https://instagram.com/yourhandle"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Branding</CardTitle>
                <CardDescription>Upload your logo and favicon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input
                    id="logo_url"
                    value={settings.logo_url}
                    onChange={(e) => updateSetting('logo_url', e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="favicon_url">Favicon URL</Label>
                  <Input
                    id="favicon_url"
                    value={settings.favicon_url}
                    onChange={(e) => updateSetting('favicon_url', e.target.value)}
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={refreshPreview}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Preview Changes
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SiteSettings;
