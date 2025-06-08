
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Award, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}

const About = () => {
  const { settings, loading } = useSiteSettings();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('faqs')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  const teamMembers = [
    {
      name: "Alex Chen",
      role: "Editor-in-Chief",
      bio: "Technology journalist with 10+ years covering emerging tech trends.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Sarah Johnson",
      role: "Senior Writer",
      bio: "Specialist in AI, machine learning, and consumer electronics.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Mike Rodriguez",
      role: "Tech Reviewer",
      bio: "Hardware enthusiast with expertise in mobile devices and gaming.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
    },
  ];

  const values = [
    {
      icon: Target,
      title: "Accuracy",
      description: "We strive for factual, well-researched content that you can trust."
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a community of tech enthusiasts who share knowledge."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Delivering high-quality content that sets industry standards."
    },
    {
      icon: Heart,
      title: "Passion",
      description: "Driven by genuine love for technology and innovation."
    },
  ];

  const toggleFaq = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
            <div className="container mx-auto px-4 text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-12 bg-gray-200 rounded w-64 mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">About {settings?.site_name || 'TechFlow'}</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {settings?.site_description || 'We\'re passionate about technology and committed to bringing you the latest news, in-depth reviews, and expert insights from the ever-evolving tech landscape.'}
            </p>
          </div>
        </div>

        {/* Custom About Content */}
        {settings?.about_content && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="prose prose-lg mx-auto">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">
                    {settings.about_content}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Mission and Vision */}
        {(settings?.about_mission || settings?.about_vision) && (
          <section className="py-16 bg-accent/5">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8">
                  {settings?.about_mission && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-6 w-6 text-primary" />
                          Our Mission
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {settings.about_mission}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {settings?.about_vision && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-6 w-6 text-primary" />
                          Our Vision
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {settings.about_vision}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Default Mission Section - only show if no custom content */}
        {!settings?.about_content && !settings?.about_mission && !settings?.about_vision && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                  <p className="text-lg text-muted-foreground">
                    To democratize technology knowledge and help everyone make informed decisions 
                    about the tech products and services that shape our daily lives.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">What We Do</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <span>Provide unbiased reviews of the latest tech products</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <span>Break down complex technology trends in simple terms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <span>Cover breaking news from the tech industry</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <span>Share insights from industry experts and thought leaders</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
                      alt="Team collaboration"
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Values Section */}
        <section className="py-16 bg-accent/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-lg text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <Card key={value.title} className="text-center">
                    <CardHeader>
                      <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {value.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-lg text-muted-foreground">
                The passionate people behind {settings?.site_name || 'TechFlow'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {teamMembers.map((member) => (
                <Card key={member.name} className="text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full object-cover mx-auto"
                      />
                    </div>
                    <CardTitle>{member.name}</CardTitle>
                    <Badge variant="secondary" className="mx-auto w-fit">
                      {member.role}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {member.bio}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        {faqs.length > 0 && (
          <section className="py-16 bg-accent/5">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                  <p className="text-lg text-muted-foreground">
                    Find answers to common questions about {settings?.site_name || 'TechFlow'}
                  </p>
                </div>

                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <Card key={faq.id}>
                      <CardHeader>
                        <Button
                          variant="ghost"
                          className="w-full justify-between p-0 h-auto"
                          onClick={() => toggleFaq(faq.id)}
                        >
                          <CardTitle className="text-left">{faq.question}</CardTitle>
                          {expandedFaq === faq.id ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </Button>
                      </CardHeader>
                      {expandedFaq === faq.id && (
                        <CardContent>
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {faq.answer}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Have a story tip, product suggestion, or just want to say hello? 
                We'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Badge variant="outline" className="text-base px-4 py-2">
                  📧 contact@{settings?.site_name?.toLowerCase() || 'techflow'}.com
                </Badge>
                {settings?.social_twitter && (
                  <Badge variant="outline" className="text-base px-4 py-2">
                    🐦 @{settings.site_name || 'TechFlow'}News
                  </Badge>
                )}
                {settings?.social_linkedin && (
                  <Badge variant="outline" className="text-base px-4 py-2">
                    💼 LinkedIn/{settings.site_name || 'TechFlow'}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
