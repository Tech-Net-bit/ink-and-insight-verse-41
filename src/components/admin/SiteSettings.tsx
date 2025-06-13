
import { useState, useEffect } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from './ImageUpload';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Image as ImageIcon } from 'lucide-react';

const SiteSettings = () => {
  const { settings, loading, updateSettings } = useSiteSettings();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    hero_title: '',
    hero_subtitle: '',
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
  });

  const [showHeroImageUpload, setShowHeroImageUpload] = useState(false);
  const [showFaviconUpload, setShowFaviconUpload] = useState(false);
  const [showLogoUpload, setShowLogoUpload] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        site_name: settings.site_name || '',
        site_description: settings.site_description || '',
        hero_title: settings.hero_title || '',
        hero_subtitle: settings.hero_subtitle || '',
        hero_image_url: settings.hero_image_url || '',
        hero_layout: settings.hero_layout || 'default',
        primary_color: settings.primary_color || '#000000',
        secondary_color: settings.secondary_color || '#ffffff',
        meta_title: settings.meta_title || '',
        meta_description: settings.meta_description || '',
        meta_keywords: settings.meta_keywords || '',
        favicon_url: settings.favicon_url || '',
        logo_url: settings.logo_url || '',
        social_twitter: settings.social_twitter || '',
        social_facebook: settings.social_facebook || '',
        social_linkedin: settings.social_linkedin || '',
        social_instagram: settings.social_instagram || '',
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(formData);
      toast({
        title: 'Success',
        description: 'Site settings updated successfully',
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update settings',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
        <p className="text-muted-foreground">
          Manage your website configuration and appearance
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Basic site information and configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input
                    id="site_name"
                    value={formData.site_name}
                    onChange={(e) => handleInputChange('site_name', e.target.value)}
                    placeholder="Your Site Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_description">Site Description</Label>
                  <Textarea
                    id="site_description"
                    value={formData.site_description}
                    onChange={(e) => handleInputChange('site_description', e.target.value)}
                    placeholder="Brief description of your site"
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
                  Configure your homepage hero section
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hero_layout">Hero Layout</Label>
                  <Select
                    value={formData.hero_layout}
                    onValueChange={(value) => handleInputChange('hero_layout', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select hero layout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default - Centered content</SelectItem>
                      <SelectItem value="banner">Banner - Full width background</SelectItem>
                      <SelectItem value="minimal">Minimal - Clean and simple</SelectItem>
                      <SelectItem value="split">Split - Text and image side by side</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero_title">Hero Title</Label>
                  <Input
                    id="hero_title"
                    value={formData.hero_title}
                    onChange={(e) => handleInputChange('hero_title', e.target.value)}
                    placeholder="Main headline for your hero section"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                  <Textarea
                    id="hero_subtitle"
                    value={formData.hero_subtitle}
                    onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                    placeholder="Supporting text for your hero section"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hero Image</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={formData.hero_image_url}
                      onChange={(e) => handleInputChange('hero_image_url', e.target.value)}
                      placeholder="Hero image URL"
                      className="flex-1"
                    />
                    <Dialog open={showHeroImageUpload} onOpenChange={setShowHeroImageUpload}>
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <ImageUpload
                          value={formData.hero_image_url}
                          onChange={(url) => {
                            handleInputChange('hero_image_url', url);
                            setShowHeroImageUpload(false);
                          }}
                          onClose={() => setShowHeroImageUpload(false)}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Branding</CardTitle>
                <CardDescription>
                  Colors, logo, and visual identity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary_color">Primary Color</Label>
                    <Input
                      id="primary_color"
                      type="color"
                      value={formData.primary_color}
                      onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary_color">Secondary Color</Label>
                    <Input
                      id="secondary_color"
                      type="color"
                      value={formData.secondary_color}
                      onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={formData.logo_url}
                      onChange={(e) => handleInputChange('logo_url', e.target.value)}
                      placeholder="Logo URL"
                      className="flex-1"
                    />
                    <Dialog open={showLogoUpload} onOpenChange={setShowLogoUpload}>
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <ImageUpload
                          value={formData.logo_url}
                          onChange={(url) => {
                            handleInputChange('logo_url', url);
                            setShowLogoUpload(false);
                          }}
                          onClose={() => setShowLogoUpload(false)}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Favicon</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={formData.favicon_url}
                      onChange={(e) => handleInputChange('favicon_url', e.target.value)}
                      placeholder="Favicon URL"
                      className="flex-1"
                    />
                    <Dialog open={showFaviconUpload} onOpenChange={setShowFaviconUpload}>
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <ImageUpload
                          value={formData.favicon_url}
                          onChange={(url) => {
                            handleInputChange('favicon_url', url);
                            setShowFaviconUpload(false);
                          }}
                          onClose={() => setShowFaviconUpload(false)}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Search engine optimization configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => handleInputChange('meta_title', e.target.value)}
                    placeholder="Title that appears in search results"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => handleInputChange('meta_description', e.target.value)}
                    placeholder="Description that appears in search results"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta_keywords">Meta Keywords</Label>
                  <Input
                    id="meta_keywords"
                    value={formData.meta_keywords}
                    onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
                    placeholder="Comma-separated keywords"
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
                  Social media links and integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="social_twitter">Twitter URL</Label>
                  <Input
                    id="social_twitter"
                    value={formData.social_twitter}
                    onChange={(e) => handleInputChange('social_twitter', e.target.value)}
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_facebook">Facebook URL</Label>
                  <Input
                    id="social_facebook"
                    value={formData.social_facebook}
                    onChange={(e) => handleInputChange('social_facebook', e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_linkedin">LinkedIn URL</Label>
                  <Input
                    id="social_linkedin"
                    value={formData.social_linkedin}
                    onChange={(e) => handleInputChange('social_linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_instagram">Instagram URL</Label>
                  <Input
                    id="social_instagram"
                    value={formData.social_instagram}
                    onChange={(e) => handleInputChange('social_instagram', e.target.value)}
                    placeholder="https://instagram.com/yourusername"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button type="submit">Save Settings</Button>
        </div>
      </form>
    </div>
  );
};

export default SiteSettings;
