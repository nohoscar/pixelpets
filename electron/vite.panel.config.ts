// Vite config to build the standalone panel for Electron.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "panel-dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "panel.html"),
    },
  },
  base: "./",
});
