import React, { useRef, useState } from 'react';

export type FieldMergeGroupProps = {
  fieldName: string;
  fieldValues: Array<{ entityId: string; entityTitle: string; value: unknown }>;
  allowCustom: boolean;
  onChange: (value: unknown) => void;
};

export const FieldMergeGroup: React.FC<FieldMergeGroupProps> = ({
  fieldName,
  fieldValues,
  allowCustom,
  onChange,
}) => {
  const [selected, setSelected] = useState<string>('');
  const [customValue, setCustomValue] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.value);
    if (e.target.value === 'custom') {
      onChange(customValue);
    } else {
      onChange(e.target.value);
    }
  };

  const handleCustomInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomValue(e.target.value);
    if (selected === 'custom') {
      onChange(e.target.value);
    }
  };

  return (
    <div>
      <h4>{fieldName}</h4>
      <div className='field-options'>
        {fieldValues.map(({ entityId, entityTitle, value }) => (
          <label key={`${fieldName}-${entityId}`} className='field-option'>
            <input
              type='radio'
              name={`field-${fieldName}`}
              value={String(value)}
              checked={selected === String(value)}
              onChange={handleRadioChange}
            />
            <div className='field-value'>
              <strong>{String(value)}</strong>
              <span className='source'>from {entityTitle}</span>
            </div>
          </label>
        ))}
        {allowCustom && (
          <>
            <label className='field-option custom-option'>
              <input
                type='radio'
                name={`field-${fieldName}`}
                value='custom'
                checked={selected === 'custom'}
                onChange={handleRadioChange}
              />
              <div className='field-value custom-value'>
                <strong>Custom / Combined</strong>
                <span className='source'>manually edit or combine values</span>
              </div>
            </label>
            {selected === 'custom' && (
              <div className='custom-input-container'>
                <textarea
                  ref={textareaRef}
                  className='custom-input'
                  value={customValue}
                  onChange={handleCustomInput}
                  placeholder={`Enter custom value for ${fieldName}...`}
                  rows={3}
                />
                <div className='custom-hint'>
                  💡 Tip: You can combine values from multiple entities above
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
