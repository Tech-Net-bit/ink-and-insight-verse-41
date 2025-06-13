
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import ArticleGrid from '@/components/ArticleGrid';
import Footer from '@/components/Footer';

const Index = () => {
  // Mock articles data for now
  const mockArticles = [
    {
      id: '1',
      title: 'Sample Article 1',
      excerpt: 'This is a sample article excerpt',
      featured_image_url: '',
      slug: 'sample-article-1',
      created_at: new Date().toISOString(),
      categories: { name: 'Technology' },
      reading_time: 5,
      article_type: 'article'
    },
    {
      id: '2',
      title: 'Sample Article 2',
      excerpt: 'Another sample article excerpt',
      featured_image_url: '',
      slug: 'sample-article-2',
      created_at: new Date().toISOString(),
      categories: { name: 'Business' },
      reading_time: 3,
      article_type: 'article'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Categories />
        <div className="container mx-auto px-4 py-8">
          <ArticleGrid articles={mockArticles} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
