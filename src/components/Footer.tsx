import { Hotel } from '@/lib/icons';

const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <Hotel className="h-6 w-6 text-primary" />
            <span className="font-headline text-lg font-bold">Global Stay 2.0</span>
          </div>
          <p className="text-muted-foreground text-sm mt-4 md:mt-0">
            © {new Date().getFullYear()} Global Stay Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
