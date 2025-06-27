// client/src/setupTests.ts

// Importa matchers personalizados de jest-dom para mejorar las aserciones en pruebas de DOM.
// Ejemplos: .toBeInTheDocument(), .toHaveClass(), .toBeVisible()
import '@testing-library/jest-dom';

// Aquí puedes añadir cualquier otra configuración global para tus pruebas si es necesario.
// Por ejemplo:
// - Mocks globales para APIs (localStorage, fetch, etc.)
// - Configuración para librerías de internacionalización (i18n)
// - Limpieza global después de cada prueba (aunque Vitest y Testing Library suelen manejar esto bien)

// Ejemplo de mock global para localStorage (si fuera necesario):
/*
const localStorageMock = (function() {
  let store: { [key: string]: string } = {};
  return {
    getItem: function(key: string) {
      return store[key] || null;
    },
    setItem: function(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem: function(key: string) {
      delete store[key];
    },
    clear: function() {
      store = {};
    }
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});
*/

// Vitest también ejecuta archivos de setup definidos en `test.setupFiles`
// en un entorno donde las variables globales de Vitest (describe, it, expect) ya están disponibles.
// No necesitas importarlas aquí.
console.log('Archivo setupTests.ts cargado para Vitest.');
