
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
    // Rate limit admin access attempts
    if (!loading && !checkRateLimit(`admin-access-${user?.id || 'anonymous'}`)) {
      console.warn('Rate limit exceeded for admin access');
      return;
    }

    if (!loading && (!user || userRole !== 'admin')) {
      console.log('Access denied - redirecting to auth. User:', !!user, 'Role:', userRole);
      navigate('/auth');
    }
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
          <p className="text-muted-foreground">
            Access denied. User: {user?.email || 'Not logged in'}, Role: {userRole || 'None'}
          </p>
          <p className="text-xs text-muted-foreground">Redirecting to authentication...</p>
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
