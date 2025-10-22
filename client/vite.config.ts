import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        strictPort: false, // Allow port to increment if 3000 is in use
        open: true, // Auto-open browser
        proxy: {
            '/api': {
                target: process.env.VITE_API_URL || 'http://localhost:3005',
                changeOrigin: true,
                secure: false,
                configure: (proxy, options) => {
                    // Log proxy requests for debugging
                    proxy.on('proxyReq', (proxyReq, req, res) => {
                        console.log('Proxying request:', req.method, req.url, '→', options.target + req.url);
                    });
                }
            }
        }
    },
    preview: {
        port: 3000,
        strictPort: false
    }
})