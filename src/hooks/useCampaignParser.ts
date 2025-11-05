import { useState, useCallback, useEffect } from 'react';
import { uploadDocument } from '@/lib/clients';
import { type SerializedParsedDocumentWithEntities, type AnyEntity, type EntityWithId } from '@/types';

type UseCampaignParserReturn = {
    parsedData: SerializedParsedDocumentWithEntities | null;
    entities: EntityWithId[];
    loading: boolean;
    error: string | null;
    processDocument: (file: File) => Promise<void>;
    discardEntity: (entityId: string) => void;
    mergeEntities: (primaryEntity: EntityWithId, duplicateIds: string[]) => void;
    restoreEntities: () => void;
    clearResults: () => void;
    clearError: () => void;
};

export const useCampaignParser = (): UseCampaignParserReturn => {
    const [parsedData, setParsedData] = useState<SerializedParsedDocumentWithEntities | null>(null);
    const [entities, setEntities] = useState<EntityWithId[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Update entities when parsedData changes
    useEffect(() => {
        if (!parsedData?.entities) {
            setEntities([]);
            return;
        }

        const entitiesWithIds = parsedData.entities.map((entity, index) => {
            const anyEntity = entity as AnyEntity;
            return {
                ...anyEntity,
                id: `${anyEntity.kind}-${index}`,
            } as EntityWithId;
        });

        setEntities(entitiesWithIds);
    }, [parsedData]);

    const processDocument = useCallback(async (file: File): Promise<void> => {
        setLoading(true);
        setError(null);
        setParsedData(null);

        try {
            const result = await uploadDocument(file);
            setParsedData(result);
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(errorMessage);
            console.error('Document processing error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const discardEntity = useCallback((entityId: string): void => {
        setEntities((prev) => prev.filter((entity) => entity.id !== entityId));
    }, []);

    const mergeEntities = useCallback((primaryEntity: EntityWithId, duplicateIds: string[]): void => {
        setEntities((prev) => {
            // Remove all entities in duplicateIds list
            const filtered = prev.filter((entity) => !duplicateIds.includes(entity.id));

            // Update the primary entity (it might have been modified with merged data)
            const primaryIndex = filtered.findIndex((entity) => entity.id === primaryEntity.id);
            if (primaryIndex >= 0) {
                filtered[primaryIndex] = primaryEntity;
            } else {
                // If primary entity wasn't in the filtered list, add it
                filtered.push(primaryEntity);
            }

            return filtered;
        });
    }, []);

    const restoreEntities = useCallback((): void => {
        if (!parsedData?.entities) {
            setEntities([]);
            return;
        }

        const entitiesWithIds = parsedData.entities.map((entity, index) => {
            const anyEntity = entity as AnyEntity;
            return {
                ...anyEntity,
                id: `${anyEntity.kind}-${index}`,
            } as EntityWithId;
        });

        setEntities(entitiesWithIds);
    }, [parsedData]);

    const clearResults = useCallback((): void => {
        setParsedData(null);
        setEntities([]);
        setError(null);
    }, []);

    const clearError = useCallback((): void => {
        setError(null);
    }, []);

    return {
        parsedData,
        entities,
        loading,
        error,
        processDocument,
        discardEntity,
        mergeEntities,
        restoreEntities,
        clearResults,
        clearError,
    };
};