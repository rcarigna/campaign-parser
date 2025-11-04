import fs from 'fs';
import path from 'path';
import { AllowedMimeType } from '@obsidian-parser/shared';

export const createMockFileFromTestData = (filename: string, mimetype: string = AllowedMimeType.MARKDOWN): Express.Multer.File => {
    const testDataPath = path.join(__dirname, '../../../test_data', filename);
    const fileContent = fs.readFileSync(testDataPath);

    return {
        fieldname: 'document',
        originalname: filename,
        encoding: '7bit',
        mimetype,
        buffer: fileContent,
        size: fileContent.length,
        destination: '',
        filename,
        path: '',
        stream: {} as any,
    };
};

export const getTestDataContent = (filename: string): string => {
    const testDataPath = path.join(__dirname, '../../../test_data', filename);
    return fs.readFileSync(testDataPath, 'utf-8');
};

export const testDataFiles = {
    SESSION_SUMMARY: 'session_summary_1.md',
    // Add more test files as they're created
} as const;