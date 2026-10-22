import type { NextConfig } from "next";

const backendBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '')
    : 'http://localhost:5000'
);

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    cpus: 1,
    workerThreads: false,
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

