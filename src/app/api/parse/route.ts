import { NextRequest, NextResponse } from 'next/server';
import { parseDocument } from '@/lib/services/documentParser';
import { extractEntitiesRegex } from '@/lib/services/entityExtractor';
import { DocumentType } from '@/types';

export async function POST(request: NextRequest) {
    try {
        // Parse the multipart/form-data
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Convert File to Buffer for processing
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create file object compatible with parseDocument
        const fileObj = {
            originalname: file.name,
            mimetype: file.type,
            size: file.size,
            buffer: buffer
        };

        const result = await parseDocument(fileObj);

        // For markdown documents, enhance the response with entity extraction
        if (result.type === DocumentType.MARKDOWN && 'raw' in result.content) {
            const entities = extractEntitiesRegex(result.content, file.name);

            // Return enhanced response with entities
            return NextResponse.json({
                ...result,
                entities  // Add entities to the response
            });
        } else {
            // For other document types, return the standard parsed document
            return NextResponse.json(result);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to parse document';
        console.error('Parse error:', error);
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}