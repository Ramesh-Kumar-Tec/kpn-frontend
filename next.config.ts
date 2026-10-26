import type { NextConfig } from "next";
const backendBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '')
    : (process.env.NODE_ENV === 'production'
        ? 'https://kpnbackend.elroiitsolutions.com'
        : 'http://localhost:5000')
);

const nextConfig: NextConfig = {
  
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.elroiitsolutions.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: '192.168.*.*',
      },
      {
        protocol: 'http',
        hostname: '10.*.*.*',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  experimental: {
    cpus: 1,
    workerThreads: false,
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '127.0.0.1:3000',
        '192.168.1.3:3000',
        '*.local:3000',
      ],
    },
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${backendBaseUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;

