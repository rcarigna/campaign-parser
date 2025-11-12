import { render, screen, fireEvent } from '@testing-library/react';
import {
  FieldMergeGroup,
  FieldMergeGroupProps,
  generateValueKey,
} from './FieldMergeGroup';
import { FieldValueOption, CustomValueOption } from './FieldMergeOption';
import { EntityKind, ItemRarity } from '@/types';
import userEvent from '@testing-library/user-event';

const defaultProps: FieldMergeGroupProps = {
  fieldName: 'Description',
  fieldValues: [
    { entityId: '1', entityTitle: 'Entity One', value: 'Value One' },
    { entityId: '2', entityTitle: 'Entity Two', value: 'Value Two' },
  ],
  onChange: jest.fn(),
  entityKind: EntityKind.ITEM,
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

  it('calls onChange with selected value when radio is clicked', async () => {
    render(<FieldMergeGroup {...defaultProps} />);
    const radios = screen.getAllByRole('radio');
    await userEvent.click(radios[0]);
    expect(defaultProps.onChange).toHaveBeenCalledWith('Value One');
    await userEvent.click(radios[1]);
    expect(defaultProps.onChange).toHaveBeenCalledWith('Value Two');
  });

  it('shows custom option and textarea when selected', async () => {
    render(<FieldMergeGroup {...defaultProps} />);
    const customRadio = screen.getByLabelText(/Custom \/ Combined/i);
    await userEvent.click(customRadio);
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
    render(
      <FieldMergeGroup
        {...defaultProps}
        fieldName='rarity'
        fieldValues={[
          {
            entityId: '1',
            entityTitle: 'Entity One',
            value: ItemRarity.COMMON,
          },
        ]}
      />
    );
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

  it('selects the appropriate radio when value is updated externally', async () => {
    render(
      <FieldMergeGroup
        {...defaultProps}
        fieldName='rarity'
        fieldValues={[
          {
            entityId: '1',
            entityTitle: 'Entity One',
            value: ItemRarity.COMMON,
          },
          {
            entityId: '2',
            entityTitle: 'Entity Two',
            value: ItemRarity.RARE,
          },
        ]}
      />
    );
    const radios = screen.getAllByRole('radio');
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).not.toBeChecked();

    await userEvent.click(radios[0]);
    expect(radios[0]).toBeChecked();
    expect(radios[1]).not.toBeChecked();

    await userEvent.click(radios[1]);
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
  });
});

describe('generateValueKey', () => {
  it('generates a unique key based on entityId, entityTitle, and value', () => {
    const key = generateValueKey({
      entityId: '123',
      entityTitle: 'Test Entity',
      value: 'Some Value',
    });
    expect(key).toBe('field-Test Entity-123-Some Value');
  });

  it('handles numeric values correctly', () => {
    const key = generateValueKey({
      entityId: '456',
      entityTitle: 'Number Entity',
      value: 42,
    });
    expect(key).toBe('field-Number Entity-456-42');
  });

  it('handles boolean values correctly', () => {
    const keyTrue = generateValueKey({
      entityId: '789',
      entityTitle: 'Bool Entity',
      value: true,
    });
    const keyFalse = generateValueKey({
      entityId: '789',
      entityTitle: 'Bool Entity',
      value: false,
    });
    expect(keyTrue).toBe('field-Bool Entity-789-true');
    expect(keyFalse).toBe('field-Bool Entity-789-false');
  });

  it('handles undefined and null values', () => {
    const keyUndefined = generateValueKey({
      entityId: 'abc',
      entityTitle: 'Null Entity',
      value: undefined,
    });
    const keyNull = generateValueKey({
      entityId: 'abc',
      entityTitle: 'Null Entity',
      value: null,
    });
    expect(keyUndefined).toBe('field-Null Entity-abc-undefined');
    expect(keyNull).toBe('field-Null Entity-abc-null');
  });

  it('handles object values by stringifying them', () => {
    const key = generateValueKey({
      entityId: 'obj',
      entityTitle: 'Object Entity',
      value: { foo: 'bar' },
    });
    expect(key).toBe('field-Object Entity-obj-[object Object]');
  });
});

describe('FieldValueOption', () => {
  const valueOptionProps = {
    optionKey: 'option1',
    value: 'Test Value',
    source: 'Entity One',
    onChange: jest.fn(),
    selected: false,
    groupName: 'testGroup',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the value and source correctly', () => {
    render(<FieldValueOption {...valueOptionProps} />);
    expect(screen.getByText('Test Value')).toBeInTheDocument();
    expect(screen.getByText('from Entity One')).toBeInTheDocument();
    //can we check that the radio input is rendered with the correct attributes?
    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('name', 'testGroup');
    expect(radio).not.toBeChecked();
  });

  it('calls onChange when the radio input is clicked', async () => {
    render(<FieldValueOption {...valueOptionProps} />);
    const radio = screen.getByRole('radio');
    await userEvent.click(radio);
    expect(valueOptionProps.onChange).toHaveBeenCalled();
  });
});

describe('CustomValueOption', () => {
  const customValueOptionProps = {
    key: 'customOption',
    onChange: jest.fn(),
    selected: false,
    groupName: 'testGroup',
    customValueKey: 'customOption',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the custom option correctly', () => {
    render(<CustomValueOption {...customValueOptionProps} />);
    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('name', 'testGroup');
    expect(radio).not.toBeChecked();
  });

  it('calls onChange when the radio input is clicked', async () => {
    render(<CustomValueOption {...customValueOptionProps} />);
    const radio = screen.getByRole('radio');
    await userEvent.click(radio);
    expect(customValueOptionProps.onChange).toHaveBeenCalled();
  });
});
