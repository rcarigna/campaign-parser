import {
  Box,
  MenuItem,
  InputLabel,
  Select,
  Checkbox,
  FormControl,
} from '@mui/material';
import { FlexCenter } from '../../Layout/CommonStyled';
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
    <FlexCenter
      sx={{ gap: 3, flexWrap: 'wrap', alignItems: 'center', mt: 2, mb: 2 }}
    >
      <FormControl sx={{ minWidth: 220 }}>
        <InputLabel id='type-filter-label'>Filter by type</InputLabel>
        <Select
          labelId='type-filter-label'
          id='type-filter'
          value={filterType}
          label='Filter by type'
          onChange={(e) => onFilterChange(e.target.value as EntityFilterType)}
        >
          <MenuItem value='all'>All Types ({totalEntities})</MenuItem>
          {Object.entries(typeCounts).map(([type, count]) => (
            <MenuItem key={type} value={type}>
              {getEntityIcon(type as EntityKind)} {type} ({count})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <InputLabel
        sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 15 }}
      >
        <Checkbox
          checked={showDuplicates}
          onChange={(e) => onDuplicateToggle(e.target.checked)}
        />
        Show only duplicates ({totalDuplicates})
      </InputLabel>
    </FlexCenter>
  );
};
