'use client';

import { useState } from 'react';

type HelpTooltipProps = {
  content: string | React.ReactNode;
  title?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
};

export const HelpTooltip = ({
  content,
  title = 'Help',
  position = 'top',
  size = 'md',
}: HelpTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const sizeClasses = {
    sm: 'w-48',
    md: 'w-64',
    lg: 'w-80',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-800',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-800',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-800',
  };

  return (
    <div className='relative inline-block'>
      <button
        onClick={() => setIsVisible(!isVisible)}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className='w-5 h-5 bg-gray-100 hover:bg-gray-200 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 text-xs font-medium'
        title={title}
        aria-label={title}
      >
        ?
      </button>

      {isVisible && (
        <div
          className={`absolute z-50 ${positionClasses[position]} ${sizeClasses[size]}`}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          <div className='bg-gray-800 text-white text-sm rounded-lg p-3 shadow-lg'>
            {typeof content === 'string' ? (
              <p className='leading-relaxed'>{content}</p>
            ) : (
              content
            )}
            {/* Arrow */}
            <div
              className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

type HelpButtonProps = {
  helpText: string | React.ReactNode;
  title?: string;
  className?: string;
};

export const HelpButton = ({
  helpText,
  title = 'Help',
  className = '',
}: HelpButtonProps) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setShowHelp(!showHelp)}
        className='w-6 h-6 bg-blue-100 hover:bg-blue-200 rounded-full border border-blue-300 flex items-center justify-center text-blue-600 hover:text-blue-800 transition-all duration-200 text-sm'
        title={title}
        aria-label={title}
      >
        ?
      </button>

      {showHelp && (
        <>
          {/* Backdrop */}
          <div
            className='fixed inset-0 z-40'
            onClick={() => setShowHelp(false)}
          />

          {/* Help Panel */}
          <div className='absolute top-8 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80 max-w-sm'>
            <div className='flex justify-between items-start mb-2'>
              <h3 className='font-semibold text-gray-800 text-sm'>{title}</h3>
              <button
                onClick={() => setShowHelp(false)}
                className='text-gray-400 hover:text-gray-600 text-lg leading-none'
                aria-label='Close help'
              >
                ×
              </button>
            </div>
            <div className='text-gray-600 text-sm'>
              {typeof helpText === 'string' ? <p>{helpText}</p> : helpText}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Context-aware help content
export const HelpContent = {
  fileUpload: (
    <div className='space-y-2'>
      <p>
        <strong>Supported formats:</strong> .docx, .md
      </p>
      <p>
        <strong>File size limit:</strong> 10MB
      </p>
      <p>
        <strong>Tips:</strong>
      </p>
      <ul className='list-disc list-inside space-y-1 text-xs'>
        <li>Use clear character names</li>
        <li>Include location descriptions</li>
        <li>Mention items and equipment</li>
        <li>Structure quests with clear objectives</li>
      </ul>
    </div>
  ),

  entityTypes: (
    <div className='space-y-3'>
      <div>
        <div className='flex items-center space-x-2 mb-1'>
          <span>👤</span>
          <strong className='text-xs'>NPCs</strong>
        </div>
        <p className='text-xs text-gray-500'>
          Characters, merchants, villains, and other people
        </p>
      </div>
      <div>
        <div className='flex items-center space-x-2 mb-1'>
          <span>🗺️</span>
          <strong className='text-xs'>Locations</strong>
        </div>
        <p className='text-xs text-gray-500'>
          Cities, taverns, dungeons, and geographical areas
        </p>
      </div>
      <div>
        <div className='flex items-center space-x-2 mb-1'>
          <span>⚔️</span>
          <strong className='text-xs'>Items</strong>
        </div>
        <p className='text-xs text-gray-500'>
          Weapons, armor, magic items, and equipment
        </p>
      </div>
      <div>
        <div className='flex items-center space-x-2 mb-1'>
          <span>🎯</span>
          <strong className='text-xs'>Quests</strong>
        </div>
        <p className='text-xs text-gray-500'>
          Missions, objectives, and ongoing storylines
        </p>
      </div>
    </div>
  ),

  duplicateManagement: (
    <div className='space-y-2'>
      <p>
        <strong>Duplicate Detection:</strong>
      </p>
      <p className='text-xs'>
        The system automatically identifies potential duplicates based on name
        similarity and context.
      </p>
      <p>
        <strong>Merging Process:</strong>
      </p>
      <ul className='list-disc list-inside space-y-1 text-xs'>
        <li>Select the primary entity to keep</li>
        <li>Choose which fields to merge from duplicates</li>
        <li>Preview the merged result</li>
        <li>Confirm to complete the merge</li>
      </ul>
    </div>
  ),

  exportOptions: (
    <div className='space-y-2'>
      <p>
        <strong>Obsidian Export:</strong>
      </p>
      <p className='text-xs'>
        Generates markdown files with proper frontmatter and templates for each
        entity type.
      </p>
      <p>
        <strong>File Organization:</strong>
      </p>
      <ul className='list-disc list-inside space-y-1 text-xs'>
        <li>Entities grouped by type in folders</li>
        <li>Cross-references and links preserved</li>
        <li>Campaign metadata included</li>
        <li>Ready for import into Obsidian vaults</li>
      </ul>
    </div>
  ),
};
