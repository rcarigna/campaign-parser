import { render, screen, fireEvent } from '@testing-library/react';
import { ParsedResults } from './ParsedResults';
import {
  type SerializedParsedDocumentWithEntities,
  type EntityWithId,
  DocumentType,
  EntityKind,
} from '../../../types/constants';

const mockParsedData: SerializedParsedDocumentWithEntities = {
  filename: 'Test Document.md',
  type: DocumentType.MARKDOWN,
  content: {
    raw: '# Test Content',
    html: '<h1>Test Content</h1>',
    text: 'Test Content',
    frontmatter: {},
    headings: [{ level: 1, text: 'Test Content', id: 'test-content' }],
    links: [],
    images: [],
  },
  metadata: {
    size: 1234,
    lastModified: '2023-01-01T00:00:00.000Z',
    mimeType: 'text/markdown',
  },
  entities: [
    {
      kind: 'npc',
      title: 'Test NPC',
      role: 'warrior',
    },
  ],
};

describe('ParsedResults', () => {
  const mockEntities: EntityWithId[] = [
    {
      id: 'npc-0',
      kind: EntityKind.NPC,
      title: 'Test NPC',
      role: 'merchant',
    },
  ];

  const mockOnEntityDiscard = jest.fn();

  it('should render null when parsedData is null', () => {
    const { container } = render(
      <ParsedResults
        parsedData={null}
        entities={[]}
        onEntityDiscard={mockOnEntityDiscard}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render parsed results with entity view by default', () => {
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
    expect(screen.getByText('📋 Extracted Entities (1)')).toBeInTheDocument();
    expect(screen.getByText('Test NPC')).toBeInTheDocument();
  });

  it('should switch to JSON view when toggle is clicked', () => {
    render(
      <ParsedResults
        parsedData={mockParsedData}
        entities={mockEntities}
        onEntityDiscard={mockOnEntityDiscard}
      />
    );

    const jsonViewButton = screen.getByText('📄 JSON View');
    fireEvent.click(jsonViewButton);

    expect(screen.getByText(/Test Document\.md/)).toBeInTheDocument();
    expect(screen.getByText(/Test Content/)).toBeInTheDocument();
    expect(screen.getByText(/markdown/)).toBeInTheDocument();
    expect(screen.getByText(/2023-01-01T00:00:00\.000Z/)).toBeInTheDocument();
  });

  it('should render with correct CSS classes', () => {
    render(
      <ParsedResults
        parsedData={mockParsedData}
        entities={mockEntities}
        onEntityDiscard={mockOnEntityDiscard}
      />
    );

    const resultsDiv =
      screen.getByText('Parsed Results').parentElement?.parentElement;
    expect(resultsDiv).toHaveClass('results');
  });

  it('should format JSON with proper indentation when in JSON view', () => {
    render(
      <ParsedResults
        parsedData={mockParsedData}
        entities={mockEntities}
        onEntityDiscard={mockOnEntityDiscard}
      />
    );

    const jsonViewButton = screen.getByText('📄 JSON View');
    fireEvent.click(jsonViewButton);

    const preElement = screen.getByText(/Test Document\.md/);
    expect(preElement.tagName).toBe('PRE');
  });
});
