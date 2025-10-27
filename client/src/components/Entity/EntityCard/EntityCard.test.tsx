import { render, screen, fireEvent } from '@testing-library/react';
import { EntityCard } from './EntityCard';
import { EntityKind } from '../../../types/constants';

const mockEntity = {
  id: 'test-id',
  kind: EntityKind.NPC,
  title: 'Test NPC',
  role: 'warrior',
} as any;

const mockOnClick = jest.fn();

describe('EntityCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders entity card with basic information', () => {
    render(
      <EntityCard
        entity={mockEntity}
        isDuplicate={false}
        missingFields={[]}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText('Test NPC')).toBeInTheDocument();
    expect(screen.getByText('👤')).toBeInTheDocument();
    expect(screen.getByText('npc')).toBeInTheDocument();
    expect(screen.getByText('Role: warrior')).toBeInTheDocument();
  });

  it('shows duplicate badge when isDuplicate is true', () => {
    render(
      <EntityCard
        entity={mockEntity}
        isDuplicate={true}
        missingFields={[]}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText('DUPE')).toBeInTheDocument();
  });

  it('shows missing fields when provided', () => {
    render(
      <EntityCard
        entity={mockEntity}
        isDuplicate={false}
        missingFields={['faction', 'importance']}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText('Missing:')).toBeInTheDocument();
    expect(screen.getByText('faction, importance')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    render(
      <EntityCard
        entity={mockEntity}
        isDuplicate={false}
        missingFields={[]}
        onClick={mockOnClick}
      />
    );

    const card = screen.getByText('Test NPC').closest('.entity-card');
    fireEvent.click(card!);

    expect(mockOnClick).toHaveBeenCalledWith(mockEntity);
  });

  it('renders different entity types with correct icons', () => {
    const locationEntity = {
      ...mockEntity,
      kind: EntityKind.LOCATION,
      title: 'Test Location',
      type: 'dungeon',
    } as any;

    render(
      <EntityCard
        entity={locationEntity}
        isDuplicate={false}
        missingFields={[]}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText('🗺️')).toBeInTheDocument();
    expect(screen.getByText('Type: dungeon')).toBeInTheDocument();
  });
});
