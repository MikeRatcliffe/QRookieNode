import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@react": resolve(__dirname, "src/react"),
      "@pages": resolve(__dirname, "src/react/pages"),
      "@bridge": resolve(__dirname, "src/react/bridge"),
      "@components": resolve(__dirname, "src/react/components"),
      "@server": resolve(__dirname, "src/server"),
      "@commands": resolve(__dirname, "src/server/commands"),
      "@main": resolve(__dirname, "src/server/main"),
    },
  },
  build: {
    outDir: "dist/react",
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  },
});
