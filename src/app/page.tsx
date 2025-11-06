'use client';

import {
  Header,
  PersistentWelcome,
  WelcomeSection,
  ProcessingWorkflow,
  ResultsSection,
} from '@/components';
import { useCampaignParser, useFileManager } from '@/hooks';
import { type DemoDataResponse } from '@/client/api';
import { toast } from 'react-hot-toast';

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
      toast.error(`Processing failed: ${error}`);
    }
  };

  const handleDemoDataLoaded = (demoData: DemoDataResponse) => {
    // Clear any existing file selection
    fileManager.clearFile();
    // Load demo data into campaign parser
    campaignParser.loadDemoData(demoData);
  };

  const handleClearResults = () => {
    fileManager.clearFile();
    campaignParser.clearResults();
  };

  const hasContent = !!campaignParser.parsedData;
  const combinedError = fileManager.error || campaignParser.error;

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

          <PersistentWelcome />

          {!hasContent && (
            <WelcomeSection onDemoDataLoaded={handleDemoDataLoaded} />
          )}

          <ProcessingWorkflow
            selectedFile={fileManager.selectedFile}
            loading={campaignParser.loading}
            error={combinedError}
            hasContent={hasContent}
            onFileSelect={handleFileSelect}
            onProcess={handleProcessDocument}
            onReset={handleClearResults}
            onClearError={campaignParser.clearError}
          />
        </div>

        {/* Results Section */}
        {campaignParser.parsedData && (
          <ResultsSection
            parsedData={campaignParser.parsedData}
            entities={campaignParser.entities}
            onEntityDiscard={campaignParser.discardEntity}
            onEntityMerge={campaignParser.mergeEntities}
          />
        )}
      </main>
    </div>
  );
}
