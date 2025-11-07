'use client';

import { useState } from 'react';

export const PersistentWelcome = () => {
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);

  const entityInfo = [
    {
      icon: '👤',
      label: 'NPCs',
      description:
        'Non-Player Characters - automatically extracted from character names, titles, and descriptions in your documents.',
    },
    {
      icon: '🗺️',
      label: 'Locations',
      description:
        'Places and areas - cities, taverns, dungeons, and other geographical locations mentioned in your campaign.',
    },
    {
      icon: '⚔️',
      label: 'Items',
      description:
        'Equipment and artifacts - weapons, armor, magic items, and other objects found in your documents.',
    },
    {
      icon: '🎯',
      label: 'Quests',
      description:
        'Missions and objectives - automatically identified quest hooks, goals, and ongoing storylines.',
    },
  ];

  return (
    <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-8 text-center mb-6 relative'>
      {/* Help Button */}
      <button
        onClick={() => setShowHelpTooltip(!showHelpTooltip)}
        className='absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full border border-blue-300 flex items-center justify-center text-blue-600 hover:text-blue-800 transition-all duration-200 shadow-sm hover:shadow-md'
        title='Learn about entity types'
      >
        ?
      </button>

      {/* Help Tooltip */}
      {showHelpTooltip && (
        <div className='absolute top-14 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-left z-10 w-80 max-w-sm'>
          <h3 className='font-semibold text-gray-800 mb-3'>
            Entity Types Explained
          </h3>
          <div className='space-y-3'>
            {entityInfo.map((entity) => (
              <div key={entity.label} className='flex items-start space-x-3'>
                <span className='text-lg flex-shrink-0'>{entity.icon}</span>
                <div>
                  <div className='font-medium text-gray-800 text-sm'>
                    {entity.label}
                  </div>
                  <div className='text-gray-600 text-xs'>
                    {entity.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='mt-4 pt-3 border-t border-gray-200'>
            <p className='text-xs text-gray-500'>
              The parser uses advanced NLP and pattern matching to automatically
              identify these entity types in your documents.
            </p>
          </div>
        </div>
      )}

      <div className='text-6xl mb-4'>📜</div>
      <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
        Welcome to Campaign Parser
      </h2>
      <p className='text-gray-600 max-w-2xl mx-auto mb-6'>
        Upload campaign documents (.docx, .md) or try the demo to automatically
        identify and extract entities like NPCs, locations, items, and quests,
        making it easy to manage your tabletop RPG campaigns.
      </p>

      {/* Entity Types Grid */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
        {entityInfo.map((entity) => (
          <div
            key={entity.label}
            className='p-4 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors duration-200 cursor-help'
            title={entity.description}
          >
            <div className='text-2xl mb-2'>{entity.icon}</div>
            <div className='text-sm font-medium text-gray-700'>
              {entity.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
