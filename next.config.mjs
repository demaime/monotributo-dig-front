/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Agregar configuración de proxy para peticiones a la API
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
          : "http://localhost:4000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
