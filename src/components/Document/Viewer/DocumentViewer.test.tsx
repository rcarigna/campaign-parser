import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { DocumentViewer } from './DocumentViewer';
import { DocumentType } from '@/types';

const mockMarkdownData = {
  filename: 'test.md',
  type: DocumentType.MARKDOWN,
  content: {
    raw: '# Test Header\n\nThis is test content.',
    html: '<h1>Test Header</h1><p>This is test content.</p>',
    text: 'Test Header\n\nThis is test content.',
    frontmatter: {},
    headings: [],
    links: [],
    images: [],
  },
  metadata: {
    size: 1024,
    lastModified: '2024-01-01T00:00:00.000Z',
    mimeType: 'text/markdown',
  },
  entities: [],
};

const mockWordData = {
  filename: 'test.docx',
  type: DocumentType.WORD_DOCUMENT,
  content: {
    html: '<p>Word document content</p>',
    text: 'Word document content',
    messages: [],
    warnings: [],
    errors: [],
  },
  metadata: {
    size: 2048,
    lastModified: '2024-01-01T00:00:00.000Z',
    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  entities: [],
};

describe('DocumentViewer', () => {
  it('renders markdown document with formatted view by default', () => {
    render(<DocumentViewer parsedData={mockMarkdownData} />);

    expect(screen.getByText('📄 Document Content')).toBeInTheDocument();
    expect(screen.getByText('test.md • Markdown')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /formatted/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /raw markdown/i })
    ).toBeInTheDocument();
  });

  it('toggles between formatted and raw markdown views', async () => {
    render(<DocumentViewer parsedData={mockMarkdownData} />);

    // Initially should show formatted view
    expect(screen.getByRole('button', { name: /formatted/i })).toHaveClass(
      'bg-blue-600'
    );

    // Click raw markdown button
    const rawButton = screen.getByRole('button', { name: /raw markdown/i });
    await userEvent.click(rawButton);

    // Should now show raw view
    expect(rawButton).toHaveClass('bg-blue-600');

    // Should display the raw content in a pre tag
    const preElement = document.querySelector('pre');
    expect(preElement).toBeInTheDocument();
    expect(preElement?.textContent).toContain('# Test Header');
  });

  it('renders word document with appropriate labels', () => {
    render(<DocumentViewer parsedData={mockWordData} />);

    expect(screen.getByText('📄 Document Content')).toBeInTheDocument();
    expect(screen.getByText('test.docx • Word Document')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /rendered/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /plain text/i })
    ).toBeInTheDocument();
  });

  it('toggles between rendered and plain text views for word documents', async () => {
    render(<DocumentViewer parsedData={mockWordData} />);

    // Initially should show rendered view
    expect(screen.getByRole('button', { name: /rendered/i })).toHaveClass(
      'bg-blue-600'
    );

    // Click plain text button
    const plainTextButton = screen.getByRole('button', { name: /plain text/i });
    await userEvent.click(plainTextButton);

    // Should now show plain text view
    expect(plainTextButton).toHaveClass('bg-blue-600');

    // Should display the plain text in a pre tag
    const preElement = document.querySelector('pre');
    expect(preElement).toBeInTheDocument();
    expect(preElement?.textContent).toContain('Word document content');
  });
});
