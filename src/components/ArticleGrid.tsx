
import ArticleCard from './ArticleCard';

const ArticleGrid = () => {
  const articles = [
    {
      title: "iPhone 15 Pro Max Review: The Ultimate Camera Phone",
      excerpt: "Apple's latest flagship delivers exceptional performance and camera capabilities. We dive deep into what makes this device stand out in the crowded smartphone market.",
      category: "Mobile",
      readTime: "8 min read",
      publishedAt: "2 hours ago",
      rating: 4.8,
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
      type: "review" as const
    },
    {
      title: "AI Revolution: How Machine Learning is Transforming Healthcare",
      excerpt: "Exploring the latest developments in artificial intelligence and its profound impact on medical diagnosis, treatment, and patient care.",
      category: "AI & ML",
      readTime: "12 min read",
      publishedAt: "5 hours ago",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
      type: "blog" as const
    },
    {
      title: "Breaking: Tech Giants Announce New Privacy Standards",
      excerpt: "Major technology companies have jointly announced new privacy protection measures that will reshape how user data is handled across platforms.",
      category: "News",
      readTime: "4 min read",
      publishedAt: "1 hour ago",
      imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
      type: "news" as const
    },
    {
      title: "The Best Gaming Laptops of 2024: Performance Meets Portability",
      excerpt: "Our comprehensive review of the top gaming laptops this year, comparing performance, battery life, and value for money.",
      category: "Gaming",
      readTime: "15 min read",
      publishedAt: "1 day ago",
      rating: 4.6,
      imageUrl: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80",
      type: "review" as const
    },
    {
      title: "The Future of Remote Work: Tools and Technologies Shaping Tomorrow",
      excerpt: "How emerging technologies are revolutionizing the way we work from anywhere, creating new opportunities and challenges for businesses.",
      category: "Technology",
      readTime: "10 min read",
      publishedAt: "2 days ago",
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
      type: "blog" as const
    },
    {
      title: "Electric Vehicle Market Surges with New Battery Technology",
      excerpt: "Revolutionary battery innovations are driving unprecedented growth in the electric vehicle sector, promising longer ranges and faster charging.",
      category: "Innovation",
      readTime: "6 min read",
      publishedAt: "3 days ago",
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
      type: "news" as const
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Latest Stories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest technology news, in-depth reviews, and expert insights
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <ArticleCard
              key={index}
              {...article}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 hover:scale-105 transform">
            Load More Articles
          </button>
        </div>
      </div>
    </section>
  );
};

export default ArticleGrid;
