import { useState } from 'react';
export const FieldValueOption = ({
  optionKey,
  value,
  source,
  onChange,
  selected,
  groupName,
}: {
  optionKey: string;
  value: string;
  source: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selected: boolean;
  groupName: string;
}) => (
  <div className='field-option'>
    <input
      type='radio'
      id={optionKey}
      name={groupName}
      value={value}
      onChange={onChange}
      checked={selected}
    />
    <label htmlFor={optionKey} className='field-value'>
      <strong>{String(value)}</strong>
      <span className='source'>from {source}</span>
    </label>
  </div>
);

export const CustomValueOption = ({
  customValueKey,
  onChange,
  selected,
  groupName,
}: {
  customValueKey: string;
  onChange: (value: unknown) => void;
  selected: boolean;
  groupName: string;
}) => {
  const [customValue, setCustomValue] = useState('');
  const handleRadioChange = () => {
    onChange(customValue);
  };
  const handleCustomValueChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCustomValue(e.target.value);
    if (selected) {
      onChange(e.target.value);
    }
  };
  return (
    <label className='field-option custom-option'>
      <input
        type='radio'
        name={groupName}
        value={customValueKey}
        checked={selected}
        onChange={handleRadioChange}
      />
      <div className='field-value custom-value'>
        <strong>Custom / Combined</strong>
        <span className='source'>manually edit or combine values</span>
      </div>
      <div className='custom-input-container'>
        <textarea
          className='custom-input'
          value={customValue}
          onChange={handleCustomValueChange}
          placeholder={`Enter custom value for ${groupName}...`}
          rows={3}
        />
        <div className='custom-hint'>
          💡 Tip: You can combine values from multiple entities above
        </div>
      </div>
    </label>
  );
};
