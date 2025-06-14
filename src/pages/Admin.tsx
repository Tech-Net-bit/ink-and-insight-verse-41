
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';

const Admin = () => {
  const { user, userRole, loading } = useAuth();
  const { checkRateLimit } = usePerformanceOptimization();
  const navigate = useNavigate();

  // Add debugging information
  console.log('Admin page - User:', user?.email, 'Role:', userRole, 'Loading:', loading);

  useEffect(() => {
    // Only redirect after loading is complete
    if (loading) {
      console.log('Still loading, waiting...');
      return;
    }

    // Rate limit admin access attempts
    if (!checkRateLimit(`admin-access-${user?.id || 'anonymous'}`)) {
      console.warn('Rate limit exceeded for admin access');
      return;
    }

    // Check authentication and role
    if (!user) {
      console.log('No user found, redirecting to auth');
      navigate('/auth');
      return;
    }

    if (userRole !== 'admin') {
      console.log('Access denied - user role is:', userRole, 'but needs to be admin');
      console.log('Full user data:', user);
      navigate('/auth');
      return;
    }

    console.log('Admin access granted for user:', user.email, 'with role:', userRole);
  }, [user, userRole, loading, navigate, checkRateLimit]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/10">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
          <p className="text-xs text-muted-foreground">
            Checking authentication and permissions...
          </p>
        </div>
      </div>
    );
  }

  if (!user || userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/10">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="text-muted-foreground">
            User: {user?.email || 'Not logged in'}
          </p>
          <p className="text-muted-foreground">
            Role: {userRole || 'None'} (Required: admin)
          </p>
          <p className="text-xs text-muted-foreground">
            If you believe this is an error, check your profile role in the database.
          </p>
          <button 
            onClick={() => navigate('/auth')}
            className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
};

export default Admin;
