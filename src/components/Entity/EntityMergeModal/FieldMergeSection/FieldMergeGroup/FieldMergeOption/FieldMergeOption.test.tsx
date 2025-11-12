import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FieldValueOption, CustomValueOption } from './FieldMergeOption';
import {
  fieldValueOptionMock,
  customValueOptionMock,
} from '@/components/__mocks__/fieldMergeOptionMocks';

describe('FieldValueOption', () => {
  const getProps = (overrides = {}) => ({
    ...fieldValueOptionMock,
    ...overrides,
  });

  it('renders the value and source', () => {
    render(<FieldValueOption {...getProps()} />);
    expect(screen.getByText('Value 1')).toBeInTheDocument();
    expect(screen.getByText(/from Entity A/)).toBeInTheDocument();
  });

  it('renders radio input with correct props', async () => {
    render(<FieldValueOption {...getProps()} />);
    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('name', 'fieldGroup');
    expect(radio).not.toBeChecked();
  });

  it('calls onChange when radio is clicked', async () => {
    const onChange = jest.fn();
    render(<FieldValueOption {...getProps({ onChange })} />);
    const radio = screen.getByRole('radio');
    await userEvent.click(radio);
    expect(onChange).toHaveBeenCalled();
  });

  it('shows as checked when selected', () => {
    render(<FieldValueOption {...getProps({ selected: true })} />);
    expect(screen.getByRole('radio')).toBeChecked();
  });
});

describe('CustomValueOption', () => {
  const getProps = (overrides = {}) => ({
    ...customValueOptionMock,
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders custom value option UI', () => {
    render(<CustomValueOption {...getProps()} />);
    expect(screen.getByText('Custom / Combined')).toBeInTheDocument();
    expect(
      screen.getByText(/manually edit or combine values/)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter custom value for/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Tip: You can combine values/)).toBeInTheDocument();
  });

  it('radio is unchecked when not selected', () => {
    render(<CustomValueOption {...getProps()} />);
    expect(screen.getByRole('radio')).not.toBeChecked();
  });

  it('radio is checked when selected', () => {
    render(<CustomValueOption {...getProps({ selected: true })} />);
    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('calls onChange with custom value when textarea changes and selected', async () => {
    const onChange = jest.fn();
    render(<CustomValueOption {...getProps({ selected: true, onChange })} />);
    const textarea = screen.getByPlaceholderText(/Enter custom value for/);
    await userEvent.type(textarea, 'My Custom Value');
    expect(onChange).toHaveBeenCalledWith('My Custom Value');
  });

  it('does not call onChange when textarea changes and not selected', async () => {
    const onChange = jest.fn();
    render(<CustomValueOption {...getProps({ selected: false, onChange })} />);
    const textarea = screen.getByPlaceholderText(/Enter custom value for/);
    await userEvent.type(textarea, 'Another Value');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('calls onChange with current custom value when radio is selected', async () => {
    const onChange = jest.fn();
    render(<CustomValueOption {...getProps({ onChange })} />);
    const textarea = screen.getByPlaceholderText(/Enter custom value for/);
    await userEvent.type(textarea, 'Radio Value');
    const radio = screen.getByRole('radio');
    await userEvent.click(radio);
    expect(onChange).toHaveBeenCalledWith('Radio Value');
  });
});
