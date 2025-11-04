import express from 'express';
import cors from 'cors';
import { upload, errorHandler } from './middleware';
import { healthHandler, parseDocumentHandler } from './routes';

export const createApp = (): express.Application => {
    const app = express();

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Routes
    app.get('/api/health', healthHandler);
    app.post('/api/parse', upload.single('document'), parseDocumentHandler);

    // Error handling middleware (must be last)
    app.use(errorHandler);

    return app;
};