import { Box, Button, Typography, Checkbox } from '@mui/material';
import { EntityCardProps } from '@/types';
import { getEntityIcon } from '@/lib/utils/entity';

export const EntityCard = ({
  entity,
  isDuplicate,
  missingFields,
  onClick,
  isSelectable = false,
  isSelected = false,
  onSelect,
  onDiscard,
}: EntityCardProps) => {
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on checkbox
    const target = e.target as HTMLElement;
    if (
      !(
        target.tagName === 'INPUT' &&
        (target as HTMLInputElement).type === 'checkbox'
      )
    ) {
      onClick(entity);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(entity.id, e.target.checked);
    }
  };

  const handleDiscardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDiscard) {
      onDiscard(entity);
    }
  };
  try {
    return (
      <Box
        className={`entity-card entity-kind-${entity.kind} ${
          isDuplicate ? 'duplicate' : ''
        } ${isSelected ? 'selected' : ''}`}
        onClick={handleCardClick}
      >
        <Box className='entity-card-header'>
          {isSelectable && (
            <Checkbox
              checked={isSelected}
              onChange={handleSelectChange}
              className='entity-select-checkbox'
              data-testid={`select-checkbox-${entity.id}`}
            />
          )}
          <Box component='span' className='entity-icon'>
            {getEntityIcon(entity.kind)}
          </Box>
          <Box component='span' className='entity-type'>
            {entity.kind}
          </Box>
          {isDuplicate && (
            <Box component='span' className='duplicate-badge'>
              DUPE
            </Box>
          )}
          {onDiscard && (
            <Button
              className='entity-discard-btn'
              onClick={handleDiscardClick}
              title={`Discard ${entity.title}`}
              aria-label={`Discard ${entity.title}`}
            >
              🗑️
            </Button>
          )}
        </Box>

        <Typography variant='h4' className='entity-title'>
          {entity.title}
        </Typography>
        <Box className='entity-details'>
          {'role' in entity && entity.role && (
            <Box className='detail-item'>Role: {entity.role}</Box>
          )}
          {'type' in entity && entity.type && (
            <Box className='detail-item'>Type: {entity.type}</Box>
          )}
          {'status' in entity && entity.status && (
            <Box className='detail-item'>Status: {entity.status}</Box>
          )}
          {entity.sourceSessions && (
            <Box className='detail-item'>
              Sessions: {entity.sourceSessions?.join(', ')}
            </Box>
          )}
        </Box>

        {missingFields.length > 0 && (
          <Box className='missing-fields'>
            <span className='missing-label'>Missing:</span>
            <span className='missing-list'>{missingFields.join(', ')}</span>
          </Box>
        )}
      </Box>
    );
  } catch (error) {
    console.error('Error rendering EntityCard:', error);
    console.error('Entity data:', JSON.stringify(entity, null, 2));
    return null;
  }
};
