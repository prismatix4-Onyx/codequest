/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@codequest/shared-types',
    '@codequest/story-schema',
    '@codequest/story-engine',
    '@codequest/learning-engine',
    '@codequest/game-engine',
    '@codequest/audio-engine',
    '@codequest/python-curriculum',
    '@codequest/ui',
  ],
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
};

export default nextConfig;
