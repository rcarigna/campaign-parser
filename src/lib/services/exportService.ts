import { initializeTemplates, processEntities } from '../templateEngine';
import type { AnyEntity } from '@/types';

/**
 * Type definitions for export results
 */
export interface ExportResult {
    files: OrganizedFile[];
    metadata: ExportMetadata;
}

export interface OrganizedFile {
    filename: string;
    content: string;
    vaultPath: string;
    fullPath: string;
    kind: string;
}

export interface ExportMetadata {
    exportDate: string;
    totalEntities: number;
    entityCounts: Record<string, number>;
    vaultStructure: VaultStructure;
}

export interface VaultStructure {
    [key: string]: string | VaultStructure;
}

/**
 * Export entities to Obsidian-formatted files with vault organization
 */
export const exportEntities = async (entities: AnyEntity[]): Promise<ExportResult> => {
    // Initialize template engine if not already done
    await initializeTemplates();

    // Process all entities into markdown
    const processedFiles = await processEntities(entities);

    // Organize files by vault structure
    const organizedFiles = organizeByVaultStructure(processedFiles);

    // Generate export metadata
    const metadata: ExportMetadata = {
        exportDate: new Date().toISOString(),
        totalEntities: entities.length,
        entityCounts: countEntitiesByType(entities),
        vaultStructure: getVaultStructure()
    };

    return {
        files: organizedFiles,
        metadata
    };
};

/**
 * Organize processed files according to Obsidian vault structure
 */
const organizeByVaultStructure = (files: Array<{ filename: string; content: string; kind: string }>): OrganizedFile[] => {
    const organized: OrganizedFile[] = [];

    for (const file of files) {
        const vaultPath = getVaultPath(file.kind);

        organized.push({
            filename: file.filename,
            content: file.content,
            vaultPath: vaultPath,
            fullPath: `${vaultPath}/${file.filename}`,
            kind: file.kind
        });
    }

    return organized;
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

/**
 * Get the vault folder structure for reference
 */
const getVaultStructure = (): VaultStructure => {
    return {
        'Campaign Vault': {
            '02_World': {
                'NPCs': 'Character files with relationships and stats',
                'Locations': 'Places, regions, and points of interest'
            },
            '04_QuestLines': 'Active and completed quests with objectives',
            '06_Items': 'Equipment, artifacts, and magical items',
            '07_Sessions': 'Session summaries and campaign narrative'
        }
    };
};