import { render, screen, waitFor } from '@testing-library/react';
import { EntitiesView } from './EntitiesView';
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

describe('EntitiesView', () => {
  it('renders SelectionControls and EntityGrid', () => {
    render(
      <EntitiesView
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
      <EntitiesView
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
      <EntitiesView
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
      <EntitiesView
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
      <EntitiesView
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
  it('clears entity selection when merge modal is closed', async () => {
    const selectionWithMerge = {
      ...selection,
      mergeModalEntities: [mockEntities[0], mockEntities[1]],
    };
    render(
      <EntitiesView
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

    // Simulate merging entities
    await userEvent.click(screen.getByTestId('close-button'));

    await waitFor(() =>
      expect(selectionWithMerge.setMergeModalEntities).toHaveBeenCalled()
    );
  });
  it('clears entity sselection when edit modal is closed', async () => {
    render(
      <EntitiesView
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

    // Simulate closing the edit modal
    await userEvent.click(screen.getByTestId('close-button'));

    await waitFor(() => expect(setSelectedEntity).toHaveBeenCalledWith(null));
  });
  it('cancels selection when cancel button is clicked', async () => {
    const selectionInMode = {
      ...selection,
      isSelectionMode: true,
    };
    render(
      <EntitiesView
        entities={mockEntities}
        filtering={filtering}
        selection={selectionInMode}
        handleEntityClick={handleEntityClick}
        handleEntityDiscard={handleEntityDiscard}
        selectedEntity={null}
        setSelectedEntity={setSelectedEntity}
        handleEntitySave={handleEntitySave}
        handleEntityMerge={handleEntityMerge}
      />
    );

    // Simulate clicking the cancel selection button
    await userEvent.click(screen.getByText('Cancel'));

    await waitFor(() =>
      expect(selectionInMode.handleCancelSelection).toHaveBeenCalled()
    );
  });

  it('marks duplicates when mark duplicates button is clicked', async () => {
    const selectionInMode = {
      ...selection,
      selectedEntityIds: new Set(['1', '2']),
      isSelectionMode: true,
    };
    render(
      <EntitiesView
        entities={mockEntities}
        filtering={filtering}
        selection={selectionInMode}
        handleEntityClick={handleEntityClick}
        handleEntityDiscard={handleEntityDiscard}
        selectedEntity={null}
        setSelectedEntity={setSelectedEntity}
        handleEntitySave={handleEntitySave}
        handleEntityMerge={handleEntityMerge}
      />
    );

    // Simulate clicking the mark duplicates button
    await userEvent.click(screen.getByTestId('mark-duplicates'));

    await waitFor(() =>
      expect(selectionInMode.handleMarkAsDuplicates).toHaveBeenCalledWith(
        mockEntities
      )
    );
  });

  it('toggles selection mode when select duplicates button is clicked', async () => {
    render(
      <EntitiesView
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

    // Simulate clicking the select duplicates button
    await userEvent.click(screen.getByText('Select Duplicates'));

    await waitFor(() =>
      expect(selection.setIsSelectionMode).toHaveBeenCalledWith(true)
    );
  });
});
