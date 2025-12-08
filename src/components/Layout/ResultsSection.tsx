'use client';

import { DocumentViewer, EntityViewer } from '@/components';
import {
  type SerializedParsedDocumentWithEntities,
  type EntityWithId,
} from '@/types';
import { Box, Typography } from '@mui/material';

type ResultsSectionProps = {
  parsedData: SerializedParsedDocumentWithEntities;
  entities: EntityWithId[];
  onEntityDiscard: (entityId: string) => void;
  onEntityUpdate: (updatedEntity: EntityWithId) => void;
  onEntityMerge: (primaryEntity: EntityWithId, duplicateIds: string[]) => void;
};

export const ResultsSection = ({
  parsedData,
  entities,
  onEntityDiscard,
  onEntityUpdate,
  onEntityMerge,
}: ResultsSectionProps) => {
  return (
    <Box className='space-y-6'>
      {/* Document Content */}
      <DocumentViewer data-testid='document-viewer' parsedData={parsedData} />

      {/* Entity Management */}
      <Box className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        <Box className='mb-4'>
          <Typography
            variant='h3'
            className='text-xl font-semibold text-gray-800 mb-2'
          >
            ✨ Extracted Entities
          </Typography>
          <Typography className='text-gray-600 text-sm'>
            The parser automatically identified {entities.length} entities from
            your document. You can view, edit, merge duplicates, and export them
            to Obsidian format.
          </Typography>
        </Box>
        <EntityViewer
          entities={entities}
          onEntityDiscard={onEntityDiscard}
          onEntityUpdate={onEntityUpdate}
          onEntityMerge={onEntityMerge}
          parsedData={parsedData}
        />
      </Box>
    </Box>
  );
};
