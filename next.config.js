/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.jsdelivr.net'],
    unoptimized: true
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/index.html',
      },
    ]
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
}

module.exports = nextConfig
