// client/vitest.config.ts
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config'; // Importa la configuración de Vite existente

export default mergeConfig(
  viteConfig, // Combina con la configuración de Vite para heredar plugins (como react()), alias, etc.
  defineConfig({
    test: {
      globals: true, // Permite usar `describe`, `it`, `expect`, etc., sin importarlos explícitamente.
      environment: 'jsdom', // Simula un entorno de navegador con JSDOM para pruebas de UI.
      setupFiles: './src/setupTests.ts', // Ruta al archivo de configuración de pruebas.
      css: true, // Habilita el procesamiento de CSS si tus componentes los importan.
      // Opcional: para incluir archivos de prueba con diferentes patrones
      // include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    },
  })
);
