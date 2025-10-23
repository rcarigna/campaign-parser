import multer from 'multer';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_KB } from '@obsidian-parser/shared';

const MAX_FILE_SIZE = MAX_FILE_SIZE_KB * 1024; // Convert KB to bytes

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
    const isAllowedMimeType = ALLOWED_MIME_TYPES.includes(file.mimetype as any);
    const isMarkdownFile = file.originalname.endsWith('.md');

    if (isAllowedMimeType || isMarkdownFile) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only DOC, DOCX, and MD files are allowed.'));
    }
};

export const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
    fileFilter
});

export { MAX_FILE_SIZE };