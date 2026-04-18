// Vite config to build the standalone pet overlay for Electron.
// Produces a single JS bundle + CSS that pet.html can load directly.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "pet-dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "pet-entry.tsx"),
      output: {
        entryFileNames: "pet-bundle.js",
        assetFileNames: "pet-bundle[extname]",
        format: "es",
      },
    },
  },
  base: "./",
});
