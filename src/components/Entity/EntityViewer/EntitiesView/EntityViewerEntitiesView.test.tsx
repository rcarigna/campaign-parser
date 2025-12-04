import { render, screen, fireEvent } from '@testing-library/react';
import { EntityViewerEntitiesView } from './EntityViewerEntitiesView';
import { UseEntityFilteringReturn, UseEntitySelectionReturn } from '../hooks';
import { defaultMockEntities as mockEntities } from '../../../__mocks__/mockedEntities';
import userEvent from '@testing-library/user-event';

const filtering = {
  filteredEntities: mockEntities,
  duplicateIds: new Set(['2']),
} as UseEntityFilteringReturn;

const selection = {
  isSelectionMode: false,
  selectedEntityIds: new Set<string>(),
  handleMarkAsDuplicates: jest.fn(),
  handleCancelSelection: jest.fn(),
  setIsSelectionMode: jest.fn(),
  handleEntitySelect: jest.fn(),
  mergeModalEntities: null,
  setMergeModalEntities: jest.fn(),
  clearEntitySelection: jest.fn(),
} as UseEntitySelectionReturn;

const handleEntityClick = jest.fn();
const handleEntityDiscard = jest.fn();
const setSelectedEntity = jest.fn();
const handleEntitySave = jest.fn();
const handleEntityMerge = jest.fn();

describe('EntityViewerEntitiesView', () => {
  it('renders EntityViewerSelectionControls and EntityGrid', () => {
    render(
      <EntityViewerEntitiesView
        entities={mockEntities}
        filtering={filtering}
        selection={selection}
        handleEntityClick={handleEntityClick}
        handleEntityDiscard={handleEntityDiscard}
        selectedEntity={null}
        setSelectedEntity={setSelectedEntity}
        handleEntitySave={handleEntitySave}
        handleEntityMerge={handleEntityMerge}
      />
    );
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getByText('Select Duplicates')).toBeInTheDocument();
  });

  it('calls handleEntityClick when entity is clicked in non-selection mode', async () => {
    render(
      <EntityViewerEntitiesView
        entities={mockEntities}
        filtering={filtering}
        selection={selection}
        handleEntityClick={handleEntityClick}
        handleEntityDiscard={handleEntityDiscard}
        selectedEntity={null}
        setSelectedEntity={setSelectedEntity}
        handleEntitySave={handleEntitySave}
        handleEntityMerge={handleEntityMerge}
      />
    );
    // Simulate clicking the first entity card
    const entityCard = screen.getByText(mockEntities[0].title);
    await userEvent.click(entityCard);
    expect(handleEntityClick).toHaveBeenCalled();
  });

  it('calls handleEntitySelect when entity is clicked in selection mode', async () => {
    const selectionMode = {
      ...selection,
      isSelectionMode: true,
      selectedEntityIds: new Set(['1']),
    };
    render(
      <EntityViewerEntitiesView
        entities={mockEntities}
        filtering={filtering}
        selection={selectionMode}
        handleEntityClick={handleEntityClick}
        handleEntityDiscard={handleEntityDiscard}
        selectedEntity={null}
        setSelectedEntity={setSelectedEntity}
        handleEntitySave={handleEntitySave}
        handleEntityMerge={handleEntityMerge}
      />
    );
    const entityCard = screen.getByText(mockEntities[0].title);
    await userEvent.click(entityCard);
    expect(selectionMode.handleEntitySelect).toHaveBeenCalledWith('1', false);
  });

  it('renders EntityEditModal when selectedEntity is set', () => {
    render(
      <EntityViewerEntitiesView
        entities={mockEntities}
        filtering={filtering}
        selection={selection}
        handleEntityClick={handleEntityClick}
        handleEntityDiscard={handleEntityDiscard}
        selectedEntity={mockEntities[0]}
        setSelectedEntity={setSelectedEntity}
        handleEntitySave={handleEntitySave}
        handleEntityMerge={handleEntityMerge}
      />
    );
    expect(
      screen.getByText(`Edit Entity: ${mockEntities[0].title}`)
    ).toBeInTheDocument();
  });

  it('renders EntityMergeModal when mergeModalEntities is set', () => {
    const selectionWithMerge = {
      ...selection,
      mergeModalEntities: [mockEntities[0], mockEntities[1]],
    };
    render(
      <EntityViewerEntitiesView
        entities={mockEntities}
        filtering={filtering}
        selection={selectionWithMerge}
        handleEntityClick={handleEntityClick}
        handleEntityDiscard={handleEntityDiscard}
        selectedEntity={null}
        setSelectedEntity={setSelectedEntity}
        handleEntitySave={handleEntitySave}
        handleEntityMerge={handleEntityMerge}
      />
    );
    expect(screen.getByText(/Merge Duplicate Entities/)).toBeInTheDocument();
  });
});
