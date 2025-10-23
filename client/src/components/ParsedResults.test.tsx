import { render, screen } from '@testing-library/react';
import { ParsedResults } from './ParsedResults';
import { type ParsedDocument } from '../types/constants';

const mockParsedData: ParsedDocument = {
  filename: 'Test Document',
  content: 'This is test content',
  type: 'markdown',
  metadata: {
    size: 1234,
    lastModified: '2023-01-01',
    mimeType: 'markdown',
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
    expect(screen.getByText(/Test Document/)).toBeInTheDocument();
    expect(screen.getByText(/This is test content/)).toBeInTheDocument();
    expect(screen.getByText(/markdown/)).toBeInTheDocument();
    expect(screen.getByText(/2023-01-01/)).toBeInTheDocument();
  });

  it('should render with correct CSS classes', () => {
    render(<ParsedResults parsedData={mockParsedData} />);

    const resultsDiv = screen.getByText('Parsed JSON Output').parentElement;
    const jsonOutputDiv = screen.getByText(/Test Document/).parentElement;

    expect(resultsDiv).toHaveClass('results');
    expect(jsonOutputDiv).toHaveClass('json-output');
  });

  it('should format JSON with proper indentation', () => {
    render(<ParsedResults parsedData={mockParsedData} />);

    const preElement = screen.getByText(/Test Document/);
    expect(preElement.tagName).toBe('PRE');
  });
});
