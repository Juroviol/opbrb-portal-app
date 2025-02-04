import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
});
