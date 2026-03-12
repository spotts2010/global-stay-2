// src/components/Footer.tsx

import packageJson from '../../package.json';
import { Hotel } from '@/lib/icons';
import { BUILD_META } from '@/lib/build-meta';

const Footer = () => {
  const STAGE = 'dev';
  const VERSION = `${packageJson.version}-${STAGE}`;

  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex items-center gap-2">
            <Hotel className="h-6 w-6 text-primary" />
            <span className="font-headline text-lg font-bold">Global Stay 2.0</span>
          </div>

          <div className="mt-4 text-center text-sm text-muted-foreground md:mt-0 md:text-right">
            <p>© {new Date().getFullYear()} Global Stay Inc. All rights reserved.</p>
            <p className="text-xs opacity-70">
              Platform Version {VERSION} • {BUILD_META.commit}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;