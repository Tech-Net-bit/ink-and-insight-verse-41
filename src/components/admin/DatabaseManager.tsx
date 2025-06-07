
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Database, Play, Copy, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SqlTemplate {
  id: string;
  name: string;
  description: string;
  sql_query: string;
  category: string;
}

interface QueryResult {
  data: any[];
  error: string | null;
  executionTime: number;
}

const DatabaseManager = () => {
  const [templates, setTemplates] = useState<SqlTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
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
        title: 'Error',
        description: 'Failed to fetch SQL templates',
        variant: 'destructive',
      });
    }
  };

  const executeQuery = async () => {
    if (!sqlQuery.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a SQL query',
        variant: 'destructive',
      });
      return;
    }

    setIsExecuting(true);
    const startTime = Date.now();

    try {
      // For security, only allow SELECT statements
      if (!sqlQuery.trim().toLowerCase().startsWith('select')) {
        throw new Error('Only SELECT queries are allowed for security reasons');
      }

      const { data, error } = await supabase.rpc('execute_sql', {
        query: sqlQuery
      });

      const executionTime = Date.now() - startTime;

      if (error) throw error;

      setQueryResult({
        data: data || [],
        error: null,
        executionTime
      });

      toast({
        title: 'Success',
        description: `Query executed successfully in ${executionTime}ms`,
      });
    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      setQueryResult({
        data: [],
        error: error.message,
        executionTime
      });

      toast({
        title: 'Query Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const loadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSqlQuery(template.sql_query);
      setSelectedTemplate(templateId);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Query copied to clipboard',
    });
  };

  const clearQuery = () => {
    setSqlQuery('');
    setSelectedTemplate('');
    setQueryResult(null);
  };

  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, SqlTemplate[]>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Database className="h-8 w-8" />
          Database Manager
        </h1>
        <p className="text-muted-foreground">Execute SQL queries and manage your database</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SQL Query Editor</CardTitle>
              <CardDescription>
                Write and execute SQL queries. Only SELECT statements are allowed for security.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Select value={selectedTemplate} onValueChange={loadTemplate}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Load a template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
                      <div key={category}>
                        <div className="px-2 py-1 text-sm font-medium text-muted-foreground capitalize">
                          {category}
                        </div>
                        {categoryTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={clearQuery}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <Textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                placeholder="Enter your SQL query here..."
                className="min-h-[200px] font-mono text-sm"
              />

              <div className="flex gap-2">
                <Button 
                  onClick={executeQuery} 
                  disabled={isExecuting}
                  className="flex-1"
                >
                  <Play className="mr-2 h-4 w-4" />
                  {isExecuting ? 'Executing...' : 'Execute Query'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => copyToClipboard(sqlQuery)}
                  disabled={!sqlQuery}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {queryResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Query Results
                  <Badge variant="outline">
                    {queryResult.executionTime}ms
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {queryResult.error ? (
                  <div className="text-red-600 bg-red-50 p-4 rounded-lg">
                    <strong>Error:</strong> {queryResult.error}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      {queryResult.data.length} rows returned
                    </div>
                    {queryResult.data.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-50">
                              {Object.keys(queryResult.data[0]).map((column) => (
                                <th key={column} className="border border-gray-300 px-4 py-2 text-left font-medium">
                                  {column}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {queryResult.data.slice(0, 100).map((row, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                {Object.values(row).map((value, cellIndex) => (
                                  <td key={cellIndex} className="border border-gray-300 px-4 py-2 text-sm">
                                    {value !== null ? String(value) : <span className="text-gray-400">NULL</span>}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {queryResult.data.length > 100 && (
                          <div className="text-sm text-muted-foreground mt-2">
                            Showing first 100 rows of {queryResult.data.length} total rows
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-muted-foreground">No data returned</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Templates</CardTitle>
              <CardDescription>Pre-built queries for common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
                <div key={category} className="space-y-2">
                  <h4 className="font-medium text-sm capitalize text-muted-foreground">
                    {category}
                  </h4>
                  {categoryTemplates.map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => loadTemplate(template.id)}
                    >
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {template.description}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Database Schema</CardTitle>
              <CardDescription>Quick reference for table structures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm space-y-1">
                <div className="font-medium">Main Tables:</div>
                <div className="pl-2 space-y-1 text-muted-foreground">
                  <div>• articles (id, title, content, author_id...)</div>
                  <div>• profiles (id, email, full_name, role...)</div>
                  <div>• categories (id, name, slug...)</div>
                  <div>• reviews (id, article_id, user_id, rating...)</div>
                  <div>• site_settings (id, site_name, meta_title...)</div>
                  <div>• usage_limits (id, total_articles, total_users...)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DatabaseManager;
