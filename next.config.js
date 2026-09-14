/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    // The standalone voice agent is authored as NodeNext TypeScript and uses
    // ESM-style `./module.js` specifiers. When Next bundles those source files
    // directly for Vercel, map the emitted .js specifier back to its .ts source.
    config.resolve.extensionAlias = {
      ...(config.resolve.extensionAlias || {}),
      '.js': ['.ts', '.tsx', '.js'],
      '.mjs': ['.mts', '.mjs'],
      '.cjs': ['.cts', '.cjs'],
    };
    return config;
  },
};

module.exports = nextConfig;
