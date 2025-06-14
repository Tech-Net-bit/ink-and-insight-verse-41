
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  created_at: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users from profiles table...');
      
      // First check if the profiles table exists and has data
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Profiles query result:', { profiles, profilesError });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        
        // If profiles table doesn't exist or has issues, try to get auth users
        // Note: This won't work in production due to RLS, but helps with debugging
        try {
          const { data: authData, error: authError } = await supabase.auth.getUser();
          console.log('Current auth user:', { authData, authError });
          
          if (authData?.user) {
            // Create a mock user based on current auth user
            setUsers([{
              id: authData.user.id,
              email: authData.user.email || 'Unknown',
              full_name: authData.user.user_metadata?.full_name || 'Unknown User',
              role: 'user',
              created_at: authData.user.created_at || new Date().toISOString()
            }]);
          } else {
            setUsers([]);
            toast({
              title: 'No Users Found',
              description: 'No user profiles found. Make sure users have signed up and profiles are created.',
              variant: 'destructive',
            });
          }
        } catch (authError) {
          console.error('Auth error:', authError);
          setUsers([]);
        }
        
        return;
      }

      if (!profiles || profiles.length === 0) {
        console.log('No profiles found in database');
        setUsers([]);
        toast({
          title: 'No Users Found',
          description: 'No user profiles found. Users need to sign up first.',
        });
        return;
      }

      console.log(`Found ${profiles.length} profiles`);
      setUsers(profiles || []);
      
    } catch (error) {
      console.error('Unexpected error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: newRole }
          : user
      ));

      toast({
        title: 'Success',
        description: `User role updated to ${newRole}`,
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage user accounts and permissions</p>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={fetchUsers} variant="outline">
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground text-lg">
              No users found. {users.length === 0 ? 'Users need to sign up first.' : 'Try adjusting your search.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg">
                        {user.full_name || 'No Name'}
                      </CardTitle>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? (
                          <>
                            <ShieldCheck className="mr-1 h-3 w-3" />
                            Admin
                          </>
                        ) : (
                          <>
                            <Shield className="mr-1 h-3 w-3" />
                            User
                          </>
                        )}
                      </Badge>
                    </div>
                    <CardDescription>{user.email}</CardDescription>
                    <p className="text-sm text-muted-foreground">
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={user.role}
                      onValueChange={(value: 'admin' | 'user') => updateUserRole(user.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
