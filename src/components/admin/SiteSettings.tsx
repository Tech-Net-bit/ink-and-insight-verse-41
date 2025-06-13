
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SiteSettings {
  id: string;
  site_name: string;
  site_description: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string | null;
  hero_layout: string;
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

const SiteSettings = () => {
  const [formData, setFormData] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      
      // Ensure proper type conversion
      const settingsData: Partial<SiteSettings> = {
        ...data,
        hero_layout: data.hero_layout || 'default',
        custom_values: Array.isArray(data.custom_values) ? data.custom_values : [],
        custom_team_members: Array.isArray(data.custom_team_members) ? data.custom_team_members : [],
      };
      
      setFormData(settingsData);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SiteSettings, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('site_settings')
        .update(formData)
        .eq('id', formData.id);

      if (error) throw error;

      toast.success('Settings updated successfully!');
      
      // Dispatch custom event for real-time updates
      window.dispatchEvent(new Event('site-settings-updated'));
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <p className="text-muted-foreground">
          Manage your website's configuration and appearance.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="about">About Page</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Basic information about your website.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="site_name">Site Name</Label>
                    <Input
                      id="site_name"
                      value={formData?.site_name || ''}
                      onChange={(e) => handleInputChange('site_name', e.target.value)}
                      placeholder="Your Site Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primary_color">Primary Color</Label>
                    <Input
                      id="primary_color"
                      type="color"
                      value={formData?.primary_color || '#000000'}
                      onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_description">Site Description</Label>
                  <Textarea
                    id="site_description"
                    value={formData?.site_description || ''}
                    onChange={(e) => handleInputChange('site_description', e.target.value)}
                    placeholder="Describe your website..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>
                  Configure your homepage hero section layout and content.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="hero_layout">Hero Section Layout</Label>
                  <Select
                    value={formData?.hero_layout || 'default'}
                    onValueChange={(value) => handleInputChange('hero_layout', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select hero layout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default - Side by Side</SelectItem>
                      <SelectItem value="banner">Banner - Full Width Background</SelectItem>
                      <SelectItem value="minimal">Minimal - Centered Content</SelectItem>
                      <SelectItem value="split">Split - Half Content, Half Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero_title">Hero Title</Label>
                  <Input
                    id="hero_title"
                    value={formData?.hero_title || ''}
                    onChange={(e) => handleInputChange('hero_title', e.target.value)}
                    placeholder="Your main headline"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                  <Textarea
                    id="hero_subtitle"
                    value={formData?.hero_subtitle || ''}
                    onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                    placeholder="Supporting text for your headline"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero_image_url">Hero Background Image URL</Label>
                  <Input
                    id="hero_image_url"
                    value={formData?.hero_image_url || ''}
                    onChange={(e) => handleInputChange('hero_image_url', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData?.hero_image_url && (
                    <div className="mt-2">
                      <img
                        src={formData.hero_image_url}
                        alt="Hero background preview"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Branding</CardTitle>
                <CardDescription>
                  Configure your brand assets.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input
                    id="logo_url"
                    value={formData?.logo_url || ''}
                    onChange={(e) => handleInputChange('logo_url', e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                  {formData?.logo_url && (
                    <div className="mt-2">
                      <img
                        src={formData.logo_url}
                        alt="Logo preview"
                        className="h-20 object-contain"
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favicon_url">Favicon URL</Label>
                  <Input
                    id="favicon_url"
                    value={formData?.favicon_url || ''}
                    onChange={(e) => handleInputChange('favicon_url', e.target.value)}
                    placeholder="https://example.com/favicon.ico"
                  />
                  {formData?.favicon_url && (
                    <div className="mt-2">
                      <img
                        src={formData.favicon_url}
                        alt="Favicon preview"
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Optimize your site for search engines.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData?.meta_title || ''}
                    onChange={(e) => handleInputChange('meta_title', e.target.value)}
                    placeholder="Enter meta title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData?.meta_description || ''}
                    onChange={(e) => handleInputChange('meta_description', e.target.value)}
                    placeholder="Enter meta description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta_keywords">Meta Keywords</Label>
                  <Input
                    id="meta_keywords"
                    value={formData?.meta_keywords || ''}
                    onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>
                  Connect your social media accounts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="social_twitter">Twitter</Label>
                  <Input
                    id="social_twitter"
                    value={formData?.social_twitter || ''}
                    onChange={(e) => handleInputChange('social_twitter', e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_facebook">Facebook</Label>
                  <Input
                    id="social_facebook"
                    value={formData?.social_facebook || ''}
                    onChange={(e) => handleInputChange('social_facebook', e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_linkedin">LinkedIn</Label>
                  <Input
                    id="social_linkedin"
                    value={formData?.social_linkedin || ''}
                    onChange={(e) => handleInputChange('social_linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_instagram">Instagram</Label>
                  <Input
                    id="social_instagram"
                    value={formData?.social_instagram || ''}
                    onChange={(e) => handleInputChange('social_instagram', e.target.value)}
                    placeholder="https://instagram.com/yourhandle"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About Page Content</CardTitle>
                <CardDescription>
                  Configure your about page content.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="about_content">About Content</Label>
                  <Textarea
                    id="about_content"
                    value={formData?.about_content || ''}
                    onChange={(e) => handleInputChange('about_content', e.target.value)}
                    placeholder="Enter about page content"
                    rows={5}
                  />
                </div>
                <div>
                  <Label htmlFor="about_mission">Mission Statement</Label>
                  <Textarea
                    id="about_mission"
                    value={formData?.about_mission || ''}
                    onChange={(e) => handleInputChange('about_mission', e.target.value)}
                    placeholder="Enter mission statement"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="about_vision">Vision Statement</Label>
                  <Textarea
                    id="about_vision"
                    value={formData?.about_vision || ''}
                    onChange={(e) => handleInputChange('about_vision', e.target.value)}
                    placeholder="Enter vision statement"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SiteSettings;
