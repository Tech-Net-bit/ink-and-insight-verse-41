
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from '@/hooks/useAuth';

// Lazy load components for better performance
const Index = lazy(() => import('./pages/Index'));
const About = lazy(() => import('./pages/About'));
const Articles = lazy(() => import('./pages/Articles'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const Categories = lazy(() => import('./pages/Categories'));
const Auth = lazy(() => import('./pages/Auth'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin components
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const ArticleManagement = lazy(() => import('./components/admin/ArticleManagement'));
const CategoryManagement = lazy(() => import('./components/admin/CategoryManagement'));
const UserManagement = lazy(() => import('./components/admin/UserManagement'));
const SiteSettings = lazy(() => import('./components/admin/SiteSettings'));
const DatabaseManager = lazy(() => import('./components/admin/DatabaseManager'));
const DatabaseTables = lazy(() => import('./components/admin/DatabaseTables'));
const UsageLimits = lazy(() => import('./components/admin/UsageLimits'));

const queryClient = new QueryClient();

const LazyRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  }>
    {children}
  </Suspense>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LazyRoute><Index /></LazyRoute>} />
            <Route path="/about" element={<LazyRoute><About /></LazyRoute>} />
            <Route path="/articles" element={<LazyRoute><Articles /></LazyRoute>} />
            <Route path="/article/:slug" element={<LazyRoute><ArticleDetail /></LazyRoute>} />
            <Route path="/categories" element={<LazyRoute><Categories /></LazyRoute>} />
            <Route path="/auth" element={<LazyRoute><Auth /></LazyRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<LazyRoute><Admin /></LazyRoute>}>
              <Route index element={<LazyRoute><AdminDashboard /></LazyRoute>} />
              <Route path="articles" element={<LazyRoute><ArticleManagement /></LazyRoute>} />
              <Route path="categories" element={<LazyRoute><CategoryManagement /></LazyRoute>} />
              <Route path="users" element={<LazyRoute><UserManagement /></LazyRoute>} />
              <Route path="settings" element={<LazyRoute><SiteSettings /></LazyRoute>} />
              <Route path="database" element={<LazyRoute><DatabaseManager /></LazyRoute>} />
              <Route path="database-tables" element={<LazyRoute><DatabaseTables /></LazyRoute>} />
              <Route path="usage" element={<LazyRoute><UsageLimits /></LazyRoute>} />
            </Route>
            
            <Route path="*" element={<LazyRoute><NotFound /></LazyRoute>} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
