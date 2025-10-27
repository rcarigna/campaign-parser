import { render, screen, fireEvent } from '@testing-library/react';
import { EntityFilters } from './EntityFilters';
import { EntityKind } from '../../types/constants';

const mockOnFilterChange = jest.fn();
const mockOnDuplicateToggle = jest.fn();

const mockProps = {
  filterType: 'all' as const,
  onFilterChange: mockOnFilterChange,
  showDuplicates: false,
  onDuplicateToggle: mockOnDuplicateToggle,
  typeCounts: {
    [EntityKind.NPC]: 3,
    [EntityKind.LOCATION]: 2,
    [EntityKind.ITEM]: 1,
  },
  totalEntities: 6,
  totalDuplicates: 2,
};

describe('EntityFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders filter controls with correct counts', () => {
    render(<EntityFilters {...mockProps} />);

    expect(screen.getByLabelText('Filter by type:')).toBeInTheDocument();
    expect(screen.getByText('All Types (6)')).toBeInTheDocument();
    expect(screen.getByText(/npc \(3\)/)).toBeInTheDocument();
    expect(screen.getByText(/location \(2\)/)).toBeInTheDocument();
    expect(screen.getByText(/item \(1\)/)).toBeInTheDocument();
  });

  it('calls onFilterChange when filter selection changes', () => {
    render(<EntityFilters {...mockProps} />);

    const select = screen.getByLabelText('Filter by type:');
    fireEvent.change(select, { target: { value: EntityKind.NPC } });

    expect(mockOnFilterChange).toHaveBeenCalledWith(EntityKind.NPC);
  });

  it('renders duplicate toggle with correct count', () => {
    render(<EntityFilters {...mockProps} />);

    expect(screen.getByText('Show only duplicates (2)')).toBeInTheDocument();
  });

  it('calls onDuplicateToggle when checkbox is clicked', () => {
    render(<EntityFilters {...mockProps} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnDuplicateToggle).toHaveBeenCalledWith(true);
  });

  it('shows correct selected value', () => {
    render(<EntityFilters {...mockProps} filterType={EntityKind.NPC} />);

    const select = screen.getByLabelText(
      'Filter by type:'
    ) as HTMLSelectElement;
    expect(select.value).toBe(EntityKind.NPC);
  });

  it('shows checked state when showDuplicates is true', () => {
    render(<EntityFilters {...mockProps} showDuplicates={true} />);

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });
});
