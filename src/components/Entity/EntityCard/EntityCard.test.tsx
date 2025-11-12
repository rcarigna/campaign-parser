import { render, screen, fireEvent } from '@testing-library/react';
import { EntityCard, EntityCardProps } from './EntityCard';
import { EntityKind, LocationType, EntityWithId } from '@/types';
import { mockEntity } from '../../__mocks__';

const mockOnClick = jest.fn();
const mockOnDiscard = jest.fn();
const mockOnSelect = jest.fn();

const getDefaultProps: (
  overrides?: Partial<EntityCardProps>
) => EntityCardProps = (overrides = {}) => ({
  entity: mockEntity,
  isDuplicate: false,
  missingFields: [],
  onClick: mockOnClick,
  ...overrides,
});

const renderEntityCard = (props = {}) =>
  render(<EntityCard {...getDefaultProps(props)} />);

describe('EntityCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders entity card with basic information', () => {
    renderEntityCard();
    expect(screen.getByText('Test NPC')).toBeInTheDocument();
    expect(screen.getByText('👤')).toBeInTheDocument();
    expect(screen.getByText('npc')).toBeInTheDocument();
    expect(screen.getByText('Role: warrior')).toBeInTheDocument();
  });

  it('renders duplicate badge when isDuplicate is true', () => {
    renderEntityCard({ isDuplicate: true });
    expect(screen.getByText('DUPE')).toBeInTheDocument();
  });

  it('renders discard button when onDiscard handler is provided', () => {
    renderEntityCard({ onDiscard: mockOnDiscard });
    const discardButton = screen.getByRole('button', {
      name: /discard test npc/i,
    });
    expect(discardButton).toBeInTheDocument();
    expect(discardButton).toHaveTextContent('🗑️');
  });

  it('calls onDiscard when discard button is clicked', () => {
    renderEntityCard({ onDiscard: mockOnDiscard });
    const discardButton = screen.getByRole('button', {
      name: /discard test npc/i,
    });
    fireEvent.click(discardButton);
    expect(mockOnDiscard).toHaveBeenCalledWith(mockEntity);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('does not render discard button when onDiscard handler is not provided', () => {
    renderEntityCard();
    expect(
      screen.queryByRole('button', { name: /discard/i })
    ).not.toBeInTheDocument();
  });

  it('shows missing fields when provided', () => {
    renderEntityCard({ missingFields: ['faction', 'importance'] });
    expect(screen.getByText('Missing:')).toBeInTheDocument();
    expect(screen.getByText('faction, importance')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    renderEntityCard();
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
    renderEntityCard({ entity: locationEntity });
    expect(screen.getByText('🗺️')).toBeInTheDocument();
    expect(screen.getByText('Type: dungeon')).toBeInTheDocument();
  });

  it('renders session summary entity with correct icon', () => {
    const sessionSummaryEntity: EntityWithId = {
      id: 'session-1',
      kind: EntityKind.SESSION_SUMMARY,
      title: 'Session 1 Summary',
    };
    renderEntityCard({ entity: sessionSummaryEntity });
    expect(screen.getByText('📜')).toBeInTheDocument();
    expect(screen.getByText(sessionSummaryEntity.title)).toBeInTheDocument();
  });

  it('renders checkbox when isSelectable is true', () => {
    renderEntityCard({
      isSelectable: true,
      isSelected: false,
      onSelect: mockOnSelect,
    });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('renders checked checkbox when isSelected is true', () => {
    renderEntityCard({
      isSelectable: true,
      isSelected: true,
      onSelect: mockOnSelect,
    });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls onSelect when checkbox is changed', () => {
    renderEntityCard({
      isSelectable: true,
      isSelected: false,
      onSelect: mockOnSelect,
    });
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(mockOnSelect).toHaveBeenCalledWith('test-id', true);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when checkbox is clicked', () => {
    renderEntityCard({
      isSelectable: true,
      isSelected: false,
      onSelect: mockOnSelect,
    });
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('renders entity with source sessions', () => {
    const entityWithSessions: EntityWithId = {
      ...mockEntity,
      sourceSessions: [1, 2],
    };
    renderEntityCard({ entity: entityWithSessions });
    expect(screen.getByText(/Sessions: 1, 2/)).toBeInTheDocument();
  });

  it('applies correct CSS classes based on props', () => {
    renderEntityCard({ isDuplicate: true, isSelected: true });
    const card = screen.getByText('Test NPC').closest('.entity-card');
    expect(card).toHaveClass('entity-card', 'duplicate', 'selected');
  });
});
