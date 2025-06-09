
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import ReviewSystem from './ReviewSystem';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  rating?: number;
  imageUrl: string;
  type: 'blog' | 'news' | 'review';
  articleId?: string;
  slug?: string;
}

const ArticleCard = ({ 
  title, 
  excerpt, 
  category, 
  readTime, 
  publishedAt, 
  rating, 
  imageUrl, 
  type,
  articleId,
  slug
}: ArticleCardProps) => {
  const [showReviews, setShowReviews] = useState(false);
  const navigate = useNavigate();

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'review': return 'default';
      case 'news': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'review': return 'Review';
      case 'news': return 'Breaking';
      default: return 'Article';
    }
  };

  const handleReadMore = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (slug) {
      navigate(`/article/${slug}`);
    }
  };

  const handleCardClick = () => {
    if (slug) {
      navigate(`/article/${slug}`);
    }
  };

  return (
    <div className="space-y-4">
      <article className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer">
        <div onClick={handleCardClick}>
          <div className="relative aspect-video overflow-hidden">
            <img 
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Badge 
              variant={getBadgeVariant(type)}
              className="absolute top-4 left-4"
            >
              {getTypeLabel(type)}
            </Badge>
            {rating && (
              <div className="absolute top-4 right-4 flex items-center space-x-1 bg-black/20 backdrop-blur-sm rounded-lg px-2 py-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-white text-sm font-medium">{rating}</span>
              </div>
            )}
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs">
                {category}
              </Badge>
              <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors duration-200 line-clamp-2">
                {title}
              </h3>
            </div>

            <p className="text-muted-foreground line-clamp-3 leading-relaxed">
              {excerpt}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{readTime}</span>
                <span>•</span>
                <span>{publishedAt}</span>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-accent group-hover:text-primary transition-colors duration-200"
                  onClick={handleReadMore}
                >
                  Read More
                </Button>
                {articleId && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowReviews(!showReviews);
                    }}
                  >
                    Reviews
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>

      {showReviews && articleId && (
        <ReviewSystem articleId={articleId} />
      )}
    </div>
  );
};

export default ArticleCard;
