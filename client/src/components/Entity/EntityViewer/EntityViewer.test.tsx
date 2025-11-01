import { render, screen, fireEvent } from '@testing-library/react';
import { EntityViewer } from './EntityViewer';
import {
  type EntityWithId,
  EntityKind,
  LocationType,
  ItemType,
} from '../../../types/constants';

const entities: EntityWithId[] = [
  {
    id: 'npc-0',
    kind: EntityKind.NPC,
    title: 'Durnan',
    role: 'barkeep',
    description: 'Friendly tavern keeper',
    location: 'Yawning Portal',
  },
  {
    id: 'npc-1',
    kind: EntityKind.NPC,
    title: 'Durnan', // Duplicate for testing
    role: 'innkeeper',
  },
  {
    id: 'location-0',
    kind: EntityKind.LOCATION,
    title: 'Yawning Portal',
    type: LocationType.TAVERN,
  },
  {
    id: 'item-0',
    kind: EntityKind.ITEM,
    title: 'Magic Sword',
    type: ItemType.WEAPON,
  },
  {
    id: 'quest-0',
    kind: EntityKind.QUEST,
    title: 'Rescue the Princess',
    status: 'active',
  },
];

// Mock discard handler
const mockOnEntityDiscard = jest.fn();

describe('EntityViewer', () => {
  beforeEach(() => {
    mockOnEntityDiscard.mockClear();
  });

  it('renders entities correctly', () => {
    render(
      <EntityViewer entities={entities} onEntityDiscard={mockOnEntityDiscard} />
    );

    expect(screen.getByText('📋 Extracted Entities (5)')).toBeInTheDocument();

    // Check for entity titles - there are 2 Durnan NPCs
    const durnanElements = screen.getAllByText('Durnan');
    expect(durnanElements).toHaveLength(2);

    expect(screen.getByText('Yawning Portal')).toBeInTheDocument();
    expect(screen.getByText('Magic Sword')).toBeInTheDocument();
    expect(screen.getByText('Rescue the Princess')).toBeInTheDocument();
  });

  it('filters entities by type', () => {
    render(
      <EntityViewer entities={entities} onEntityDiscard={mockOnEntityDiscard} />
    );

    const filterSelect = screen.getByLabelText('Filter by type:');
    fireEvent.change(filterSelect, { target: { value: 'npc' } });

    // Should show both NPCs
    expect(screen.getAllByText('Durnan')).toHaveLength(2);
    // Should not show location
    expect(screen.queryByText('Yawning Portal')).not.toBeInTheDocument();
  });

  it('detects and highlights duplicates', () => {
    render(
      <EntityViewer entities={entities} onEntityDiscard={mockOnEntityDiscard} />
    );

    // Check for duplicate badges
    const duplicateBadges = screen.getAllByText('DUPE');
    expect(duplicateBadges).toHaveLength(2); // Both Durnan entries
  });

  it('shows missing fields warnings', () => {
    render(
      <EntityViewer entities={entities} onEntityDiscard={mockOnEntityDiscard} />
    );

    // Look for missing field indicators
    expect(screen.getAllByText(/Missing:/)).toHaveLength(5); // All entities missing some fields
  });

  it('opens edit modal when entity card is clicked', () => {
    render(
      <EntityViewer entities={entities} onEntityDiscard={mockOnEntityDiscard} />
    );

    const entityCard = screen.getAllByText('Durnan')[0].closest('.entity-card');
    fireEvent.click(entityCard!);

    expect(screen.getByText('Edit npc: Durnan')).toBeInTheDocument();
  });

  it('handles empty entities', () => {
    render(
      <EntityViewer entities={[]} onEntityDiscard={mockOnEntityDiscard} />
    );

    expect(
      screen.getByText('No entities found in this document.')
    ).toBeInTheDocument();
  });

  it('displays toast notification when no entities are found', () => {
    render(
      <EntityViewer entities={[]} onEntityDiscard={mockOnEntityDiscard} />
    );
    expect(
      screen.getByText('No entities found in this document.')
    ).toBeInTheDocument();
  });
  it('displays toast success notification when entities are found', () => {
    render(
      <EntityViewer entities={entities} onEntityDiscard={mockOnEntityDiscard} />
    );

    expect(screen.getByText('📋 Extracted Entities (5)')).toBeInTheDocument();
  });
});
