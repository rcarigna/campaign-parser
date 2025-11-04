import express from 'express';
import multer from 'multer';
import { MAX_FILE_SIZE } from './upload';

export const errorHandler = (error: unknown, req: express.Request, res: express.Response, next: express.NextFunction): void => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            res.status(400).json({ error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.` });
            return;
        }
    }

    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
};