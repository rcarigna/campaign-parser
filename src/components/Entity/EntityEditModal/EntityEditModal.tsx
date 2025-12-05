import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  getEntityFields,
  type EntityWithId,
  EntityKind,
  type FieldMetadata,
} from '@/types';
import { FormField } from './FormField';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { getAllEntityMetadata } from '@/lib/utils/entity';

type EntityEditModalProps = {
  entity: EntityWithId;
  onClose: () => void;
  onSave: (entity: EntityWithId) => void;
};

export const EntityEditModal = ({
  entity,
  onClose,
  onSave,
}: EntityEditModalProps) => {
  const [entityKind, setEntityKind] = useState<EntityKind>(entity.kind);
  const formFields: FieldMetadata[] = getEntityFields(entityKind);
  const { register, handleSubmit } = useForm();
  const entityTypes = getAllEntityMetadata();

  const handleSave = (data: Record<string, unknown>) => {
    const updatedEntity = {
      ...entity,
      ...data,
      kind: entityKind, // Update the kind
    } as EntityWithId;
    onSave(updatedEntity);
  };

  return (
    <Box
      className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4'
      data-testid='modal-overlay'
      onClick={onClose}
    >
      <Box
        className='relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden'
        data-testid='modal-content'
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit(handleSave)}>
          {/* Header */}
          <Box className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
            <Box className='flex items-center justify-between'>
              <Typography
                variant='h3'
                className='text-lg font-medium text-gray-900'
              >
                Edit Entity: {entity.title}
              </Typography>
              <IconButton
                className='text-gray-400 hover:text-gray-600 transition-colors duration-200'
                onClick={onClose}
                aria-label='Close modal'
                data-testid='close-button'
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Body */}
          <Box className='px-6 py-4 overflow-y-auto max-h-[60vh]'>
            {/* Entity Type Selector */}
            <Box className='mb-6 pb-4 border-b border-gray-200'>
              <FormControl fullWidth>
                <InputLabel id='entity-type-label'>
                  Entity Type
                  {entityKind !== entity.kind && (
                    <Box
                      component='span'
                      sx={{
                        color: 'orange',
                        fontSize: '0.8em',
                        ml: 1,
                      }}
                    >
                      (Changed from {entity.kind})
                    </Box>
                  )}
                </InputLabel>
                <Select
                  labelId='entity-type-label'
                  id='entity-type'
                  value={entityKind}
                  label='Entity Type'
                  onChange={(e) => setEntityKind(e.target.value as EntityKind)}
                >
                  {entityTypes.map((type) => (
                    <MenuItem key={type.kind} value={type.kind}>
                      {type.emoji} {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {entityKind !== entity.kind && (
                <Typography
                  variant='body2'
                  className='mt-2 text-xs text-orange-600'
                >
                  ⚠️ Changing entity type will preserve existing fields where
                  possible, but some fields may be lost if they don&apos;t exist
                  in the new type.
                </Typography>
              )}
            </Box>

            <Box className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {formFields.map((field) => (
                <Box
                  key={field.key}
                  className={field.type === 'textarea' ? 'md:col-span-2' : ''}
                >
                  <FormField
                    field={field}
                    entity={entity}
                    register={register}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Footer */}
          <Box className='bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end space-x-3'>
            <Button
              className='inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className='inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'
              type='submit'
            >
              Save Changes
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};
