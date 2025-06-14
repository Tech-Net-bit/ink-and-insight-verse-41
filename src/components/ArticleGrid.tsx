
import { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import { supabase } from '@/integrations/supabase/client';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { useDataPreloader } from '@/hooks/useDataPreloader';

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
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { cacheData, getCachedData, checkRateLimit } = usePerformanceOptimization();
  const { allArticles, isPreloading } = useDataPreloader();

  // Mock articles for demonstration
  const mockArticles: Article[] = [
    {
      id: '1',
      title: 'Getting Started with React and TypeScript',
      excerpt: 'Learn how to build modern web applications with React and TypeScript. This comprehensive guide covers everything from setup to advanced patterns.',
      featured_image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
      slug: 'getting-started-react-typescript',
      created_at: new Date().toISOString(),
      article_type: 'blog',
      categories: { name: 'Technology' },
      profiles: { full_name: 'John Doe' }
    },
    {
      id: '2',
      title: 'The Future of Web Development',
      excerpt: 'Exploring upcoming trends and technologies that will shape the future of web development in the next decade.',
      featured_image_url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80',
      slug: 'future-web-development',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      article_type: 'news',
      categories: { name: 'Technology' },
      profiles: { full_name: 'Jane Smith' }
    },
    {
      id: '3',
      title: 'Best JavaScript Frameworks in 2024',
      excerpt: 'A comprehensive review of the most popular JavaScript frameworks and libraries available in 2024.',
      featured_image_url: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=800&q=80',
      slug: 'best-javascript-frameworks-2024',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      article_type: 'product_review',
      categories: { name: 'Reviews' },
      profiles: { full_name: 'Mike Johnson' }
    }
  ];

  useEffect(() => {
    // Use preloaded data if available, otherwise use mock data
    if (allArticles && allArticles.length > 0) {
      const typedArticles = allArticles.map(article => ({
        ...article,
        article_type: article.article_type || 'blog'
      }));
      setArticles(typedArticles);
      setLoading(false);
      setHasMore(allArticles.length >= 6);
    } else {
      // Use mock data as fallback
      setArticles(mockArticles);
      setLoading(false);
      setHasMore(false);
    }
  }, [allArticles]);

  const loadMore = () => {
    // For now, just show message that this would load more
    console.log('Load more articles functionality would be implemented here');
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content ? content.split(' ').length : 0;
    return Math.ceil(wordCount / wordsPerMinute);
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
  if ((loading && articles.length === 0) || isPreloading) {
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

        {articles.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No articles found. Check back later for new content!
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
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
