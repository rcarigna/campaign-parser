'use client';

import { useState } from 'react';
import { EntityKind } from '@/types';
import { WelcomeHeader } from '../WelcomeHeader';
import { EntityTypesGrid, EntitySchemaView } from '@/components/Entity';
import { SectionContainer } from '../CommonStyled';

export const PersistentWelcome = () => {
  const [selectedEntity, setSelectedEntity] = useState<EntityKind | null>(null);

  const handleEntityClick = (entityKind: EntityKind) => {
    setSelectedEntity(selectedEntity === entityKind ? null : entityKind);
  };

  return (
    <SectionContainer>
      <WelcomeHeader />
      <EntityTypesGrid
        selectedEntity={selectedEntity}
        onEntityClick={handleEntityClick}
      />
      {selectedEntity && (
        <EntitySchemaView
          entityKind={selectedEntity}
          onClose={() => setSelectedEntity(null)}
        />
      )}
    </SectionContainer>
  );
};
