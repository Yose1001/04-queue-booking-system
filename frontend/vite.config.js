import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // ตอน dev (npm run dev) ให้ส่ง /api ไปหา backend ใน Docker ที่ port 5001
    proxy: {
      '/api': 'http://localhost:5001',
    },
  },
});
