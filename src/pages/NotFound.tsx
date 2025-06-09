
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/10">
      <div className="text-center space-y-8 max-w-md mx-auto px-4">
        <div className="space-y-4">
          <div className="text-8xl font-bold text-primary opacity-50">404</div>
          <h1 className="text-3xl font-bold text-foreground">Page Not Found</h1>
          <p className="text-lg text-muted-foreground">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="flex items-center gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
          
          <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          
          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link to="/articles">
              <Search className="h-4 w-4" />
              Browse Articles
            </Link>
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>If you believe this is an error, please contact support.</p>
          <p className="mt-2 font-mono text-xs">
            Path: {location.pathname}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
