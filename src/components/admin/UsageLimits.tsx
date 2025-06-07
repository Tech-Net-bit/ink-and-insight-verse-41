
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, FileText, Users, MessageCircle, HardDrive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UsageData {
  total_articles: number;
  total_users: number;
  total_comments: number;
  total_storage_mb: number;
  last_updated: string;
}

interface UsageLimit {
  name: string;
  current: number;
  limit: number;
  unit: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

const UsageLimits = () => {
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  // Supabase Free Plan Limits
  const LIMITS = {
    articles: 500, // Reasonable limit for free plan
    users: 50000, // Supabase auth limit
    comments: 2000, // Reasonable limit for reviews
    storage: 1024, // 1GB in MB
  };

  useEffect(() => {
    fetchUsageData();
  }, []);

  const fetchUsageData = async () => {
    try {
      const { data, error } = await supabase
        .from('usage_limits')
        .select('*')
        .single();

      if (error) throw error;
      setUsageData(data);
    } catch (error) {
      console.error('Error fetching usage data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch usage data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUsageStats = async () => {
    setUpdating(true);
    try {
      const { error } = await supabase.rpc('update_usage_stats');
      if (error) throw error;

      await fetchUsageData();
      toast({
        title: 'Success',
        description: 'Usage statistics updated successfully',
      });
    } catch (error) {
      console.error('Error updating usage stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to update usage statistics',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!usageData) return null;

  const usageLimits: UsageLimit[] = [
    {
      name: 'Articles',
      current: usageData.total_articles,
      limit: LIMITS.articles,
      unit: 'articles',
      icon: FileText,
      color: 'blue',
      description: 'Total published and draft articles'
    },
    {
      name: 'Users',
      current: usageData.total_users,
      limit: LIMITS.users,
      unit: 'users',
      icon: Users,
      color: 'green',
      description: 'Registered user accounts'
    },
    {
      name: 'Comments',
      current: usageData.total_comments,
      limit: LIMITS.comments,
      unit: 'comments',
      icon: MessageCircle,
      color: 'purple',
      description: 'User reviews and comments'
    },
    {
      name: 'Storage',
      current: Math.round(usageData.total_storage_mb),
      limit: LIMITS.storage,
      unit: 'MB',
      icon: HardDrive,
      color: 'orange',
      description: 'File storage usage'
    }
  ];

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usage & Limits</h1>
          <p className="text-muted-foreground">
            Monitor your Supabase free plan usage and limits
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={updateUsageStats}
            disabled={updating}
            variant="outline"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${updating ? 'animate-spin' : ''}`} />
            {updating ? 'Updating...' : 'Refresh'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {usageLimits.map((item) => {
          const percentage = getUsagePercentage(item.current, item.limit);
          const Icon = item.icon;
          const isNearLimit = percentage >= 75;

          return (
            <Card key={item.name} className={isNearLimit ? 'border-yellow-200' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {isNearLimit && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <div className={`text-2xl font-bold ${getUsageColor(percentage)}`}>
                      {item.current.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      / {item.limit.toLocaleString()} {item.unit}
                    </div>
                  </div>
                  
                  <Progress 
                    value={percentage} 
                    className="w-full h-2"
                    // className={getProgressColor(percentage)}
                  />
                  
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={percentage >= 90 ? 'destructive' : percentage >= 75 ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {percentage.toFixed(1)}% used
                    </Badge>
                    {percentage >= 90 && (
                      <Badge variant="destructive" className="text-xs">
                        Limit reached!
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supabase Free Plan Limits</CardTitle>
          <CardDescription>
            Understanding your current plan limitations and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Current Plan: Free</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Database size: 500MB</li>
                <li>• File storage: 1GB</li>
                <li>• Bandwidth: 5GB</li>
                <li>• Auth users: 50,000</li>
                <li>• Edge function invocations: 500K/month</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Optimize images before uploading</li>
                <li>• Regular cleanup of unused content</li>
                <li>• Monitor usage regularly</li>
                <li>• Consider Pro plan if limits are reached</li>
              </ul>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Last updated: {new Date(usageData.last_updated).toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageLimits;
