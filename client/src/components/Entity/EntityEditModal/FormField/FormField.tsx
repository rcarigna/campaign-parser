import { type FieldConfig } from '../EntityFieldConfig';

type FormFieldProps = {
  field: FieldConfig;
  value: any;
  onChange: (field: string, value: string) => void;
  required?: boolean;
};

export const FormField = ({
  field,
  value,
  onChange,
  required,
}: FormFieldProps): JSX.Element => {
  const handleChange = (newValue: string) => {
    onChange(field.key, newValue);
  };

  const fieldId = `field-${field.key}`;
  const commonProps = {
    id: fieldId,
    required,
    className: `form-${field.type}`,
  };

  return (
    <div className='form-group'>
      <label htmlFor={fieldId}>
        {field.label}:{required && <span className='required'>*</span>}
      </label>

      {field.type === 'text' && (
        <input
          {...commonProps}
          type='text'
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
        />
      )}

      {field.type === 'textarea' && (
        <textarea
          {...commonProps}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          rows={3}
        />
      )}

      {field.type === 'select' && field.options && (
        <select
          {...commonProps}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
        >
          <option value=''>-- Select {field.label} --</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}

      {field.type === 'checkbox' && (
        <input
          {...commonProps}
          type='checkbox'
          checked={!!value}
          onChange={(e) => handleChange(e.target.checked.toString())}
        />
      )}
    </div>
  );
};
