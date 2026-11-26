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
    // Don Matthews live avatar: the DonAvatarHero component talks to the Don
    // LiveTalking avatar + orchestrator on the WTP News GPU box through these
    // same-origin /don/* paths. The box frontdoor (Vast public port 50800 on the RTX 5090)
    // strips the /don prefix and routes /speak, /ws/listen and /health to the
    // Don orchestrator (port 8023, Don's Cartesia voice) and /offer, /human
    // and /humanaudio to LiveTalking (avatar don_matthews_v2).
    const DON = 'http://142.252.100.103:50800';
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
