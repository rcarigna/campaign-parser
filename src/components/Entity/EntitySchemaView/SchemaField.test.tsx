import { render, screen, fireEvent } from '@testing-library/react';
import { SchemaField } from './SchemaField';
import { EntityKind, FieldMetadata } from '@/types';

// Mock window.open
const mockOpen = jest.fn();
window.open = mockOpen;

describe('SchemaField', () => {
  beforeEach(() => {
    mockOpen.mockClear();
  });

  it('should render field key and type', () => {
    const field: FieldMetadata = {
      key: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    };

    render(<SchemaField field={field} entityKind={EntityKind.NPC} />);

    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('text')).toBeInTheDocument();
  });

  it('should render required indicator for required fields', () => {
    const field: FieldMetadata = {
      key: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    };

    render(<SchemaField field={field} entityKind={EntityKind.LOCATION} />);

    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveClass('text-red-500');
  });

  it('should not render required indicator for optional fields', () => {
    const field: FieldMetadata = {
      key: 'notes',
      label: 'Notes',
      type: 'textarea',
      required: false,
    };

    const { container } = render(
      <SchemaField field={field} entityKind={EntityKind.ITEM} />
    );

    // Check that there's no red asterisk
    const redElements = container.querySelectorAll('.text-red-500');
    expect(redElements.length).toBe(0);
  });

  it('should render field label', () => {
    const field: FieldMetadata = {
      key: 'importance',
      label: 'Importance Level',
      type: 'select',
      required: false,
    };

    render(<SchemaField field={field} entityKind={EntityKind.NPC} />);

    expect(screen.getByText('Importance Level')).toBeInTheDocument();
  });

  it('should render placeholder example when provided', () => {
    const field: FieldMetadata = {
      key: 'faction',
      label: 'Faction',
      type: 'text',
      required: false,
      placeholder: 'Harpers, Zhentarim',
    };

    render(<SchemaField field={field} entityKind={EntityKind.NPC} />);

    expect(screen.getByText(/Example:/)).toBeInTheDocument();
    expect(screen.getByText(/Harpers, Zhentarim/)).toBeInTheDocument();
  });

  it('should render field options when available', () => {
    const field: FieldMetadata = {
      key: 'rarity',
      label: 'Rarity',
      type: 'select',
      required: true,
      options: [
        { value: 'common', label: 'Common' },
        { value: 'rare', label: 'Rare' },
        { value: 'legendary', label: 'Legendary' },
      ],
    };

    render(<SchemaField field={field} entityKind={EntityKind.ITEM} />);

    expect(screen.getByText('Allowed values:')).toBeInTheDocument();
    expect(screen.getByText('Common')).toBeInTheDocument();
    expect(screen.getByText('Rare')).toBeInTheDocument();
    expect(screen.getByText('Legendary')).toBeInTheDocument();
  });

  it('should render "Suggest Edit" button', () => {
    const field: FieldMetadata = {
      key: 'status',
      label: 'Status',
      type: 'text',
      required: false,
    };

    render(<SchemaField field={field} entityKind={EntityKind.QUEST} />);

    const suggestButton = screen.getByText('Suggest Edit');
    expect(suggestButton).toBeInTheDocument();
    expect(suggestButton.closest('button')).toBeInTheDocument();
  });

  it('should open GitHub issue when "Suggest Edit" is clicked', () => {
    const field: FieldMetadata = {
      key: 'importance',
      label: 'Importance Level',
      type: 'select',
      required: true,
      options: [
        { value: 'minor', label: 'Minor' },
        { value: 'major', label: 'Major' },
      ],
    };

    render(<SchemaField field={field} entityKind={EntityKind.NPC} />);

    const suggestButton = screen.getByText('Suggest Edit');
    fireEvent.click(suggestButton);

    expect(mockOpen).toHaveBeenCalledTimes(1);
    const url = mockOpen.mock.calls[0][0];
    expect(url).toContain('github.com/rcarigna/campaign-parser/issues/new');
    expect(url).toContain('template=schema_suggestion.yml');
    expect(url).toContain('entity-type=NPC');
    expect(url).toContain('field-name=importance');
  });

  it('should include security attributes for window.open', () => {
    const field: FieldMetadata = {
      key: 'type',
      label: 'Type',
      type: 'select',
      required: true,
    };

    render(<SchemaField field={field} entityKind={EntityKind.LOCATION} />);

    const suggestButton = screen.getByText('Suggest Edit');
    fireEvent.click(suggestButton);

    expect(mockOpen).toHaveBeenCalledTimes(1);
    expect(mockOpen.mock.calls[0][1]).toBe('_blank');
    expect(mockOpen.mock.calls[0][2]).toBe('noopener,noreferrer');
  });

  it('should have proper aria-label for accessibility', () => {
    const field: FieldMetadata = {
      key: 'faction',
      label: 'Faction',
      type: 'text',
      required: false,
    };

    render(<SchemaField field={field} entityKind={EntityKind.NPC} />);

    const button = screen.getByLabelText('Suggest edit for faction field');
    expect(button).toBeInTheDocument();
  });

  it('should render complete field with all features', () => {
    const field: FieldMetadata = {
      key: 'importance',
      label: 'Importance Level',
      type: 'select',
      required: true,
      placeholder: 'major',
      options: [
        { value: 'minor', label: 'Minor' },
        { value: 'supporting', label: 'Supporting' },
        { value: 'major', label: 'Major' },
      ],
    };

    render(<SchemaField field={field} entityKind={EntityKind.NPC} />);

    // Check all elements are present
    expect(screen.getByText('importance')).toBeInTheDocument();
    expect(screen.getByText('select')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('Importance Level')).toBeInTheDocument();
    expect(screen.getByText(/Example:/)).toBeInTheDocument();
    expect(screen.getByText('Allowed values:')).toBeInTheDocument();
    expect(screen.getByText('Minor')).toBeInTheDocument();
    expect(screen.getByText('Supporting')).toBeInTheDocument();
    expect(screen.getByText('Major')).toBeInTheDocument();
    expect(screen.getByText('Suggest Edit')).toBeInTheDocument();
  });
});
