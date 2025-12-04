import React from 'react';
import { EntityFilters } from '../EntityFilters';
import { UseEntityFilteringReturn } from './hooks/useEntityFiltering';

type EntityViewerHeaderProps = {
  entitiesLength: number;
  isExporting: boolean;
  onExport: () => void;
  view: 'entities' | 'json';
  setView: (view: 'entities' | 'json') => void;
  filtering: UseEntityFilteringReturn;
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
    <div className='entity-title-row'>
      <h3>📋 Extracted Entities ({entitiesLength})</h3>
      <div className='header-controls'>
        <button
          className='btn btn-primary export-btn'
          onClick={onExport}
          disabled={isExporting || entitiesLength === 0}
          title='Export all entities to Obsidian vault format'
        >
          {isExporting ? '⏳ Exporting...' : '📦 Export to Obsidian'}
        </button>
        <div className='view-toggle'>
          {view === 'entities' ? (
            <button className='toggle-btn' onClick={() => setView('json')}>
              📄 Raw Data
            </button>
          ) : (
            <button className='toggle-btn' onClick={() => setView('entities')}>
              📋 Entity View
            </button>
          )}
        </div>
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
