/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_HELIUS_RPC: process.env.HELIUS_RPC,
  },
};
module.exports = nextConfig;
