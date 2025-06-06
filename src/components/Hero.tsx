
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-background via-background to-accent/20 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                Featured Story
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                The Future of{" "}
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Technology
                </span>{" "}
                is Here
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Discover the latest breakthroughs, in-depth reviews, and expert insights 
                that are shaping our digital world. Stay ahead with TechFlow.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="hover:scale-105 transition-transform duration-200">
                Read Latest Articles
              </Button>
              <Button variant="outline" size="lg" className="hover:bg-accent">
                Watch Reviews
              </Button>
            </div>
            <div className="flex items-center space-x-8 text-sm text-muted-foreground">
              <div>
                <span className="font-semibold text-foreground">1.2M+</span> Readers
              </div>
              <div>
                <span className="font-semibold text-foreground">500+</span> Reviews
              </div>
              <div>
                <span className="font-semibold text-foreground">Daily</span> Updates
              </div>
            </div>
          </div>

          {/* Featured Article Card */}
          <div className="relative">
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 group">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-600/20 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=2000&q=80"
                  alt="Featured article"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                  Technology
                </Badge>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-200">
                  Revolutionary AI Breakthrough: The Next Generation of Machine Learning
                </h3>
                <p className="text-muted-foreground">
                  Exploring how the latest advancements in artificial intelligence are 
                  reshaping industries and creating new possibilities...
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>5 min read</span>
                    <span>•</span>
                    <span>2 hours ago</span>
                  </div>
                  <Button variant="ghost" size="sm" className="hover:bg-accent">
                    Read More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
