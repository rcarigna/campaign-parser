import { EntityKind } from '@/types';
import type { EntityMetadata } from '@/types';
import { Box } from '@mui/material';
import { EntityCardContainer } from '../CommonEntityStyled';

type EntityTypeCardProps = {
  metadata: EntityMetadata;
  isSelected: boolean;
  onClick: (kind: EntityKind) => void;
};

export const EntityTypeCard = ({
  metadata,
  isSelected,
  onClick,
}: EntityTypeCardProps) => {
  const { kind, emoji, label, description } = metadata;

  return (
    <EntityCardContainer
      className={isSelected ? 'selected' : ''}
      onClick={() => onClick(kind)}
      role='button'
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(kind);
        }
      }}
      sx={{ textAlign: 'center' }}
    >
      <Box sx={{ fontSize: 28, mb: 1 }}>{emoji}</Box>
      <Box
        sx={{ fontSize: 14, fontWeight: 500, color: 'text.primary', mb: 0.5 }}
      >
        {label}
      </Box>
      <Box sx={{ fontSize: 12, color: 'text.secondary' }}>{description}</Box>
    </EntityCardContainer>
  );
};
