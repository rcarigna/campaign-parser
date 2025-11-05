import { render, screen, fireEvent } from '@testing-library/react';
import { EntityGrid } from './EntityGrid';
import { EntityKind, LocationType, type EntityWithId } from '@/types';

describe('EntityGrid', () => {
  const mockEntities: EntityWithId[] = [
    {
      id: '1',
      kind: EntityKind.NPC,
      title: 'Test NPC',
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
  ];

  const mockProps = {
    entities: mockEntities,
    duplicateIds: new Set<string>(),
    onEntityClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders entities correctly', () => {
    render(<EntityGrid {...mockProps} />);

    expect(screen.getByText('Test NPC')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });

  it('shows no results message when entities array is empty', () => {
    render(<EntityGrid {...mockProps} entities={[]} />);

    expect(
      screen.getByText('No entities match the current filter.')
    ).toBeInTheDocument();
  });

  it('calls onEntityClick when entity is clicked', () => {
    render(<EntityGrid {...mockProps} />);

    const entityCard = screen.getByText('Test NPC').closest('.entity-card');
    fireEvent.click(entityCard!);

    expect(mockProps.onEntityClick).toHaveBeenCalledWith(mockEntities[0]);
  });

  it('identifies missing fields correctly', () => {
    const incompleteEntity: EntityWithId = {
      id: '3',
      kind: EntityKind.NPC,
      title: 'Incomplete NPC',
      // Missing role, faction, importance
    };

    render(<EntityGrid {...mockProps} entities={[incompleteEntity]} />);

    expect(screen.getByText('Missing:')).toBeInTheDocument();
    expect(
      screen.getByText('character_name, role, faction')
    ).toBeInTheDocument();
  });

  it('handles selection mode correctly', () => {
    const onEntitySelect = jest.fn();
    render(
      <EntityGrid
        {...mockProps}
        isSelectionMode={true}
        selectedEntityIds={new Set(['1'])}
        onEntitySelect={onEntitySelect}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();

    fireEvent.click(checkboxes[1]);
    expect(onEntitySelect).toHaveBeenCalledWith('2', true);
  });

  it('shows duplicate badge for duplicate entities', () => {
    render(<EntityGrid {...mockProps} duplicateIds={new Set(['1'])} />);

    expect(screen.getByText('DUPE')).toBeInTheDocument();
  });

  it('handles entity discard correctly', () => {
    const onEntityDiscard = jest.fn();
    render(<EntityGrid {...mockProps} onEntityDiscard={onEntityDiscard} />);

    const discardButtons = screen.getAllByLabelText(/Discard/);
    fireEvent.click(discardButtons[0]);

    expect(onEntityDiscard).toHaveBeenCalledWith(mockEntities[0]);
  });
});
