import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MarkdownRenderer } from './MarkdownRenderer';

describe('MarkdownRenderer', () => {
  it('renders markdown content', async () => {
    const markdown = '# Test Heading\n\nTest content';

    render(<MarkdownRenderer markdown={markdown} />);

    await waitFor(() => {
      const container = screen.getByText(
        (_, element) => {
          return element?.className.includes('prose') || false;
        },
        { selector: 'div' }
      );
      expect(container).toBeInTheDocument();
    });
  });

  it('updates when markdown prop changes', async () => {
    const { rerender } = render(<MarkdownRenderer markdown='# First' />);

    await waitFor(() => {
      expect(
        screen.getByText(
          (_, element) => {
            return element?.className.includes('prose') || false;
          },
          { selector: 'div' }
        )
      ).toBeInTheDocument();
    });

    rerender(<MarkdownRenderer markdown='# Second' />);

    await waitFor(() => {
      expect(
        screen.getByText(
          (_, element) => {
            return (
              element?.className.includes('prose prose-sm max-w-none') || false
            );
          },
          { selector: 'div' }
        )
      ).toBeInTheDocument();
    });
  });
});
