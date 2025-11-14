import { render, screen } from '@testing-library/react';
import { FieldMergeSection } from './FieldMergeSection';
import { getFieldValuesMock } from '../../../__mocks__';
import { EntityKind, FieldMergeSectionProps } from '@/types';

export const defaultFieldMergeSectionProps: FieldMergeSectionProps = {
  entityKind: EntityKind.ITEM,
  allFields: ['name', 'type', 'description'],
  getFieldValues: getFieldValuesMock,
  onFieldChange: jest.fn(),
};

describe('FieldMergeSection', () => {
  it('renders the section title and help text', () => {
    render(<FieldMergeSection {...defaultFieldMergeSectionProps} />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      '2. Merge Fields'
    );
    expect(
      screen.getByText(/choose a value or enter a custom combination/i)
    ).toBeInTheDocument();
  });

  it('renders FieldMergeGroup for fields with more than one value', () => {
    render(<FieldMergeSection {...defaultFieldMergeSectionProps} />);
    expect(screen.getByTestId('field-merge-group-name')).toBeInTheDocument();
    expect(screen.getByTestId('field-merge-group-type')).toBeInTheDocument();
    expect(
      screen.queryByTestId('field-merge-group-description')
    ).not.toBeInTheDocument();
  });

  it('does not render FieldMergeGroup for fields with one or zero values', () => {
    const props = {
      ...defaultFieldMergeSectionProps,
      allFields: ['description'],
    };
    render(<FieldMergeSection {...props} />);
    expect(
      screen.queryByTestId('field-merge-group-description')
    ).not.toBeInTheDocument();
  });
});
