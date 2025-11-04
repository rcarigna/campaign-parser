import { render, screen, fireEvent } from '@testing-library/react';
import { ParsedResults } from './ParsedResults';
import {
  EntityKind,
  DocumentType,
  type SerializedParsedDocumentWithEntities,
  type EntityWithId,
} from '@/types';

const mockParsedData: SerializedParsedDocumentWithEntities = {
  filename: 'test.md',
  type: DocumentType.MARKDOWN,
  content: {
    raw: '# Test Document',
    html: '<h1>Test Document</h1>',
    text: 'Test Document',
    frontmatter: {},
    headings: [{ level: 1, text: 'Test Document', id: 'test-document' }],
    links: [],
    images: [],
  },
  metadata: {
    size: 100,
    lastModified: '2023-01-01T00:00:00.000Z',
    mimeType: 'text/markdown',
  },
  entities: [],
};

const mockEntities: EntityWithId[] = [
  {
    id: 'entity-1',
    kind: EntityKind.NPC,
    title: 'Test NPC',
  },
  {
    id: 'entity-2',
    kind: EntityKind.LOCATION,
    title: 'Test Location',
  },
];

const mockOnEntityDiscard = jest.fn();

describe('ParsedResults', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when no parsed data is provided', () => {
    const { container } = render(
      <ParsedResults
        parsedData={null}
        entities={[]}
        onEntityDiscard={mockOnEntityDiscard}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders parsed results with entity view by default', () => {
    render(
      <ParsedResults
        parsedData={mockParsedData}
        entities={mockEntities}
        onEntityDiscard={mockOnEntityDiscard}
      />
    );

    expect(screen.getByText('Parsed Results')).toBeInTheDocument();
    expect(screen.getByText('📋 Entity View')).toBeInTheDocument();
    expect(screen.getByText('📄 JSON View')).toBeInTheDocument();
    expect(screen.getByText('📋 Extracted Entities (2)')).toBeInTheDocument();
  });

  it('shows JSON view when JSON toggle is clicked', () => {
    render(
      <ParsedResults
        parsedData={mockParsedData}
        entities={mockEntities}
        onEntityDiscard={mockOnEntityDiscard}
      />
    );

    fireEvent.click(screen.getByText('📄 JSON View'));

    expect(screen.getByText(/"filename": "test.md"/)).toBeInTheDocument();
  });

  it('calls onEntityDiscard when discard button is clicked', () => {
    render(
      <ParsedResults
        parsedData={mockParsedData}
        entities={mockEntities}
        onEntityDiscard={mockOnEntityDiscard}
      />
    );

    const discardButtons = screen.getAllByText('Discard');
    fireEvent.click(discardButtons[0]);

    expect(mockOnEntityDiscard).toHaveBeenCalledWith('entity-1');
  });

  it('shows entity count correctly', () => {
    render(
      <ParsedResults
        parsedData={mockParsedData}
        entities={mockEntities}
        onEntityDiscard={mockOnEntityDiscard}
      />
    );

    expect(screen.getByText('📋 Extracted Entities (2)')).toBeInTheDocument();
  });
});
