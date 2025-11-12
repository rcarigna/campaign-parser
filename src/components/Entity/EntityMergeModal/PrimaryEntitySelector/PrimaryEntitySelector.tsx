import React from 'react';
import { PrimaryEntitySelectorProps } from '@/types';
import { getEntityIcon } from '@/lib/utils/entity';

export const PrimaryEntitySelector: React.FC<PrimaryEntitySelectorProps> = ({
  entities,
  primaryEntityId,
  setPrimaryEntityId,
  renderEntityDetail,
}) => (
  <div className='merge-section'>
    <h3>1. Select Primary Entity</h3>
    <div className='entity-selector'>
      {entities.map((entity) => (
        <label key={entity.id} className='entity-option'>
          <input
            type='radio'
            name='primary-entity'
            value={entity.id}
            checked={primaryEntityId === entity.id}
            onChange={() => setPrimaryEntityId(entity.id)}
          />
          <div className='entity-preview'>
            <strong>
              <span className='entity-icon'>{getEntityIcon(entity.kind)}</span>
              {entity.title}
            </strong>
            <div className='entity-details'>
              {renderEntityDetail(entity, 'role', 'Role')}
              {renderEntityDetail(entity, 'type', 'Type')}
              {renderEntityDetail(entity, 'description', 'Description')}
            </div>
          </div>
        </label>
      ))}
    </div>
  </div>
);
