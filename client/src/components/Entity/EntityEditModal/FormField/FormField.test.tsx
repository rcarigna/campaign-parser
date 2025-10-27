import { render, screen, fireEvent } from '@testing-library/react';
import { FormField } from './FormField';

const mockOnChange = jest.fn();

describe('FormField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders text input field', () => {
    const field = { key: 'name', label: 'Name', type: 'text' as const };

    render(
      <FormField field={field} value='Test Value' onChange={mockOnChange} />
    );

    expect(screen.getByLabelText('Name:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Value')).toBeInTheDocument();
  });

  it('renders textarea field', () => {
    const field = {
      key: 'description',
      label: 'Description',
      type: 'textarea' as const,
    };

    render(
      <FormField
        field={field}
        value='Long description'
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText('Description:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Long description')).toBeInTheDocument();
  });

  it('renders select field with options', () => {
    const field = {
      key: 'type',
      label: 'Type',
      type: 'select' as const,
      options: ['option1', 'option2', 'option3'],
    };

    render(<FormField field={field} value='option2' onChange={mockOnChange} />);

    expect(screen.getByLabelText('Type:')).toBeInTheDocument();
    expect(screen.getByText('option1')).toBeInTheDocument();
    expect(screen.getByText('option2')).toBeInTheDocument();
    expect(screen.getByText('option3')).toBeInTheDocument();
  });

  it('renders checkbox field', () => {
    const field = { key: 'active', label: 'Active', type: 'checkbox' as const };

    render(<FormField field={field} value='true' onChange={mockOnChange} />);

    expect(screen.getByLabelText('Active:')).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('shows required indicator when required is true', () => {
    const field = { key: 'name', label: 'Name', type: 'text' as const };

    render(
      <FormField
        field={field}
        value=''
        onChange={mockOnChange}
        required={true}
      />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('calls onChange when text input changes', () => {
    const field = { key: 'name', label: 'Name', type: 'text' as const };

    render(<FormField field={field} value='' onChange={mockOnChange} />);

    const input = screen.getByLabelText('Name:');
    fireEvent.change(input, { target: { value: 'New Value' } });

    expect(mockOnChange).toHaveBeenCalledWith('name', 'New Value');
  });

  it('calls onChange when select changes', () => {
    const field = {
      key: 'type',
      label: 'Type',
      type: 'select' as const,
      options: ['option1', 'option2'],
    };

    render(<FormField field={field} value='' onChange={mockOnChange} />);

    const select = screen.getByLabelText('Type:');
    fireEvent.change(select, { target: { value: 'option1' } });

    expect(mockOnChange).toHaveBeenCalledWith('type', 'option1');
  });

  it('calls onChange when checkbox changes', () => {
    const field = { key: 'active', label: 'Active', type: 'checkbox' as const };

    render(<FormField field={field} value={false} onChange={mockOnChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledWith('active', 'true');
  });
});
