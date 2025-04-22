/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Add webpack configuration to handle the module resolution issue
  webpack: (config, { isServer }) => {
    // Fix for the domhandler module resolution error
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        path: false,
        "node.js": false,
      };
    }

    return config;
  },
};

export default nextConfig;
