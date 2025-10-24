import express from 'express';
import { parseDocument } from '../services';

export const extractEntitiesHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        // Parse the document first
        const parsedDocument = await parseDocument(req.file);

        // Then extract entities separately for markdown documents
        if (parsedDocument.type === 'markdown' && 'raw' in parsedDocument.content) {
            const { extractEntities } = await import('../services/entityExtractor');
            const entities = extractEntities(parsedDocument.content);
            res.json({ entities });
        } else {
            // For non-markdown documents, return empty entities
            res.json({ entities: [] });
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to extract entities';
        console.error('Extract error:', error);
        res.status(500).json({ error: errorMessage });
    }
};
