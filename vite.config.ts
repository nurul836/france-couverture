import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // GitHub project Pages uses a repository subpath; Vercel stays at the root.
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [react(), tailwindcss()],
});
