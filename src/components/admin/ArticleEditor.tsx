
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ArticleEditorProps {
  articleId?: string | null;
  onClose: () => void;
}

interface Category {
  id: string;
  name: string;
}

interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  category_id: string;
  published: boolean;
  featured: boolean;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_image_url: string;
}

const ArticleEditor = ({ articleId, onClose }: ArticleEditorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    category_id: '',
    published: false,
    featured: false,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_image_url: '',
  });

  useEffect(() => {
    fetchCategories();
    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchArticle = async () => {
    if (!articleId) return;

    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single();

      if (error) throw error;
      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        featured_image_url: data.featured_image_url || '',
        category_id: data.category_id || '',
        published: data.published || false,
        featured: data.featured || false,
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
        meta_keywords: data.meta_keywords || '',
        og_image_url: data.og_image_url || '',
      });
    } catch (error) {
      console.error('Error fetching article:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch article',
        variant: 'destructive',
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const articleData = {
        ...formData,
        author_id: user.id,
        updated_at: new Date().toISOString(),
      };

      if (articleId) {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', articleId);

        if (error) throw error;
        toast({
          title: 'Success',
          description: 'Article updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([articleData]);

        if (error) throw error;
        toast({
          title: 'Success',
          description: 'Article created successfully',
        });
      }

      onClose();
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        title: 'Error',
        description: 'Failed to save article',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {articleId ? 'Edit Article' : 'Create Article'}
          </h1>
          <p className="text-muted-foreground">
            {articleId ? 'Update your article' : 'Write a new blog post'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Content</CardTitle>
                <CardDescription>Write your article content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter article title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="article-slug"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief description of the article"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your article content here..."
                    rows={20}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="featured_image">Featured Image URL</Label>
                  <Input
                    id="featured_image"
                    value={formData.featured_image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO & Meta Tags</CardTitle>
                <CardDescription>Optimize your article for search engines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                    placeholder="SEO optimized title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                    placeholder="SEO meta description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_keywords">Meta Keywords</Label>
                  <Input
                    id="meta_keywords"
                    value={formData.meta_keywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="og_image">Open Graph Image</Label>
                  <Input
                    id="og_image"
                    value={formData.og_image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, og_image_url: e.target.value }))}
                    placeholder="https://example.com/og-image.jpg"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Settings</CardTitle>
                <CardDescription>Configure article visibility and category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                  />
                  <Label htmlFor="published">Published</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Saving...' : 'Save Article'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ArticleEditor;
