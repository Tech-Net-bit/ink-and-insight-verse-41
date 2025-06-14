
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { useEffect } from "react";
import LazyRoute from "@/components/LazyRoute";
import PerformanceMonitor from "@/components/PerformanceMonitor";

// Lazy load components for better performance
const Index = () => import("./pages/Index");
const Auth = () => import("./pages/Auth");
const Admin = () => import("./pages/Admin");
const NotFound = () => import("./pages/NotFound");
const Articles = () => import("./pages/Articles");
const ArticleDetail = () => import("./pages/ArticleDetail");
const Categories = () => import("./pages/Categories");
const About = () => import("./pages/About");
const AdminLayout = () => import("./components/admin/AdminLayout");
const ArticleManagement = () => import("./components/admin/ArticleManagement");
const CategoryManagement = () => import("./components/admin/CategoryManagement");
const UserManagement = () => import("./components/admin/UserManagement");
const SiteSettings = () => import("./components/admin/SiteSettings");
const DatabaseManager = () => import("./components/admin/DatabaseManager");
const UsageLimits = () => import("./components/admin/UsageLimits");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent: React.FC = () => {
  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  return (
    <React.Fragment>
      <PerformanceMonitor />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LazyRoute component={Index} />} />
          <Route path="/auth" element={<LazyRoute component={Auth} />} />
          <Route path="/articles" element={<LazyRoute component={Articles} />} />
          <Route path="/article/:slug" element={<LazyRoute component={ArticleDetail} />} />
          <Route path="/categories" element={<LazyRoute component={Categories} />} />
          <Route path="/about" element={<LazyRoute component={About} />} />
          <Route path="/admin" element={<LazyRoute component={Admin} />} />
          
          {/* Admin routes with nested routing */}
          <Route path="/admin/*" element={<LazyRoute component={AdminLayout} />}>
            <Route path="articles" element={<LazyRoute component={ArticleManagement} />} />
            <Route path="categories" element={<LazyRoute component={CategoryManagement} />} />
            <Route path="users" element={<LazyRoute component={UserManagement} />} />
            <Route path="settings" element={<LazyRoute component={SiteSettings} />} />
            <Route path="database" element={<LazyRoute component={DatabaseManager} />} />
            <Route path="limits" element={<LazyRoute component={UsageLimits} />} />
          </Route>
          
          <Route path="*" element={<LazyRoute component={NotFound} />} />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <AppContent />
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
