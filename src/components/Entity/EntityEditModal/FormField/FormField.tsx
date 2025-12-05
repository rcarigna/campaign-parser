import { EntityWithId, FieldMetadata } from '@/types';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import {
  TextField,
  NumberField,
  BooleanField,
  SelectField,
  TextAreaField,
  ArrayField,
} from './fields';

export const FormField = ({
  field,
  entity,
  register,
}: {
  field: FieldMetadata;
  entity: EntityWithId;
  register: UseFormRegister<FieldValues>;
}) => {
  const commonProps = {
    fieldKey: field.key,
    label: field.label,
    required: field.required,
    register,
  };

  switch (field.type) {
    case 'text':
      return (
        <TextField
          {...commonProps}
          placeholder={field.placeholder}
          defaultValue={entity[field.key as keyof EntityWithId] as string}
        />
      );
    case 'number':
      return (
        <NumberField
          {...commonProps}
          defaultValue={
            entity[field.key as keyof EntityWithId] as unknown as number
          }
        />
      );
    case 'boolean':
      return (
        <BooleanField
          {...commonProps}
          defaultValue={
            entity[field.key as keyof EntityWithId] as unknown as boolean
          }
        />
      );
    case 'select':
      return (
        <SelectField
          {...commonProps}
          options={field.options}
          defaultValue={entity[field.key as keyof EntityWithId] as string}
        />
      );
    case 'textarea':
      return (
        <TextAreaField
          {...commonProps}
          placeholder={field.placeholder}
          defaultValue={entity[field.key as keyof EntityWithId] as string}
        />
      );
    case 'array':
      return (
        <ArrayField
          {...commonProps}
          placeholder={field.placeholder}
          defaultValue={
            entity[field.key as keyof EntityWithId] as unknown as string[]
          }
        />
      );
    default:
      return (
        <TextField
          {...commonProps}
          defaultValue={String(entity[field.key as keyof EntityWithId])}
        />
      );
  }
};
