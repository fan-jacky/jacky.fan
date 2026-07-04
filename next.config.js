/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath: '',
  output: 'standalone',
  env: {
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
  },
  reactStrictMode: true,
  turbopack: {},
  // Proxy CMS API requests to the internal CMS container
  async rewrites() {
    // Use internal Docker network hostname (not public URL)
    const cmsInternalUrl = 'http://cms:3000'
    return [
      {
        source: '/api/:path*',
        has: [
          {
            type: 'query',
            key: '_cms_proxy',
            value: '1',
          },
        ],
        destination: `${cmsInternalUrl}/api/:path*`,
      },
      {
        // Proxy media files through to CMS
        source: '/api/media/:path*',
        destination: `${cmsInternalUrl}/api/media/:path*`,
      },
    ]
  },
  webpack: function (config) {
    config.module.rules.push({
      test: /\.md$/,
      type: "asset/source",
    });
    return config;
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.STRAPI_HOSTNAME || "localhost",
        port: process.env.STRAPI_PORT || "1337",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      // Allow Payload CMS media over HTTP (local dev)
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");

if (process.env.NODE_ENV !== "production") {
  initOpenNextCloudflareForDev();
}

module.exports = nextConfig;
