import { render, screen, fireEvent } from '@testing-library/react';
import { EntityCard } from './EntityCard';
import { EntityKind, LocationType, type EntityWithId } from '@/types';

const mockEntity: EntityWithId = {
  id: 'test-id',
  kind: EntityKind.NPC,
  title: 'Test NPC',
  role: 'warrior',
};

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

  it('renders duplicate badge when isDuplicate is true', () => {
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

  it('renders discard button when onDiscard handler is provided', () => {
    const mockOnDiscard = jest.fn();

    render(
      <EntityCard
        entity={mockEntity}
        isDuplicate={false}
        missingFields={[]}
        onClick={mockOnClick}
        onDiscard={mockOnDiscard}
      />
    );

    const discardButton = screen.getByRole('button', {
      name: /discard test npc/i,
    });
    expect(discardButton).toBeInTheDocument();
    expect(discardButton).toHaveTextContent('🗑️');
  });

  it('calls onDiscard when discard button is clicked', () => {
    const mockOnDiscard = jest.fn();

    render(
      <EntityCard
        entity={mockEntity}
        isDuplicate={false}
        missingFields={[]}
        onClick={mockOnClick}
        onDiscard={mockOnDiscard}
      />
    );

    const discardButton = screen.getByRole('button', {
      name: /discard test npc/i,
    });
    fireEvent.click(discardButton);

    expect(mockOnDiscard).toHaveBeenCalledWith(mockEntity);
    expect(mockOnClick).not.toHaveBeenCalled(); // Should not trigger card click
  });

  it('does not render discard button when onDiscard handler is not provided', () => {
    render(
      <EntityCard
        entity={mockEntity}
        isDuplicate={false}
        missingFields={[]}
        onClick={mockOnClick}
      />
    );

    expect(
      screen.queryByRole('button', { name: /discard/i })
    ).not.toBeInTheDocument();
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
    const locationEntity: EntityWithId = {
      id: 'location-1',
      kind: EntityKind.LOCATION,
      title: 'Test Location',
      type: LocationType.DUNGEON,
    };

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
