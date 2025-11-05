import { NextRequest, NextResponse } from 'next/server';
import { exportEntities } from '@/lib/services/exportService';
import { type EntityWithId } from '@/types';

export const POST = async (request: NextRequest): Promise<NextResponse> => {
    try {
        const body = await request.json();
        const { entities } = body;

        if (!Array.isArray(entities)) {
            return NextResponse.json(
                { error: 'Invalid request: entities must be an array' },
                { status: 400 }
            );
        }

        // Validate entities structure
        const validatedEntities: EntityWithId[] = entities.map((entity, index) => {
            if (typeof entity !== 'object' || !entity.kind || !entity.title) {
                throw new Error(`Invalid entity at index ${index}: missing required fields`);
            }
            return entity as EntityWithId;
        });

        // Generate the export using server-side business logic
        const exportResult = await exportEntities(validatedEntities);

        return NextResponse.json({
            success: true,
            files: exportResult.files,
            metadata: exportResult.metadata,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to export entities';
        console.error('Export error:', error);
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
};