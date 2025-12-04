import { render, screen, fireEvent } from '@testing-library/react';
import {
  EntityViewerHeader,
  EntityViewerHeaderProps,
} from './EntityViewerHeader';
import { UseEntityFilteringReturn } from '../hooks';
import { EntityKind } from '@/types';
import { defaultMockEntities } from '@/components/__mocks__';

const mockFiltering: UseEntityFilteringReturn = {
  filterType: 'all',
  setFilterType: jest.fn(),
  showDuplicates: false,
  setShowDuplicates: jest.fn(),
  typeCounts: { npc: 2, item: 1 },
  filteredEntities: defaultMockEntities,
  duplicateIds: new Set(['1', '2']),
  duplicates: [
    { id: '1', kind: EntityKind.NPC, title: 'NPC 1' },
    { id: '2', kind: EntityKind.NPC, title: 'NPC 2' },
  ],
};

describe('EntityViewerHeader', () => {
  const defaultProps: EntityViewerHeaderProps = {
    entitiesLength: 3,
    isExporting: false,
    onExport: jest.fn(),
    view: 'entities' as const,
    setView: jest.fn(),
    filtering: mockFiltering,
  };

  it('renders the header with entity count', () => {
    render(<EntityViewerHeader {...defaultProps} />);
    expect(screen.getByText(/Extracted Entities \(3\)/)).toBeInTheDocument();
  });

  it('disables export button when exporting', () => {
    render(<EntityViewerHeader {...defaultProps} isExporting={true} />);
    expect(screen.getByLabelText(/Export to Obsidian/i)).toBeDisabled();
  });

  it('disables export button when entitiesLength is 0', () => {
    render(<EntityViewerHeader {...defaultProps} entitiesLength={0} />);
    expect(screen.getByLabelText(/Export to Obsidian/i)).toBeDisabled();
  });

  it('calls onExport when export button is clicked', () => {
    render(<EntityViewerHeader {...defaultProps} />);
    fireEvent.click(screen.getByLabelText(/Export to Obsidian/i));
    expect(defaultProps.onExport).toHaveBeenCalled();
  });

  it('shows EntityFilters when view is entities', () => {
    render(<EntityViewerHeader {...defaultProps} view='entities' />);
    expect(screen.getByText(/Duplicates/i)).toBeInTheDocument();
  });

  it('does not show EntityFilters when view is json', () => {
    render(<EntityViewerHeader {...defaultProps} view='json' />);
    expect(screen.queryByText(/Duplicates/i)).not.toBeInTheDocument();
  });

  it('toggles view when toggle buttons are clicked', () => {
    render(<EntityViewerHeader {...defaultProps} />);
    fireEvent.click(screen.getByText(/Raw Data/i));
    expect(defaultProps.setView).toHaveBeenCalledWith('json');
    fireEvent.click(screen.getByText(/Entity View/i));
    expect(defaultProps.setView).toHaveBeenCalledWith('entities');
  });
});
