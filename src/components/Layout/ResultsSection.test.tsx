import { render, screen } from '@testing-library/react';
import { ResultsSection } from './ResultsSection';
import { type EntityWithId } from '@/types';
import { mockParsedDocument as mockParsedData } from '../__mocks__';
import userEvent from '@testing-library/user-event';

describe('ResultsSection', () => {
  const onEntityDiscard = jest.fn();
  const onEntityUpdate = jest.fn();
  const onEntityMerge = jest.fn();

  const commonProps = {
    parsedData: mockParsedData,
    entities: mockParsedData.entities as EntityWithId[],
    onEntityDiscard,
    onEntityUpdate,
    onEntityMerge,
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders DocumentViewer with parsedData', () => {
    render(<ResultsSection {...commonProps} />);
    expect(screen.getByText('📄 Document Content')).toBeInTheDocument();
  });

  it('renders EntityViewer with entities', () => {
    render(<ResultsSection {...commonProps} />);
    expect(screen.getByTestId('entity-viewer')).toBeInTheDocument();
    expect(screen.getByText('✨ Extracted Entities')).toBeInTheDocument();
  });

  it('displays the correct entity count in the description', () => {
    render(<ResultsSection {...commonProps} />);
    expect(
      screen.getByText(/The parser automatically identified 3 entities/i)
    ).toBeInTheDocument();
  });

  it('calls onEntityDiscard when discard button is clicked', async () => {
    render(<ResultsSection {...commonProps} />);
    await userEvent.click(screen.getByTestId('discard-button-1'));
    expect(onEntityDiscard).toHaveBeenCalledWith('1');
  });
});
