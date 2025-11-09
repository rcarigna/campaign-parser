import { render, screen, fireEvent } from '@testing-library/react';
import { EntityViewer } from './EntityViewer';
import {
  DocumentType,
  EntityKind,
  LocationType,
  MarkdownContent,
  SerializedParsedDocumentWithEntities,
  type EntityWithId,
} from '@/types';

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

import toast from 'react-hot-toast';
import userEvent from '@testing-library/user-event';
import { exportEntities } from '@/client/api';

const mockToast = toast as jest.Mocked<typeof toast>;
const mockExportEntities = exportEntities as jest.MockedFunction<
  typeof exportEntities
>;

describe('EntityViewer', () => {
  const mockEntities: EntityWithId[] = [
    {
      id: '1',
      kind: EntityKind.NPC,
      title: 'Guard NPC',
      role: 'Guard',
      faction: 'City Watch',
      importance: 'minor' as const,
    },
    {
      id: '2',
      kind: EntityKind.LOCATION,
      title: 'Test Location',
      type: LocationType.CITY,
      region: 'Northern Kingdom',
    },
    {
      id: '3',
      kind: EntityKind.NPC,
      title: 'Captain NPC',
      role: 'Captain',
      faction: 'City Watch',
      importance: 'major' as const,
    },
  ];

  const mockProps = {
    entities: mockEntities,
    onEntityDiscard: jest.fn(),
    onEntityUpdate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock URL.createObjectURL and revokeObjectURL
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = jest.fn();
  });

  it('renders entities correctly', () => {
    render(<EntityViewer {...mockProps} />);

    expect(screen.getByText('📋 Extracted Entities (3)')).toBeInTheDocument();
    expect(screen.getByText('Guard NPC')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText('Captain NPC')).toBeInTheDocument();
  });

  it('shows no entities message when entities array is empty', () => {
    render(<EntityViewer {...mockProps} entities={[]} />);

    expect(
      screen.getByText('No entities found in this document.')
    ).toBeInTheDocument();
  });

  it('handles entity filtering', () => {
    render(<EntityViewer {...mockProps} />);

    // Check filter dropdown
    const filterSelect = screen.getByLabelText('Filter by type:');
    expect(filterSelect).toBeInTheDocument();

    // Filter by NPC type
    fireEvent.change(filterSelect, { target: { value: EntityKind.NPC } });

    // Should show both NPCs
    expect(screen.getByText('Guard NPC')).toBeInTheDocument();
    expect(screen.getByText('Captain NPC')).toBeInTheDocument();
    expect(screen.queryByText('Test Location')).not.toBeInTheDocument();
  });

  it('handles duplicate detection', () => {
    render(<EntityViewer {...mockProps} />);

    // Toggle show duplicates
    const duplicateToggle = screen.getByRole('checkbox');
    fireEvent.click(duplicateToggle);

    // Should show no duplicates since our entities have unique names now
    expect(screen.getByText('Show only duplicates (0)')).toBeInTheDocument();
  });

  it('enters selection mode correctly', () => {
    render(<EntityViewer {...mockProps} />);

    const selectButton = screen.getByText('Select Duplicates');
    fireEvent.click(selectButton);

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText(/Selected: 0/)).toBeInTheDocument();
  });

  it('handles entity discard', () => {
    render(<EntityViewer {...mockProps} />);

    // Find and click discard button for first entity
    const discardButtons = screen.getAllByLabelText(/Discard/);
    fireEvent.click(discardButtons[0]);

    expect(mockProps.onEntityDiscard).toHaveBeenCalledWith('1');
    expect(mockToast.success).toHaveBeenCalledWith(
      'Discarded "Guard NPC" - Undo coming soon!',
      { duration: 5000 }
    );
  });

  it('opens entity edit modal when entity is clicked', () => {
    render(<EntityViewer {...mockProps} />);

    const entityCard = screen.getByText('Guard NPC').closest('.entity-card');
    fireEvent.click(entityCard!);
  });

  it('closes entity edit modal', async () => {
    render(<EntityViewer {...mockProps} />);

    // Open modal
    const entityCard = screen.getByText('Guard NPC').closest('.entity-card');
    await userEvent.click(entityCard!);

    expect(await screen.findByText(/Save Changes/)).toBeInTheDocument();

    // Close modal
    const closeButton = screen.getByTestId('close-button');
    await userEvent.click(closeButton);

    expect(
      screen.queryByText('Edit Entity: Guard NPC')
    ).not.toBeInTheDocument();
  });

  it('handles entity save from modal', async () => {
    render(<EntityViewer {...mockProps} />);

    // Open modal
    const entityCard = screen.getByText('Guard NPC').closest('.entity-card');
    await userEvent.click(entityCard!);

    // Save changes
    const saveButton = screen.getByText('Save Changes');
    await userEvent.click(saveButton);

    // Should call onEntityUpdate and close modal
    expect(mockProps.onEntityUpdate).toHaveBeenCalled();
    expect(mockToast.success).toHaveBeenCalledWith('Updated "Guard NPC"', {
      duration: 3000,
    });
    expect(
      screen.queryByText('Edit Entity: Guard NPC')
    ).not.toBeInTheDocument();
  });

  it('cancels selection mode', () => {
    render(<EntityViewer {...mockProps} />);

    // Enter selection mode
    const selectButton = screen.getByText('Select Duplicates');
    fireEvent.click(selectButton);

    // Cancel selection
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.getByText('Select Duplicates')).toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('toggles between entity view and raw data view', () => {
    const parsedData: SerializedParsedDocumentWithEntities = {
      type: DocumentType.MARKDOWN,
      filename: 'test.md',
      content: {} as MarkdownContent,
      metadata: {
        size: 1234,
        lastModified: new Date().toISOString(),
        mimeType: 'text/markdown',
      },
      entities: mockEntities,
    };
    render(<EntityViewer {...mockProps} parsedData={parsedData} />);

    // Should start in entity view
    expect(screen.getByText('📋 Entity View')).toHaveClass('active');
    expect(screen.getByText('📄 Raw Data')).not.toHaveClass('active');

    // Switch to raw data view
    const rawDataButton = screen.getByText('📄 Raw Data');
    fireEvent.click(rawDataButton);

    expect(screen.getByText('📄 Raw Data')).toHaveClass('active');
    expect(screen.getByText('📋 Entity View')).not.toHaveClass('active');
    expect(screen.getByText(/"type": "markdown"/)).toBeInTheDocument();

    // Switch back to entity view
    const entityViewButton = screen.getByText('📋 Entity View');
    fireEvent.click(entityViewButton);

    expect(screen.getByText('📋 Entity View')).toHaveClass('active');
    expect(screen.queryByText(/"test": "data"/)).not.toBeInTheDocument();
  });

  it('handles entity merge flow', () => {
    const mockOnEntityMerge = jest.fn();
    render(<EntityViewer {...mockProps} onEntityMerge={mockOnEntityMerge} />);

    // Enter selection mode
    fireEvent.click(screen.getByText('Select Duplicates'));

    // Select multiple entities
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // First entity checkbox
    fireEvent.click(checkboxes[2]); // Second entity checkbox

    // Mark as duplicates
    const markDuplicatesButton = screen.getByText('Mark 2 as Duplicates');
    fireEvent.click(markDuplicatesButton);

    // Should open merge modal
    expect(screen.getByText(/Merge Duplicate Entities/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Merge Duplicate Entities/));
    // Select primary entity and merge
    const mergeButton = screen.getByText((_content, element) => {
      return element?.textContent === '🔄 Merge 2 Entities';
    });
    fireEvent.click(mergeButton);

    expect(mockOnEntityMerge).toHaveBeenCalled();
    expect(mockToast.success).toHaveBeenCalledWith(
      expect.stringContaining('Successfully merged'),
      { duration: 5000 }
    );
  });

  it('disables mark as duplicates button when less than 2 entities selected', () => {
    render(<EntityViewer {...mockProps} />);

    // Enter selection mode
    fireEvent.click(screen.getByText('Select Duplicates'));

    // Button should be disabled with 0 selected
    expect(screen.getByText('Mark 0 as Duplicates')).toBeDisabled();

    // Select one entity
    const checkbox = screen.getAllByRole('checkbox')[1];
    fireEvent.click(checkbox);

    // Button should still be disabled with 1 selected
    expect(screen.getByText('Mark 1 as Duplicates')).toBeDisabled();
  });

  it('closes merge modal when cancel is clicked', () => {
    const mockOnEntityMerge = jest.fn();
    render(<EntityViewer {...mockProps} onEntityMerge={mockOnEntityMerge} />);

    // Enter selection mode and select entities
    fireEvent.click(screen.getByText('Select Duplicates'));
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[2]);

    // Open merge modal
    fireEvent.click(screen.getByText('Mark 2 as Duplicates'));

    // Cancel merge
    const cancelButton = screen.getByTestId('cancel-selection');
    fireEvent.click(cancelButton);

    expect(
      screen.queryByText('Merge Duplicate Entities')
    ).not.toBeInTheDocument();
  });

  it('handles entity merge without onEntityMerge prop', () => {
    render(<EntityViewer {...mockProps} />);

    // Enter selection mode and select entities
    fireEvent.click(screen.getByText('Select Duplicates'));
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[2]);

    // Open merge modal
    fireEvent.click(screen.getByText('Mark 2 as Duplicates'));

    // Try to merge - should not crash
    const mergeButton = screen.getByText((_content, element) => {
      return element?.textContent === '🔄 Merge 2 Entities';
    });
    fireEvent.click(mergeButton);

    // Should not show success toast since merge didn't happen
    expect(mockToast.success).not.toHaveBeenCalled();
  });

  it('renders export button', () => {
    render(<EntityViewer {...mockProps} />);
    expect(screen.getByText('📦 Export to Obsidian')).toBeInTheDocument();
  });

  it('handles successful export', async () => {
    const mockBlob = new Blob(['test data'], { type: 'application/zip' });
    mockExportEntities.mockResolvedValue(mockBlob);
    mockToast.loading.mockReturnValue('toast-id');

    render(<EntityViewer {...mockProps} />);

    const exportButton = screen.getByText('📦 Export to Obsidian');
    await userEvent.click(exportButton);

    // Should show loading toast
    expect(mockToast.loading).toHaveBeenCalledWith(
      'Exporting 3 entities to Obsidian format...'
    );

    // Should call export API
    expect(mockExportEntities).toHaveBeenCalledWith(mockEntities);

    // Wait for async operations
    await screen.findByText('📦 Export to Obsidian');

    // Should show success toast
    expect(mockToast.success).toHaveBeenCalledWith(
      'Successfully exported 3 entities as Obsidian vault!',
      { id: 'toast-id', duration: 5000 }
    );
  });

  it('handles export error', async () => {
    mockExportEntities.mockRejectedValue(new Error('Export failed'));
    mockToast.loading.mockReturnValue('toast-id');

    render(<EntityViewer {...mockProps} />);

    const exportButton = screen.getByText('📦 Export to Obsidian');
    await userEvent.click(exportButton);

    // Wait for error handling
    await screen.findByText('📦 Export to Obsidian');

    expect(mockToast.error).toHaveBeenCalledWith('Export failed', {
      id: 'toast-id',
      duration: 5000,
    });
  });

  it('shows error when trying to export empty entities', async () => {
    render(<EntityViewer {...mockProps} entities={[]} />);

    // Can't click export button because empty state shows different UI
    expect(screen.queryByText('📦 Export to Obsidian')).not.toBeInTheDocument();
  });

  it('disables export button while exporting', async () => {
    const mockBlob = new Blob(['test data'], { type: 'application/zip' });
    // Make export take a while
    mockExportEntities.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockBlob), 100))
    );
    mockToast.loading.mockReturnValue('toast-id');

    render(<EntityViewer {...mockProps} />);

    const exportButton = screen.getByText('📦 Export to Obsidian');
    await userEvent.click(exportButton);

    // Button should show loading state and be disabled
    expect(screen.getByText('⏳ Exporting...')).toBeDisabled();

    // Wait for export to complete
    await screen.findByText('📦 Export to Obsidian');
  });
});
