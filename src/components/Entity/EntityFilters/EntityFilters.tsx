import { Box, MenuItem, InputLabel, Select, Checkbox } from '@mui/material';
import { EntityKind } from '@/types';
import { getEntityIcon } from '@/lib/utils/entity';

type EntityFilterType = 'all' | EntityKind;

export type EntityFiltersProps = {
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
}: EntityFiltersProps) => {
  return (
    <Box className='entity-controls'>
      <Box className='filter-group'>
        <Select
          label='Filter by type'
          id='type-filter'
          value={filterType}
          onChange={(e) => onFilterChange(e.target.value as EntityFilterType)}
          className='filter-Select'
        >
          <MenuItem value='all'>All Types ({totalEntities})</MenuItem>
          {Object.entries(typeCounts).map(([type, count]) => (
            <MenuItem key={type} value={type}>
              {getEntityIcon(type as EntityKind)} {type} ({count})
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box className='toggle-group'>
        <InputLabel className='toggle-InputLabel'>
          <Checkbox
            checked={showDuplicates}
            onChange={(e) => onDuplicateToggle(e.target.checked)}
          />
          Show only duplicates ({totalDuplicates})
        </InputLabel>
      </Box>
    </Box>
  );
};
