import React, { useCallback } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { EntityFilters } from '../../EntityFilters';
import { UseEntityFilteringReturn } from '../hooks/useEntityFiltering';
import IconButton from '@mui/material/IconButton';
import { Box, Typography } from '@mui/material';

export type EntityViewerHeaderProps = {
  entitiesLength: number;
  isExporting: boolean;
  onExport: () => void;
  view: 'entities' | 'json';
  setView: (view: 'entities' | 'json') => void;
  filtering: UseEntityFilteringReturn;
};

const ViewToggle = ({
  view,
  setView,
}: {
  view: 'entities' | 'json';
  setView: (view: 'entities' | 'json') => void;
}) => {
  const handleViewToggle = useCallback(
    (_: React.MouseEvent<HTMLElement>, newView: 'entities' | 'json' | null) => {
      console.log('Toggling view to:', newView);
      if (newView !== null) {
        setView(newView);
      }
    },
    [setView]
  );
  return (
    <ToggleButtonGroup value={view} exclusive onChange={handleViewToggle}>
      <ToggleButton value='entities'>📋 Entity View</ToggleButton>
      <ToggleButton value='json'>📄 Raw Data</ToggleButton>
    </ToggleButtonGroup>
  );
};

export const EntityViewerHeader: React.FC<EntityViewerHeaderProps> = ({
  entitiesLength,
  isExporting,
  onExport,
  view,
  setView,
  filtering,
}) => (
  <Box className='entity-header'>
    <Box className='entity-title-row'>
      <Typography variant='h3' className='flex-shrink-0 whitespace-nowrap'>
        📋 Extracted Entities ({entitiesLength})
      </Typography>
      <Box className='header-controls flex items-center gap-6 w-full justify-between'>
        <Box title='Export all entities to Obsidian vault format'>
          <IconButton
            color='primary'
            onClick={onExport}
            disabled={isExporting || entitiesLength === 0}
            size='large'
            aria-label='Export to Obsidian'
          >
            <FileDownloadIcon />
          </IconButton>
        </Box>
        <ViewToggle view={view} setView={setView} />
      </Box>
    </Box>
    {view === 'entities' && (
      <EntityFilters
        filterType={filtering.filterType}
        onFilterChange={filtering.setFilterType}
        showDuplicates={filtering.showDuplicates}
        onDuplicateToggle={filtering.setShowDuplicates}
        typeCounts={filtering.typeCounts}
        totalEntities={entitiesLength}
        totalDuplicates={filtering.duplicates.length}
      />
    )}
  </Box>
);
