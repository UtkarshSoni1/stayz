import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async redirects() {
    return [
      // ── Owner pages — old flat routes → new role-grouped routes ────────────
      {
        source: "/dashboard",
        destination: "/owner/dashboard",
        permanent: true,
      },
      {
        source: "/add-listing",
        destination: "/owner/add-listing",
        permanent: true,
      },
      {
        source: "/my-listings",
        destination: "/owner/my-listings",
        permanent: true,
      },
      // ── Listing detail — old /listings-details/[id] → /listings/[id] ───────
      {
        source: "/listings-details/:id",
        destination: "/listings/:id",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
