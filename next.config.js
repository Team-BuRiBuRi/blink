/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    XE_ID: process.env.XE_ID,
    XE_KEY: process.env.XE_KEY,
  },
};

module.exports = nextConfig;
