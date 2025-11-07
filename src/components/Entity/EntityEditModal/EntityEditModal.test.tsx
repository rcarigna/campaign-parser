import { render, screen, fireEvent } from '@testing-library/react';
import { EntityEditModal } from './EntityEditModal';
import { EntityKind, EntityWithId } from '@/types';
import * as formGenerator from '@/lib/formGenerator';

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
    title: 'Test Player',
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

      expect(screen.getByText('Edit Entity: Test Player')).toBeInTheDocument();
      expect(
        screen.getByText((_content, element) => {
          return element?.textContent === 'Type: player';
        })
      ).toBeInTheDocument();
      expect(screen.getByText('Title:')).toBeInTheDocument();
      expect(screen.getByText('Test Player')).toBeInTheDocument();
      expect(
        screen.getByText(/Entity editing functionality coming soon.../)
      ).toBeInTheDocument();
    });

    it('renders action buttons', () => {
      renderComponent();

      expect(
        screen.getByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Save Changes' })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument();
    });

    it('calls getEntityFields with correct entity kind', () => {
      renderComponent();

      expect(mockConsoleLog).toHaveBeenCalledWith('Form fields for player:', [
        {
          key: 'title',
          label: 'Title',
          options: undefined,
          placeholder: 'Enter title...',
          required: true,
          type: 'text',
        },
        {
          key: 'tags',
          label: 'Tags',
          options: undefined,
          placeholder: 'Add tags...',
          required: false,
          type: 'array',
        },
        {
          key: 'character_name',
          label: 'Character Name',
          options: undefined,
          placeholder: 'Enter character name...',
          required: true,
          type: 'text',
        },
        {
          key: 'player_name',
          label: 'Player Name',
          options: undefined,
          placeholder: 'Enter player name...',
          required: false,
          type: 'text',
        },
        {
          key: 'race',
          label: 'Race',
          options: undefined,
          placeholder: 'Enter race...',
          required: false,
          type: 'text',
        },
        {
          key: 'class',
          label: 'Class',
          options: undefined,
          placeholder: 'Enter class...',
          required: false,
          type: 'text',
        },
        {
          key: 'level',
          label: 'Level',
          options: undefined,
          placeholder: '0',
          required: false,
          type: 'number',
        },
        {
          key: 'status',
          label: 'Status',
          options: undefined,
          placeholder: 'Enter status...',
          required: false,
          type: 'text',
        },
      ]);
    });
  });

  describe('User Interactions', () => {
    it('calls onClose when close button is clicked', () => {
      renderComponent();

      fireEvent.click(screen.getByRole('button', { name: '×' }));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when cancel button is clicked', () => {
      renderComponent();

      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onSave with entity when save button is clicked', () => {
      renderComponent();

      fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

      expect(mockOnSave).toHaveBeenCalledTimes(1);
      expect(mockOnSave).toHaveBeenCalledWith(mockEntity);
    });

    it('calls onClose when modal overlay is clicked', () => {
      renderComponent();

      fireEvent.click(screen.getByTestId('modal-overlay'));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when modal content is clicked', () => {
      renderComponent();

      fireEvent.click(screen.getByTestId('modal-content'));

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
        screen.getByText('Edit Entity: Test Location')
      ).toBeInTheDocument();
      expect(
        screen.getByText((_content, element) => {
          return element?.textContent === 'Type: location';
        })
      ).toBeInTheDocument();
    });

    it('renders correctly for item entity', () => {
      const itemEntity: EntityWithId = {
        ...mockEntity,
        kind: EntityKind.ITEM,
        title: 'Test Item',
      };

      renderComponent({ entity: itemEntity });

      expect(screen.getByText('Edit Entity: Test Item')).toBeInTheDocument();
      expect(
        screen.getByText((_content, element) => {
          return element?.textContent === 'Type: item';
        })
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper modal structure with test ids', () => {
      const { container } = renderComponent();

      const overlay = container.querySelector('.modal-overlay');
      const content = container.querySelector('.modal-content');

      expect(overlay).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });

    it('stops propagation when clicking modal content', () => {
      renderComponent();

      const modalContent = screen.getByTestId('modal-content');
      const clickEvent = new MouseEvent('click', { bubbles: true });
      const stopPropagationSpy = jest.spyOn(clickEvent, 'stopPropagation');

      fireEvent(modalContent, clickEvent);

      expect(stopPropagationSpy).toHaveBeenCalled();
    });
  });
});
