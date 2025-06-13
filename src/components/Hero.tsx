
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Link } from 'react-router-dom';
import FeaturedSlider from './FeaturedSlider';

const Hero = () => {
  const { settings, loading } = useSiteSettings();

  if (loading) {
    return (
      <section className="relative bg-gradient-to-br from-background via-background to-accent/20 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-24"></div>
              <div className="h-16 bg-gray-200 rounded w-full"></div>
              <div className="h-24 bg-gray-200 rounded w-full"></div>
              <div className="flex space-x-4">
                <div className="h-12 bg-gray-200 rounded w-32"></div>
                <div className="h-12 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  const heroLayout = settings?.hero_layout || 'default';

  // Banner/Poster Layout
  if (heroLayout === 'banner') {
    return (
      <section 
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage: settings?.hero_image_url ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${settings.hero_image_url})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {settings?.hero_title || 'The Future of Technology is Here'}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            {settings?.hero_subtitle || 'Discover the latest breakthroughs, in-depth reviews, and expert insights'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4" asChild>
              <Link to="/articles">Explore Articles</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
              <Link to="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Minimal Layout
  if (heroLayout === 'minimal') {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-6">
            Featured Content
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto">
            {settings?.hero_title || 'The Future of Technology is Here'}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {settings?.hero_subtitle || 'Discover the latest breakthroughs, in-depth reviews, and expert insights'}
          </p>
          <Button size="lg" asChild>
            <Link to="/articles">Start Reading</Link>
          </Button>
        </div>
      </section>
    );
  }

  // Split Layout
  if (heroLayout === 'split') {
    return (
      <section className="min-h-screen flex">
        <div className="flex-1 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-8">
          <div className="max-w-lg">
            <Badge variant="secondary" className="mb-6">
              Featured Story
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {settings?.hero_title || 'The Future of Technology is Here'}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {settings?.hero_subtitle || 'Discover the latest breakthroughs, in-depth reviews, and expert insights'}
            </p>
            <div className="flex flex-col gap-4">
              <Button size="lg" asChild>
                <Link to="/articles">Read Articles</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/categories">Browse Categories</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex-1 relative">
          {settings?.hero_image_url ? (
            <img 
              src={settings.hero_image_url} 
              alt="Hero" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
              <FeaturedSlider />
            </div>
          )}
        </div>
      </section>
    );
  }

  // Default Layout
  return (
    <section 
      className="relative bg-gradient-to-br from-background via-background to-accent/20 py-20 overflow-hidden"
      style={{
        backgroundImage: settings?.hero_image_url ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${settings.hero_image_url})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                Featured Story
              </Badge>
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight ${settings?.hero_image_url ? 'text-white' : ''}`}>
                {settings?.hero_title || 'The Future of Technology is Here'}
              </h1>
              <p className={`text-xl leading-relaxed max-w-2xl ${settings?.hero_image_url ? 'text-gray-200' : 'text-muted-foreground'}`}>
                {settings?.hero_subtitle || 'Discover the latest breakthroughs, in-depth reviews, and expert insights that are shaping our digital world.'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="hover:scale-105 transition-transform duration-200" asChild>
                <Link to="/articles">Read Latest Articles</Link>
              </Button>
              <Button variant="outline" size="lg" className="hover:bg-accent" asChild>
                <Link to="/categories">Browse Categories</Link>
              </Button>
            </div>
            <div className={`flex items-center space-x-8 text-sm ${settings?.hero_image_url ? 'text-gray-300' : 'text-muted-foreground'}`}>
              <div>
                <span className={`font-semibold ${settings?.hero_image_url ? 'text-white' : 'text-foreground'}`}>1.2M+</span> Readers
              </div>
              <div>
                <span className={`font-semibold ${settings?.hero_image_url ? 'text-white' : 'text-foreground'}`}>500+</span> Reviews
              </div>
              <div>
                <span className={`font-semibold ${settings?.hero_image_url ? 'text-white' : 'text-foreground'}`}>Daily</span> Updates
              </div>
            </div>
          </div>

          {/* Featured Articles Slider */}
          <div className="relative">
            <FeaturedSlider />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
