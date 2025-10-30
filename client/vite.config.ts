import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
        plugins: [react()],
        server: {
            port: 3000,
            strictPort: false, // Allow port to increment if 3000 is in use
            open: true, // Auto-open browser
            proxy: {
                '/api': {
                    target: env.VITE_API_URL || 'http://localhost:3005',
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
    }
});