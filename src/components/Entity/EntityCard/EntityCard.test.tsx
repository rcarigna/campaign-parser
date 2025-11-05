import { render, screen, fireEvent } from '@testing-library/react';
import { EntityCard } from './EntityCard';
import { EntityKind, LocationType, EntityWithId } from '@/types';

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

  it('renders session summary entity with correct icon', () => {
    const sessionSummaryEntity: EntityWithId = {
      id: 'session-1',
      kind: EntityKind.SESSION_SUMMARY,
      title: 'Session 1 Summary',
    };

    render(
      <EntityCard
        entity={sessionSummaryEntity}
        isDuplicate={false}
        missingFields={[]}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText('📜')).toBeInTheDocument();
    expect(screen.getByText(sessionSummaryEntity.title)).toBeInTheDocument();
  });

  it('renders checkbox when isSelectable is true', () => {
    const mockOnSelect = jest.fn();

    render(
      <EntityCard
        entity={mockEntity}
        isDuplicate={false}
        missingFields={[]}
        onClick={mockOnClick}
        isSelectable={true}
        isSelected={false}
        onSelect={mockOnSelect}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('renders checked checkbox when isSelected is true', () => {
    const mockOnSelect = jest.fn();

    render(
      <EntityCard
        entity={mockEntity}
        isDuplicate={false}
        missingFields={[]}
        onClick={mockOnClick}
        isSelectable={true}
        isSelected={true}
        onSelect={mockOnSelect}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls onSelect when checkbox is changed', () => {
    const mockOnSelect = jest.fn();

    render(
      <EntityCard
        entity={mockEntity}
        isDuplicate={false}
        missingFields={[]}
        onClick={mockOnClick}
        isSelectable={true}
        isSelected={false}
        onSelect={mockOnSelect}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnSelect).toHaveBeenCalledWith(true);
    expect(mockOnClick).not.toHaveBeenCalled(); // Should not trigger card click
  });

  it('does not call onClick when checkbox is clicked', () => {
    const mockOnSelect = jest.fn();

    render(
      <EntityCard
        entity={mockEntity}
        isDuplicate={false}
        missingFields={[]}
        onClick={mockOnClick}
        isSelectable={true}
        isSelected={false}
        onSelect={mockOnSelect}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('renders entity with source sessions', () => {
    const entityWithSessions: EntityWithId = {
      ...mockEntity,
      sourceSessions: [1, 2],
    };

    render(
      <EntityCard
        entity={entityWithSessions}
        isDuplicate={false}
        missingFields={[]}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText(/Sessions: 1, 2/)).toBeInTheDocument();
  });

  it('applies correct CSS classes based on props', () => {
    render(
      <EntityCard
        entity={mockEntity}
        isDuplicate={true}
        missingFields={[]}
        onClick={mockOnClick}
        isSelected={true}
      />
    );

    const card = screen.getByText('Test NPC').closest('.entity-card');
    expect(card).toHaveClass('entity-card', 'duplicate', 'selected');
  });
});
