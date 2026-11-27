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
  // NOTE: the old /don/* rewrites to avatar.wtpnews.org were removed with
  // the Don paywall (Nov. 27, 2026). That LiveTalking backend died with the
  // China 5090; the hero now talks to the hosted Anam stage server via
  // /api/don/session (see docs/don-paywall.md).
};

module.exports = nextConfig;
