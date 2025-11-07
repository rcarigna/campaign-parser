'use client';

import { useState } from 'react';

type HeaderProps = {
  title: string;
  subtitle: string;
};

type NavigationItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  icon: string;
};

export const Header = ({ title, subtitle }: HeaderProps) => {
  const [showDocumentationModal, setShowDocumentationModal] = useState(false);

  const navigationItems: NavigationItem[] = [
    {
      label: 'Documentation',
      onClick: () => setShowDocumentationModal(true),
      icon: '📚',
    },
    {
      label: 'API Reference',
      href: '/api/docs?file=api-reference',
      icon: '🔌',
    },
    {
      label: 'Architecture',
      href: '/api/docs?file=architecture',
      icon: '🏗️',
    },
    {
      label: 'GitHub',
      href: 'https://github.com/rcarigna/campaign-parser',
      icon: '🐙',
    },
  ];

  const handleNavItemClick = (item: NavigationItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <header role='banner' className='relative'>
      <div className='flex justify-between items-start mb-8'>
        <div className='flex-1'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>{title}</h1>
          <p className='text-gray-600'>{subtitle}</p>
        </div>

        {/* Navigation Menu */}
        <nav className='flex items-center space-x-1 ml-8'>
          {navigationItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavItemClick(item)}
              className='flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200'
              title={item.label}
            >
              <span className='text-lg'>{item.icon}</span>
              <span className='hidden sm:inline'>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Documentation Modal */}
      {showDocumentationModal && (
        <DocumentationModal onClose={() => setShowDocumentationModal(false)} />
      )}
    </header>
  );
};

// Documentation Modal Component
const DocumentationModal = ({ onClose }: { onClose: () => void }) => {
  const [activeSection, setActiveSection] = useState<
    'quickstart' | 'features' | 'troubleshooting'
  >('quickstart');

  const sections = {
    quickstart: {
      title: '🚀 Quick Start Guide',
      content: (
        <div className='space-y-4'>
          <div>
            <h4 className='font-semibold text-gray-800 mb-2'>
              1. Try the Demo First
            </h4>
            <p className='text-gray-600 text-sm mb-3'>
              Click &quot;🎭 Try the Demo&quot; below to load a sample D&amp;D
              session and see how the parser works.
            </p>
          </div>

          <div>
            <h4 className='font-semibold text-gray-800 mb-2'>
              2. Upload Your Documents
            </h4>
            <p className='text-gray-600 text-sm mb-3'>
              Drag & drop or select .docx or .md files to extract entities
              automatically.
            </p>
          </div>

          <div>
            <h4 className='font-semibold text-gray-800 mb-2'>
              3. Manage Entities
            </h4>
            <p className='text-gray-600 text-sm mb-3'>
              Review extracted NPCs, locations, items, and quests. Filter, edit,
              and merge duplicates.
            </p>
          </div>

          <div>
            <h4 className='font-semibold text-gray-800 mb-2'>
              4. Export to Obsidian
            </h4>
            <p className='text-gray-600 text-sm'>
              Download organized markdown files ready for your Obsidian vault or
              other note-taking systems.
            </p>
          </div>
        </div>
      ),
    },
    features: {
      title: '⚡ Key Features',
      content: (
        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='p-3 bg-blue-50 rounded-lg'>
              <h4 className='font-semibold text-blue-800 mb-1'>
                🧠 Smart Entity Extraction
              </h4>
              <p className='text-blue-600 text-sm'>
                Dual NLP + regex engine automatically identifies NPCs,
                locations, items, and quests.
              </p>
            </div>

            <div className='p-3 bg-green-50 rounded-lg'>
              <h4 className='font-semibold text-green-800 mb-1'>
                🔀 Duplicate Detection
              </h4>
              <p className='text-green-600 text-sm'>
                Intelligent duplicate detection with guided merge workflow.
              </p>
            </div>

            <div className='p-3 bg-purple-50 rounded-lg'>
              <h4 className='font-semibold text-purple-800 mb-1'>
                📁 Obsidian Export
              </h4>
              <p className='text-purple-600 text-sm'>
                Generates vault-ready files with proper frontmatter and
                templates.
              </p>
            </div>

            <div className='p-3 bg-orange-50 rounded-lg'>
              <h4 className='font-semibold text-orange-800 mb-1'>
                ✅ Real Data Testing
              </h4>
              <p className='text-orange-600 text-sm'>
                260+ tests using authentic D&D campaign sessions for
                reliability.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    troubleshooting: {
      title: '🔧 Troubleshooting',
      content: (
        <div className='space-y-4'>
          <div>
            <h4 className='font-semibold text-gray-800 mb-2'>
              File Upload Issues
            </h4>
            <ul className='text-gray-600 text-sm space-y-1 ml-4'>
              <li>• Ensure file is .docx or .md format</li>
              <li>• Check file size is under 10MB</li>
              <li>• Try refreshing the page and re-uploading</li>
            </ul>
          </div>

          <div>
            <h4 className='font-semibold text-gray-800 mb-2'>
              Missing Entities
            </h4>
            <ul className='text-gray-600 text-sm space-y-1 ml-4'>
              <li>• Use clear names in your documents</li>
              <li>• Avoid excessive abbreviations</li>
              <li>• Include context around character/location names</li>
            </ul>
          </div>

          <div>
            <h4 className='font-semibold text-gray-800 mb-2'>
              Export Problems
            </h4>
            <ul className='text-gray-600 text-sm space-y-1 ml-4'>
              <li>• Ensure you have entities to export</li>
              <li>• Check your browser&apos;s download settings</li>
              <li>• Try exporting smaller batches if needed</li>
            </ul>
          </div>

          <div className='mt-6 p-3 bg-gray-50 rounded-lg'>
            <p className='text-gray-600 text-sm'>
              <strong>Need more help?</strong> Visit our{' '}
              <button
                onClick={() =>
                  window.open(
                    'https://github.com/rcarigna/campaign-parser/issues',
                    '_blank'
                  )
                }
                className='text-blue-600 hover:text-blue-800 underline'
              >
                GitHub Issues
              </button>{' '}
              page or check the full{' '}
              <button
                onClick={() =>
                  window.open(
                    'https://github.com/rcarigna/campaign-parser/blob/main/docs/README.md',
                    '_blank'
                  )
                }
                className='text-blue-600 hover:text-blue-800 underline'
              >
                Documentation
              </button>
              .
            </p>
          </div>
        </div>
      ),
    },
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-900'>📚 Documentation</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 text-2xl'
            aria-label='Close documentation'
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className='flex border-b border-gray-200'>
          {Object.entries(sections).map(([key, section]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key as keyof typeof sections)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeSection === key
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-6'>
          {sections[activeSection].content}
        </div>

        {/* Footer */}
        <div className='border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center'>
          <div className='text-sm text-gray-600'>
            Campaign Document Parser - Next.js 16 Application
          </div>
          <div className='flex space-x-3'>
            <button
              onClick={() =>
                window.open(
                  'https://github.com/rcarigna/campaign-parser/blob/main/README.md',
                  '_blank'
                )
              }
              className='text-sm px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
            >
              Full Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
