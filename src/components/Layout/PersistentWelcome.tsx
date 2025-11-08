'use client';

import { useState } from 'react';
import { EntityKind, getEntityFields } from '@/types';
import { getAllEntityMetadata } from '@/components/Entity/entityUtils';

const entityTypes = getAllEntityMetadata();

export const PersistentWelcome = () => {
  const [selectedEntity, setSelectedEntity] = useState<EntityKind | null>(null);

  const handleEntityClick = (entityKind: EntityKind) => {
    setSelectedEntity(selectedEntity === entityKind ? null : entityKind);
  };

  // Removed getSelectedEntitySchema for KISS principle

  return (
    <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-8 mb-6'>
      <div className='text-center mb-8'>
        <div className='text-6xl mb-4'>📜</div>
        <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
          Welcome to Campaign Parser
        </h2>
        <p className='text-gray-600 max-w-2xl mx-auto mb-6'>
          Upload campaign documents (.docx, .md) or try the demo to
          automatically identify and extract entities like NPCs, locations,
          items, and quests, making it easy to manage your tabletop RPG
          campaigns.
        </p>
      </div>

      {/* Entity Types Grid */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6'>
        {entityTypes.map(({ kind, emoji, label, description }) => (
          <div
            key={kind}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedEntity === kind
                ? 'bg-blue-100 border-blue-300 ring-2 ring-blue-200'
                : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
            onClick={() => handleEntityClick(kind)}
          >
            <div className='text-2xl mb-2 text-center'>{emoji}</div>
            <div className='text-sm font-medium text-gray-700 text-center mb-1'>
              {label}
            </div>
            <div className='text-xs text-gray-500 text-center'>
              {description}
            </div>
          </div>
        ))}
      </div>

      {/* Schema Display */}
      {selectedEntity && (
        <div className='bg-white rounded-lg border border-gray-200 p-6'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>
            {entityTypes.find((e) => e.kind === selectedEntity)?.label} Schema
            Fields
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {getSelectedEntitySchema().map((field) => (
              <div key={field.key} className='p-3 bg-gray-50 rounded-lg border'>
                <div className='flex items-center mb-2'>
                  <span className='font-medium text-sm text-gray-800'>
                    {field.label}
                  </span>
                  {field.required && (
                    <span className='text-red-500 text-xs ml-1'>*</span>
                  )}
                </div>
                <div className='text-xs text-gray-600 mb-1'>
                  Type:{' '}
                  <span className='font-mono bg-gray-200 px-1 rounded'>
                    {field.type}
                  </span>
                </div>
                {field.placeholder && (
                  <div className='text-xs text-gray-500 italic'>
                    {field.placeholder}
                  </div>
                )}
                {field.options && field.options.length > 0 && (
                  <div className='text-xs text-gray-500 mt-1'>
                    Options: {field.options.map((opt) => opt.label).join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className='mt-4 text-center'>
            <button
              onClick={() => setSelectedEntity(null)}
              className='text-sm text-blue-600 hover:text-blue-800 underline'
            >
              Close Schema View
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
