import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Imagem Docker enxuta: .next/standalone já traz o server.js e só o node_modules que ele usa.
  output: "standalone",
  // Fontes, selo e fundo dos cards de compartilhamento (lib/og-card) são lidos do disco em runtime.
  outputFileTracingIncludes: { "/**": ["./src/assets/**"] },
  images: {
    // Fotos e vídeos dos passeios vêm do DunasTour (api.dunastour.com.br/uploads/...).
    remotePatterns: [
      { protocol: "https", hostname: "api.dunastour.com.br", pathname: "/uploads/**" },
      { protocol: "http", hostname: "api.dunastour.com.br", pathname: "/uploads/**" },
      { protocol: "http", hostname: "localhost", pathname: "/uploads/**" },
    ],
  },
  async redirects() {
    // Uma só versão do site para o Google: www -> domínio sem www (301).
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.rsadventure.tur.br" }],
        destination: "https://rsadventure.tur.br/:path*",
        permanent: true,
      },
    ];
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
