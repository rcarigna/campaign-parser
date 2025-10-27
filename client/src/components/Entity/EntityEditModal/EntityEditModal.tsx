import { useState } from 'react';
import {
  type AnyEntity,
  EntityKind,
  ItemRarity,
  LocationType,
  QuestType,
  ItemType,
} from '../../../types/constants';

type EntityWithId = AnyEntity & {
  id: string;
  [key: string]: any;
};

type EntityEditModalProps = {
  entity: EntityWithId;
  onClose: () => void;
  onSave: (entity: EntityWithId) => void;
};

export const EntityEditModal = ({
  entity,
  onClose,
  onSave,
}: EntityEditModalProps): JSX.Element => {
  const [editedEntity, setEditedEntity] = useState<EntityWithId>({ ...entity });

  const handleFieldChange = (field: string, value: string) => {
    setEditedEntity((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedEntity);
  };

  const getFieldsForType = (
    kind: EntityKind
  ): Array<{
    key: string;
    label: string;
    type: string;
    options?: string[];
  }> => {
    const baseFields = [{ key: 'title', label: 'Title', type: 'text' }];

    switch (kind) {
      case EntityKind.NPC:
        return [
          ...baseFields,
          { key: 'role', label: 'Role', type: 'text' },
          { key: 'faction', label: 'Faction', type: 'text' },
          {
            key: 'importance',
            label: 'Importance',
            type: 'select',
            options: ['minor', 'supporting', 'major'],
          },
          { key: 'location', label: 'Location', type: 'text' },
          { key: 'class', label: 'Class', type: 'text' },
          { key: 'race', label: 'Race', type: 'text' },
        ];
      case EntityKind.LOCATION:
        return [
          ...baseFields,
          {
            key: 'type',
            label: 'Type',
            type: 'select',
            options: Object.values(LocationType),
          },
          { key: 'region', label: 'Region', type: 'text' },
        ];
      case EntityKind.ITEM:
        return [
          ...baseFields,
          {
            key: 'type',
            label: 'Type',
            type: 'select',
            options: Object.values(ItemType),
          },
          {
            key: 'rarity',
            label: 'Rarity',
            type: 'select',
            options: Object.values(ItemRarity),
          },
          { key: 'attunement', label: 'Requires Attunement', type: 'checkbox' },
          { key: 'owner', label: 'Owner', type: 'text' },
        ];
      case EntityKind.QUEST:
        return [
          ...baseFields,
          {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: ['active', 'completed', 'failed', 'available'],
          },
          {
            key: 'type',
            label: 'Type',
            type: 'select',
            options: Object.values(QuestType),
          },
          { key: 'owner', label: 'Quest Giver', type: 'text' },
          { key: 'faction', label: 'Faction', type: 'text' },
        ];
      default:
        return baseFields;
    }
  };

  const fields = getFieldsForType(entity.kind);

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h3>
            Edit {entity.kind}: {entity.title}
          </h3>
          <button className='close-button' onClick={onClose}>
            ×
          </button>
        </div>

        <div className='modal-body'>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            {fields.map((field) => (
              <div key={field.key} className='form-group'>
                <label htmlFor={field.key}>{field.label}:</label>

                {field.type === 'text' && (
                  <input
                    id={field.key}
                    type='text'
                    value={editedEntity[field.key] || ''}
                    onChange={(e) =>
                      handleFieldChange(field.key, e.target.value)
                    }
                    className='form-input'
                  />
                )}

                {field.type === 'textarea' && (
                  <textarea
                    id={field.key}
                    value={editedEntity[field.key] || ''}
                    onChange={(e) =>
                      handleFieldChange(field.key, e.target.value)
                    }
                    className='form-textarea'
                    rows={3}
                  />
                )}

                {field.type === 'select' && field.options && (
                  <select
                    id={field.key}
                    value={editedEntity[field.key] || ''}
                    onChange={(e) =>
                      handleFieldChange(field.key, e.target.value)
                    }
                    className='form-select'
                  >
                    <option value=''>-- Select {field.label} --</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === 'checkbox' && (
                  <input
                    id={field.key}
                    type='checkbox'
                    checked={!!editedEntity[field.key]}
                    onChange={(e) =>
                      handleFieldChange(field.key, e.target.checked.toString())
                    }
                    className='form-checkbox'
                  />
                )}
              </div>
            ))}

            <div className='form-actions'>
              <button
                type='button'
                onClick={onClose}
                className='btn btn-secondary'
              >
                Cancel
              </button>
              <button type='submit' className='btn btn-primary'>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
