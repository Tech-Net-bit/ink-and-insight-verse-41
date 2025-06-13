interface Article {
  id: string;
  title: string;
  excerpt?: string;
  featured_image_url?: string;
  slug: string;
  created_at: string;
  categories?: {
    name: string;
  };
  reading_time?: number;
  article_type?: string;
}

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
        <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          {article.featured_image_url && (
            <img 
              src={article.featured_image_url} 
              alt={article.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
            {article.excerpt && (
              <p className="text-gray-600 text-sm mb-3">{article.excerpt}</p>
            )}
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{article.categories?.name}</span>
              <span>{article.reading_time || 5} min read</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArticleGrid;
