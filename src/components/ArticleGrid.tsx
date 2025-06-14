
import { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import { supabase } from '@/integrations/supabase/client';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  featured_image_url: string;
  slug: string;
  created_at: string;
  article_type: string;
  categories: { name: string } | null;
  profiles: { full_name: string };
}

const ArticleGrid = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { cacheData, getCachedData } = usePerformanceOptimization();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      console.log('Fetching articles from database...');
      
      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          excerpt,
          featured_image_url,
          slug,
          created_at,
          article_type,
          categories (name),
          profiles (full_name)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(6);

      console.log('Articles query result:', { data, error });

      if (error) {
        console.error('Error fetching articles:', error);
        
        // Show empty state instead of mock data
        setArticles([]);
        setHasMore(false);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        console.log(`Found ${data.length} articles`);
        setArticles(data);
        setHasMore(data.length >= 6);
        cacheData('all-articles', data, 30 * 60 * 1000); // 30 minutes cache
      } else {
        console.log('No articles found in database');
        setArticles([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Unexpected error fetching articles:', error);
      setArticles([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          excerpt,
          featured_image_url,
          slug,
          created_at,
          article_type,
          categories (name),
          profiles (full_name)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .range(page * 6, (page + 1) * 6 - 1);

      if (error) throw error;

      if (data && data.length > 0) {
        setArticles(prev => [...prev, ...data]);
        setPage(prev => prev + 1);
        setHasMore(data.length >= 6);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content ? content.split(' ').length : 0;
    return Math.ceil(wordCount / wordsPerMinute) || 5;
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minutes ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hours ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} days ago`;
    }
  };

  // Show loading state
  if (loading && articles.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Latest Stories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest technology news, in-depth reviews, and expert insights
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              No articles found. 
            </p>
            <p className="text-sm text-muted-foreground">
              Articles will appear here once they are published in the admin panel.
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  title={article.title}
                  excerpt={article.excerpt || ''}
                  category={article.categories?.name || 'Uncategorized'}
                  readTime={`${getReadTime(article.excerpt || '')} min read`}
                  publishedAt={getRelativeTime(article.created_at)}
                  imageUrl={article.featured_image_url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80'}
                  type={article.article_type === 'product_review' ? 'review' : article.article_type === 'news' ? 'news' : 'blog'}
                  articleId={article.id}
                  slug={article.slug}
                />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 hover:scale-105 transform disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More Articles'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ArticleGrid;
