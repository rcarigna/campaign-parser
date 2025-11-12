import React, { useState, useMemo, useCallback } from 'react';
import { EntityKind, FieldMergeGroupProps, getEntityFields } from '@/types';
import {
  FieldValueOption,
  CustomValueOption,
} from './FieldMergeOption/FieldMergeOption';

export const shouldAllowCustomInput = (
  entityKind: EntityKind,
  fieldName: string
) => {
  if (fieldName === 'kind') return false; // Don't allow custom input for 'kind' field
  // otherwise, lookup the type of the field in the entity metadata to determine if it's an enum
  const fieldType = getEntityFields(entityKind).find(
    (f) => f.key === fieldName
  )?.type;
  if (fieldType === 'select') return false; // Don't allow custom input for enum fields
  return true;
};

export const generateValueKey = ({
  entityId,
  entityTitle,
  value,
}: {
  entityId: string;
  entityTitle: string;
  value: unknown;
}) => {
  return `field-${entityTitle}-${entityId}-${String(value)}`;
};

export const FieldMergeGroup: React.FC<FieldMergeGroupProps> = ({
  fieldName,
  fieldValues,
  entityKind,
  onChange,
}) => {
  const allowCustom = shouldAllowCustomInput(entityKind, fieldName);
  const [selectedKey, setSelectedKey] = useState<string>('');

  const groupName = fieldName;

  const customOptionKey = generateValueKey({
    entityId: entityKind,
    entityTitle: fieldName,
    value: 'custom',
  });

  const handleOptionChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedKey(event.target.id);
      onChange(event.target.value);
    },
    [onChange]
  );
  const optionsList = useMemo(() => {
    const optionsList = fieldValues.map((field) => {
      // console.log('Generating option for value: ', field.value);
      const inputKey = generateValueKey({
        entityId: field.entityId,
        entityTitle: field.entityTitle,
        value: field.value,
      });
      return (
        <FieldValueOption
          key={inputKey}
          value={field.value}
          source={field.entityTitle}
          optionKey={inputKey}
          selected={selectedKey === inputKey}
          groupName={groupName}
          onChange={handleOptionChange}
        />
      );
    });
    if (allowCustom) {
      optionsList.push(
        <CustomValueOption
          key={customOptionKey} // <-- Add this line
          customValueKey={customOptionKey}
          onChange={(customValue) => {
            handleOptionChange({
              target: {
                value: customValue,
                name: groupName,
                id: customOptionKey,
              },
            } as React.ChangeEvent<HTMLInputElement>);
          }}
          selected={selectedKey === customOptionKey}
          groupName={groupName}
        />
      );
    }
    return optionsList;
  }, [
    fieldValues,
    allowCustom,
    selectedKey,
    groupName,
    handleOptionChange,
    customOptionKey,
  ]);

  return (
    <div className='field-merge-group'>
      <h4 className='field-name'>{fieldName}</h4>
      <div className='options-list'>{optionsList}</div>
    </div>
  );
};
