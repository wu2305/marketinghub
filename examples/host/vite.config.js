import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* Standalone host — deliberately mounted under a non-root base so asset and
   route handling cannot rely on "/". */
export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: "/mh-host/",
  publicDir: false,
  plugins: [react()],
  build: { outDir: "dist" },
});
