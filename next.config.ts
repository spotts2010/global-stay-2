// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep builds/dev server resilient while you stabilise types + lint
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  /**
   * NOTE:
   * - Remove `allowedDevOrigins` entirely.
   * - It is NOT a valid Next.js config key in Next 15 and will trigger:
   *   "Invalid next.config options detected: Unrecognized key(s) ..."
   *
   * If you were using this to solve cross-origin / dev overlay / Studio preview issues,
   * handle that at the platform/proxy layer instead (Firebase Studio / hosting),
   * not via next.config.
   */

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'plus.unsplash.com', pathname: '/**' },

      // Firebase / Google hosting & storage
      { protocol: 'https', hostname: '*.apphosting.dev' },
      { protocol: 'https', hostname: '*.hosted.app' },
      { protocol: 'https', hostname: '*.firebaseapp.com' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },

      // Local dev
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
      { protocol: 'https', hostname: '127.0.0.1' },
    ],
  },
};

export default nextConfig;
