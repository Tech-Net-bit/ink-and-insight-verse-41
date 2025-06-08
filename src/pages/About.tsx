
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Target, 
  Eye, 
  Heart,
  Shield, 
  Zap, 
  Globe,
  Award,
  ExternalLink
} from 'lucide-react';
import { useEffect, useState } from 'react';

const About = () => {
  const { settings, loading } = useSiteSettings();
  const { getCachedData, cacheData } = usePerformanceOptimization();
  const [optimizedContent, setOptimizedContent] = useState<any>(null);

  // Default values that can be shown alongside custom ones
  const defaultValues = [
    {
      icon: '🚀',
      title: 'Innovation',
      description: 'We constantly push the boundaries of technology to bring you the latest breakthroughs and insights.'
    },
    {
      icon: '🎯',
      title: 'Accuracy',
      description: 'Our reviews and articles are thoroughly researched and fact-checked to ensure reliability.'
    },
    {
      icon: '🌍',
      title: 'Community',
      description: 'We foster a vibrant community of tech enthusiasts who share knowledge and experiences.'
    },
    {
      icon: '🔒',
      title: 'Trust',
      description: 'Transparency and honesty guide everything we do, from reviews to editorial decisions.'
    }
  ];

  const defaultTeam = [
    {
      name: 'Alex Chen',
      role: 'Editor-in-Chief',
      bio: 'With over 10 years in tech journalism, Alex leads our editorial team with a passion for emerging technologies.',
      image: '/placeholder.svg'
    },
    {
      name: 'Sarah Rodriguez',
      role: 'Senior Tech Reviewer',
      bio: 'Sarah specializes in hardware reviews and has tested over 500 devices in her career.',
      image: '/placeholder.svg'
    },
    {
      name: 'Michael Park',
      role: 'Software Analyst',
      bio: 'Michael focuses on software reviews and cybersecurity, bringing enterprise-level insights to our readers.',
      image: '/placeholder.svg'
    }
  ];

  useEffect(() => {
    // Try to get cached content first
    const cached = getCachedData('about-page-content');
    if (cached && !loading) {
      setOptimizedContent(cached);
    } else if (settings && !loading) {
      // Process and cache the content
      const processedContent = {
        values: [
          ...(settings.show_default_values ? defaultValues : []),
          ...(settings.custom_values || [])
        ],
        team: [
          ...(settings.show_default_team ? defaultTeam : []),
          ...(settings.custom_team_members || [])
        ]
      };
      
      setOptimizedContent(processedContent);
      cacheData('about-page-content', processedContent, 10 * 60 * 1000); // Cache for 10 minutes
    }
  }, [settings, loading, getCachedData, cacheData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <Badge variant="secondary" className="mb-4">About Us</Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              About {settings?.site_name || 'TechFlow'}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {settings?.about_content || 
                `We're passionate about technology and committed to delivering the most comprehensive, 
                accurate, and insightful tech content. Our mission is to help you navigate the ever-evolving 
                world of technology with confidence.`}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      {(settings?.about_mission || settings?.about_vision) && (
        <section className="py-16 bg-accent/5">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {settings?.about_mission && (
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="h-8 w-8 text-primary" />
                      <h3 className="text-2xl font-bold">Our Mission</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {settings.about_mission}
                    </p>
                  </CardContent>
                </Card>
              )}
              
              {settings?.about_vision && (
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Eye className="h-8 w-8 text-primary" />
                      <h3 className="text-2xl font-bold">Our Vision</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {settings.about_vision}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Values Section */}
      {optimizedContent?.values && optimizedContent.values.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Heart className="h-6 w-6 text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold">Our Values</h2>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {optimizedContent.values.map((value: any, index: number) => (
                <Card key={index} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {optimizedContent?.team && optimizedContent.team.length > 0 && (
        <section className="py-16 bg-accent/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold">Meet Our Team</h2>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The passionate individuals behind our content
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {optimizedContent.team.map((member: any, index: number) => (
                <Card key={index} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-4">
                      <img
                        src={member.image || '/placeholder.svg'}
                        alt={member.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-background shadow-lg group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {member.bio}
                    </p>
                    {(member.linkedin || member.twitter) && (
                      <div className="flex justify-center gap-2">
                        {member.linkedin && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              LinkedIn
                            </a>
                          </Button>
                        )}
                        {member.twitter && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Twitter
                            </a>
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Globe, label: 'Global Readers', value: '1.2M+' },
              { icon: Award, label: 'Reviews Published', value: '500+' },
              { icon: Users, label: 'Community Members', value: '50K+' },
              { icon: Zap, label: 'Years of Excellence', value: '8+' }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
