import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/data-api": {
        target: "http://localhost:4280", // your backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/data-api/, ""),
      },
    },
  },
});
