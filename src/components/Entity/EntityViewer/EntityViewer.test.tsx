import { render, screen, waitFor } from '@testing-library/react';
import { EntityViewer } from './EntityViewer';
import { EntityKind } from '@/types';
import {
  setupEntityViewerTest,
  mockToast,
  mockExportEntities,
  mockOnEntityDiscard,
  mockOnEntityUpdate,
  mockParsedDocument,
} from './testUtils';

import userEvent from '@testing-library/user-event';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
  },
}));

// Mock the export API
jest.mock('@/client/api', () => ({
  exportEntities: jest.fn(),
}));

describe('EntityViewer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnEntityDiscard.mockClear();
    mockOnEntityUpdate.mockClear();
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = jest.fn();
  });

  it('renders entities correctly', () => {
    setupEntityViewerTest((props) => render(<EntityViewer {...props} />));
    expect(screen.getByText('📋 Extracted Entities (3)')).toBeInTheDocument();
    expect(screen.getByText('Guard NPC')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText('Captain NPC')).toBeInTheDocument();
  });

  it('shows no entities message when entities array is empty', () => {
    setupEntityViewerTest((props) => render(<EntityViewer {...props} />), {
      entities: [],
    });
    expect(
      screen.getByText('No entities found in this document.')
    ).toBeInTheDocument();
  });

  it('handles entity filtering', async () => {
    setupEntityViewerTest((props) => render(<EntityViewer {...props} />));
    const filterSelect = screen.getByLabelText('Filter by type:');
    expect(filterSelect).toBeInTheDocument();
    await userEvent.selectOptions(filterSelect, EntityKind.NPC);
    expect(screen.getByText('Guard NPC')).toBeInTheDocument();
    expect(screen.getByText('Captain NPC')).toBeInTheDocument();
    expect(screen.queryByText('Test Location')).not.toBeInTheDocument();
  });

  it('handles duplicate detection', async () => {
    setupEntityViewerTest((props) => render(<EntityViewer {...props} />));
    const duplicateToggle = screen.getByRole('checkbox');
    await userEvent.click(duplicateToggle);
    expect(screen.getByText('Show only duplicates (0)')).toBeInTheDocument();
  });

  it('enters selection mode correctly', async () => {
    setupEntityViewerTest((props) => render(<EntityViewer {...props} />));
    const selectButton = screen.getByText('Select Duplicates');
    await userEvent.click(selectButton);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText(/Selected: 0/)).toBeInTheDocument();
  });

  it('handles entity discard', async () => {
    setupEntityViewerTest((props) => render(<EntityViewer {...props} />));
    const discardButton = screen.getByLabelText('Discard Guard NPC');
    await userEvent.click(discardButton);
    expect(mockOnEntityDiscard).toHaveBeenCalledWith('1');
    expect(mockToast.success).toHaveBeenCalledWith(
      'Discarded "Guard NPC" - Undo coming soon!',
      { duration: 5000 }
    );
  });

  it('opens entity edit modal when entity is clicked', async () => {
    setupEntityViewerTest((props) => render(<EntityViewer {...props} />));
    const entityCard = screen.getByText('Guard NPC').closest('.entity-card');
    await userEvent.click(entityCard!);
  });

  it('closes entity edit modal', async () => {
    setupEntityViewerTest((props) => render(<EntityViewer {...props} />));
    const entityCard = screen.getByText('Guard NPC').closest('.entity-card');
    await userEvent.click(entityCard!);
    expect(await screen.findByText(/Save Changes/)).toBeInTheDocument();
    const closeButton = screen.getByTestId('close-button');
    await userEvent.click(closeButton);
    expect(
      screen.queryByText('Edit Entity: Guard NPC')
    ).not.toBeInTheDocument();
  });

  it('handles entity save from modal', async () => {
    setupEntityViewerTest((props) => render(<EntityViewer {...props} />));
    const entityCard = screen.getByText('Guard NPC').closest('.entity-card');
    await userEvent.click(entityCard!);
    const titleInput = screen.getByLabelText(/title/i);
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Guard NPC Updated');
    const saveButton = screen.getByText('Save Changes');
    await userEvent.click(saveButton);
    expect(mockOnEntityUpdate).toHaveBeenCalled();
    expect(mockToast.success).toHaveBeenCalledWith(
      'Updated "Guard NPC Updated"',
      {
        duration: 3000,
      }
    );
    expect(
      screen.queryByText('Edit Entity: Guard NPC')
    ).not.toBeInTheDocument();
  });

  it('cancels selection mode', async () => {
    setupEntityViewerTest((props) => render(<EntityViewer {...props} />));
    const selectButton = screen.getByText('Select Duplicates');
    await userEvent.click(selectButton);
    const cancelButton = screen.getByText('Cancel');
    await userEvent.click(cancelButton);
    expect(screen.getByText('Select Duplicates')).toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('toggles between entity view and raw data view', async () => {
    setupEntityViewerTest((props) => render(<EntityViewer {...props} />), {
      mockParsedDocument,
    });
    expect(screen.getByText('📋 Entity View')).toHaveClass('active');
    expect(screen.getByText('📄 Raw Data')).not.toHaveClass('active');
    const rawDataButton = screen.getByText('📄 Raw Data');
    await userEvent.click(rawDataButton);
    expect(screen.getByText('📄 Raw Data')).toHaveClass('active');
    expect(screen.getByText('📋 Entity View')).not.toHaveClass('active');
    expect(
      screen.getByText((content) => content.includes('"kind": "location"'))
    ).toBeInTheDocument();
    const entityViewButton = screen.getByText('📋 Entity View');
    await userEvent.click(entityViewButton);
    expect(screen.getByText('📋 Entity View')).toHaveClass('active');
    expect(screen.queryByText(/"test": "data"/)).not.toBeInTheDocument();
  });

  it('handles entity merge flow', async () => {
    const mockOnEntityMerge = jest.fn();
    setupEntityViewerTest((props) => render(<EntityViewer {...props} />), {
      onEntityMerge: mockOnEntityMerge,
    });
    await userEvent.click(screen.getByText('Select Duplicates'));
    expect(screen.getByText(/Mark 0 as Duplicates/)).toBeInTheDocument();
    expect(
      screen.getByText(/Select entities to mark as duplicates. Selected: 0/)
    ).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('select-checkbox-1'));
    await waitFor(() =>
      expect(screen.getByText(/Mark 1 as Duplicates/)).toBeInTheDocument()
    );
    await userEvent.click(screen.getByTestId('select-checkbox-2'));
    const markDuplicatesButton = screen.getByText(
      (_content, element) =>
        element?.textContent?.replace(/\s+/g, ' ').trim() ===
        'Mark 2 as Duplicates'
    );
    await userEvent.click(markDuplicatesButton);
    expect(screen.getByText(/Merge Duplicate Entities/)).toBeInTheDocument();
    await userEvent.click(screen.getByText(/Merge Duplicate Entities/));
    const mergeButton = screen.getByText((_content, element) => {
      return element?.textContent === '🔄 Merge 2 Entities';
    });
    await userEvent.click(mergeButton);
    expect(mockOnEntityMerge).toHaveBeenCalled();
    expect(mockToast.success).toHaveBeenCalledWith(
      expect.stringContaining('Successfully merged'),
      { duration: 5000 }
    );
  });

  it('disables mark as duplicates button when less than 2 entities selected', async () => {
    setupEntityViewerTest((props) => render(<EntityViewer {...props} />));
    await userEvent.click(screen.getByText('Select Duplicates'));
    expect(screen.getByText('Mark 0 as Duplicates')).toBeDisabled();
    const checkbox = screen.getAllByRole('checkbox')[1];
    await userEvent.click(checkbox);
    expect(
      screen.getByText(
        (_content, element) =>
          element?.textContent?.replace(/\s+/g, ' ').trim() ===
          'Mark 1 as Duplicates'
      )
    ).toBeDisabled();
  });

  it('closes merge modal when cancel is clicked', async () => {
    const mockOnEntityMerge = jest.fn();
    setupEntityViewerTest((props) => render(<EntityViewer {...props} />), {
      onEntityMerge: mockOnEntityMerge,
    });
    await userEvent.click(screen.getByText('Select Duplicates'));
    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[1]);
    await userEvent.click(checkboxes[2]);
    await userEvent.click(screen.getByText('Mark 2 as Duplicates'));
    const cancelButton = screen.getByTestId('cancel-selection');
    await userEvent.click(cancelButton);
    expect(
      screen.queryByText('Merge Duplicate Entities')
    ).not.toBeInTheDocument();
  });

  it('handles entity merge without onEntityMerge prop', async () => {
    setupEntityViewerTest((props) => render(<EntityViewer {...props} />));
    await userEvent.click(screen.getByText('Select Duplicates'));
    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[1]);
    await userEvent.click(checkboxes[2]);
    await userEvent.click(screen.getByText('Mark 2 as Duplicates'));
    const mergeButton = screen.getByText((_content, element) => {
      return element?.textContent === '🔄 Merge 2 Entities';
    });
    await userEvent.click(mergeButton);
    expect(mockToast.success).not.toHaveBeenCalled();
  });

  it('renders export button', () => {
    setupEntityViewerTest((props) => render(<EntityViewer {...props} />));
    expect(screen.getByText('📦 Export to Obsidian')).toBeInTheDocument();
  });

  it('handles successful export', async () => {
    const mockBlob = new Blob(['test data'], { type: 'application/zip' });
    mockExportEntities.mockResolvedValue(mockBlob);
    mockToast.loading.mockReturnValue('toast-id');
    const { props } = setupEntityViewerTest((p) =>
      render(<EntityViewer {...p} />)
    );
    const exportButton = screen.getByText('📦 Export to Obsidian');
    await userEvent.click(exportButton);
    expect(mockToast.loading).toHaveBeenCalledWith(
      'Exporting 3 entities to Obsidian format...'
    );
    expect(mockExportEntities).toHaveBeenCalledWith(props.entities);
    await screen.findByText('📦 Export to Obsidian');
    expect(mockToast.success).toHaveBeenCalledWith(
      'Successfully exported 3 entities as Obsidian vault!',
      { id: 'toast-id', duration: 5000 }
    );
  });

  it('handles export error', async () => {
    mockExportEntities.mockRejectedValue(new Error('Export failed'));
    mockToast.loading.mockReturnValue('toast-id');
    setupEntityViewerTest((props) => render(<EntityViewer {...props} />));
    const exportButton = screen.getByText('📦 Export to Obsidian');
    await userEvent.click(exportButton);
    await screen.findByText('📦 Export to Obsidian');
    expect(mockToast.error).toHaveBeenCalledWith('Export failed', {
      id: 'toast-id',
      duration: 5000,
    });
  });

  it('shows error when trying to export empty entities', async () => {
    setupEntityViewerTest((props) => render(<EntityViewer {...props} />), {
      entities: [],
    });
    expect(screen.queryByText('📦 Export to Obsidian')).not.toBeInTheDocument();
  });

  it('disables export button while exporting', async () => {
    const mockBlob = new Blob(['test data'], { type: 'application/zip' });
    mockExportEntities.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockBlob), 100))
    );
    mockToast.loading.mockReturnValue('toast-id');
    setupEntityViewerTest((props) => render(<EntityViewer {...props} />));
    const exportButton = screen.getByText('📦 Export to Obsidian');
    await userEvent.click(exportButton);
    expect(screen.getByText('⏳ Exporting...')).toBeDisabled();
    await screen.findByText('📦 Export to Obsidian');
  });
});
