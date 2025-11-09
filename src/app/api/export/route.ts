import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import { initializeTemplates, processEntities } from '@/lib/templateEngine';
import { type EntityWithId, type AnyEntity } from '@/types';

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

        // Create ZIP file
        const zip = new JSZip();
        const vaultName = 'Campaign Vault';

        // Add each file to the ZIP with proper folder structure
        for (const file of processedFiles) {
            const vaultPath = getVaultPath(file.kind);
            const fullPath = `${vaultName}/${vaultPath}/${file.filename}`;
            zip.file(fullPath, file.content);
        }

        // Add a README to the root
        const readmeContent = `# Campaign Vault Export

Exported on: ${new Date().toISOString()}
Total Entities: ${validatedEntities.length}

## Folder Structure

- **02_World/NPCs**: Non-player characters
- **02_World/Locations**: Places and regions
- **04_QuestLines**: Quests and objectives
- **06_Items**: Equipment and artifacts
- **07_Sessions**: Session summaries

Import this vault into Obsidian to view your campaign data.
`;
        zip.file(`${vaultName}/README.md`, readmeContent);

        // Generate the ZIP file as a blob
        const zipBlob = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 9 }
        });

        // Convert blob to buffer for NextResponse
        const arrayBuffer = await zipBlob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Return the ZIP file
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': 'attachment; filename="obsidian-vault.zip"',
            },
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
        'session_summary': '07_Sessions',
        'player': '02_World/Players',
        'session_prep': '07_Sessions/Prep'
    };
    return pathMap[kind] || '99_Misc';
};