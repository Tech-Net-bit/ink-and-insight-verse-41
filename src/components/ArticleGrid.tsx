
import { Article } from '@/integrations/supabase/types';
import ArticleCard from './ArticleCard';

interface ArticleGridProps {
  articles: Article[];
  loading?: boolean;
}

const ArticleGrid = ({ articles, loading }: ArticleGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-video rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No articles found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          id={article.id}
          title={article.title}
          excerpt={article.excerpt || ''}
          imageUrl={article.featured_image_url}
          slug={article.slug}
          publishedAt={article.created_at}
          category={article.categories?.name}
          readingTime={article.reading_time ? String(article.reading_time) : '5'}
          articleType={article.article_type}
        />
      ))}
    </div>
  );
};

export default ArticleGrid;
