import React from 'react';
import { EntityWithId, SerializedParsedDocumentWithEntities } from '@/types';

type EntityViewerJsonViewProps = {
  entities: EntityWithId[];
  parsedData?: SerializedParsedDocumentWithEntities | null;
};

export const EntityViewerJsonView: React.FC<EntityViewerJsonViewProps> = ({
  entities,
  parsedData,
}) => (
  <div className='json-output'>
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
  </div>
);
