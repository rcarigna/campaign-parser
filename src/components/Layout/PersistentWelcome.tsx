'use client';

import { useState } from 'react';
import { EntityKind, getEntityFields } from '@/types';
import { getAllEntityMetadata } from '@/lib/utils/entity';

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
            role='button'
            tabIndex={0}
            aria-pressed={selectedEntity === kind}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleEntityClick(kind);
              }
            }}
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
        <div className='bg-white rounded-lg border-2 border-blue-300 shadow-lg overflow-hidden'>
          {/* Schema Header */}
          <div className='bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <span className='text-3xl'>
                {entityTypes.find((e) => e.kind === selectedEntity)?.emoji}
              </span>
              <div>
                <h3 className='text-xl font-bold text-white'>
                  {entityTypes.find((e) => e.kind === selectedEntity)?.label}{' '}
                  Schema
                </h3>
                <p className='text-blue-100 text-sm'>
                  Field definitions and data structure
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedEntity(null)}
              className='text-white hover:text-blue-100 transition-colors'
              aria-label='Close schema view'
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>

          {/* Schema Content */}
          <div className='p-6 bg-gray-50'>
            <div className='mb-4 flex items-center gap-2 text-sm text-gray-600'>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <span>
                Fields marked with{' '}
                <span className='text-red-500 font-bold'>*</span> are required
              </span>
            </div>

            {/* Field List */}
            <div className='space-y-3'>
              {getEntityFields(selectedEntity).map((field) => (
                <div
                  key={field.key}
                  className='bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-colors select-none'
                >
                  <div className='flex items-start justify-between mb-2'>
                    <div className='flex items-center gap-2'>
                      <code className='text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded select-text'>
                        {field.key}
                      </code>
                      {field.required && (
                        <span className='text-red-500 font-bold text-lg leading-none'>
                          *
                        </span>
                      )}
                    </div>
                    <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700'>
                      {field.type}
                    </span>
                  </div>

                  <div className='text-sm text-gray-700 mb-2 select-text'>
                    {field.label}
                  </div>

                  {field.placeholder && (
                    <div className='text-xs text-gray-500 italic bg-gray-50 px-3 py-2 rounded border-l-2 border-gray-300 select-text'>
                      Example: {field.placeholder}
                    </div>
                  )}

                  {field.options && field.options.length > 0 && (
                    <div className='mt-2'>
                      <div className='text-xs font-medium text-gray-600 mb-1'>
                        Allowed values:
                      </div>
                      <div className='flex flex-wrap gap-1'>
                        {field.options.map((opt) => (
                          <span
                            key={opt.value}
                            className='inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 select-text'
                          >
                            {opt.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Schema Footer */}
          <div className='bg-gray-100 px-6 py-3 border-t border-gray-200 flex items-center justify-between'>
            <div className='text-xs text-gray-500'>
              {getEntityFields(selectedEntity).filter((f) => f.required).length}{' '}
              required •{' '}
              {
                getEntityFields(selectedEntity).filter((f) => !f.required)
                  .length
              }{' '}
              optional
            </div>
            <button
              onClick={() => setSelectedEntity(null)}
              className='text-sm text-blue-600 hover:text-blue-800 font-medium'
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
