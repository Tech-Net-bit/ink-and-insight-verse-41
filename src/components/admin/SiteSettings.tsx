import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Globe, Palette, Share2, FileText, Users, Heart } from 'lucide-react';
import ImageUpload from './ImageUpload';
import ValuesTeamManager from './ValuesTeamManager';

interface SiteSettingsData {
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
  about_content: string;
  about_mission: string;
  about_vision: string;
  custom_values: any[];
  custom_team_members: any[];
  show_default_values: boolean;
  show_default_team: boolean;
}

const SiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettingsData>({
    site_name: '',
    site_description: '',
    hero_title: '',
    hero_subtitle: '',
    hero_image_url: '',
    primary_color: '#2563eb',
    secondary_color: '#7c3aed',
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
    custom_values: [],
    custom_team_members: [],
    show_default_values: true,
    show_default_team: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        // Properly handle the data types
        const typedData: SiteSettingsData = {
          ...data,
          custom_values: Array.isArray(data.custom_values) ? data.custom_values : [],
          custom_team_members: Array.isArray(data.custom_team_members) ? data.custom_team_members : [],
          show_default_values: data.show_default_values ?? true,
          show_default_team: data.show_default_team ?? true,
        };
        setSettings(typedData);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch site settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert([settings]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Site settings updated successfully",
      });

      // Trigger custom event for real-time updates
      window.dispatchEvent(new CustomEvent('site-settings-updated'));
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save site settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof SiteSettingsData, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Site Settings</h2>
          <p className="text-muted-foreground">Configure your website settings and appearance</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Social
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            About
          </TabsTrigger>
          <TabsTrigger value="values-team" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Values & Team
          </TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Configure your site's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input
                    id="site_name"
                    value={settings.site_name}
                    onChange={(e) => handleInputChange('site_name', e.target.value)}
                    placeholder="Enter site name"
                  />
                </div>
                <div>
                  <Label htmlFor="site_description">Site Description</Label>
                  <Input
                    id="site_description"
                    value={settings.site_description}
                    onChange={(e) => handleInputChange('site_description', e.target.value)}
                    placeholder="Enter site description"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="hero_title">Hero Title</Label>
                <Input
                  id="hero_title"
                  value={settings.hero_title}
                  onChange={(e) => handleInputChange('hero_title', e.target.value)}
                  placeholder="Enter hero section title"
                />
              </div>
              
              <div>
                <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                <Textarea
                  id="hero_subtitle"
                  value={settings.hero_subtitle}
                  onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                  placeholder="Enter hero section subtitle"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visual Settings</CardTitle>
              <CardDescription>Customize your site's appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary_color">Primary Color</Label>
                  <Input
                    id="primary_color"
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="secondary_color">Secondary Color</Label>
                  <Input
                    id="secondary_color"
                    type="color"
                    value={settings.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Logo</Label>
                  <ImageUpload
                    onImageUploaded={(url) => handleInputChange('logo_url', url)}
                    className="mt-2"
                  />
                  {settings.logo_url && (
                    <img src={settings.logo_url} alt="Logo" className="mt-2 h-16 w-auto" />
                  )}
                </div>
                
                <div>
                  <Label>Favicon</Label>
                  <ImageUpload
                    onImageUploaded={(url) => handleInputChange('favicon_url', url)}
                    className="mt-2"
                  />
                  {settings.favicon_url && (
                    <img src={settings.favicon_url} alt="Favicon" className="mt-2 h-8 w-8" />
                  )}
                </div>
                
                <div>
                  <Label>Hero Background Image</Label>
                  <ImageUpload
                    onImageUploaded={(url) => handleInputChange('hero_image_url', url)}
                    className="mt-2"
                  />
                  {settings.hero_image_url && (
                    <img src={settings.hero_image_url} alt="Hero Background" className="mt-2 h-32 w-auto rounded" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Add your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="social_twitter">Twitter</Label>
                  <Input
                    id="social_twitter"
                    value={settings.social_twitter}
                    onChange={(e) => handleInputChange('social_twitter', e.target.value)}
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div>
                  <Label htmlFor="social_facebook">Facebook</Label>
                  <Input
                    id="social_facebook"
                    value={settings.social_facebook}
                    onChange={(e) => handleInputChange('social_facebook', e.target.value)}
                    placeholder="https://facebook.com/page"
                  />
                </div>
                <div>
                  <Label htmlFor="social_linkedin">LinkedIn</Label>
                  <Input
                    id="social_linkedin"
                    value={settings.social_linkedin}
                    onChange={(e) => handleInputChange('social_linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/name"
                  />
                </div>
                <div>
                  <Label htmlFor="social_instagram">Instagram</Label>
                  <Input
                    id="social_instagram"
                    value={settings.social_instagram}
                    onChange={(e) => handleInputChange('social_instagram', e.target.value)}
                    placeholder="https://instagram.com/username"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Optimize your site for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={settings.meta_title}
                  onChange={(e) => handleInputChange('meta_title', e.target.value)}
                  placeholder="Enter meta title"
                />
              </div>
              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={settings.meta_description}
                  onChange={(e) => handleInputChange('meta_description', e.target.value)}
                  placeholder="Enter meta description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="meta_keywords">Meta Keywords</Label>
                <Input
                  id="meta_keywords"
                  value={settings.meta_keywords}
                  onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Page Content</CardTitle>
              <CardDescription>Configure your about page content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="about_content">About Content</Label>
                <Textarea
                  id="about_content"
                  value={settings.about_content}
                  onChange={(e) => handleInputChange('about_content', e.target.value)}
                  placeholder="Enter about page content"
                  rows={5}
                />
              </div>
              <div>
                <Label htmlFor="about_mission">Mission Statement</Label>
                <Textarea
                  id="about_mission"
                  value={settings.about_mission}
                  onChange={(e) => handleInputChange('about_mission', e.target.value)}
                  placeholder="Enter mission statement"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="about_vision">Vision Statement</Label>
                <Textarea
                  id="about_vision"
                  value={settings.about_vision}
                  onChange={(e) => handleInputChange('about_vision', e.target.value)}
                  placeholder="Enter vision statement"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Values & Team Tab */}
        <TabsContent value="values-team" className="space-y-6">
          <ValuesTeamManager
            values={settings.custom_values}
            teamMembers={settings.custom_team_members}
            showDefaultValues={settings.show_default_values}
            showDefaultTeam={settings.show_default_team}
            onValuesChange={(values) => handleInputChange('custom_values', values)}
            onTeamMembersChange={(members) => handleInputChange('custom_team_members', members)}
            onShowDefaultValuesChange={(show) => handleInputChange('show_default_values', show)}
            onShowDefaultTeamChange={(show) => handleInputChange('show_default_team', show)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteSettings;
