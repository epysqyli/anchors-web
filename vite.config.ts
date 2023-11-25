import solid from "solid-start/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [solid({ ssr: true })],
  server: {
    host: true,
    port: 3000
  }
});
