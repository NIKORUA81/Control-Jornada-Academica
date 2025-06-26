// vite.config.ts

import path from "path" // <-- Paso 1: Importa 'path'
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: { // <-- Paso 2: Añade esta sección completa
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})