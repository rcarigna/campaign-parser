import { render, screen } from '@testing-library/react';
import { ParsedResults } from './ParsedResults';
import {
  type SerializedParsedDocument,
  DocumentType,
} from '@obsidian-parser/shared';

const mockParsedData: SerializedParsedDocument = {
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
};

describe('ParsedResults', () => {
  it('should render null when parsedData is null', () => {
    const { container } = render(<ParsedResults parsedData={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render parsed JSON output when parsedData is provided', () => {
    render(<ParsedResults parsedData={mockParsedData} />);

    expect(screen.getByText('Parsed JSON Output')).toBeInTheDocument();
    expect(screen.getByText(/Test Document\.md/)).toBeInTheDocument();
    expect(screen.getByText(/Test Content/)).toBeInTheDocument();
    expect(screen.getByText(/markdown/)).toBeInTheDocument();
    expect(screen.getByText(/2023-01-01T00:00:00\.000Z/)).toBeInTheDocument();
  });

  it('should render with correct CSS classes', () => {
    render(<ParsedResults parsedData={mockParsedData} />);

    const resultsDiv = screen.getByText('Parsed JSON Output').parentElement;
    const jsonOutputDiv = screen.getByText(/Test Document\.md/).parentElement;

    expect(resultsDiv).toHaveClass('results');
    expect(jsonOutputDiv).toHaveClass('json-output');
  });

  it('should format JSON with proper indentation', () => {
    render(<ParsedResults parsedData={mockParsedData} />);

    const preElement = screen.getByText(/Test Document\.md/);
    expect(preElement.tagName).toBe('PRE');
  });
});
