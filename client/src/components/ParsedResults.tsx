import { type SerializedParsedDocumentWithEntities } from '../types/constants';

type ParsedResultsProps = {
  parsedData: SerializedParsedDocumentWithEntities | null;
};

export const ParsedResults = ({
  parsedData,
}: ParsedResultsProps): JSX.Element | null => {
  if (!parsedData) {
    return null;
  }

  return (
    <div className='results'>
      <h2>Parsed JSON Output</h2>
      <div className='json-output'>
        <pre>{JSON.stringify(parsedData, null, 2)}</pre>
      </div>
    </div>
  );
};
