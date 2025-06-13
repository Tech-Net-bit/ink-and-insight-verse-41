
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Users, MessageCircle, Eye, Database, BarChart, Table } from 'lucide-react';

interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  totalUsers: number;
  totalReviews: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    publishedArticles: 0,
    totalUsers: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [articlesResult, usersResult, reviewsResult] = await Promise.all([
        supabase.from('articles').select('published', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('reviews').select('id', { count: 'exact' }),
      ]);

      const totalArticles = articlesResult.count || 0;
      const publishedArticles = articlesResult.data?.filter(a => a.published).length || 0;
      const totalUsers = usersResult.count || 0;
      const totalReviews = reviewsResult.count || 0;

      setStats({
        totalArticles,
        publishedArticles,
        totalUsers,
        totalReviews,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Articles',
      value: stats.totalArticles,
      icon: FileText,
      description: `${stats.publishedArticles} published`,
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      description: 'Registered users',
    },
    {
      title: 'Total Reviews',
      value: stats.totalReviews,
      icon: MessageCircle,
      description: 'User reviews',
    },
    {
      title: 'Published Articles',
      value: stats.publishedArticles,
      icon: Eye,
      description: 'Live on site',
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard. Here's an overview of your blog.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks you can perform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/admin/articles"
              className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="font-medium">Create New Article</div>
              <div className="text-sm text-muted-foreground">Write and publish a new blog post</div>
            </a>
            <a
              href="/admin/database"
              className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="font-medium flex items-center gap-2">
                <Database className="h-4 w-4" />
                Database Manager
              </div>
              <div className="text-sm text-muted-foreground">Execute SQL queries and manage data</div>
            </a>
            <a
              href="/admin/database-tables"
              className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="font-medium flex items-center gap-2">
                <Table className="h-4 w-4" />
                Database Tables
              </div>
              <div className="text-sm text-muted-foreground">View table definitions and creation scripts</div>
            </a>
            <a
              href="/admin/usage"
              className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="font-medium flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Usage & Limits
              </div>
              <div className="text-sm text-muted-foreground">Monitor Supabase plan usage and limits</div>
            </a>
            <a
              href="/admin/settings"
              className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="font-medium">Site Settings</div>
              <div className="text-sm text-muted-foreground">Customize your site appearance and SEO</div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates to your blog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                No recent activity to show. Start by creating your first article!
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
