/* eslint-disable no-undef */
import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@hooks',
        replacement: resolve(__dirname, 'src/hooks'),
      },
      {
        find: '@utils',
        replacement: resolve(__dirname, 'src/utils'),
      },
      {
        find: '@dto',
        replacement: resolve(__dirname, 'src/dto'),
      },
      {
        find: '@config',
        replacement: resolve(__dirname, 'src/config'),
      },
      {
        find: '@components',
        replacement: resolve(__dirname, 'src/admin/components'),
      },
      {
        find: '@lists',
        replacement: resolve(__dirname, 'src/lists'),
      },
    ],
  },
  plugins: [react()],
});
