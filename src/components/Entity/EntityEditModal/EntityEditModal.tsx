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
import { SectionTitle } from '../../Layout/CommonStyled';
import CloseIcon from '@mui/icons-material/Close';
import {
  getEntityFields,
  type EntityWithId,
  EntityKind,
  type FieldMetadata,
  EntityMetadata,
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
const EditModalHeader = ({
  onClose,
  title,
}: {
  onClose: () => void;
  title: string;
}) => (
  <Box
    sx={{
      bgcolor: 'background.paper',
      px: 4,
      py: 3,
      borderBottom: 1,
      borderColor: 'divider',
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <SectionTitle component='h3' variant='h5' sx={{ mb: 0 }} id='entity-edit-modal-title'>
        Edit Entity: {title}
      </SectionTitle>
      <IconButton
        onClick={onClose}
        aria-label='Close modal'
        data-testid='close-button'
        type='button'
        sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  </Box>
);
const EditModalFooter = ({ onClose }: { onClose: () => void }) => (
  <Box
    sx={{
      bgcolor: 'background.paper',
      px: 4,
      py: 2,
      borderTop: 1,
      borderColor: 'divider',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 2,
    }}
  >
    <Button variant='outlined' color='inherit' onClick={onClose} type='button'>
      Cancel
    </Button>
    <Button variant='contained' color='primary' type='submit'>
      Save Changes
    </Button>
  </Box>
);
const EntityTypeSelector = ({
  entityKind,
  setEntityKind,
  entityTypes,
  originalKind,
}: {
  entityKind: EntityKind;
  setEntityKind: (kind: EntityKind) => void;
  entityTypes: EntityMetadata[];
  originalKind: EntityKind;
}) => (
  <Box sx={{ mb: 6, pb: 4, borderBottom: 1, borderColor: 'divider' }}>
    <FormControl fullWidth>
      <InputLabel id='entity-type-label'>
        Entity Type
        {entityKind !== originalKind && (
          <Box
            component='span'
            sx={{
              color: 'orange',
              fontSize: '0.8em',
              ml: 1,
            }}
          >
            (Changed from {originalKind})
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
    {entityKind !== originalKind && (
      <Typography
        variant='body2'
        sx={{ mt: 2, fontSize: 12, color: 'warning.main' }}
      >
        ⚠️ Changing entity type will preserve existing fields where possible,
        but some fields may be lost if they don&apos;t exist in the new type.
      </Typography>
    )}
  </Box>
);
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
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: 'rgba(0, 0, 0, 0.7)',
        overflowY: 'auto',
        height: '100vh',
        width: '100vw',
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
      role='dialog'
      aria-modal='true'
      aria-labelledby='entity-edit-modal-title'
      data-testid='modal-overlay'
      onClick={onClose}
    >
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 24,
          maxWidth: 600,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
        }}
        data-testid='modal-content'
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit(handleSave)}>
          <EditModalHeader onClose={onClose} title={entity.title} />
          <Box sx={{ px: 4, py: 3, overflowY: 'auto', maxHeight: '60vh' }}>
            <EntityTypeSelector
              entityKind={entityKind}
              setEntityKind={setEntityKind}
              entityTypes={entityTypes}
              originalKind={entity.kind}
            />
            {/* Dynamic Form Fields */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2,
              }}
            >
              {formFields.map((field) => (
                <Box
                  key={field.key}
                  sx={
                    field.type === 'textarea'
                      ? { gridColumn: { md: '1 / span 2' } }
                      : {}
                  }
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
          <EditModalFooter onClose={onClose} />
        </form>
      </Box>
    </Box>
  );
};
