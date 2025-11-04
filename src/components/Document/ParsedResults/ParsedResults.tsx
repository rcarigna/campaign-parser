import { useState } from 'react';
import {
  type SerializedParsedDocumentWithEntities,
  type EntityWithId,
} from '@/types';

type ParsedResultsProps = {
  parsedData: SerializedParsedDocumentWithEntities | null;
  entities: EntityWithId[];
  onEntityDiscard: (entityId: string) => void;
};

export const ParsedResults = ({
  parsedData,
  entities,
  onEntityDiscard,
}: ParsedResultsProps) => {
  const [view, setView] = useState<'entities' | 'json'>('entities');

  if (!parsedData) {
    return null;
  }

  return (
    <div className='results'>
      <div className='results-header'>
        <h2>Parsed Results</h2>
        <div className='view-toggle'>
          <button
            className={`toggle-btn ${view === 'entities' ? 'active' : ''}`}
            onClick={() => setView('entities')}
          >
            📋 Entity View
          </button>
          <button
            className={`toggle-btn ${view === 'json' ? 'active' : ''}`}
            onClick={() => setView('json')}
          >
            📄 JSON View
          </button>
        </div>
      </div>

      {view === 'entities' ? (
        <div className='entity-placeholder'>
          <h3>📋 Extracted Entities ({entities.length})</h3>
          <p>Entity viewer will be migrated next...</p>
          <ul>
            {entities.slice(0, 5).map((entity) => (
              <li key={entity.id}>
                {entity.kind}: {entity.title}
                <button onClick={() => onEntityDiscard(entity.id)}>
                  Discard
                </button>
              </li>
            ))}
            {entities.length > 5 && <li>... and {entities.length - 5} more</li>}
          </ul>
        </div>
      ) : (
        <div className='json-output'>
          <pre>{JSON.stringify(parsedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
