import React from 'react';

export type FieldEditState = {
  mode: 'select' | 'custom';
  customValue: string;
};

export type FieldMergeGroupProps = {
  fieldName: string;
  fieldValues: Array<{ entityId: string; entityTitle: string; value: unknown }>;
  currentValue: unknown;
  editState: FieldEditState;
  isCustomMode: boolean;
  allowCustom: boolean;
  onSelect: (value: unknown) => void;
  onCustomMode: () => void;
  onCustomValueChange: (value: string) => void;
};

export const FieldMergeGroup: React.FC<FieldMergeGroupProps> = ({
  fieldName,
  fieldValues,
  currentValue,
  editState,
  isCustomMode,
  allowCustom,
  onSelect,
  onCustomMode,
  onCustomValueChange,
}) => (
  <div>
    <h4>{fieldName}</h4>
    <div className='field-options'>
      {fieldValues.map(({ entityId, entityTitle, value }) => (
        <label key={`${fieldName}-${entityId}`} className='field-option'>
          <input
            type='radio'
            name={`field-${fieldName}`}
            value={String(value)}
            checked={!isCustomMode && currentValue === value}
            onChange={() => onSelect(value)}
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
              checked={isCustomMode}
              onChange={onCustomMode}
            />
            <div className='field-value custom-value'>
              <strong>Custom / Combined</strong>
              <span className='source'>manually edit or combine values</span>
            </div>
          </label>
          {isCustomMode && (
            <div className='custom-input-container'>
              <textarea
                className='custom-input'
                value={editState.customValue}
                onChange={(e) => onCustomValueChange(e.target.value)}
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
