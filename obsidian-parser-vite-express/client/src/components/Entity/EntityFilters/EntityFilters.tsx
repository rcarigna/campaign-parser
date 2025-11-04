import { EntityKind } from '../../../types/constants';

type EntityFilterType = 'all' | EntityKind;

type EntityFiltersProps = {
  filterType: EntityFilterType;
  onFilterChange: (filter: EntityFilterType) => void;
  showDuplicates: boolean;
  onDuplicateToggle: (show: boolean) => void;
  typeCounts: Record<string, number>;
  totalEntities: number;
  totalDuplicates: number;
};

export const EntityFilters = ({
  filterType,
  onFilterChange,
  showDuplicates,
  onDuplicateToggle,
  typeCounts,
  totalEntities,
  totalDuplicates,
}: EntityFiltersProps): JSX.Element => {
  const getEntityIcon = (kind: EntityKind): string => {
    switch (kind) {
      case EntityKind.SESSION_SUMMARY:
        return '📜';
      case EntityKind.NPC:
        return '👤';
      case EntityKind.LOCATION:
        return '🗺️';
      case EntityKind.ITEM:
        return '⚔️';
      case EntityKind.QUEST:
        return '🎯';
      case EntityKind.PLAYER:
        return '🧙';
      case EntityKind.SESSION_PREP:
        return '📋';
      default:
        return '📄';
    }
  };

  return (
    <div className='entity-controls'>
      <div className='filter-group'>
        <label htmlFor='type-filter'>Filter by type:</label>
        <select
          id='type-filter'
          value={filterType}
          onChange={(e) => onFilterChange(e.target.value as EntityFilterType)}
          className='filter-select'
        >
          <option value='all'>All Types ({totalEntities})</option>
          {Object.entries(typeCounts).map(([type, count]) => (
            <option key={type} value={type}>
              {getEntityIcon(type as EntityKind)} {type} ({count})
            </option>
          ))}
        </select>
      </div>

      <div className='toggle-group'>
        <label className='toggle-label'>
          <input
            type='checkbox'
            checked={showDuplicates}
            onChange={(e) => onDuplicateToggle(e.target.checked)}
          />
          Show only duplicates ({totalDuplicates})
        </label>
      </div>
    </div>
  );
};
