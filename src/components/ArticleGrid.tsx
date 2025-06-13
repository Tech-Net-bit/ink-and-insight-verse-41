
import { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import { supabase } from '@/integrations/supabase/client';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  featured_image_url: string;
  slug: string;
  created_at: string;
  categories: { name: string } | null;
  profiles: { full_name: string };
}

const ArticleGrid = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select(`
            *,
            categories(name),
            profiles(full_name)
          `)
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data to match expected interface
        const transformedArticles = data?.map(article => ({
          ...article,
          author: article.profiles?.full_name || 'Unknown Author'
        })).filter(article => 
          article && 
          article.title && 
          article.slug
        ) || [];

        setArticles(transformedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading articles...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Latest Articles
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Stay up to date with the latest technology trends and insights.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} articleId={article.id} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ArticleGrid;
