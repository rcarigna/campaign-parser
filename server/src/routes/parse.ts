import express from 'express';
import { parseDocument } from '../services';

export const parseDocumentHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const result = await parseDocument(req.file);

        // For markdown documents, enhance the response with entity extraction
        if (result.type === 'markdown' && 'raw' in result.content) {
            const { extractEntities } = await import('../services/entityExtractor');
            const entities = extractEntities(result.content);

            // Return enhanced response with entities
            res.json({
                ...result,
                entities  // Add entities to the response without changing the core ParsedDocument type
            });
        } else {
            // For other document types, return the standard parsed document
            res.json(result);
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to parse document';
        console.error('Parse error:', error);
        res.status(500).json({ error: errorMessage });
    }
};