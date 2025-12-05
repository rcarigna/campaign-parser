import type { FieldMetadata } from '@/types';
import type { EntityKind } from '@/types';
import { generateFieldModificationIssueUrl } from '@/lib/utils/github';
import { Box, Button, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

type SchemaFieldProps = {
  field: FieldMetadata;
  entityKind: EntityKind;
};

export const SchemaField = ({ field, entityKind }: SchemaFieldProps) => {
  const handleSuggestEdit = () => {
    const url = generateFieldModificationIssueUrl(entityKind, field);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Box className='bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-colors select-none'>
      <Box className='flex items-start justify-between mb-2'>
        <Box className='flex items-center gap-2'>
          <Typography
            component='code'
            variant='body2'
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              bgcolor: 'primary.light',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontFamily: 'monospace',
              userSelect: 'text',
            }}
          >
            {field.key}
          </Typography>
          {field.required && (
            <Typography
              component='span'
              className='text-red-500 font-bold text-lg leading-none'
            >
              *
            </Typography>
          )}
        </Box>
        <Typography
          component='span'
          className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700'
        >
          {field.type}
        </Typography>
      </Box>

      <Box className='text-sm text-gray-700 mb-2 select-text'>
        {field.label}
      </Box>

      {field.placeholder && (
        <Box className='text-xs text-gray-500 italic bg-gray-50 px-3 py-2 rounded border-l-2 border-gray-300 select-text'>
          Example: {field.placeholder}
        </Box>
      )}

      {field.options && field.options.length > 0 && (
        <Box className='mt-2'>
          <Box className='text-xs font-medium text-gray-600 mb-1'>
            Allowed values:
          </Box>
          <Box className='flex flex-wrap gap-1'>
            {field.options.map((opt) => (
              <Typography
                component='span'
                key={opt.value}
                className='inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 select-text'
              >
                {opt.label}
              </Typography>
            ))}
          </Box>
        </Box>
      )}

      {/* Suggest Edit Button */}
      <Box className='mt-3 pt-3 border-t border-gray-200'>
        <Button
          onClick={handleSuggestEdit}
          className='flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors'
          aria-label={`Suggest edit for ${field.key} field`}
        >
          <AddCircleOutlineIcon fontSize='small' />
          Suggest Edit
        </Button>
      </Box>
    </Box>
  );
};
