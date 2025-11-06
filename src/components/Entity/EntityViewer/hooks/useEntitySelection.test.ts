import { renderHook, act } from '@testing-library/react';
import toast from 'react-hot-toast';
import { useEntitySelection } from './useEntitySelection';
import { EntityKind, type EntityWithId } from '@/types';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
    error: jest.fn(),
}));

const mockToast = toast as jest.Mocked<typeof toast>;

describe('useEntitySelection', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockEntities: EntityWithId[] = [
        { id: '1', title: 'Entity 1', kind: EntityKind.PLAYER, content: 'Content 1', character_name: 'Player Character 1' } as EntityWithId,
        { id: '2', title: 'Entity 2', kind: EntityKind.LOCATION, content: 'Content 2' } as EntityWithId,
        { id: '3', title: 'Entity 3', kind: EntityKind.ITEM, content: 'Content 3' } as EntityWithId,
    ];

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useEntitySelection());

        expect(result.current.selectedEntityIds.size).toBe(0);
        expect(result.current.isSelectionMode).toBe(false);
        expect(result.current.mergeModalEntities).toBe(null);
    });

    it('should toggle selection mode', () => {
        const { result } = renderHook(() => useEntitySelection());

        act(() => {
            result.current.setIsSelectionMode(true);
        });

        expect(result.current.isSelectionMode).toBe(true);

        act(() => {
            result.current.setIsSelectionMode(false);
        });

        expect(result.current.isSelectionMode).toBe(false);
    });

    describe('handleEntitySelect', () => {
        it('should add entity to selection when isSelected is true', () => {
            const { result } = renderHook(() => useEntitySelection());

            act(() => {
                result.current.handleEntitySelect('1', true);
            });

            expect(result.current.selectedEntityIds.has('1')).toBe(true);
            expect(result.current.selectedEntityIds.size).toBe(1);
        });

        it('should remove entity from selection when isSelected is false', () => {
            const { result } = renderHook(() => useEntitySelection());

            // First add an entity
            act(() => {
                result.current.handleEntitySelect('1', true);
            });

            expect(result.current.selectedEntityIds.has('1')).toBe(true);

            // Then remove it
            act(() => {
                result.current.handleEntitySelect('1', false);
            });

            expect(result.current.selectedEntityIds.has('1')).toBe(false);
            expect(result.current.selectedEntityIds.size).toBe(0);
        });

        it('should handle multiple entity selections', () => {
            const { result } = renderHook(() => useEntitySelection());

            act(() => {
                result.current.handleEntitySelect('1', true);
                result.current.handleEntitySelect('2', true);
                result.current.handleEntitySelect('3', true);
            });

            expect(result.current.selectedEntityIds.size).toBe(3);
            expect(result.current.selectedEntityIds.has('1')).toBe(true);
            expect(result.current.selectedEntityIds.has('2')).toBe(true);
            expect(result.current.selectedEntityIds.has('3')).toBe(true);
        });
    });

    describe('handleMarkAsDuplicates', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('should show error when less than 2 entities are selected', () => {
            const { result } = renderHook(() => useEntitySelection());

            act(() => {
                result.current.handleEntitySelect('1', true);
                result.current.handleMarkAsDuplicates(mockEntities);
            });

            expect(mockToast.error).toHaveBeenCalledWith('Please select at least 2 entities to mark as duplicates');
            expect(result.current.mergeModalEntities).toBe(null);
        });

        it('should show error when no entities are selected', () => {
            const { result } = renderHook(() => useEntitySelection());

            act(() => {
                result.current.handleMarkAsDuplicates(mockEntities);
            });

            expect(mockToast.error).toHaveBeenCalledWith('Please select at least 2 entities to mark as duplicates');
            expect(result.current.mergeModalEntities).toBe(null);
        });

        it('should set merge modal entities when 2 or more entities are selected', () => {
            const { result } = renderHook(() => useEntitySelection());

            act(() => {
                result.current.handleEntitySelect('1', true);
                result.current.handleEntitySelect('2', true);
            });

            act(() => {
                result.current.handleMarkAsDuplicates(mockEntities);
            });

            expect(mockToast.error).not.toHaveBeenCalled();
            expect(result.current.mergeModalEntities).toEqual([
                mockEntities[0],
                mockEntities[1],
            ]);
        });

        it('should filter selected entities correctly', () => {
            const { result } = renderHook(() => useEntitySelection());

            act(() => {
                result.current.handleEntitySelect('1', true);
                result.current.handleEntitySelect('3', true);
            });
            act(() => {
                result.current.handleMarkAsDuplicates(mockEntities);
            });

            expect(result.current.mergeModalEntities).toEqual([
                mockEntities[0],
                mockEntities[2],
            ]);
        });
    });

    describe('handleCancelSelection', () => {
        it('should clear selected entities and exit selection mode', () => {
            const { result } = renderHook(() => useEntitySelection());

            // Setup some selected entities and selection mode
            act(() => {
                result.current.handleEntitySelect('1', true);
                result.current.handleEntitySelect('2', true);
                result.current.setIsSelectionMode(true);
            });

            expect(result.current.selectedEntityIds.size).toBe(2);
            expect(result.current.isSelectionMode).toBe(true);

            act(() => {
                result.current.handleCancelSelection();
            });

            expect(result.current.selectedEntityIds.size).toBe(0);
            expect(result.current.isSelectionMode).toBe(false);
        });
    });

    describe('clearEntitySelection', () => {
        it('should remove specific entity from selection', () => {
            const { result } = renderHook(() => useEntitySelection());

            act(() => {
                result.current.handleEntitySelect('1', true);
                result.current.handleEntitySelect('2', true);
                result.current.handleEntitySelect('3', true);
            });

            expect(result.current.selectedEntityIds.size).toBe(3);

            act(() => {
                result.current.clearEntitySelection('2');
            });

            expect(result.current.selectedEntityIds.size).toBe(2);
            expect(result.current.selectedEntityIds.has('1')).toBe(true);
            expect(result.current.selectedEntityIds.has('2')).toBe(false);
            expect(result.current.selectedEntityIds.has('3')).toBe(true);
        });

        it('should handle clearing non-existent entity gracefully', () => {
            const { result } = renderHook(() => useEntitySelection());

            act(() => {
                result.current.handleEntitySelect('1', true);
            });

            expect(result.current.selectedEntityIds.size).toBe(1);

            act(() => {
                result.current.clearEntitySelection('non-existent');
            });

            expect(result.current.selectedEntityIds.size).toBe(1);
            expect(result.current.selectedEntityIds.has('1')).toBe(true);
        });
    });

    describe('setMergeModalEntities', () => {
        it('should set merge modal entities', () => {
            const { result } = renderHook(() => useEntitySelection());

            act(() => {
                result.current.setMergeModalEntities(mockEntities);
            });

            expect(result.current.mergeModalEntities).toEqual(mockEntities);
        });

        it('should clear merge modal entities when set to null', () => {
            const { result } = renderHook(() => useEntitySelection());

            act(() => {
                result.current.setMergeModalEntities(mockEntities);
            });

            expect(result.current.mergeModalEntities).toEqual(mockEntities);

            act(() => {
                result.current.setMergeModalEntities(null);
            });

            expect(result.current.mergeModalEntities).toBe(null);
        });
    });
});