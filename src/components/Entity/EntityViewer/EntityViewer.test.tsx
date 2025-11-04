import { render, screen, fireEvent } from '@testing-library/react';
import { EntityViewer } from './EntityViewer';
import { EntityKind, LocationType, type EntityWithId } from '@/types';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

import toast from 'react-hot-toast';
const mockToast = toast as jest.Mocked<typeof toast>;

describe('EntityViewer', () => {
  const mockEntities: EntityWithId[] = [
    {
      id: '1',
      kind: EntityKind.NPC,
      title: 'Guard NPC',
      role: 'Guard',
      faction: 'City Watch',
      importance: 'minor' as const,
    },
    {
      id: '2',
      kind: EntityKind.LOCATION,
      title: 'Test Location',
      type: LocationType.CITY,
      region: 'Northern Kingdom',
    },
    {
      id: '3',
      kind: EntityKind.NPC,
      title: 'Captain NPC',
      role: 'Captain',
      faction: 'City Watch',
      importance: 'major' as const,
    },
  ];

  const mockProps = {
    entities: mockEntities,
    onEntityDiscard: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders entities correctly', () => {
    render(<EntityViewer {...mockProps} />);

    expect(screen.getByText('📋 Extracted Entities (3)')).toBeInTheDocument();
    expect(screen.getByText('Guard NPC')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText('Captain NPC')).toBeInTheDocument();
  });

  it('shows no entities message when entities array is empty', () => {
    render(<EntityViewer {...mockProps} entities={[]} />);

    expect(
      screen.getByText('No entities found in this document.')
    ).toBeInTheDocument();
  });

  it('handles entity filtering', () => {
    render(<EntityViewer {...mockProps} />);

    // Check filter dropdown
    const filterSelect = screen.getByLabelText('Filter by type:');
    expect(filterSelect).toBeInTheDocument();

    // Filter by NPC type
    fireEvent.change(filterSelect, { target: { value: EntityKind.NPC } });

    // Should show both NPCs
    expect(screen.getByText('Guard NPC')).toBeInTheDocument();
    expect(screen.getByText('Captain NPC')).toBeInTheDocument();
    expect(screen.queryByText('Test Location')).not.toBeInTheDocument();
  });

  it('handles duplicate detection', () => {
    render(<EntityViewer {...mockProps} />);

    // Toggle show duplicates
    const duplicateToggle = screen.getByRole('checkbox');
    fireEvent.click(duplicateToggle);

    // Should show no duplicates since our entities have unique names now
    expect(screen.getByText('Show only duplicates (0)')).toBeInTheDocument();
  });

  it('enters selection mode correctly', () => {
    render(<EntityViewer {...mockProps} />);

    const selectButton = screen.getByText('Select Duplicates');
    fireEvent.click(selectButton);

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText(/Selected: 0/)).toBeInTheDocument();
  });

  it('handles entity discard', () => {
    render(<EntityViewer {...mockProps} />);

    // Find and click discard button for first entity
    const discardButtons = screen.getAllByLabelText(/Discard/);
    fireEvent.click(discardButtons[0]);

    expect(mockProps.onEntityDiscard).toHaveBeenCalledWith('1');
    expect(mockToast.success).toHaveBeenCalledWith(
      'Discarded "Guard NPC" - Undo coming soon!',
      { duration: 5000 }
    );
  });

  it('opens entity edit modal when entity is clicked', () => {
    render(<EntityViewer {...mockProps} />);

    const entityCard = screen.getByText('Guard NPC').closest('.entity-card');
    fireEvent.click(entityCard!);

    expect(screen.getByText('Edit Entity: Guard NPC')).toBeInTheDocument();
    expect(
      screen.getByText('Entity editing functionality coming soon...')
    ).toBeInTheDocument();
  });

  it('closes entity edit modal', () => {
    render(<EntityViewer {...mockProps} />);

    // Open modal
    const entityCard = screen.getByText('Guard NPC').closest('.entity-card');
    fireEvent.click(entityCard!);

    // Close modal
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(
      screen.queryByText('Edit Entity: Guard NPC')
    ).not.toBeInTheDocument();
  });

  it('handles entity save from modal', () => {
    render(<EntityViewer {...mockProps} />);

    // Open modal
    const entityCard = screen.getByText('Guard NPC').closest('.entity-card');
    fireEvent.click(entityCard!);

    // Save changes
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    // The save functionality should work (console.log is still used for save)
    expect(
      screen.queryByText('Edit Entity: Guard NPC')
    ).not.toBeInTheDocument();
  });

  it('cancels selection mode', () => {
    render(<EntityViewer {...mockProps} />);

    // Enter selection mode
    const selectButton = screen.getByText('Select Duplicates');
    fireEvent.click(selectButton);

    // Cancel selection
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.getByText('Select Duplicates')).toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });
});
