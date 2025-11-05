import { NextRequest, NextResponse } from 'next/server';
import { initializeTemplates, processEntities } from '@/lib/templateEngine';
import { type EntityWithId, type AnyEntity } from '@/types';

// Types for the export response
interface OrganizedFile {
    filename: string;
    content: string;
    vaultPath: string;
    fullPath: string;
    kind: string;
}

interface ExportMetadata {
    exportDate: string;
    totalEntities: number;
    entityCounts: Record<string, number>;
    vaultStructure: Record<string, unknown>;
}

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

        // Initialize templates and process entities
        await initializeTemplates();
        const processedFiles = await processEntities(validatedEntities as AnyEntity[]);

        // Organize files by vault structure
        const organizedFiles: OrganizedFile[] = processedFiles.map(file => {
            const vaultPath = getVaultPath(file.kind);
            return {
                filename: file.filename,
                content: file.content,
                vaultPath,
                fullPath: `${vaultPath}/${file.filename}`,
                kind: file.kind
            };
        });

        // Generate metadata
        const metadata: ExportMetadata = {
            exportDate: new Date().toISOString(),
            totalEntities: validatedEntities.length,
            entityCounts: countEntitiesByType(validatedEntities),
            vaultStructure: {
                'Campaign Vault': {
                    '02_World': {
                        'NPCs': 'Character files with relationships and stats',
                        'Locations': 'Places, regions, and points of interest'
                    },
                    '04_QuestLines': 'Active and completed quests with objectives',
                    '06_Items': 'Equipment, artifacts, and magical items',
                    '07_Sessions': 'Session summaries and campaign narrative'
                }
            }
        };

        return NextResponse.json({
            success: true,
            files: organizedFiles,
            metadata,
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

/**
 * Get the vault folder path for an entity kind
 */
const getVaultPath = (kind: string): string => {
    const pathMap: Record<string, string> = {
        'npc': '02_World/NPCs',
        'location': '02_World/Locations',
        'item': '06_Items',
        'quest': '04_QuestLines',
        'session_summary': '07_Sessions'
    };
    return pathMap[kind] || '99_Misc';
};

/**
 * Count entities by type for metadata
 */
const countEntitiesByType = (entities: AnyEntity[]): Record<string, number> => {
    const counts: Record<string, number> = {};
    for (const entity of entities) {
        counts[entity.kind] = (counts[entity.kind] || 0) + 1;
    }
    return counts;
};