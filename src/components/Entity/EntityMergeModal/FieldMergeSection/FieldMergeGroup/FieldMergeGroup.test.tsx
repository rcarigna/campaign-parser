import { render, screen, fireEvent } from '@testing-library/react';
import {
  FieldMergeGroup,
  FieldMergeGroupProps,
  generateValueKey,
} from './FieldMergeGroup';
import { FieldValueOption, CustomValueOption } from './FieldMergeOption';
import { EntityKind, ItemRarity } from '@/types';
import userEvent from '@testing-library/user-event';
import {
  fieldValueOptionMock,
  customValueOptionMock,
  fieldValuesMock,
  rarityFieldValuesMock,
} from '../../../../__mocks__';

export const defaultFieldMergeGroupProps: FieldMergeGroupProps = {
  fieldName: 'Description',
  fieldValues: fieldValuesMock,
  onChange: jest.fn(),
  entityKind: EntityKind.ITEM,
};

const getFieldMergeGroupProps = (
  overrides: Partial<FieldMergeGroupProps> = {}
): FieldMergeGroupProps => ({
  ...defaultFieldMergeGroupProps,
  ...overrides,
});

describe('FieldMergeGroup', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders field name and options', () => {
    const props = getFieldMergeGroupProps();
    render(<FieldMergeGroup {...props} />);
    expect(screen.getByText(props.fieldName)).toBeInTheDocument();
    props.fieldValues.forEach((v) => {
      expect(screen.getByText(v.value.toString())).toBeInTheDocument();
      expect(screen.getByText(`from ${v.entityTitle}`)).toBeInTheDocument();
    });
  });

  it('does not render custom option if allowCustom is false', () => {
    const rarityProps = getFieldMergeGroupProps({
      fieldName: 'rarity',
      fieldValues: rarityFieldValuesMock.slice(0, 1),
    });
    render(<FieldMergeGroup {...rarityProps} />);
    expect(screen.queryByText(/Custom \/ Combined/i)).not.toBeInTheDocument();
  });
  it('calls onChange with selected value when radio is clicked', async () => {
    const props = getFieldMergeGroupProps();
    render(<FieldMergeGroup {...props} />);
    const radios = screen.getAllByRole('radio');
    await userEvent.click(radios[0]);
    expect(props.onChange).toHaveBeenCalledWith('Value One');
    await userEvent.click(radios[1]);
    expect(props.onChange).toHaveBeenCalledWith('Value Two');
  });

  it('shows custom option and textarea when selected', async () => {
    const props = getFieldMergeGroupProps();
    render(<FieldMergeGroup {...props} />);
    const customRadio = screen.getByLabelText(/Custom \/ Combined/i);
    await userEvent.click(customRadio);
    expect(
      screen.getByPlaceholderText(/Enter custom value for Description/i)
    ).toBeInTheDocument();
    expect(props.onChange).toHaveBeenCalledWith('');
  });

  it('calls onChange with custom value when typing in textarea', () => {
    const props = getFieldMergeGroupProps();
    render(<FieldMergeGroup {...props} />);
    const customRadio = screen.getByLabelText(/Custom \/ Combined/i);
    fireEvent.click(customRadio);
    const textarea = screen.getByPlaceholderText(
      /Enter custom value for Description/i
    );
    fireEvent.change(textarea, { target: { value: 'Custom Value' } });
    expect(props.onChange).toHaveBeenCalledWith('Custom Value');
  });

  it('does not render custom option if allowCustom is false', () => {
    const props = getFieldMergeGroupProps({
      fieldName: 'rarity',
      fieldValues: [
        { entityId: '1', entityTitle: 'Entity One', value: ItemRarity.COMMON },
      ],
    });
    render(<FieldMergeGroup {...props} />);
    expect(screen.queryByText(/Custom \/ Combined/i)).not.toBeInTheDocument();
  });

  it('radio selection updates checked state', () => {
    const props = getFieldMergeGroupProps();
    render(<FieldMergeGroup {...props} />);
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[1]);
    expect(radios[1]).toBeChecked();
    fireEvent.click(radios[0]);
    expect(radios[0]).toBeChecked();
  });

  it('selects the appropriate radio when value is updated externally', async () => {
    const rarityProps = getFieldMergeGroupProps({
      fieldName: 'rarity',
      fieldValues: rarityFieldValuesMock,
    });
    render(<FieldMergeGroup {...rarityProps} />);
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
  const getProps = (overrides = {}) => ({
    ...fieldValueOptionMock,
    ...overrides,
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the value and source correctly', () => {
    render(<FieldValueOption {...getProps()} />);
    expect(screen.getByText('Value 1')).toBeInTheDocument();
    expect(screen.getByText('from Entity A')).toBeInTheDocument();
    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('name', 'fieldGroup');
    expect(radio).not.toBeChecked();
  });

  it('calls onChange when the radio input is clicked', async () => {
    const onChange = jest.fn();
    render(<FieldValueOption {...getProps({ onChange })} />);
    const radio = screen.getByRole('radio');
    await userEvent.click(radio);
    expect(onChange).toHaveBeenCalled();
  });
});

describe('CustomValueOption', () => {
  const getProps = (overrides = {}) => ({
    ...customValueOptionMock,
    ...overrides,
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the custom option correctly', () => {
    render(<CustomValueOption {...getProps()} />);
    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('name', 'fieldGroup');
    expect(radio).not.toBeChecked();
  });

  it('calls onChange when the radio input is clicked', async () => {
    const onChange = jest.fn();
    render(<CustomValueOption {...getProps({ onChange })} />);
    const radio = screen.getByRole('radio');
    await userEvent.click(radio);
    expect(onChange).toHaveBeenCalled();
  });
});
