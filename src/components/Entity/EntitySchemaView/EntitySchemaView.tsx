import { EntityKind, getEntityFields } from '@/types';
import { getAllEntityMetadata } from '@/lib/utils/entity';
import { generateSchemaEnhancementIssueUrl } from '@/lib/utils/github';
import { SchemaField } from './SchemaField';
import { Box, Typography, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

type EntitySchemaViewProps = {
  entityKind: EntityKind;
  onClose: () => void;
};

export const EntitySchemaView = ({
  entityKind,
  onClose,
}: EntitySchemaViewProps) => {
  const entityTypes = getAllEntityMetadata();
  const entityMetadata = entityTypes.find((e) => e.kind === entityKind);
  const fields = getEntityFields(entityKind);
  const requiredCount = fields.filter((f) => f.required).length;
  const optionalCount = fields.filter((f) => !f.required).length;

  const handleSuggestEnhancement = () => {
    const url = generateSchemaEnhancementIssueUrl(entityKind, fields);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!entityMetadata) return null;

  return (
    <Box
      data-testid='entity-schema-view'
      className='bg-white rounded-lg border-2 border-blue-300 shadow-lg overflow-hidden'
    >
      {/* Schema Header */}
      <Box className='bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex items-center justify-between'>
        <Box className='flex items-center gap-3'>
          <Typography component='span' className='text-3xl'>
            {entityMetadata.emoji}
          </Typography>
          <Box>
            <Typography variant='h3' className='text-white font-bold'>
              {entityMetadata.label} Schema
            </Typography>
            <Typography className='text-blue-100 text-sm'>
              Field definitions and data structure
            </Typography>
          </Box>
        </Box>
        <Button
          onClick={onClose}
          className='text-white hover:text-blue-100 transition-colors'
          aria-label='Close schema view'
        >
          <CloseIcon fontSize='medium' />
        </Button>
      </Box>

      {/* Schema Content */}
      <Box className='p-6 bg-gray-50'>
        <Box className='mb-4 flex items-center justify-between'>
          <Box className='flex items-center gap-2 text-sm text-gray-600'>
            <InfoOutlinedIcon
              fontSize='small'
              sx={{ color: 'text.secondary' }}
            />
            <Typography component='span'>
              Fields marked with
              <Typography component='span' className='text-red-500 font-bold'>
                *
              </Typography>{' '}
              are required
            </Typography>
          </Box>
          <Button
            onClick={handleSuggestEnhancement}
            className='flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md font-medium transition-colors border border-blue-200 hover:border-blue-300'
            aria-label='Suggest schema enhancement'
          >
            <AddCircleOutlineIcon fontSize='small' />
            Suggest Enhancement
          </Button>
        </Box>

        {/* Field List */}
        <Box className='space-y-3'>
          {fields.map((field) => (
            <SchemaField
              key={field.key}
              field={field}
              entityKind={entityKind}
            />
          ))}
        </Box>
      </Box>

      {/* Schema Footer */}
      <Box className='bg-gray-100 px-6 py-3 border-t border-gray-200 flex items-center justify-between'>
        <Box className='text-xs text-gray-500'>
          {requiredCount} required • {optionalCount} optional
        </Box>
        <Button
          onClick={onClose}
          className='text-sm text-blue-600 hover:text-blue-800 font-medium'
        >
          Close
        </Button>
      </Box>
    </Box>
  );
};
