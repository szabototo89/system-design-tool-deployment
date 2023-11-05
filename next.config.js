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
  env: {
    NEXTAUTH_SECRET:
      "Zc^@2f+#XJbsjL%*;&0@'15QQ$]+;bhlPX9:+Gz1<jB&u-qU3Vr9J`;WiK6d({=",
  },
  experimental: {},
};

module.exports = nextConfig;
