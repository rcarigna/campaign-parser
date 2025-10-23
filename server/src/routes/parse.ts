import express from 'express';
import { parseDocument } from '../services';

export const parseDocumentHandler = async (req: express.Request, res: express.Response): Promise<void> => {
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