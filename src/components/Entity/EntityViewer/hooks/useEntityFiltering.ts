import { useState, useMemo } from 'react';
import { type EntityWithId, EntityKind } from '@/types';

type EntityFilterType = 'all' | EntityKind;

type UseEntityFilteringReturn = {
    filterType: EntityFilterType;
    setFilterType: (type: EntityFilterType) => void;
    showDuplicates: boolean;
    setShowDuplicates: (show: boolean) => void;
    filteredEntities: EntityWithId[];
    duplicates: EntityWithId[];
    duplicateIds: Set<string>;
    typeCounts: Record<string, number>;
};

export const useEntityFiltering = (entities: EntityWithId[]): UseEntityFilteringReturn => {
    const [filterType, setFilterType] = useState<EntityFilterType>('all');
    const [showDuplicates, setShowDuplicates] = useState(false);

    const { filteredEntities, duplicates, duplicateIds, typeCounts } = useMemo(() => {
        const filtered = filterType === 'all'
            ? entities
            : entities.filter((entity) => entity.kind === filterType);

        const duplicateGroups = new Map<string, EntityWithId[]>();
        entities?.forEach((entity) => {
            const key = `${entity.kind}-${entity.title.toLowerCase().trim()}`;
            if (!duplicateGroups.has(key)) {
                duplicateGroups.set(key, []);
            }
            duplicateGroups.get(key)!.push(entity);
        });

        const duplicates = Array.from(duplicateGroups.values())
            .filter((group) => group.length > 1)
            .flat();
        const duplicateIds = new Set(duplicates.map((d) => d.id));

        const typeCounts = entities?.reduce((acc, entity) => {
            acc[entity.kind] = (acc[entity.kind] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const displayedEntities = showDuplicates
            ? filtered.filter((e) => duplicateIds.has(e.id))
            : filtered;

        return {
            filteredEntities: displayedEntities,
            duplicates,
            duplicateIds,
            typeCounts,
        };
    }, [entities, filterType, showDuplicates]);

    return {
        filterType,
        setFilterType,
        showDuplicates,
        setShowDuplicates,
        filteredEntities,
        duplicates,
        duplicateIds,
        typeCounts,
    };
};