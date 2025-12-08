import React from 'react';
import { EntityWithId, SerializedParsedDocumentWithEntities } from '@/types';
import { Box } from '@mui/material';

type EntityViewerJsonViewProps = {
  entities: EntityWithId[];
  parsedData?: SerializedParsedDocumentWithEntities | null;
};

export const EntityViewerJsonView: React.FC<EntityViewerJsonViewProps> = ({
  entities,
  parsedData,
}) => (
  <Box className='json-output'>
    <pre>
      {JSON.stringify(
        {
          ...parsedData,
          entities,
        },
        null,
        2
      )}
    </pre>
  </Box>
);
