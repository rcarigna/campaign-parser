import React, { useRef, useState } from 'react';
import { EntityKind, getEntityFields } from '@/types';

export type FieldMergeGroupProps = {
  fieldName: string;
  fieldValues: Array<{ entityId: string; entityTitle: string; value: unknown }>;
  entityKind: EntityKind;
  onChange: (value: unknown) => void;
};

const shouldAllowCustomInput = (entityKind: EntityKind, fieldName: string) => {
  if (fieldName === 'kind') return false; // Don't allow custom input for 'kind' field
  // otherwise, lookup the type of the field in the entity metadata to determine if it's an enum
  const fieldType = getEntityFields(entityKind).find(
    (f) => f.key === fieldName
  )?.type;
  if (fieldType === 'select') return false; // Don't allow custom input for enum fields
  return true;
};

export const FieldMergeGroup: React.FC<FieldMergeGroupProps> = ({
  fieldName,
  fieldValues,
  entityKind,
  onChange,
}) => {
  const allowCustom = shouldAllowCustomInput(entityKind, fieldName);
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
