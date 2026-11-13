import { fileURLToPath } from "node:url";

export default {
  output: "standalone",
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  outputFileTracingRoot: fileURLToPath(new URL("../", import.meta.url)),
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};
