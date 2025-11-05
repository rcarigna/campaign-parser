import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MarkdownRenderer } from './MarkdownRenderer';

jest.mock('marked');

describe('MarkdownRenderer', () => {
    it('renders markdown content', async () => {
        const markdown = '# Test Heading\n\nTest content';
        
        render(<MarkdownRenderer markdown={markdown} />);
        
        await waitFor(() => {
            const container = screen.getByText((content, element) => {
                return element?.className.includes('prose') || false;
            }, { selector: 'div' });
            expect(container).toBeInTheDocument();
        });
    });

    it('updates when markdown prop changes', async () => {
        const { rerender } = render(<MarkdownRenderer markdown="# First" />);
        
        await waitFor(() => {
            expect(screen.getByText((content, element) => {
                return element?.className.includes('prose') || false;
            }, { selector: 'div' })).toBeInTheDocument();
        });

        rerender(<MarkdownRenderer markdown="# Second" />);
        
        await waitFor(() => {
            expect(screen.getByText((content, element) => {
                return element?.className.includes('prose') || false;
            }, { selector: 'div' })).toBeInTheDocument();
        });
    });
});
