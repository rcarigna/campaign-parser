import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { parseDocument } from './services/documentParser';

// Configuration constants
const DEFAULT_PORT = 3001;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit
const ALLOWED_MIME_TYPES = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/markdown',
    'text/plain'
] as const;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
    const isAllowedMimeType = ALLOWED_MIME_TYPES.includes(file.mimetype as any);
    const isMarkdownFile = file.originalname.endsWith('.md');

    if (isAllowedMimeType || isMarkdownFile) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only DOC, DOCX, and MD files are allowed.'));
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
    fileFilter
});

// Routes
const healthHandler = (req: express.Request, res: express.Response): void => {
    res.json({ status: 'OK', message: 'Document Parser API is running' });
};

const parseDocumentHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const result = await parseDocument(req.file);
        res.json(result);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to parse document';
        console.error('Parse error:', error);
        res.status(500).json({ error: errorMessage });
    }
};

app.get('/api/health', healthHandler);
app.post('/api/parse', upload.single('document'), parseDocumentHandler);

// Error handling middleware
const errorHandler = (error: unknown, req: express.Request, res: express.Response, next: express.NextFunction): void => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            res.status(400).json({ error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.` });
            return;
        }
    }

    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
};

// Helper function to find available port
const findAvailablePort = async (startPort: number): Promise<number> => {
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

const startServer = async (): Promise<void> => {
    try {
        const preferredPort = parseInt(process.env.PORT || DEFAULT_PORT.toString());
        const port = await findAvailablePort(preferredPort);

        app.use(errorHandler);

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

startServer();