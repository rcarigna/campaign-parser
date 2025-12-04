import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { EntityFilters } from '../../EntityFilters';
import { UseEntityFilteringReturn } from '../hooks/useEntityFiltering';
import IconButton from '@mui/material/IconButton';

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
  return (
    <ToggleButtonGroup>
      <ToggleButton
        value='entities'
        selected={view === 'entities'}
        onClick={() => setView('entities')}
      >
        📋 Entity View
      </ToggleButton>
      <ToggleButton
        value='json'
        selected={view === 'json'}
        onClick={() => setView('json')}
      >
        📄 Raw Data
      </ToggleButton>
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
  <div className='entity-header'>
    {/* <div className='entity-title-row flex items-center justify-between gap-4'> */}
    <div className='entity-title-row'>
      <h3 className='flex-shrink-0 whitespace-nowrap'>
        📋 Extracted Entities ({entitiesLength})
      </h3>
      <div className='header-controls flex items-center gap-6 w-full justify-between'>
        <span title='Export all entities to Obsidian vault format'>
          <IconButton
            color='primary'
            onClick={onExport}
            disabled={isExporting || entitiesLength === 0}
            size='large'
            aria-label='Export to Obsidian'
          >
            <FileDownloadIcon />
          </IconButton>
        </span>
        <ViewToggle view={view} setView={setView} />
      </div>
    </div>
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
  </div>
);
