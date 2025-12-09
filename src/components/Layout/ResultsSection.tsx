'use client';

import { DocumentViewer, EntityViewer } from '@/components';
import {
  type SerializedParsedDocumentWithEntities,
  type EntityWithId,
} from '@/types';
import { Box, Typography } from '@mui/material';
import { SectionContainer, SectionTitle } from './CommonStyled';

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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {/* Document Content */}
      <DocumentViewer data-testid='document-viewer' parsedData={parsedData} />

      {/* Entity Management */}
      <SectionContainer sx={{ p: 6 }}>
        <Box sx={{ mb: 4 }}>
          <SectionTitle component='h3' variant='h5' sx={{ mb: 2 }}>
            ✨ Extracted Entities
          </SectionTitle>
          <Typography sx={{ color: 'text.secondary', fontSize: '1rem' }}>
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
      </SectionContainer>
    </Box>
  );
};
