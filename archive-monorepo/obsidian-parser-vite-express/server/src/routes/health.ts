import express from 'express';

export const healthHandler = (req: express.Request, res: express.Response): void => {
    res.json({ status: 'OK', message: 'Document Parser API is running' });
};