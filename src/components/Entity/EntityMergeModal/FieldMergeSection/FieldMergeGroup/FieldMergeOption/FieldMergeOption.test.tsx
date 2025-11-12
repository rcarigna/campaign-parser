import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FieldValueOption, CustomValueOption } from './FieldMergeOption';

describe('FieldValueOption', () => {
  const defaultProps = {
    key: 'option1',
    optionKey: 'option1',
    value: 'Value 1',
    source: 'Entity A',
    onChange: jest.fn(),
    selected: false,
    groupName: 'fieldGroup',
  };

  it('renders the value and source', () => {
    render(<FieldValueOption {...defaultProps} />);
    expect(screen.getByText('Value 1')).toBeInTheDocument();
    expect(screen.getByText(/from Entity A/)).toBeInTheDocument();
  });

  it('renders radio input with correct props', async () => {
    render(<FieldValueOption {...defaultProps} />);
    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('name', 'fieldGroup');
    expect(radio).not.toBeChecked();
  });

  it('calls onChange when radio is clicked', async () => {
    render(<FieldValueOption {...defaultProps} />);
    const radio = screen.getByRole('radio');
    await userEvent.click(radio);
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('shows as checked when selected', () => {
    render(<FieldValueOption {...defaultProps} selected={true} />);
    expect(screen.getByRole('radio')).toBeChecked();
  });
});

describe('CustomValueOption', () => {
  const onChangeMock = jest.fn();
  const defaultProps = {
    customValueKey: 'custom',
    onChange: onChangeMock,
    selected: false,
    groupName: 'fieldGroup',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders custom value option UI', () => {
    render(<CustomValueOption {...defaultProps} />);
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
    render(<CustomValueOption {...defaultProps} />);
    expect(screen.getByRole('radio')).not.toBeChecked();
  });

  it('radio is checked when selected', () => {
    render(<CustomValueOption {...defaultProps} selected={true} />);
    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('calls onChange with custom value when textarea changes and selected', async () => {
    render(<CustomValueOption {...defaultProps} selected={true} />);
    const textarea = screen.getByPlaceholderText(/Enter custom value for/);
    await userEvent.type(textarea, 'My Custom Value');
    expect(onChangeMock).toHaveBeenCalledWith('My Custom Value');
  });

  it('does not call onChange when textarea changes and not selected', async () => {
    render(<CustomValueOption {...defaultProps} selected={false} />);
    const textarea = screen.getByPlaceholderText(/Enter custom value for/);
    await userEvent.type(textarea, 'Another Value');
    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('calls onChange with current custom value when radio is selected', async () => {
    render(<CustomValueOption {...defaultProps} />);
    const textarea = screen.getByPlaceholderText(/Enter custom value for/);
    await userEvent.type(textarea, 'Radio Value');
    const radio = screen.getByRole('radio');
    await userEvent.click(radio);
    expect(onChangeMock).toHaveBeenCalledWith('Radio Value');
  });
});
