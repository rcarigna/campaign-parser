import { useState } from 'react';
import { type EntityWithId } from '@/types';

// Simple toast functionality for Next.js (we'll use a basic implementation)
const toast = {
    success: (message: string) => {
        console.log('SUCCESS:', message);
        // TODO: Implement proper toast notifications for Next.js
    },
    error: (message: string) => {
        console.error('ERROR:', message);
        // TODO: Implement proper toast notifications for Next.js
    },
};

type UseEntitySelectionReturn = {
    selectedEntityIds: Set<string>;
    isSelectionMode: boolean;
    setIsSelectionMode: (mode: boolean) => void;
    handleEntitySelect: (entityId: string, isSelected: boolean) => void;
    handleMarkAsDuplicates: (entities: EntityWithId[]) => void;
    handleCancelSelection: () => void;
    clearEntitySelection: (entityId: string) => void;
};

export const useEntitySelection = (): UseEntitySelectionReturn => {
    const [selectedEntityIds, setSelectedEntityIds] = useState<Set<string>>(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);

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

        // TODO: Implement actual duplicate merging logic
        // For now, just show success message and clear the selection
        toast.success(
            `Successfully marked ${selectedEntities.length} entities as duplicates: ${selectedEntities
                .map((e) => e.title)
                .join(', ')}`
        );

        setSelectedEntityIds(new Set());
        setIsSelectionMode(false);
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
    };
};