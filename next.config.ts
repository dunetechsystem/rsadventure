import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Fotos e vídeos dos passeios vêm do DunasTour (api.dunastour.com.br/uploads/...).
    remotePatterns: [
      { protocol: "https", hostname: "api.dunastour.com.br", pathname: "/uploads/**" },
      { protocol: "http", hostname: "api.dunastour.com.br", pathname: "/uploads/**" },
      { protocol: "http", hostname: "localhost", pathname: "/uploads/**" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
