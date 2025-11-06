'use client';

import { useState } from 'react';
import {
  Header,
  FileUpload,
  ActionButtons,
  EntityViewer,
  DemoSection,
  DocumentViewer,
} from '@/components';
import { useCampaignParser, useFileManager } from '@/hooks';
import { ALLOWED_EXTENSIONS } from '@/types';
import { toast } from 'react-hot-toast';

type Tab = 'upload' | 'demo';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('demo');
  const campaignParser = useCampaignParser();
  const fileManager = useFileManager();

  const handleFileSelect = (file: File) => {
    fileManager.selectFile(file);
  };

  const handleProcessDocument = async (file: File) => {
    try {
      await campaignParser.processDocument(file);
    } catch (error) {
      toast.error(`Processing failed: ${error}`);
    }
  };

  const handleClearResults = () => {
    fileManager.clearFile();
    campaignParser.clearResults();
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <main className='container mx-auto px-4 py-8 max-w-6xl'>
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8'>
          <Header
            title='🎲 Campaign Document Parser'
            subtitle='Upload your campaign documents (.docx, .md) to automatically extract
            and manage NPCs, locations, items, quests, and other campaign
            entities.'
          />

          {/* Tab Navigation */}
          <div className='flex gap-2 mb-6 border-b border-gray-200'>
            <button
              onClick={() => setActiveTab('demo')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'demo'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🎭 Try Demo
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'upload'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📤 Upload Document
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'demo' ? (
            <DemoSection />
          ) : (
            <>
              {/* Welcome Message when no document is loaded */}
              {!fileManager.selectedFile && !campaignParser.parsedData && (
                <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-8 text-center mb-6'>
                  <div className='text-6xl mb-4'>📜</div>
                  <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
                    Welcome to Campaign Parser
                  </h2>
                  <p className='text-gray-600 max-w-2xl mx-auto mb-6'>
                    Get started by uploading a campaign document below. The
                    parser will automatically identify and extract entities like
                    NPCs, locations, items, and quests, making it easy to manage
                    your tabletop RPG campaigns.
                  </p>
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
                    <div className='p-4'>
                      <div className='text-2xl mb-2'>👤</div>
                      <div className='text-sm font-medium text-gray-700'>
                        NPCs
                      </div>
                    </div>
                    <div className='p-4'>
                      <div className='text-2xl mb-2'>🗺️</div>
                      <div className='text-sm font-medium text-gray-700'>
                        Locations
                      </div>
                    </div>
                    <div className='p-4'>
                      <div className='text-2xl mb-2'>⚔️</div>
                      <div className='text-sm font-medium text-gray-700'>
                        Items
                      </div>
                    </div>
                    <div className='p-4'>
                      <div className='text-2xl mb-2'>🎯</div>
                      <div className='text-sm font-medium text-gray-700'>
                        Quests
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className='space-y-6'>
                {/* File Upload Section */}
                <div>
                  <h2 className='text-xl font-semibold text-gray-800 mb-4'>
                    📤 Upload Document
                  </h2>
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    selectedFile={fileManager.selectedFile}
                    error={fileManager.error || campaignParser.error}
                    allowedExtensions={ALLOWED_EXTENSIONS}
                  />
                </div>

                {/* Action Buttons */}
                {fileManager.selectedFile && (
                  <ActionButtons
                    selectedFile={fileManager.selectedFile}
                    loading={campaignParser.loading}
                    onProcess={handleProcessDocument}
                    onReset={handleClearResults}
                  />
                )}

                {/* Processing Status */}
                {campaignParser.loading && (
                  <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                    <div className='flex items-center'>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3'></div>
                      <span className='text-blue-700 font-medium'>
                        Processing document... This may take a few moments.
                      </span>
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {(campaignParser.error || fileManager.error) && (
                  <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                    <div className='flex items-center'>
                      <span className='text-red-600 font-medium'>
                        ❌ Error:
                      </span>
                      <span className='text-red-700 ml-2'>
                        {campaignParser.error || fileManager.error}
                      </span>
                    </div>
                    <button
                      onClick={campaignParser.clearError}
                      className='mt-2 text-red-600 hover:text-red-800 text-sm underline'
                    >
                      Clear Error
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Results Section (for Upload tab only) */}
        {activeTab === 'upload' && campaignParser.parsedData && (
          <div className='space-y-6'>
            {/* Document Content */}
            <DocumentViewer parsedData={campaignParser.parsedData} />

            {/* Entity Management */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <div className='mb-4'>
                <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                  ✨ Extracted Entities
                </h3>
                <p className='text-gray-600 text-sm'>
                  The parser automatically identified{' '}
                  {campaignParser.entities.length} entities from your document.
                  You can view, edit, merge duplicates, and export them to
                  Obsidian format.
                </p>
              </div>
              <EntityViewer
                entities={campaignParser.entities}
                onEntityDiscard={campaignParser.discardEntity}
                onEntityMerge={campaignParser.mergeEntities}
                parsedData={campaignParser.parsedData}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
