'use client';

import {
  Header,
  FileUpload,
  ActionButtons,
  ParsedResults,
  EntityViewer,
} from '@/components';
import { useCampaignParser, useFileManager } from '@/hooks';
import { ALLOWED_EXTENSIONS } from '@/types';

export default function Home() {
  const campaignParser = useCampaignParser();
  const fileManager = useFileManager();

  const handleFileSelect = (file: File) => {
    fileManager.selectFile(file);
  };

  const handleProcessDocument = async (file: File) => {
    try {
      await campaignParser.processDocument(file);
    } catch (error) {
      console.error('Processing failed:', error);
    }
  };

  const handleClearResults = () => {
    fileManager.clearFile();
    campaignParser.clearResults();
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header
        title='Campaign Document Parser'
        subtitle='Extract and manage campaign entities from your documents'
      />

      <main className='container mx-auto px-4 py-8 max-w-6xl'>
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            🎲 Campaign Document Parser
          </h1>
          <p className='text-gray-600 mb-8'>
            Upload your campaign documents (.docx, .md) to automatically extract
            and manage NPCs, locations, items, quests, and other campaign
            entities.
          </p>

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
                  <span className='text-red-600 font-medium'>❌ Error:</span>
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
        </div>

        {/* Results Section */}
        {campaignParser.parsedData && (
          <div className='space-y-8'>
            {/* Document Summary */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <ParsedResults
                parsedData={campaignParser.parsedData}
                entities={campaignParser.entities}
                onEntityDiscard={campaignParser.discardEntity}
              />
            </div>

            {/* Entity Management */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <EntityViewer
                entities={campaignParser.entities}
                onEntityDiscard={campaignParser.discardEntity}
              />
            </div>
          </div>
        )}

        {/* Welcome Message when no document is loaded */}
        {!fileManager.selectedFile && !campaignParser.parsedData && (
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
            <div className='text-6xl mb-4'>📜</div>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              Welcome to Campaign Parser
            </h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Get started by uploading a campaign document above. The parser
              will automatically identify and extract entities like NPCs,
              locations, items, and quests, making it easy to manage your
              tabletop RPG campaigns.
            </p>
            <div className='mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
              <div className='p-4'>
                <div className='text-2xl mb-2'>👤</div>
                <div className='text-sm font-medium text-gray-700'>NPCs</div>
              </div>
              <div className='p-4'>
                <div className='text-2xl mb-2'>🗺️</div>
                <div className='text-sm font-medium text-gray-700'>
                  Locations
                </div>
              </div>
              <div className='p-4'>
                <div className='text-2xl mb-2'>⚔️</div>
                <div className='text-sm font-medium text-gray-700'>Items</div>
              </div>
              <div className='p-4'>
                <div className='text-2xl mb-2'>🎯</div>
                <div className='text-sm font-medium text-gray-700'>Quests</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
