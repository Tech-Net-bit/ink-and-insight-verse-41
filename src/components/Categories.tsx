
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Categories = () => {
  const categories = [
    { name: 'All', count: 245, active: true },
    { name: 'Technology', count: 89, active: false },
    { name: 'Reviews', count: 67, active: false },
    { name: 'News', count: 54, active: false },
    { name: 'AI & ML', count: 23, active: false },
    { name: 'Mobile', count: 34, active: false },
    { name: 'Gaming', count: 29, active: false },
    { name: 'Lifestyle', count: 18, active: false },
  ];

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
              key={category.name}
              variant={category.active ? "default" : "outline"}
              className={`hover:scale-105 transition-all duration-200 ${
                category.active 
                  ? "shadow-lg" 
                  : "hover:bg-accent hover:border-primary/20"
              }`}
            >
              {category.name}
              <Badge 
                variant="secondary" 
                className={`ml-2 ${
                  category.active 
                    ? "bg-primary-foreground text-primary" 
                    : "bg-muted"
                }`}
              >
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "💻", title: "Tech Reviews", desc: "Latest gadgets" },
            { icon: "🤖", title: "AI & Future", desc: "Tomorrow's tech" },
            { icon: "📱", title: "Mobile Tech", desc: "Smartphones & apps" },
            { icon: "🎮", title: "Gaming", desc: "Latest in gaming" },
          ].map((item) => (
            <div
              key={item.title}
              className="text-center p-6 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300 group cursor-pointer"
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
