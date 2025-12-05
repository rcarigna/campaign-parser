import { Box, Button, Typography } from '@mui/material';
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
  <Box className='entity-actions'>
    {!isSelectionMode ? (
      <Button onClick={onSelectDuplicates} className='btn btn-outline'>
        Select Duplicates
      </Button>
    ) : (
      <Box className='selection-controls'>
        <Button
          onClick={onMarkDuplicates}
          disabled={selectedEntityCount < 2}
          className='btn btn-primary'
          data-testid='mark-duplicates'
        >
          Mark {selectedEntityCount} as Duplicates
        </Button>
        <Button
          onClick={onCancelSelection}
          className='btn btn-secondary'
          data-testid='cancel-selection'
        >
          Cancel
        </Button>
        <Typography className='selection-help'>
          Select entities to mark as duplicates. Selected: {selectedEntityCount}
        </Typography>
      </Box>
    )}
  </Box>
);
