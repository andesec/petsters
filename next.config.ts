import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "export",
    distDir: "out",
    images: {
        unoptimized: true,
    },
    basePath: "/petsters/out",
    assetPrefix: "/petsters/out",
};

export default nextConfig;