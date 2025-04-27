import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "s.gravatar.com",
      "lh3.googleusercontent.com",
      "tu-dominio-auth0.auth0.com",
    ],
  },
};

export default nextConfig;
