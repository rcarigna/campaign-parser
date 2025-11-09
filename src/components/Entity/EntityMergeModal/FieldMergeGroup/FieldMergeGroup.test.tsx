import { render, screen, fireEvent } from '@testing-library/react';
import { FieldMergeGroup, FieldMergeGroupProps } from './FieldMergeGroup';

const defaultProps: FieldMergeGroupProps = {
  fieldName: 'Description',
  fieldValues: [
    { entityId: '1', entityTitle: 'Entity One', value: 'Value One' },
    { entityId: '2', entityTitle: 'Entity Two', value: 'Value Two' },
  ],
  allowCustom: true,
  onChange: jest.fn(),
};

describe('FieldMergeGroup', () => {
  it('renders field name and options', () => {
    render(<FieldMergeGroup {...defaultProps} />);
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Value One')).toBeInTheDocument();
    expect(screen.getByText('Value Two')).toBeInTheDocument();
    expect(screen.getByText('from Entity One')).toBeInTheDocument();
    expect(screen.getByText('from Entity Two')).toBeInTheDocument();
  });

  it('calls onChange with selected value when radio is clicked', () => {
    render(<FieldMergeGroup {...defaultProps} />);
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[0]);
    expect(defaultProps.onChange).toHaveBeenCalledWith('Value One');
    fireEvent.click(radios[1]);
    expect(defaultProps.onChange).toHaveBeenCalledWith('Value Two');
  });

  it('shows custom option and textarea when selected', () => {
    render(<FieldMergeGroup {...defaultProps} />);
    const customRadio = screen.getByLabelText(/Custom \/ Combined/i);
    fireEvent.click(customRadio);
    expect(
      screen.getByPlaceholderText(/Enter custom value for Description/i)
    ).toBeInTheDocument();
    expect(defaultProps.onChange).toHaveBeenCalledWith('');
  });

  it('calls onChange with custom value when typing in textarea', () => {
    render(<FieldMergeGroup {...defaultProps} />);
    const customRadio = screen.getByLabelText(/Custom \/ Combined/i);
    fireEvent.click(customRadio);
    const textarea = screen.getByPlaceholderText(
      /Enter custom value for Description/i
    );
    fireEvent.change(textarea, { target: { value: 'Custom Value' } });
    expect(defaultProps.onChange).toHaveBeenCalledWith('Custom Value');
  });

  it('does not render custom option if allowCustom is false', () => {
    render(<FieldMergeGroup {...defaultProps} allowCustom={false} />);
    expect(screen.queryByText(/Custom \/ Combined/i)).not.toBeInTheDocument();
  });

  it('radio selection updates checked state', () => {
    render(<FieldMergeGroup {...defaultProps} />);
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[1]);
    expect(radios[1]).toBeChecked();
    fireEvent.click(radios[0]);
    expect(radios[0]).toBeChecked();
  });
});
