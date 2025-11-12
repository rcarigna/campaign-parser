import { render, screen } from '@testing-library/react';
import { EntityEditModal } from './EntityEditModal';
import { EntityKind } from '@/types';
import userEvent from '@testing-library/user-event';
import { mockPlayerEntity } from '@/components/__mocks__';

const mockOnClose = jest.fn();
const mockOnSave = jest.fn();
const getDefaultProps = (overrides = {}) => ({
  entity: mockPlayerEntity,
  onClose: mockOnClose,
  onSave: mockOnSave,
  ...overrides,
});
const renderEditModal = (props = {}) =>
  render(<EntityEditModal {...getDefaultProps(props)} />);

const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

beforeEach(() => jest.clearAllMocks());
afterAll(() => mockConsoleLog.mockRestore());

describe('EntityEditModal', () => {
  describe('Rendering', () => {
    it('renders the modal with entity information', () => {
      renderEditModal();
      expect(screen.getByText(/Edit Entity: Test Player/)).toBeInTheDocument();
      expect(screen.getByText(/Test Player Title/)).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Player Title')).toBeInTheDocument();
    });
    it('renders action buttons', () => {
      renderEditModal();
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
      renderEditModal();
      expect(
        screen.getByText(/Edit Entity: Test Player Title/)
      ).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls onClose when close button is clicked', async () => {
      renderEditModal();
      await userEvent.click(
        screen.getByRole('button', { name: 'Close modal' })
      );
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
    it('calls onClose when cancel button is clicked', async () => {
      renderEditModal();
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
    it('calls onSave with entity when save button is clicked', async () => {
      renderEditModal();
      await userEvent.click(
        screen.getByRole('button', { name: 'Save Changes' })
      );
      expect(mockOnSave).toHaveBeenCalledTimes(1);
      expect(mockOnSave).toHaveBeenCalledWith({
        ...mockPlayerEntity,
        class: '',
        level: '',
        player_name: '',
        race: '',
        status: '',
        tags: 'hero',
      });
    });
    it('calls onClose when modal overlay is clicked', async () => {
      renderEditModal();
      await userEvent.click(screen.getByTestId('modal-overlay'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
    it('does not call onClose when modal content is clicked', async () => {
      renderEditModal();
      await userEvent.click(screen.getByTestId('modal-content'));
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  it.each([
    [EntityKind.LOCATION, 'Test Location'],
    [EntityKind.ITEM, 'Test Item'],
  ])('renders correctly for %s entity', (kind, title) => {
    renderEditModal({ entity: { ...mockPlayerEntity, kind, title } });
    expect(
      screen.getByText(new RegExp(`Edit Entity: ${title}`))
    ).toBeInTheDocument();
  });

  describe('Accessibility', () => {
    it('has proper modal structure with test ids', () => {
      renderEditModal();
      const overlay = screen.getByTestId('modal-overlay');
      const content = screen.getByTestId('modal-content');
      expect(overlay).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });
    it('stops propagation when clicking modal content', async () => {
      renderEditModal();
      const stopPropagationSpy = jest.fn();
      const modalContent = screen.getByTestId('modal-content');
      modalContent.addEventListener('click', (e) => {
        e.stopPropagation = stopPropagationSpy;
        e.stopPropagation();
      });
      await userEvent.click(modalContent);
      expect(stopPropagationSpy).toHaveBeenCalled();
    });
    it('updates entity type when selector is changed', async () => {
      renderEditModal();
      const select = screen.getByLabelText(/Entity Type/i);
      const locationOption = screen.getByRole('option', { name: /Location/i });
      await userEvent.selectOptions(select, locationOption);
      expect(
        screen.getByText(/Changing entity type will preserve existing fields/i)
      ).toBeInTheDocument();
    });
    it('shows changed entity type label when type is changed', async () => {
      renderEditModal();
      const select = screen.getByLabelText(/Entity Type/i);
      await userEvent.selectOptions(
        select,
        screen.getByRole('option', { name: /Location/i })
      );
      expect(screen.getByText(/Changed from PLAYER/i)).toBeInTheDocument();
    });
  });
});
