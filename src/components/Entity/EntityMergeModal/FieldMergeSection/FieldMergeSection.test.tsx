import { render, screen } from '@testing-library/react';
import { FieldMergeSection, FieldMergeSectionProps } from './FieldMergeSection';
import { EntityKind } from '@/types';

const defaultProps: FieldMergeSectionProps = {
  allFields: ['name', 'type', 'description'],
  getFieldValues: (fieldName) => {
    if (fieldName === 'name') {
      return [
        { entityId: '1', entityTitle: 'Entity 1', value: 'Alice' },
        { entityId: '2', entityTitle: 'Entity 2', value: 'Alicia' },
      ];
    }
    if (fieldName === 'type') {
      return [
        { entityId: '1', entityTitle: 'Entity 1', value: 'Person' },
        { entityId: '2', entityTitle: 'Entity 2', value: 'Person' },
      ];
    }
    if (fieldName === 'description') {
      return [{ entityId: '1', entityTitle: 'Entity 1', value: 'Desc 1' }];
    }
    return [];
  },
  entityKind: EntityKind.UNKNOWN,
  onFieldChange: jest.fn(),
};

jest.mock('../FieldMergeGroup', () => ({
  FieldMergeGroup: ({ fieldName }: { fieldName: string }) => (
    <div data-testid={`field-merge-group-${fieldName}`}>{fieldName}</div>
  ),
}));

describe('FieldMergeSection', () => {
  it('renders the section title and help text', () => {
    render(<FieldMergeSection {...defaultProps} />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      '2. Merge Fields'
    );
    expect(
      screen.getByText(/choose a value or enter a custom combination/i)
    ).toBeInTheDocument();
  });

  it('renders FieldMergeGroup for fields with more than one value', () => {
    render(<FieldMergeSection {...defaultProps} />);
    expect(screen.getByTestId('field-merge-group-name')).toBeInTheDocument();
    // 'type' has two values, but both are the same, still should render
    expect(screen.getByTestId('field-merge-group-type')).toBeInTheDocument();
    // 'description' has only one value, should not render
    expect(
      screen.queryByTestId('field-merge-group-description')
    ).not.toBeInTheDocument();
  });

  it('does not render FieldMergeGroup for fields with one or zero values', () => {
    const props: FieldMergeSectionProps = {
      ...defaultProps,
      allFields: ['description'],
    };
    render(<FieldMergeSection {...props} />);
    expect(
      screen.queryByTestId('field-merge-group-description')
    ).not.toBeInTheDocument();
  });
});
