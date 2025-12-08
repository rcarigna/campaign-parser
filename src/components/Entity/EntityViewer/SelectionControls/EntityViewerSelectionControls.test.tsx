import { render, screen, fireEvent } from '@testing-library/react';
import { EntityViewerSelectionControls } from './EntityViewerSelectionControls';

describe('EntityViewerSelectionControls', () => {
  const mockMarkDuplicates = jest.fn();
  const mockCancelSelection = jest.fn();
  const mockSelectDuplicates = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders Select Duplicates button when not in selection mode', () => {
    render(
      <EntityViewerSelectionControls
        isSelectionMode={false}
        selectedEntityCount={0}
        onMarkDuplicates={mockMarkDuplicates}
        onCancelSelection={mockCancelSelection}
        onSelectDuplicates={mockSelectDuplicates}
      />
    );
    const selectBtn = screen.getByText(/Select Duplicates/i);
    expect(selectBtn).toBeInTheDocument();
    fireEvent.click(selectBtn);
    expect(mockSelectDuplicates).toHaveBeenCalledTimes(1);
  });

  it('renders selection controls when in selection mode', () => {
    render(
      <EntityViewerSelectionControls
        isSelectionMode={true}
        selectedEntityCount={3}
        onMarkDuplicates={mockMarkDuplicates}
        onCancelSelection={mockCancelSelection}
        onSelectDuplicates={mockSelectDuplicates}
      />
    );
    expect(screen.getByTestId('mark-duplicates')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-selection')).toBeInTheDocument();
    expect(screen.getByText(/Selected: 3/)).toBeInTheDocument();
  });

  it('disables Mark Duplicates button if selectedEntityCount < 2', () => {
    render(
      <EntityViewerSelectionControls
        isSelectionMode={true}
        selectedEntityCount={1}
        onMarkDuplicates={mockMarkDuplicates}
        onCancelSelection={mockCancelSelection}
        onSelectDuplicates={mockSelectDuplicates}
      />
    );
    const markBtn = screen.getByTestId('mark-duplicates');
    expect(markBtn).toBeDisabled();
  });

  it('enables Mark Duplicates button if selectedEntityCount >= 2', () => {
    render(
      <EntityViewerSelectionControls
        isSelectionMode={true}
        selectedEntityCount={2}
        onMarkDuplicates={mockMarkDuplicates}
        onCancelSelection={mockCancelSelection}
        onSelectDuplicates={mockSelectDuplicates}
      />
    );
    const markBtn = screen.getByTestId('mark-duplicates');
    expect(markBtn).not.toBeDisabled();
    fireEvent.click(markBtn);
    expect(mockMarkDuplicates).toHaveBeenCalledTimes(1);
  });

  it('calls onCancelSelection when Cancel button is clicked', () => {
    render(
      <EntityViewerSelectionControls
        isSelectionMode={true}
        selectedEntityCount={2}
        onMarkDuplicates={mockMarkDuplicates}
        onCancelSelection={mockCancelSelection}
        onSelectDuplicates={mockSelectDuplicates}
      />
    );
    const cancelBtn = screen.getByTestId('cancel-selection');
    fireEvent.click(cancelBtn);
    expect(mockCancelSelection).toHaveBeenCalledTimes(1);
  });
});
