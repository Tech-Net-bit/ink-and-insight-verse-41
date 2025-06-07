
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Star, Package, Newspaper } from 'lucide-react';

interface Template {
  id: string;
  title: string;
  type: 'blog' | 'news' | 'product_review';
  description: string;
  content: string;
  featured: boolean;
}

const templates: Template[] = [
  {
    id: 'tech-startup-spotlight',
    title: 'Tech Startup Spotlight',
    type: 'news',
    description: 'Professional template for covering tech startup news and funding announcements',
    featured: true,
    content: `<h1>Revolutionary Startup Secures $50M Series B Funding</h1>

<p><strong>Location, Date</strong> - [Company Name], a leading innovator in [industry/technology], announced today that it has successfully closed a $50 million Series B funding round led by [Lead Investor], with participation from [Other Investors].</p>

<h2>The Innovation</h2>
<p>[Company Name] has developed groundbreaking technology that [brief description of what makes it special]. The platform addresses a critical gap in [market/industry] by [specific problem solving].</p>

<blockquote>
<p>"This funding represents more than just capital - it's validation of our vision to transform [industry]," said [CEO Name], CEO and co-founder of [Company Name]. "We're excited to accelerate our growth and bring this technology to more businesses worldwide."</p>
</blockquote>

<h2>Market Impact</h2>
<p>The global [relevant market] market is projected to reach $[amount] billion by [year], driven by increasing demand for [relevant trends]. [Company Name]'s solution positions them to capture a significant share of this growing market.</p>

<h2>What's Next</h2>
<p>The new funding will be used to:</p>
<ul>
<li>Expand the engineering team by 150%</li>
<li>Accelerate product development</li>
<li>Scale customer acquisition efforts</li>
<li>Explore new market opportunities</li>
</ul>

<p><em>About [Company Name]: Founded in [year], [Company Name] is dedicated to [mission statement]. The company is headquartered in [location] and serves customers across [regions/industries].</em></p>`
  },
  {
    id: 'product-review-comprehensive',
    title: 'Comprehensive Product Review',
    type: 'product_review',
    description: 'In-depth product review template with pros, cons, and detailed analysis',
    featured: true,
    content: `<h1>[Product Name] Review: A Game-Changer or Just Hype?</h1>

<p><strong>Rating: ⭐⭐⭐⭐☆ (4/5 stars)</strong></p>

<p>After spending [time period] with the [Product Name], we've put it through its paces to bring you this comprehensive review. Here's everything you need to know before making your purchase decision.</p>

<h2>First Impressions</h2>
<p>Right out of the box, the [Product Name] impresses with its [notable first impression features]. The build quality feels [description] and the design aesthetic is [description].</p>

<h2>Key Features</h2>
<ul>
<li><strong>[Feature 1]:</strong> [Detailed description and performance]</li>
<li><strong>[Feature 2]:</strong> [Detailed description and performance]</li>
<li><strong>[Feature 3]:</strong> [Detailed description and performance]</li>
<li><strong>[Feature 4]:</strong> [Detailed description and performance]</li>
</ul>

<h2>Performance Testing</h2>
<p>We tested the [Product Name] across various scenarios:</p>

<h3>[Test Category 1]</h3>
<p>[Detailed test results and observations]</p>

<h3>[Test Category 2]</h3>
<p>[Detailed test results and observations]</p>

<h2>Pros and Cons</h2>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
<div>
<h3 style="color: #22c55e;">✅ Pros</h3>
<ul>
<li>[Positive point 1]</li>
<li>[Positive point 2]</li>
<li>[Positive point 3]</li>
<li>[Positive point 4]</li>
</ul>
</div>
<div>
<h3 style="color: #ef4444;">❌ Cons</h3>
<ul>
<li>[Negative point 1]</li>
<li>[Negative point 2]</li>
<li>[Negative point 3]</li>
</ul>
</div>
</div>

<h2>Who Should Buy This?</h2>
<p>The [Product Name] is perfect for [target audience description]. If you're someone who [specific use cases], this product will serve you well.</p>

<h2>Final Verdict</h2>
<p>At $[price], the [Product Name] offers [value proposition]. While it's not perfect due to [main limitations], it excels in [main strengths]. We recommend it for [recommendation with conditions].</p>

<p><strong>Where to Buy:</strong> Available at [retailer links] starting at $[price].</p>`
  },
  {
    id: 'thought-leadership-blog',
    title: 'Thought Leadership Blog',
    type: 'blog',
    description: 'Professional blog template for industry insights and thought leadership content',
    featured: true,
    content: `<h1>The Future of [Industry/Technology]: 5 Trends That Will Define the Next Decade</h1>

<p>As we stand at the crossroads of technological evolution, [industry] professionals are witnessing unprecedented changes that will reshape how we [relevant activity]. Having worked in this space for [time period], I've identified five key trends that will define the next decade.</p>

<h2>1. [Trend Name]: The Rise of [Technology/Concept]</h2>
<p>[Detailed explanation of the trend, why it matters, and its potential impact. Include specific examples and data where possible.]</p>

<blockquote>
<p>"[Relevant quote from industry expert or your own insight that adds credibility and perspective.]"</p>
</blockquote>

<h2>2. [Trend Name]: Democratizing [Process/Technology]</h2>
<p>[Explain how this trend is making previously complex or expensive solutions accessible to a broader audience. Discuss the implications.]</p>

<h3>Real-World Applications</h3>
<ul>
<li>[Specific example 1 with brief explanation]</li>
<li>[Specific example 2 with brief explanation]</li>
<li>[Specific example 3 with brief explanation]</li>
</ul>

<h2>3. [Trend Name]: The Integration Challenge</h2>
<p>[Discuss how different technologies or processes are converging, the challenges this creates, and the opportunities it presents.]</p>

<h2>4. [Trend Name]: Sustainability and [Relevant Aspect]</h2>
<p>[Address the growing importance of sustainable practices in your industry. Provide concrete examples and actionable insights.]</p>

<h2>5. [Trend Name]: The Human Element in an Automated World</h2>
<p>[Discuss how human skills and capabilities remain crucial even as automation advances. Provide guidance on adaptation.]</p>

<h2>Preparing for What's Ahead</h2>
<p>For professionals and organizations looking to thrive in this evolving landscape, consider these actionable steps:</p>

<ol>
<li><strong>[Actionable advice 1]:</strong> [Specific guidance]</li>
<li><strong>[Actionable advice 2]:</strong> [Specific guidance]</li>
<li><strong>[Actionable advice 3]:</strong> [Specific guidance]</li>
</ol>

<h2>Conclusion</h2>
<p>The next decade promises to be transformative for [industry]. By understanding and preparing for these trends, we can not only adapt to change but drive innovation that benefits [stakeholders/society].</p>

<p><em>What trends do you see shaping [industry]? Share your thoughts in the comments below.</em></p>`
  },
  {
    id: 'breaking-news-template',
    title: 'Breaking News Alert',
    type: 'news',
    description: 'Fast-paced breaking news template for urgent announcements',
    featured: false,
    content: `<h1>🚨 BREAKING: [Headline That Grabs Attention]</h1>

<p><strong>[Location], [Date] - [Time]</strong> - [Brief one-sentence summary of the breaking news]</p>

<h2>What We Know So Far</h2>
<ul>
<li>[Key fact 1]</li>
<li>[Key fact 2]</li>
<li>[Key fact 3]</li>
<li>[Key fact 4]</li>
</ul>

<h2>Developing Story</h2>
<p>[Provide more context and background information. Explain why this matters and what the implications might be.]</p>

<blockquote>
<p>"[Important quote from key stakeholder, official, or expert]" - [Name, Title]</p>
</blockquote>

<h2>What Happens Next</h2>
<p>[Outline expected next steps, upcoming events, or timeline for further developments]</p>

<p><strong>This is a developing story. We will continue to update this article as more information becomes available.</strong></p>

<p><em>Last updated: [Timestamp]</em></p>`
  },
  {
    id: 'tutorial-blog-post',
    title: 'Step-by-Step Tutorial',
    type: 'blog',
    description: 'Educational tutorial template with clear instructions and examples',
    featured: false,
    content: `<h1>How to [Accomplish Specific Goal]: A Complete Guide</h1>

<p>Whether you're a beginner or looking to refine your skills, this comprehensive guide will walk you through [process/task] step by step. By the end of this tutorial, you'll be able to [specific outcome].</p>

<h2>What You'll Need</h2>
<ul>
<li>[Required tool/resource 1]</li>
<li>[Required tool/resource 2]</li>
<li>[Required tool/resource 3]</li>
<li>[Time estimate: X minutes/hours]</li>
</ul>

<h2>Prerequisites</h2>
<p>Before we begin, make sure you have:</p>
<ul>
<li>[Skill/knowledge requirement 1]</li>
<li>[Skill/knowledge requirement 2]</li>
</ul>

<h2>Step 1: [First Major Step]</h2>
<p>[Detailed explanation of the first step. Include screenshots, code examples, or visual aids as needed.]</p>

<h3>Pro Tip</h3>
<blockquote>
<p>[Helpful tip or best practice related to this step]</p>
</blockquote>

<h2>Step 2: [Second Major Step]</h2>
<p>[Detailed explanation with specific instructions. Break down complex steps into sub-steps if necessary.]</p>

<h2>Step 3: [Third Major Step]</h2>
<p>[Continue with clear, actionable instructions.]</p>

<h2>Troubleshooting Common Issues</h2>
<h3>Problem: [Common issue 1]</h3>
<p><strong>Solution:</strong> [Clear solution with explanation]</p>

<h3>Problem: [Common issue 2]</h3>
<p><strong>Solution:</strong> [Clear solution with explanation]</p>

<h2>Taking It Further</h2>
<p>Now that you've mastered the basics, here are some advanced techniques to explore:</p>
<ul>
<li>[Advanced technique 1]</li>
<li>[Advanced technique 2]</li>
<li>[Advanced technique 3]</li>
</ul>

<h2>Conclusion</h2>
<p>Congratulations! You've successfully [accomplished goal]. Remember, [key takeaway or encouragement]. Practice makes perfect, so don't hesitate to experiment and try different approaches.</p>

<p><em>Did this tutorial help you? Let us know in the comments below and share your results!</em></p>`
  }
];

interface ArticleTemplatesProps {
  onSelectTemplate: (template: Template) => void;
}

const ArticleTemplates = ({ onSelectTemplate }: ArticleTemplatesProps) => {
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredTemplates = selectedType === 'all' 
    ? templates 
    : templates.filter(template => template.type === selectedType);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'news': return <Newspaper className="h-4 w-4" />;
      case 'product_review': return <Package className="h-4 w-4" />;
      case 'blog': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'news': return 'bg-blue-100 text-blue-800';
      case 'product_review': return 'bg-green-100 text-green-800';
      case 'blog': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'news': return 'News';
      case 'product_review': return 'Product Review';
      case 'blog': return 'Blog Post';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Article Templates</h2>
        <p className="text-muted-foreground">Choose from professional templates to get started quickly</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedType === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedType('all')}
          size="sm"
        >
          All Templates
        </Button>
        <Button
          variant={selectedType === 'blog' ? 'default' : 'outline'}
          onClick={() => setSelectedType('blog')}
          size="sm"
        >
          <FileText className="mr-2 h-4 w-4" />
          Blog Posts
        </Button>
        <Button
          variant={selectedType === 'news' ? 'default' : 'outline'}
          onClick={() => setSelectedType('news')}
          size="sm"
        >
          <Newspaper className="mr-2 h-4 w-4" />
          News
        </Button>
        <Button
          variant={selectedType === 'product_review' ? 'default' : 'outline'}
          onClick={() => setSelectedType('product_review')}
          size="sm"
        >
          <Package className="mr-2 h-4 w-4" />
          Reviews
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-2">
                    {getTypeIcon(template.type)}
                    {template.title}
                    {template.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getTypeColor(template.type)}>
                      {getTypeLabel(template.type)}
                    </Badge>
                    {template.featured && (
                      <Badge variant="outline">Featured</Badge>
                    )}
                  </div>
                </div>
              </div>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => onSelectTemplate(template)}
                className="w-full"
              >
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ArticleTemplates;
