import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { DocumentViewer } from './DocumentViewer';
import { mockMarkdownData, mockWordData } from '../../__mocks__/index';
import { DocumentType } from '@/types';

const markdownProps = {
  parsedData: { ...mockMarkdownData, type: DocumentType.MARKDOWN },
};
const mockWordProps = {
  parsedData: { ...mockWordData, type: DocumentType.WORD_DOCUMENT },
};
describe('DocumentViewer', () => {
  it('renders markdown document with formatted view by default', () => {
    render(<DocumentViewer {...markdownProps} />);

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
    render(<DocumentViewer {...markdownProps} />);

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
    render(<DocumentViewer {...mockWordProps} />);

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
    render(<DocumentViewer {...mockWordProps} />);

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

  it('shows formatted view when toggling back from raw markdown', async () => {
    render(<DocumentViewer {...markdownProps} />);
    const rawButton = screen.getByRole('button', { name: /raw markdown/i });
    await userEvent.click(rawButton);

    const formattedButton = screen.getByRole('button', { name: /formatted/i });
    await userEvent.click(formattedButton);

    // Should show formatted view again
    expect(formattedButton).toHaveClass('bg-blue-600');
    expect(document.querySelector('pre')).not.toBeInTheDocument();
    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  it('shows rendered view when toggling back from plain text for word documents', async () => {
    render(<DocumentViewer {...mockWordProps} />);
    const plainTextButton = screen.getByRole('button', { name: /plain text/i });
    await userEvent.click(plainTextButton);

    const renderedButton = screen.getByRole('button', { name: /rendered/i });
    await userEvent.click(renderedButton);

    // Should show rendered view again
    expect(renderedButton).toHaveClass('bg-blue-600');
    expect(document.querySelector('pre')).not.toBeInTheDocument();
    expect(screen.getByText('Word document content')).toBeInTheDocument();
  });
});
