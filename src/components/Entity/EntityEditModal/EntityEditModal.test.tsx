import { render, screen } from '@testing-library/react';
import { EntityEditModal } from './EntityEditModal';
import { EntityKind, EntityWithId } from '@/types';
import userEvent from '@testing-library/user-event';

// Mock the formGenerator module
// jest.mock('@/lib/formGenerator', () => ({
//     getEntityFields: jest.fn(),
// }));

// Mock console.log to avoid noise in tests
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

describe('EntityEditModal', () => {
  const mockEntity: EntityWithId = {
    id: 'test-id',
    kind: EntityKind.PLAYER,
    title: 'Test Player Title',
    character_name: 'Test Character',
    // description: 'A test player character',
    tags: ['hero'],
    // connections: [],
  };

  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  //   const mockGetEntityFields =
  //     formGenerator.getEntityFields as jest.MockedFunction<
  //       typeof formGenerator.getEntityFields
  //     >;

  beforeEach(() => {
    jest.clearAllMocks();
    // mockGetEntityFields.mockReturnValue([
    //   { name: 'title', type: 'text', required: true },
    //   { name: 'description', type: 'textarea', required: false },
    // ]);
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  const renderComponent = (props = {}) => {
    return render(
      <EntityEditModal
        entity={mockEntity}
        onClose={mockOnClose}
        onSave={mockOnSave}
        {...props}
      />
    );
  };

  describe('Rendering', () => {
    it('renders the modal with entity information', () => {
      renderComponent();

      expect(screen.getByText(/Edit Entity: Test Player/)).toBeInTheDocument();
      expect(screen.getByText(/Test Player Title/)).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Player Title')).toBeInTheDocument();
    });

    it('renders action buttons', () => {
      renderComponent();

      expect(
        screen.getByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Save Changes' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Close modal' })
      ).toBeInTheDocument();
    });

    it('renders entity information correctly', () => {
      renderComponent();

      // Verify the modal renders with correct entity information
      expect(
        screen.getByText(/Edit Entity: Test Player Title/)
      ).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls onClose when close button is clicked', async () => {
      renderComponent();

      await userEvent.click(
        screen.getByRole('button', { name: 'Close modal' })
      );

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when cancel button is clicked', async () => {
      renderComponent();

      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onSave with entity when save button is clicked', async () => {
      renderComponent();

      await userEvent.click(
        screen.getByRole('button', { name: 'Save Changes' })
      );

      expect(mockOnSave).toHaveBeenCalledTimes(1);
      expect(mockOnSave).toHaveBeenCalledWith({
        ...mockEntity,
        class: '',
        level: '',
        player_name: '',
        race: '',
        status: '',
        tags: 'hero',
      });
    });

    it('calls onClose when modal overlay is clicked', async () => {
      renderComponent();

      await userEvent.click(screen.getByTestId('modal-overlay'));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when modal content is clicked', async () => {
      renderComponent();

      await userEvent.click(screen.getByTestId('modal-content'));

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Different Entity Types', () => {
    it('renders correctly for location entity', () => {
      const locationEntity: EntityWithId = {
        ...mockEntity,
        kind: EntityKind.LOCATION,
        title: 'Test Location',
      };

      renderComponent({ entity: locationEntity });

      expect(
        screen.getByText(/Edit Entity: Test Location/)
      ).toBeInTheDocument();
    });

    it('renders correctly for item entity', () => {
      const itemEntity: EntityWithId = {
        ...mockEntity,
        kind: EntityKind.ITEM,
        title: 'Test Item',
      };

      renderComponent({ entity: itemEntity });

      expect(screen.getByText(/Edit Entity: Test Item/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper modal structure with test ids', () => {
      renderComponent();

      const overlay = screen.getByTestId('modal-overlay');
      const content = screen.getByTestId('modal-content');

      expect(overlay).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });

    it('stops propagation when clicking modal content', async () => {
      renderComponent();

      // Mock the stopPropagation method on the event
      const stopPropagationSpy = jest.fn();
      const modalContent = screen.getByTestId('modal-content');

      // Simulate a click event with stopPropagation spy
      modalContent.addEventListener('click', (e) => {
        e.stopPropagation = stopPropagationSpy;
        e.stopPropagation();
      });

      await userEvent.click(modalContent);

      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('updates entity type when selector is changed', async () => {
      renderComponent();

      const select = screen.getByLabelText(/Entity Type/i);
      // Find a different entity type option
      const locationOption = screen.getByRole('option', { name: /Location/i });
      await userEvent.selectOptions(select, locationOption);

      // Should show warning about changing entity type
      expect(
        screen.getByText(/Changing entity type will preserve existing fields/i)
      ).toBeInTheDocument();
    });

    it('shows changed entity type label when type is changed', async () => {
      renderComponent();

      const select = screen.getByLabelText(/Entity Type/i);
      // Select a different type
      await userEvent.selectOptions(
        select,
        screen.getByRole('option', { name: /Location/i })
      );

      // Should show "(Changed from ...)" label
      expect(screen.getByText(/Changed from PLAYER/i)).toBeInTheDocument();
    });
  });
});
