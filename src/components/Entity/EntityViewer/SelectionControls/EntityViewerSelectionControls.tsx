import React from 'react';

type EntityViewerSelectionControlsProps = {
  isSelectionMode: boolean;
  selectedEntityCount: number;
  onMarkDuplicates: () => void;
  onCancelSelection: () => void;
  onSelectDuplicates: () => void;
};

export const EntityViewerSelectionControls: React.FC<
  EntityViewerSelectionControlsProps
> = ({
  isSelectionMode,
  selectedEntityCount,
  onMarkDuplicates,
  onCancelSelection,
  onSelectDuplicates,
}) => (
  <div className='entity-actions'>
    {!isSelectionMode ? (
      <button onClick={onSelectDuplicates} className='btn btn-outline'>
        Select Duplicates
      </button>
    ) : (
      <div className='selection-controls'>
        <button
          onClick={onMarkDuplicates}
          disabled={selectedEntityCount < 2}
          className='btn btn-primary'
          data-testid='mark-duplicates'
        >
          Mark {selectedEntityCount} as Duplicates
        </button>
        <button
          onClick={onCancelSelection}
          className='btn btn-secondary'
          data-testid='cancel-selection'
        >
          Cancel
        </button>
        <p className='selection-help'>
          Select entities to mark as duplicates. Selected: {selectedEntityCount}
        </p>
      </div>
    )}
  </div>
);
