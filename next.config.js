/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'images.unsplash.com',
      'unsplash.com',
      'cdn.pixabay.com',
      'pixabay.com',
      'source.unsplash.com'
    ],
    formats: ['image/webp', 'image/avif'],
    unoptimized: process.env.NODE_ENV === 'production', // Fix for static export
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Commented out for development - uncomment for static export
  // output: 'export',
  trailingSlash: true,
  // distDir: 'dist',
}

module.exports = nextConfig
