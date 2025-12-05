import { EntityKind } from '@/types';
import { getAllEntityMetadata } from '@/lib/utils/entity';
import { EntityTypeCard } from '../EntityTypeCard';
import { Box } from '@mui/material';

type EntityTypesGridProps = {
  selectedEntity: EntityKind | null;
  onEntityClick: (kind: EntityKind) => void;
};

export const EntityTypesGrid = ({
  selectedEntity,
  onEntityClick,
}: EntityTypesGridProps) => {
  const entityTypes = getAllEntityMetadata();

  return (
    <Box className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6'>
      {entityTypes.map((metadata) => (
        <EntityTypeCard
          key={metadata.kind}
          metadata={metadata}
          isSelected={selectedEntity === metadata.kind}
          onClick={onEntityClick}
        />
      ))}
    </Box>
  );
};
