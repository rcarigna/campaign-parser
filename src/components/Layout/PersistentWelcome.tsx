'use client';

import { useState } from 'react';
import { EntityKind } from '@/types';
import { WelcomeHeader } from './WelcomeHeader';
import { EntityTypesGrid } from './EntityTypesGrid';
import { EntitySchemaView } from './EntitySchemaView';

export const PersistentWelcome = () => {
  const [selectedEntity, setSelectedEntity] = useState<EntityKind | null>(null);

  const handleEntityClick = (entityKind: EntityKind) => {
    setSelectedEntity(selectedEntity === entityKind ? null : entityKind);
  };

  return (
    <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-8 mb-6'>
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
    </div>
  );
};
