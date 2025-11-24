import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "export",
    distDir: "out",
    images: {
        unoptimized: true,
    },
    basePath: "/petsters",
    assetPrefix: "/petsters/",
};

export default nextConfig;