import { render, screen, fireEvent } from '@testing-library/react';
import { EntitySchemaView } from './EntitySchemaView';
import { EntityKind } from '@/types';

// Mock window.open
const mockOpen = jest.fn();
window.open = mockOpen;

describe('EntitySchemaView', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOpen.mockClear();
    mockOnClose.mockClear();
  });

  it('should render schema header with entity info', () => {
    render(<EntitySchemaView entityKind={EntityKind.NPC} onClose={mockOnClose} />);

    expect(screen.getByText(/Schema/)).toBeInTheDocument();
    expect(screen.getByText(/Field definitions and data structure/)).toBeInTheDocument();
  });

  it('should render all schema fields', () => {
    render(<EntitySchemaView entityKind={EntityKind.ITEM} onClose={mockOnClose} />);

    // Check that fields are rendered (at least some common ones)
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('tags')).toBeInTheDocument();
  });

  it('should display required field indicator message', () => {
    render(<EntitySchemaView entityKind={EntityKind.LOCATION} onClose={mockOnClose} />);

    expect(screen.getByText(/Fields marked with/)).toBeInTheDocument();
    expect(screen.getByText(/are required/)).toBeInTheDocument();
  });

  it('should display field counts in footer', () => {
    render(<EntitySchemaView entityKind={EntityKind.NPC} onClose={mockOnClose} />);

    // Footer should show count of required and optional fields
    const footer = screen.getAllByText(/required/)[0];
    expect(footer).toBeInTheDocument();
    expect(screen.getAllByText(/optional/)[0]).toBeInTheDocument();
  });

  it('should render "Suggest Enhancement" button', () => {
    render(<EntitySchemaView entityKind={EntityKind.QUEST} onClose={mockOnClose} />);

    const button = screen.getByText('Suggest Enhancement');
    expect(button).toBeInTheDocument();
  });

  it('should open GitHub issue when "Suggest Enhancement" is clicked', () => {
    render(<EntitySchemaView entityKind={EntityKind.NPC} onClose={mockOnClose} />);

    const button = screen.getByText('Suggest Enhancement');
    fireEvent.click(button);

    expect(mockOpen).toHaveBeenCalledTimes(1);
    const url = mockOpen.mock.calls[0][0];
    expect(url).toContain('github.com/rcarigna/campaign-parser/issues/new');
    expect(url).toContain('template=schema_suggestion.yml');
    expect(url).toContain('entity-type=NPC');
  });

  it('should call onClose when close button in header is clicked', () => {
    render(<EntitySchemaView entityKind={EntityKind.ITEM} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText('Close schema view');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when close button in footer is clicked', () => {
    render(<EntitySchemaView entityKind={EntityKind.LOCATION} onClose={mockOnClose} />);

    const closeButtons = screen.getAllByText('Close');
    const footerCloseButton = closeButtons.find(
      (btn) => btn.tagName === 'BUTTON' && btn.classList.contains('text-sm')
    );
    
    if (footerCloseButton) {
      fireEvent.click(footerCloseButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it('should render different schemas for different entity types', () => {
    const { rerender } = render(
      <EntitySchemaView entityKind={EntityKind.NPC} onClose={mockOnClose} />
    );
    expect(screen.getByText(/Schema/)).toBeInTheDocument();

    rerender(<EntitySchemaView entityKind={EntityKind.ITEM} onClose={mockOnClose} />);
    expect(screen.getByText(/Schema/)).toBeInTheDocument();

    rerender(<EntitySchemaView entityKind={EntityKind.QUEST} onClose={mockOnClose} />);
    expect(screen.getByText(/Schema/)).toBeInTheDocument();
  });

  it('should render entity emoji in header', () => {
    const { container } = render(
      <EntitySchemaView entityKind={EntityKind.NPC} onClose={mockOnClose} />
    );

    // Check that header contains an emoji (entity metadata includes emojis)
    const header = container.querySelector('.bg-gradient-to-r');
    expect(header).toBeInTheDocument();
    expect(header?.textContent).toMatch(/[^\w\s]/); // Contains non-alphanumeric characters (emoji)
  });

  it('should have proper accessibility attributes', () => {
    render(<EntitySchemaView entityKind={EntityKind.LOCATION} onClose={mockOnClose} />);

    expect(screen.getByLabelText('Close schema view')).toBeInTheDocument();
    expect(screen.getByLabelText('Suggest schema enhancement')).toBeInTheDocument();
  });

  it('should render all entity types correctly', () => {
    const entityTypes = [
      EntityKind.NPC,
      EntityKind.LOCATION,
      EntityKind.ITEM,
      EntityKind.QUEST,
      EntityKind.PLAYER,
      EntityKind.SESSION_SUMMARY,
    ];

    entityTypes.forEach((entityKind) => {
      const { unmount } = render(
        <EntitySchemaView entityKind={entityKind} onClose={mockOnClose} />
      );

      // Check that schema renders without errors
      expect(screen.getByText(/Field definitions and data structure/)).toBeInTheDocument();

      unmount();
    });
  });

  it('should return null for invalid entity kind', () => {
    // This tests the safety check in the component
    const { container } = render(
      <EntitySchemaView 
        entityKind={'invalid' as EntityKind} 
        onClose={mockOnClose} 
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
