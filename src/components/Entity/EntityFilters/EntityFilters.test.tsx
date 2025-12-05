import { render, screen, fireEvent } from '@testing-library/react';
import { EntityFilters, EntityFiltersProps } from './EntityFilters';
import userEvent from '@testing-library/user-event';

const defaultProps: EntityFiltersProps = {
  filterType: 'all',
  onFilterChange: jest.fn(),
  showDuplicates: false,
  onDuplicateToggle: jest.fn(),
  typeCounts: { Person: 2, Location: 3 },
  totalEntities: 5,
  totalDuplicates: 1,
};

describe('EntityFilters', () => {
  it('renders filter select with correct options', async () => {
    render(<EntityFilters {...defaultProps} />);
    expect(screen.getByText(/Filter by type/i)).toBeInTheDocument();
    expect(screen.getByText(/All Types \(5\)/)).toBeInTheDocument();
    await userEvent.click(screen.getByText(/All Types \(5\)/));
    expect(screen.getByText(/Person \(2\)/)).toBeInTheDocument();
    expect(screen.getByText(/Location \(3\)/)).toBeInTheDocument();
  });

  it('calls onFilterChange when filter is changed', async () => {
    render(<EntityFilters {...defaultProps} />);
    await userEvent.click(screen.getByText(/All Types \(5\)/));
    await userEvent.click(screen.getByText(/Person \(2\)/));
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith('Person');
  });

  it('renders duplicate toggle with correct label', () => {
    render(<EntityFilters {...defaultProps} />);
    expect(
      screen.getByLabelText(/Show only duplicates \(1\)/)
    ).toBeInTheDocument();
  });

  it('calls onDuplicateToggle when checkbox is toggled', () => {
    render(<EntityFilters {...defaultProps} />);
    const checkbox = screen.getByLabelText(/Show only duplicates/i);
    fireEvent.click(checkbox);
    expect(defaultProps.onDuplicateToggle).toHaveBeenCalledWith(true);
  });

  it('checkbox reflects showDuplicates prop', () => {
    render(<EntityFilters {...defaultProps} showDuplicates={true} />);
    const checkbox = screen.getByLabelText(
      /Show only duplicates/i
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });
});
