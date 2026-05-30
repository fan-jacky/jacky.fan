/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath: '',
  output: 'standalone',
  env: {
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
  },
  reactStrictMode: true,
  turbopack: {},
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
