import { render, screen } from '@testing-library/react';
import { EntityGrid } from './EntityGrid';
import { EntityKind } from '../../types/constants';

const mockOnEntityClick = jest.fn();

const mockEntities = [
  {
    id: '1',
    kind: EntityKind.NPC,
    title: 'Test NPC',
    role: 'warrior',
  } as any,
  {
    id: '2',
    kind: EntityKind.LOCATION,
    title: 'Test Location',
    type: 'dungeon',
  } as any,
];

describe('EntityGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders entities in a grid', () => {
    render(
      <EntityGrid
        entities={mockEntities}
        duplicateIds={new Set()}
        onEntityClick={mockOnEntityClick}
      />
    );

    expect(screen.getByText('Test NPC')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });

  it('shows no results message when entities array is empty', () => {
    render(
      <EntityGrid
        entities={[]}
        duplicateIds={new Set()}
        onEntityClick={mockOnEntityClick}
      />
    );

    expect(
      screen.getByText('No entities match the current filter.')
    ).toBeInTheDocument();
  });

  it('marks entities as duplicates when their ids are in duplicateIds set', () => {
    const duplicateIds = new Set(['1']);

    render(
      <EntityGrid
        entities={mockEntities}
        duplicateIds={duplicateIds}
        onEntityClick={mockOnEntityClick}
      />
    );

    expect(screen.getByText('DUPE')).toBeInTheDocument();
  });

  it('shows missing fields for entities', () => {
    const incompleteNPC = {
      id: '3',
      kind: EntityKind.NPC,
      title: 'Incomplete NPC',
      // Missing role, faction, importance
    } as any;

    render(
      <EntityGrid
        entities={[incompleteNPC]}
        duplicateIds={new Set()}
        onEntityClick={mockOnEntityClick}
      />
    );

    expect(screen.getByText('Missing:')).toBeInTheDocument();
    expect(screen.getByText('role, faction, importance')).toBeInTheDocument();
  });
});
