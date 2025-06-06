
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ArticleEditor from './ArticleEditor';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  featured: boolean;
  created_at: string;
  categories: { name: string } | null;
  profiles: { full_name: string } | null;
}

const ArticleManagement = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          slug,
          excerpt,
          published,
          featured,
          created_at,
          categories (name),
          profiles (full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch articles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ published: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      setArticles(articles.map(article => 
        article.id === id 
          ? { ...article, published: !currentStatus }
          : article
      ));

      toast({
        title: 'Success',
        description: `Article ${!currentStatus ? 'published' : 'unpublished'} successfully`,
      });
    } catch (error) {
      console.error('Error updating article:', error);
      toast({
        title: 'Error',
        description: 'Failed to update article',
        variant: 'destructive',
      });
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setArticles(articles.filter(article => article.id !== id));
      toast({
        title: 'Success',
        description: 'Article deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete article',
        variant: 'destructive',
      });
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showEditor) {
    return (
      <ArticleEditor
        articleId={editingArticle}
        onClose={() => {
          setShowEditor(false);
          setEditingArticle(null);
          fetchArticles();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Articles</h1>
          <p className="text-muted-foreground">Manage your blog articles</p>
        </div>
        <Button onClick={() => setShowEditor(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Article
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredArticles.map((article) => (
            <Card key={article.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {article.excerpt}
                    </CardDescription>
                    <div className="flex items-center space-x-2">
                      <Badge variant={article.published ? 'default' : 'secondary'}>
                        {article.published ? 'Published' : 'Draft'}
                      </Badge>
                      {article.featured && (
                        <Badge variant="outline">Featured</Badge>
                      )}
                      {article.categories && (
                        <Badge variant="outline">{article.categories.name}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      By {article.profiles?.full_name || 'Unknown'} • {new Date(article.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublished(article.id, article.published)}
                    >
                      {article.published ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingArticle(article.id);
                        setShowEditor(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteArticle(article.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleManagement;
