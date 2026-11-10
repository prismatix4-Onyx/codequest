import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      three: path.resolve(__dirname, 'node_modules/three'),
    };
    return config;
  },
};

export default nextConfig;
