const { version } = require("./package.json");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  reactStrictMode: false,
  env: {
    APP_ENV: process.env.APP_ENV || "production",
    NEXT_PUBLIC_DASHBOARD_VERSION:
      process.env.NEXT_PUBLIC_DASHBOARD_VERSION || version,
  },
};

module.exports = nextConfig;
