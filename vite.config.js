import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' sorgt für relative Pfade – die Seite funktioniert damit
// auf GitHub Pages unabhängig vom Namen des Repositories.
export default defineConfig({
  base: './',
  plugins: [react()],
});
