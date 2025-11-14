import { render, screen, fireEvent } from '@testing-library/react';
import { EntityGrid } from './EntityGrid';
import {
  mockNPCEntity,
  mockLocationEntity,
} from '@/components/__mocks__/mockedEntities';
import { EntityKind, type EntityWithId } from '@/types';

describe('EntityGrid', () => {
  const defaultEntities: EntityWithId[] = [mockNPCEntity, mockLocationEntity];

  const setupProps = (
    overrides: Partial<{
      entities: EntityWithId[];
      duplicateIds: Set<string>;
      onEntityClick: jest.Mock;
      isSelectionMode?: boolean;
      selectedEntityIds?: Set<string>;
      onEntitySelect?: jest.Mock;
      onEntityDiscard?: jest.Mock;
    }> = {}
  ) => {
    return {
      entities: defaultEntities,
      duplicateIds: new Set<string>(),
      onEntityClick: jest.fn(),
      ...overrides,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders entities correctly', () => {
    render(<EntityGrid {...setupProps()} />);
    expect(screen.getByText(defaultEntities[0].title)).toBeInTheDocument();
    expect(screen.getByText(defaultEntities[1].title)).toBeInTheDocument();
  });

  it('shows no results message when entities array is empty', () => {
    render(<EntityGrid {...setupProps({ entities: [] })} />);
    expect(
      screen.getByText('No entities match the current filter.')
    ).toBeInTheDocument();
  });

  it('calls onEntityClick when entity is clicked', () => {
    const props = setupProps();
    render(<EntityGrid {...props} />);
    const entityCard = screen
      .getByText(defaultEntities[0].title)
      .closest('.entity-card');
    fireEvent.click(entityCard!);
    expect(props.onEntityClick).toHaveBeenCalledWith(defaultEntities[0]);
  });

  it('identifies missing fields correctly', () => {
    const incompleteEntity: EntityWithId = {
      id: '3',
      kind: EntityKind.NPC,
      title: 'Incomplete NPC',
      // Missing role, faction, importance
    };
    render(<EntityGrid {...setupProps({ entities: [incompleteEntity] })} />);
    expect(screen.getByText('Missing:')).toBeInTheDocument();
    expect(
      screen.getByText('character_name, role, faction, importance')
    ).toBeInTheDocument();
  });

  it('handles selection mode correctly', () => {
    const onEntitySelect = jest.fn();
    render(
      <EntityGrid
        {...setupProps({
          isSelectionMode: true,
          selectedEntityIds: new Set([defaultEntities[0].id]),
          onEntitySelect,
        })}
      />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    fireEvent.click(checkboxes[1]);
    expect(onEntitySelect).toHaveBeenCalledWith(defaultEntities[1].id, true);
  });

  it('shows duplicate badge for duplicate entities', () => {
    render(
      <EntityGrid
        {...setupProps({ duplicateIds: new Set([defaultEntities[0].id]) })}
      />
    );
    expect(screen.getByText('DUPE')).toBeInTheDocument();
  });

  it('handles entity discard correctly', () => {
    const onEntityDiscard = jest.fn();
    render(<EntityGrid {...setupProps({ onEntityDiscard })} />);
    const discardButtons = screen.getAllByLabelText(/Discard/);
    fireEvent.click(discardButtons[0]);
    expect(onEntityDiscard).toHaveBeenCalledWith(defaultEntities[0]);
  });
});
