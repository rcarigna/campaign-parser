import { createApp } from './app';

const DEFAULT_PORT = 3001;

// Helper function to find available port
const findAvailablePort = async (startPort: number): Promise<number> => {
    const app = createApp();

    return new Promise((resolve, reject) => {
        const server = app.listen(startPort, () => {
            const port = (server.address() as any)?.port;
            server.close(() => resolve(port));
        });

        server.on('error', (err: any) => {
            if (err.code === 'EADDRINUSE') {
                resolve(findAvailablePort(startPort + 1));
            } else {
                reject(err);
            }
        });
    });
};

export const startServer = async (): Promise<void> => {
    try {
        const app = createApp();
        const preferredPort = parseInt(process.env.PORT || DEFAULT_PORT.toString());
        const port = await findAvailablePort(preferredPort);

        const server = app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
            console.log(`📊 Health check: http://localhost:${port}/api/health`);
            console.log(`📝 API endpoint: http://localhost:${port}/api/parse`);
        });

        server.on('error', (err: any) => {
            console.error('Server error:', err);
            process.exit(1);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received, shutting down gracefully...');
            server.close(() => {
                console.log('Server closed');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};