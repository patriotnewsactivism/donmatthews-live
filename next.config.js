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
  async rewrites() {
    // A stable HTTPS gateway keeps GPU host/port changes out of site releases.
    // The gateway forwards Don's routes to the existing avatar stack.
    const DON = 'https://avatar.wtpnews.org';
    return [
      { source: '/don/offer', destination: `${DON}/don/offer` },
      { source: '/don/speak', destination: `${DON}/don/speak` },
      { source: '/don/human', destination: `${DON}/don/human` },
      { source: '/don/humanaudio', destination: `${DON}/don/humanaudio` },
      { source: '/don/health', destination: `${DON}/don/health` },
      { source: '/don/ws/listen', destination: `${DON}/don/ws/listen` },
    ];
  },
};

module.exports = nextConfig;
