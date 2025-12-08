import { render, screen } from '@testing-library/react';
import { EntityViewerJsonView } from './EntityViewerJsonView';
import {
  defaultMockEntities as entities,
  mockParsedDocument as parsedData,
} from '@/components/__mocks__';
describe('EntityViewerJsonView', () => {
  it('renders JSON output with entities and parsedData', () => {
    render(
      <EntityViewerJsonView entities={entities} parsedData={parsedData} />
    );
    const pre = screen.getByText(
      (content, element) =>
        element?.tagName.toLowerCase() === 'pre' &&
        content.includes('"type": "markdown"') &&
        content.includes('"filename": "test.md"')
    );
    expect(pre).toBeInTheDocument();
  });

  it('renders JSON output with only entities when parsedData is undefined', () => {
    render(<EntityViewerJsonView entities={entities} />);
    const pre = screen.getByText(
      (content, element) =>
        element?.tagName.toLowerCase() === 'pre' &&
        content.includes('"entities": [') &&
        content.includes('"title": "Guard NPC"')
    );
    expect(pre).toBeInTheDocument();
  });

  it('renders JSON output with null parsedData', () => {
    render(<EntityViewerJsonView entities={entities} parsedData={null} />);
    const pre = screen.getByText(
      (content, element) =>
        element?.tagName.toLowerCase() === 'pre' &&
        content.includes('"entities": [') &&
        content.includes('"id": "1"')
    );
    expect(pre).toBeInTheDocument();
  });

  it('renders empty entities array', () => {
    render(<EntityViewerJsonView entities={[]} parsedData={parsedData} />);
    const pre = screen.getByText(
      (content, element) =>
        element?.tagName.toLowerCase() === 'pre' &&
        content.includes('"entities": []')
    );
    expect(pre).toBeInTheDocument();
  });
});
