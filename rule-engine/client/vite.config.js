// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // To listen on all network interfaces
    watch: {
      usePolling: true,  // Enable polling for file changes
    },
    hmr: {
      clientPort: 5173,  // Match your client port
    }
  }
});
