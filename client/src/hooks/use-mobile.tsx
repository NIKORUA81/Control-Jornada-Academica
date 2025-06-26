// src/hooks/useIsMobile.ts
import { useState, useEffect } from 'react';

// Punto de quiebre estándar para dispositivos móviles (Bootstrap, Tailwind)
const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Comprueba al montar el componente
    checkDevice();

    // Añade un listener para cuando cambie el tamaño de la ventana
    window.addEventListener('resize', checkDevice);

    // Limpia el listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return isMobile;
}