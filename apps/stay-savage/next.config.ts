import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Point at the monorepo root (where node_modules/next lives),
    // not /Users/syednizam which has an unrelated package-lock.json
    root: path.resolve(__dirname, "../.."),
  },
};

export default nextConfig;
