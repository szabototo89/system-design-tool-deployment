/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/application",
        permanent: true,
      },
    ];
  },
  experimental: {},
};

module.exports = nextConfig;
