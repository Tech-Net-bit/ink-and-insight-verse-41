
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/AdminLayout";
import ArticleManagement from "./components/admin/ArticleManagement";
import CategoryManagement from "./components/admin/CategoryManagement";
import UserManagement from "./components/admin/UserManagement";
import SiteSettings from "./components/admin/SiteSettings";
import DatabaseManager from "./components/admin/DatabaseManager";
import UsageLimits from "./components/admin/UsageLimits";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/*" element={
              <AdminLayout>
                <Routes>
                  <Route path="articles" element={<ArticleManagement />} />
                  <Route path="categories" element={<CategoryManagement />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="settings" element={<SiteSettings />} />
                  <Route path="database" element={<DatabaseManager />} />
                  <Route path="usage" element={<UsageLimits />} />
                </Routes>
              </AdminLayout>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
