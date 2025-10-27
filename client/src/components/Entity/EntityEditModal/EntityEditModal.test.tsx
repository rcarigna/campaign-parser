import { render, screen, fireEvent } from '@testing-library/react';
import { EntityEditModal } from './EntityEditModal';
import { EntityKind } from '../../../types/constants';

const mockOnClose = jest.fn();
const mockOnSave = jest.fn();

const mockEntity = {
  id: 'test-id',
  kind: EntityKind.NPC,
  title: 'Test NPC',
  role: 'warrior',
} as any;

describe('EntityEditModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with entity information', () => {
    render(
      <EntityEditModal
        entity={mockEntity}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Edit npc: Test NPC')).toBeInTheDocument();
    expect(screen.getByLabelText('Title:')).toBeInTheDocument();
    expect(screen.getByLabelText('Role:')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <EntityEditModal
        entity={mockEntity}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when overlay is clicked', () => {
    render(
      <EntityEditModal
        entity={mockEntity}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const overlay = document.querySelector('.modal-overlay');
    fireEvent.click(overlay!);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not call onClose when modal content is clicked', () => {
    render(
      <EntityEditModal
        entity={mockEntity}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const content = document.querySelector('.modal-content');
    fireEvent.click(content!);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('updates field values when inputs change', () => {
    render(
      <EntityEditModal
        entity={mockEntity}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const titleInput = screen.getByLabelText('Title:') as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: 'Updated NPC' } });

    expect(titleInput.value).toBe('Updated NPC');
  });

  it('calls onSave with updated entity when form is submitted', () => {
    render(
      <EntityEditModal
        entity={mockEntity}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const titleInput = screen.getByLabelText('Title:');
    fireEvent.change(titleInput, { target: { value: 'Updated NPC' } });

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockEntity,
        title: 'Updated NPC',
      })
    );
  });

  it('renders different fields for different entity types', () => {
    const locationEntity = {
      id: 'loc-id',
      kind: EntityKind.LOCATION,
      title: 'Test Location',
    } as any;

    render(
      <EntityEditModal
        entity={locationEntity}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByLabelText('Type:')).toBeInTheDocument();
    expect(screen.getByLabelText('Region:')).toBeInTheDocument();
  });
});
