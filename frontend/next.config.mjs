import { fileURLToPath } from "node:url";

export default {
  output: "standalone",
  distDir: process.env.WISEN_E2E_DEV === "1" ? ".next/e2e" : ".next",
  deploymentId: process.env.DEPLOYMENT_VERSION,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/auth",
        headers: [
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  outputFileTracingRoot: fileURLToPath(new URL("../", import.meta.url)),
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};
