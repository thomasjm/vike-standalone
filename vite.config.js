import react from '@vitejs/plugin-react'
import ssr from 'vike/plugin'
import { defineConfig } from "vite";

export default defineConfig(async (env) => ({
  plugins: [
    react(),
    ssr(),
    {
      name: "no-external-vike",
      config(config, _env) {
        if (env.ssrBuild) config.ssr.external = [];
      },
    }
  ],

  ssr: env.ssrBuild ? {
    external: [],
    noExternal: /^(?!(process))/,
  } : {},

  build: {
    rollupOptions: {
      input: env.ssrBuild ? {
        index: "server/index_prod.js",
      } : {},

      output: {
        strict: false,
      },
    },
  },
}));
