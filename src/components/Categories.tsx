
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  article_count?: number;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Mock categories for demonstration
  const mockCategories: Category[] = [
    { id: 'all', name: 'All', slug: 'all', description: 'All articles', article_count: 12 },
    { id: '1', name: 'Technology', slug: 'technology', description: 'Latest tech news and trends', article_count: 8 },
    { id: '2', name: 'Reviews', slug: 'reviews', description: 'Product and service reviews', article_count: 4 },
    { id: '3', name: 'Tutorials', slug: 'tutorials', description: 'Step-by-step guides', article_count: 6 },
    { id: '4', name: 'News', slug: 'news', description: 'Breaking news and updates', article_count: 3 }
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          id,
          name,
          slug,
          description
        `)
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        // Use mock data as fallback
        setCategories(mockCategories);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        // Add "All" category at the beginning
        const allCategories = [
          { id: 'all', name: 'All', slug: 'all', description: 'All articles', article_count: 0 },
          ...data.map(cat => ({ ...cat, article_count: 0 })),
        ];
        setCategories(allCategories);
      } else {
        // Use mock data if no categories found
        setCategories(mockCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Use mock data as fallback
      setCategories(mockCategories);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-accent/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-accent/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Explore by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dive deep into your areas of interest with our carefully curated content categories
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.slug ? "default" : "outline"}
              className={`hover:scale-105 transition-all duration-200 ${
                activeCategory === category.slug
                  ? "shadow-lg" 
                  : "hover:bg-accent hover:border-primary/20"
              }`}
              onClick={() => setActiveCategory(category.slug)}
            >
              {category.name}
              <Badge 
                variant="secondary" 
                className={`ml-2 ${
                  activeCategory === category.slug
                    ? "bg-primary-foreground text-primary" 
                    : "bg-muted"
                }`}
              >
                {category.article_count || 0}
              </Badge>
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "💻", title: "Tech Reviews", desc: "Latest gadgets", slug: "reviews" },
            { icon: "🤖", title: "AI & Future", desc: "Tomorrow's tech", slug: "ai-ml" },
            { icon: "📱", title: "Mobile Tech", desc: "Smartphones & apps", slug: "mobile" },
            { icon: "🎮", title: "Gaming", desc: "Latest in gaming", slug: "gaming" },
          ].map((item) => (
            <div
              key={item.title}
              className={`text-center p-6 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300 group cursor-pointer ${
                activeCategory === item.slug ? 'border-primary shadow-lg' : ''
              }`}
              onClick={() => setActiveCategory(item.slug)}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </div>
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
