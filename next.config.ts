import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  allowedDevOrigins: [
    'http://localhost:3000',
    'https://3000-firebase-studio-1753950960099.cluster-m7dwy2bmizezqukxkuxd55k5ka.cloudworkstations.dev',
    'https://6000-firebase-studio-1753950960099.cluster-m7dwy2bmizezqukxkuxd55k5ka.cloudworkstations.dev',
    'https://9000-firebase-studio-1753950960099.cluster-m7dwy2bmizezqukxkuxd55k5ka.cloudworkstations.dev',
  ],

  experimental: {
    // devTools is no longer an experimental feature, so it is moved to the top level.
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'plus.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: '*.apphosting.dev' },
      { protocol: 'https', hostname: '*.hosted.app' },
      { protocol: 'https', hostname: '*.firebaseapp.com' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
      { protocol: 'https', hostname: '127.0.0.1' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
    ],
  },
};

export default nextConfig;
