import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { parseDocument } from '@/lib/documentParser';
import { extractEntitiesRegex } from '@/lib/entityExtractor';
import { DocumentType } from '@/types';

export async function GET() {
    try {
        // Read the example session note from __mocks__
        const filePath = join(process.cwd(), '__mocks__', 'session_summary_1', 'session_summary_1.md');
        const fileContent = await readFile(filePath, 'utf-8');
        
        // Convert the file content to a buffer for processing
        const buffer = Buffer.from(fileContent, 'utf-8');
        
        // Create file object compatible with parseDocument
        const fileObj = {
            originalname: 'session_summary_1.md',
            mimetype: 'text/markdown',
            size: buffer.length,
            buffer: buffer
        };

        const result = await parseDocument(fileObj);

        // For markdown documents, enhance the response with entity extraction
        if (result.type === DocumentType.MARKDOWN && 'raw' in result.content) {
            const entities = extractEntitiesRegex(result.content, 'session_summary_1.md');

            // Return enhanced response with entities and raw markdown
            return NextResponse.json({
                ...result,
                entities,
                rawMarkdown: fileContent  // Include raw markdown for display
            });
        } else {
            // For other document types, return the standard parsed document
            return NextResponse.json({
                ...result,
                rawMarkdown: fileContent
            });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load demo data';
        console.error('Demo load error:', error);
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
