'use client';

import { DocumentViewer, EntityViewer } from '@/components';
import {
  type SerializedParsedDocumentWithEntities,
  type EntityWithId,
} from '@/types';

type ResultsSectionProps = {
  parsedData: SerializedParsedDocumentWithEntities;
  entities: EntityWithId[];
  onEntityDiscard: (entityId: string) => void;
  onEntityMerge: (primaryEntity: EntityWithId, duplicateIds: string[]) => void;
};

export const ResultsSection = ({
  parsedData,
  entities,
  onEntityDiscard,
  onEntityMerge,
}: ResultsSectionProps) => {
  return (
    <div className='space-y-6'>
      {/* Document Content */}
      <DocumentViewer parsedData={parsedData} />

      {/* Entity Management */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        <div className='mb-4'>
          <h3 className='text-xl font-semibold text-gray-800 mb-2'>
            ✨ Extracted Entities
          </h3>
          <p className='text-gray-600 text-sm'>
            The parser automatically identified {entities.length} entities from
            your document. You can view, edit, merge duplicates, and export them
            to Obsidian format.
          </p>
        </div>
        <EntityViewer
          entities={entities}
          onEntityDiscard={onEntityDiscard}
          onEntityMerge={onEntityMerge}
          parsedData={parsedData}
        />
      </div>
    </div>
  );
};
