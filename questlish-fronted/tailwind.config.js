/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        questlish: {
          bg: '#0d0d1a',          // Fondo oscuro principal
          card: '#16162a',        // Fondo de tarjetas
          panel: '#1f1f3a',       // Paneles y menús
          primary: '#7c3aed',     // Violeta acento
          primaryHover: '#6d28d9',
          success: '#22c55e',     // Respuesta correcta
          danger: '#ef4444',      // Respuesta incorrecta / Vidas
          text: '#f3f4f6',
          textMuted: '#9ca3af',
        }
      }
    },
  },
  plugins: [],
}