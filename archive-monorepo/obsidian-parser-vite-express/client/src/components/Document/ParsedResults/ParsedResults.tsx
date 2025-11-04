import { useState } from 'react';
import {
  type SerializedParsedDocumentWithEntities,
  type EntityWithId,
} from '../../../types/constants';
import { EntityViewer } from '../../Entity/EntityViewer';
import '../../Entity/EntityViewer/EntityViewer.css';

type ParsedResultsProps = {
  parsedData: SerializedParsedDocumentWithEntities | null;
  entities: EntityWithId[];
  onEntityDiscard: (entityId: string) => void;
};

export const ParsedResults = ({
  parsedData,
  entities,
  onEntityDiscard,
}: ParsedResultsProps): JSX.Element | null => {
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
        <EntityViewer entities={entities} onEntityDiscard={onEntityDiscard} />
      ) : (
        <div className='json-output'>
          <pre>{JSON.stringify(parsedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
