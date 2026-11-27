import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { securityHeaders } from "./src/lib/security-headers.js";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  preview: { headers: securityHeaders() },
  server: { headers: securityHeaders({ dev: true }), host: "127.0.0.1", port: 8080, strictPort: true },
});
