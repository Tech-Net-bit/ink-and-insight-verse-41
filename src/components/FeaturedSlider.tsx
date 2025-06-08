
import { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  featured_image_url: string;
  slug: string;
  categories: { name: string };
  profiles: { full_name: string };
  created_at: string;
}

const FeaturedSlider = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedArticles();
  }, []);

  useEffect(() => {
    if (emblaApi) {
      const autoplay = setInterval(() => {
        emblaApi.scrollNext();
      }, 5000);

      return () => clearInterval(autoplay);
    }
  }, [emblaApi]);

  const fetchFeaturedArticles = async () => {
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
          categories (name),
          profiles (full_name)
        `)
        .eq('published', true)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching featured articles:', error);
        return;
      }

      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching featured articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  if (loading) {
    return (
      <div className="relative h-96 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-2xl" />
    );
  }

  if (articles.length === 0) {
    return (
      <div className="relative h-96 bg-gradient-to-r from-accent/10 to-accent/20 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">No Featured Articles</h3>
          <p className="text-muted-foreground">Featured articles will appear here once published.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {articles.map((article) => (
            <div key={article.id} className="flex-[0_0_100%] min-w-0">
              <div className="relative h-96 overflow-hidden">
                <img
                  src={article.featured_image_url || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=2000&q=80'}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <Badge className="mb-4 bg-primary text-primary-foreground">
                    {article.categories?.name || 'Featured'}
                  </Badge>
                  <h2 className="text-3xl font-bold mb-3 line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-lg text-gray-200 mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">
                      By {article.profiles?.full_name} • {new Date(article.created_at).toLocaleDateString()}
                    </span>
                    <Button variant="secondary" size="sm" asChild>
                      <Link to={`/article/${article.slug}`}>Read More</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {articles.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
            onClick={scrollNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};

export default FeaturedSlider;
