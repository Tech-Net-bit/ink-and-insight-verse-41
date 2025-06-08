import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, RefreshCw, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from './ImageUpload';
import ValuesTeamManager from './ValuesTeamManager';

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
  about_content?: string;
  about_mission?: string;
  about_vision?: string;
  custom_values?: any[];
  custom_team_members?: any[];
  show_default_values?: boolean;
  show_default_team?: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}

const SiteSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [showImageUpload, setShowImageUpload] = useState<{type: string, field: string} | null>(null);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  useEffect(() => {
    fetchSettings();
    fetchFaqs();
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

  const fetchFaqs = async () => {
    try {
      // Use any type to bypass TypeScript checking for the new table
      const { data, error } = await (supabase as any)
        .from('faqs')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
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

  const updateSetting = (key: keyof SiteSettingsData, value: any) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  const addFaq = async () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in both question and answer',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from('faqs')
        .insert({
          question: newFaq.question,
          answer: newFaq.answer,
          order_index: faqs.length
        });

      if (error) throw error;

      setNewFaq({ question: '', answer: '' });
      fetchFaqs();
      toast({
        title: 'Success',
        description: 'FAQ added successfully',
      });
    } catch (error) {
      console.error('Error adding FAQ:', error);
      toast({
        title: 'Error',
        description: 'Failed to add FAQ',
        variant: 'destructive',
      });
    }
  };

  const deleteFaq = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchFaqs();
      toast({
        title: 'Success',
        description: 'FAQ deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete FAQ',
        variant: 'destructive',
      });
    }
  };

  const refreshPreview = () => {
    window.open('/', '_blank');
  };

  const handleImageUpload = (url: string) => {
    if (showImageUpload && settings) {
      updateSetting(showImageUpload.field as keyof SiteSettingsData, url);
      setShowImageUpload(null);
    }
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

  if (showImageUpload) {
    return (
      <ImageUpload
        value=""
        onChange={handleImageUpload}
        onClose={() => setShowImageUpload(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
          <p className="text-muted-foreground">Customize your website appearance, content, and SEO</p>
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
            <TabsTrigger value="about">About Page</TabsTrigger>
            <TabsTrigger value="values-team">Values & Team</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
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
                  <Label htmlFor="hero_image_url">Hero Background Image</Label>
                  <div className="flex gap-2">
                    <Input
                      id="hero_image_url"
                      value={settings.hero_image_url}
                      onChange={(e) => updateSetting('hero_image_url', e.target.value)}
                      placeholder="https://example.com/hero-image.jpg"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowImageUpload({type: 'hero', field: 'hero_image_url'})}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                  {settings.hero_image_url && (
                    <div className="mt-2">
                      <img
                        src={settings.hero_image_url}
                        alt="Hero preview"
                        className="max-w-xs h-20 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Page Content</CardTitle>
                <CardDescription>Customize your About page content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="about_content">About Content</Label>
                  <Textarea
                    id="about_content"
                    value={settings.about_content || ''}
                    onChange={(e) => updateSetting('about_content', e.target.value)}
                    placeholder="Main about page content..."
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about_mission">Mission Statement</Label>
                  <Textarea
                    id="about_mission"
                    value={settings.about_mission || ''}
                    onChange={(e) => updateSetting('about_mission', e.target.value)}
                    placeholder="Your mission statement..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about_vision">Vision Statement</Label>
                  <Textarea
                    id="about_vision"
                    value={settings.about_vision || ''}
                    onChange={(e) => updateSetting('about_vision', e.target.value)}
                    placeholder="Your vision statement..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="values-team" className="space-y-6">
            <ValuesTeamManager
              values={settings.custom_values || []}
              teamMembers={settings.custom_team_members || []}
              showDefaultValues={settings.show_default_values ?? true}
              showDefaultTeam={settings.show_default_team ?? true}
              onValuesChange={(values) => updateSetting('custom_values', values)}
              onTeamChange={(team) => updateSetting('custom_team_members', team)}
              onShowDefaultValuesChange={(show) => updateSetting('show_default_values', show)}
              onShowDefaultTeamChange={(show) => updateSetting('show_default_team', show)}
            />
          </TabsContent>

          <TabsContent value="faqs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>FAQ Management</CardTitle>
                <CardDescription>Manage frequently asked questions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 border-b pb-4">
                  <h4 className="font-semibold">Add New FAQ</h4>
                  <div className="space-y-2">
                    <Label htmlFor="new_question">Question</Label>
                    <Input
                      id="new_question"
                      value={newFaq.question}
                      onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}
                      placeholder="Enter the question..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new_answer">Answer</Label>
                    <Textarea
                      id="new_answer"
                      value={newFaq.answer}
                      onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
                      placeholder="Enter the answer..."
                      rows={3}
                    />
                  </div>
                  <Button type="button" onClick={addFaq}>
                    Add FAQ
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Existing FAQs</h4>
                  {faqs.length === 0 ? (
                    <p className="text-muted-foreground">No FAQs added yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {faqs.map((faq) => (
                        <div key={faq.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <h5 className="font-medium">{faq.question}</h5>
                              <p className="text-sm text-muted-foreground mt-1">{faq.answer}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteFaq(faq.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                  <div className="flex gap-2">
                    <Input
                      id="logo_url"
                      value={settings.logo_url}
                      onChange={(e) => updateSetting('logo_url', e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowImageUpload({type: 'logo', field: 'logo_url'})}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                  {settings.logo_url && (
                    <div className="mt-2">
                      <img
                        src={settings.logo_url}
                        alt="Logo preview"
                        className="h-12 w-auto object-contain border rounded p-2"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="favicon_url">Favicon URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="favicon_url"
                      value={settings.favicon_url}
                      onChange={(e) => updateSetting('favicon_url', e.target.value)}
                      placeholder="https://example.com/favicon.ico"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowImageUpload({type: 'favicon', field: 'favicon_url'})}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                  {settings.favicon_url && (
                    <div className="mt-2">
                      <img
                        src={settings.favicon_url}
                        alt="Favicon preview"
                        className="h-8 w-8 object-contain border rounded"
                      />
                    </div>
                  )}
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
