
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Database, Play, History, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SqlTemplate {
  id: string;
  name: string;
  description: string;
  sql_query: string;
  category: string;
}

const DatabaseManager = () => {
  const [templates, setTemplates] = useState<SqlTemplate[]>([]);
  const [selectedQuery, setSelectedQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('sql_templates')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to load SQL templates",
        variant: "destructive",
      });
    } finally {
      setLoadingTemplates(false);
    }
  };

  const executeQuery = async () => {
    if (!selectedQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a SQL query",
        variant: "destructive",
      });
      return;
    }

    // Only allow SELECT queries for safety
    if (!selectedQuery.trim().toLowerCase().startsWith('select')) {
      toast({
        title: "Error",
        description: "Only SELECT queries are allowed for safety",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('execute_sql', {
        query: selectedQuery
      });

      if (error) throw error;

      setQueryResult(data);
      toast({
        title: "Success",
        description: "Query executed successfully",
      });
    } catch (error: any) {
      console.error('Error executing query:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to execute query",
        variant: "destructive",
      });
      setQueryResult(null);
    } finally {
      setLoading(false);
    }
  };

  const selectTemplate = (template: SqlTemplate) => {
    setSelectedQuery(template.sql_query);
    setQueryResult(null);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      articles: 'bg-blue-100 text-blue-800',
      users: 'bg-green-100 text-green-800',
      reviews: 'bg-purple-100 text-purple-800',
      storage: 'bg-orange-100 text-orange-800',
      database: 'bg-gray-100 text-gray-800',
      general: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.general;
  };

  if (loadingTemplates) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Database className="h-8 w-8" />
          Database Manager
        </h1>
        <p className="text-muted-foreground">
          Execute SQL queries and manage your database safely
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>SQL Templates</CardTitle>
            <CardDescription>
              Pre-built queries for common database operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                onClick={() => selectTemplate(template)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{template.name}</h4>
                  <Badge className={getCategoryColor(template.category)}>
                    {template.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Query Editor</CardTitle>
            <CardDescription>
              Write and execute your SQL queries (SELECT only)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <strong>Safety Notice:</strong> Only SELECT queries are allowed to prevent data modification.
              </div>
            </div>
            
            <Textarea
              placeholder="SELECT * FROM articles WHERE published = true;"
              value={selectedQuery}
              onChange={(e) => setSelectedQuery(e.target.value)}
              className="min-h-32 font-mono text-sm"
            />
            
            <Button 
              onClick={executeQuery} 
              disabled={loading || !selectedQuery.trim()}
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              {loading ? 'Executing...' : 'Execute Query'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {queryResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Query Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4 overflow-auto">
              <pre className="text-sm">
                {JSON.stringify(queryResult, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DatabaseManager;
