
import { Button } from '@/components/ui/button';

const Footer = () => {
  const footerLinks = {
    Product: ['Features', 'Reviews', 'Pricing', 'FAQ'],
    Company: ['About', 'Blog', 'Careers', 'Contact'],
    Resources: ['Help Center', 'Privacy', 'Terms', 'Support'],
    Social: ['Twitter', 'LinkedIn', 'YouTube', 'Newsletter'],
  };

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
              TechFlow
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Your trusted source for technology news, reviews, and insights. 
              Stay ahead of the curve with our expert analysis.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Subscribe to our newsletter</p>
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button size="sm">Subscribe</Button>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 TechFlow. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
