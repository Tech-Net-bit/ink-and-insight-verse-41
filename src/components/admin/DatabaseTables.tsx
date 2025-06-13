
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Database, Copy, Search, Table } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TableDefinition {
  name: string;
  description: string;
  category: string;
  createQuery: string;
  columns: Array<{
    name: string;
    type: string;
    nullable: boolean;
    default?: string;
  }>;
}

const DatabaseTables = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const tables: TableDefinition[] = [
    {
      name: 'articles',
      description: 'Main articles/blog posts table with content, metadata, and publishing status',
      category: 'content',
      createQuery: `CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  slug TEXT NOT NULL UNIQUE,
  featured_image_url TEXT,
  og_image_url TEXT,
  article_type article_type DEFAULT 'blog',
  category_id UUID REFERENCES categories(id),
  author_id UUID NOT NULL REFERENCES profiles(id),
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  reading_time INTEGER,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);`,
      columns: [
        { name: 'id', type: 'UUID', nullable: false, default: 'gen_random_uuid()' },
        { name: 'title', type: 'TEXT', nullable: false },
        { name: 'content', type: 'TEXT', nullable: false },
        { name: 'excerpt', type: 'TEXT', nullable: true },
        { name: 'slug', type: 'TEXT', nullable: false },
        { name: 'featured_image_url', type: 'TEXT', nullable: true },
        { name: 'article_type', type: 'article_type', nullable: true, default: 'blog' },
        { name: 'published', type: 'BOOLEAN', nullable: true, default: 'false' },
        { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE', nullable: true, default: 'now()' }
      ]
    },
    {
      name: 'categories',
      description: 'Article categories for organizing content',
      category: 'content',
      createQuery: `CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);`,
      columns: [
        { name: 'id', type: 'UUID', nullable: false, default: 'gen_random_uuid()' },
        { name: 'name', type: 'TEXT', nullable: false },
        { name: 'slug', type: 'TEXT', nullable: false },
        { name: 'description', type: 'TEXT', nullable: true },
        { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE', nullable: true, default: 'now()' }
      ]
    },
    {
      name: 'profiles',
      description: 'User profiles and authentication data',
      category: 'users',
      createQuery: `CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);`,
      columns: [
        { name: 'id', type: 'UUID', nullable: false },
        { name: 'email', type: 'TEXT', nullable: false },
        { name: 'full_name', type: 'TEXT', nullable: true },
        { name: 'role', type: 'user_role', nullable: false, default: 'user' },
        { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE', nullable: true, default: 'now()' }
      ]
    },
    {
      name: 'reviews',
      description: 'User reviews and ratings for articles',
      category: 'engagement',
      createQuery: `CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);`,
      columns: [
        { name: 'id', type: 'UUID', nullable: false, default: 'gen_random_uuid()' },
        { name: 'article_id', type: 'UUID', nullable: false },
        { name: 'user_id', type: 'UUID', nullable: false },
        { name: 'rating', type: 'INTEGER', nullable: false },
        { name: 'comment', type: 'TEXT', nullable: true },
        { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE', nullable: true, default: 'now()' }
      ]
    },
    {
      name: 'site_settings',
      description: 'Global site configuration and customization settings',
      category: 'configuration',
      createQuery: `CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT DEFAULT 'TechFlow',
  site_description TEXT DEFAULT 'Your source for tech news and reviews',
  hero_title TEXT DEFAULT 'The Future of Technology is Here',
  hero_subtitle TEXT DEFAULT 'Discover the latest breakthroughs, in-depth reviews, and expert insights',
  hero_image_url TEXT,
  hero_layout TEXT DEFAULT 'default',
  primary_color TEXT DEFAULT '#000000',
  secondary_color TEXT DEFAULT '#6366f1',
  meta_title TEXT DEFAULT 'TechFlow - Tech News & Reviews',
  meta_description TEXT DEFAULT 'Stay updated with the latest technology news, in-depth reviews, and expert insights',
  meta_keywords TEXT DEFAULT 'technology, tech news, reviews, gadgets, software',
  favicon_url TEXT,
  logo_url TEXT,
  social_twitter TEXT,
  social_facebook TEXT,
  social_linkedin TEXT,
  social_instagram TEXT,
  about_content TEXT,
  about_mission TEXT,
  about_vision TEXT,
  custom_values JSONB DEFAULT '[]',
  custom_team_members JSONB DEFAULT '[]',
  show_default_values BOOLEAN DEFAULT true,
  show_default_team BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);`,
      columns: [
        { name: 'id', type: 'UUID', nullable: false, default: 'gen_random_uuid()' },
        { name: 'site_name', type: 'TEXT', nullable: true, default: 'TechFlow' },
        { name: 'hero_layout', type: 'TEXT', nullable: true, default: 'default' },
        { name: 'primary_color', type: 'TEXT', nullable: true, default: '#000000' },
        { name: 'custom_values', type: 'JSONB', nullable: true, default: '[]' }
      ]
    },
    {
      name: 'sql_templates',
      description: 'Predefined SQL query templates for database operations',
      category: 'administration',
      createQuery: `CREATE TABLE sql_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  sql_query TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);`,
      columns: [
        { name: 'id', type: 'UUID', nullable: false, default: 'gen_random_uuid()' },
        { name: 'name', type: 'TEXT', nullable: false },
        { name: 'sql_query', type: 'TEXT', nullable: false },
        { name: 'category', type: 'TEXT', nullable: true, default: 'general' }
      ]
    },
    {
      name: 'usage_limits',
      description: 'System usage tracking and limits monitoring',
      category: 'monitoring',
      createQuery: `CREATE TABLE usage_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_articles INTEGER DEFAULT 0,
  total_users INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  total_storage_mb NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);`,
      columns: [
        { name: 'id', type: 'UUID', nullable: false, default: 'gen_random_uuid()' },
        { name: 'total_articles', type: 'INTEGER', nullable: true, default: '0' },
        { name: 'total_users', type: 'INTEGER', nullable: true, default: '0' },
        { name: 'total_storage_mb', type: 'NUMERIC', nullable: true, default: '0' }
      ]
    }
  ];

  const filteredTables = tables.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      content: 'bg-blue-100 text-blue-800',
      users: 'bg-green-100 text-green-800',
      engagement: 'bg-purple-100 text-purple-800',
      configuration: 'bg-orange-100 text-orange-800',
      administration: 'bg-red-100 text-red-800',
      monitoring: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.monitoring;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Table className="h-8 w-8" />
          Database Tables
        </h1>
        <p className="text-muted-foreground">
          Complete table definitions and SQL creation scripts for the application database
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="outline">{filteredTables.length} tables</Badge>
      </div>

      <div className="grid gap-6">
        {filteredTables.map((table) => (
          <Card key={table.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    {table.name}
                  </CardTitle>
                  <Badge className={getCategoryColor(table.category)}>
                    {table.category}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(table.createQuery, `${table.name} CREATE TABLE`)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy SQL
                </Button>
              </div>
              <CardDescription>{table.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Columns:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {table.columns.map((column) => (
                    <div key={column.name} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                      <span className="font-mono font-medium">{column.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{column.type}</span>
                        {!column.nullable && <Badge variant="secondary" className="text-xs">NOT NULL</Badge>}
                        {column.default && <Badge variant="outline" className="text-xs">DEFAULT</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">CREATE TABLE Statement:</h4>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {table.createQuery}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DatabaseTables;
