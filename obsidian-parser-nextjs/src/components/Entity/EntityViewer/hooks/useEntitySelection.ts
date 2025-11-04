import { useState } from 'react';
import toast from 'react-hot-toast';
import { type EntityWithId } from '@/types';

type UseEntitySelectionReturn = {
    selectedEntityIds: Set<string>;
    isSelectionMode: boolean;
    setIsSelectionMode: (mode: boolean) => void;
    handleEntitySelect: (entityId: string, isSelected: boolean) => void;
    handleMarkAsDuplicates: (entities: EntityWithId[]) => void;
    handleCancelSelection: () => void;
    clearEntitySelection: (entityId: string) => void;
    mergeModalEntities: EntityWithId[] | null;
    setMergeModalEntities: (entities: EntityWithId[] | null) => void;
};

export const useEntitySelection = (): UseEntitySelectionReturn => {
    const [selectedEntityIds, setSelectedEntityIds] = useState<Set<string>>(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [mergeModalEntities, setMergeModalEntities] = useState<EntityWithId[] | null>(null);

    const handleEntitySelect = (entityId: string, isSelected: boolean): void => {
        setSelectedEntityIds((prev) => {
            const newSet = new Set(prev);
            if (isSelected) {
                newSet.add(entityId);
            } else {
                newSet.delete(entityId);
            }
            return newSet;
        });
    };

    const handleMarkAsDuplicates = (entities: EntityWithId[]): void => {
        if (selectedEntityIds.size < 2) {
            toast.error('Please select at least 2 entities to mark as duplicates');
            return;
        }

        const selectedEntities = entities.filter((e) => selectedEntityIds.has(e.id));

        // Open merge modal with selected entities
        setMergeModalEntities(selectedEntities);
    };

    const handleCancelSelection = (): void => {
        setSelectedEntityIds(new Set());
        setIsSelectionMode(false);
    };

    const clearEntitySelection = (entityId: string): void => {
        setSelectedEntityIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(entityId);
            return newSet;
        });
    };

    return {
        selectedEntityIds,
        isSelectionMode,
        setIsSelectionMode,
        handleEntitySelect,
        handleMarkAsDuplicates,
        handleCancelSelection,
        clearEntitySelection,
        mergeModalEntities,
        setMergeModalEntities,
    };
};