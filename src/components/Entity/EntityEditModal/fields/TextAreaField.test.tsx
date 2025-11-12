import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { TextAreaField } from './TextAreaField';

const TestWrapper = (props: {
  fieldKey: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  rows?: number;
}) => {
  const { register } = useForm();
  return <TextAreaField {...props} register={register} />;
};

describe('TextAreaField', () => {
  it('renders label and textarea with correct props', () => {
    render(
      <TestWrapper
        fieldKey='description'
        label='Description'
        required
        placeholder='Enter description'
        defaultValue='Default text'
        rows={5}
      />
    );

    const label = screen.getByText('Description');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'description');

    const textarea = screen.getByPlaceholderText('Enter description');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('id', 'description');
    expect(textarea).toHaveAttribute('rows', '5');
    expect(textarea).toHaveValue('Default text');
    expect(textarea).toHaveClass(
      'mt-1',
      'block',
      'w-full',
      'rounded-md',
      'border-gray-300',
      'shadow-sm',
      'focus:border-blue-500',
      'focus:ring-blue-500',
      'sm:text-sm'
    );
  });

  it('renders with default rows if not provided', () => {
    render(<TestWrapper fieldKey='notes' label='Notes' />);
    const textarea = screen.getByLabelText('Notes');
    expect(textarea).toHaveAttribute('rows', '3');
  });

  it('renders without required indicator if required is false', () => {
    render(<TestWrapper fieldKey='summary' label='Summary' required={false} />);
    const label = screen.getByText('Summary');
    expect(label.textContent).not.toMatch(/\*/);
  });
});
