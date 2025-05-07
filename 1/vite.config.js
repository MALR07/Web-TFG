import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Asegura que el servidor sea accesible desde fuera del contenedor
    port: 5173,
    open: false,
  },

});
