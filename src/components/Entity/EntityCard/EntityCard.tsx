import { Box, Button, Typography, Checkbox } from '@mui/material';
import { EntityCardContainer } from '../CommonEntityStyled';
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
      <EntityCardContainer
        data-testid='entity-card'
        className={`entity-kind-${entity.kind} ${
          isDuplicate ? 'duplicate' : ''
        } ${isSelected ? 'selected' : ''}`}
        onClick={handleCardClick}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {isSelectable && (
            <Checkbox
              checked={isSelected}
              onChange={handleSelectChange}
              data-testid={`select-checkbox-${entity.id}`}
              sx={{ mr: 1 }}
            />
          )}
          <Box component='span' sx={{ fontSize: 24, mr: 1 }}>
            {getEntityIcon(entity.kind)}
          </Box>
          <Box
            component='span'
            sx={{ fontSize: 12, color: 'text.secondary', mr: 1 }}
          >
            {entity.kind}
          </Box>
          {isDuplicate && (
            <Box
              component='span'
              sx={{ color: 'error.main', fontWeight: 600, fontSize: 12, ml: 1 }}
            >
              DUPE
            </Box>
          )}
          {onDiscard && (
            <Button
              data-testid={`discard-button-${entity.id}`}
              onClick={handleDiscardClick}
              title={`Discard ${entity.title}`}
              aria-label={`Discard ${entity.title}`}
              sx={{ ml: 'auto', minWidth: 0, px: 1, color: 'error.main' }}
            >
              🗑️
            </Button>
          )}
        </Box>

        <Typography variant='h4' sx={{ fontWeight: 600, mb: 1 }}>
          {entity.title}
        </Typography>
        <Box sx={{ fontSize: 13, color: 'text.secondary', mb: 1 }}>
          {'role' in entity && entity.role && (
            <Box component='span' sx={{ mr: 1 }}>
              Role: {entity.role}
            </Box>
          )}
          {'type' in entity && entity.type && (
            <Box component='span' sx={{ mr: 1 }}>
              Type: {entity.type}
            </Box>
          )}
          {'status' in entity && entity.status && (
            <Box component='span' sx={{ mr: 1 }}>
              Status: {entity.status}
            </Box>
          )}
          {entity.sourceSessions && (
            <Box component='span' sx={{ mr: 1 }}>
              Sessions: {entity.sourceSessions?.join(', ')}
            </Box>
          )}
        </Box>

        {missingFields.length > 0 && (
          <Box sx={{ fontSize: 12, color: 'warning.main', mt: 1 }}>
            <span style={{ fontWeight: 500 }}>Missing:</span>
            <span> {missingFields.join(', ')}</span>
          </Box>
        )}
      </EntityCardContainer>
    );
  } catch (error) {
    console.error('Error rendering EntityCard:', error);
    console.error('Entity data:', JSON.stringify(entity, null, 2));
    return null;
  }
};
