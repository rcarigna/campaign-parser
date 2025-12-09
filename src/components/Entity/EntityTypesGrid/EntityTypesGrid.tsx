import { EntityKind } from '@/types';
import { getAllEntityMetadata } from '@/lib/utils/entity';
import { EntityTypeCard } from '../EntityTypeCard';
import { EntityGridContainer } from '../CommonEntityStyled';

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
    <EntityGridContainer>
      {entityTypes.map((metadata) => (
        <EntityTypeCard
          key={metadata.kind}
          metadata={metadata}
          isSelected={selectedEntity === metadata.kind}
          onClick={onEntityClick}
        />
      ))}
    </EntityGridContainer>
  );
};
