
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories from database...');
      
      const { data, error } = await supabase
        .from('categories')
        .select(`
          id,
          name,
          slug,
          description
        `)
        .order('name');

      console.log('Categories query result:', { data, error });

      if (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        console.log(`Found ${data.length} categories`);
        
        // Get article counts for each category
        const categoriesWithCounts = await Promise.all(
          data.map(async (category) => {
            try {
              const { count } = await supabase
                .from('articles')
                .select('*', { count: 'exact', head: true })
                .eq('category_id', category.id)
                .eq('published', true);

              return {
                ...category,
                article_count: count || 0,
              };
            } catch (error) {
              console.error(`Error getting count for category ${category.name}:`, error);
              return {
                ...category,
                article_count: 0,
              };
            }
          })
        );

        // Add "All" category at the beginning with total count
        const totalArticles = categoriesWithCounts.reduce((sum, cat) => sum + (cat.article_count || 0), 0);
        const allCategories = [
          { id: 'all', name: 'All', slug: 'all', description: 'All articles', article_count: totalArticles },
          ...categoriesWithCounts,
        ];
        
        setCategories(allCategories);
      } else {
        console.log('No categories found in database');
        // Just show "All" category with 0 count
        setCategories([
          { id: 'all', name: 'All', slug: 'all', description: 'All articles', article_count: 0 }
        ]);
      }
    } catch (error) {
      console.error('Unexpected error fetching categories:', error);
      setCategories([
        { id: 'all', name: 'All', slug: 'all', description: 'All articles', article_count: 0 }
      ]);
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

        {categories.length <= 1 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              No categories available yet.
            </p>
            <p className="text-sm text-muted-foreground">
              Categories will appear here once they are created in the admin panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.slice(1).map((category) => (
              <div
                key={category.id}
                className={`text-center p-6 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300 group cursor-pointer ${
                  activeCategory === category.slug ? 'border-primary shadow-lg' : ''
                }`}
                onClick={() => setActiveCategory(category.slug)}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                  📁
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.description || `${category.article_count} articles`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
