'use client';

import {
  PersistentWelcome,
  WelcomeSection,
  ProcessingWorkflow,
  ResultsSection,
} from '@/components';
import MuiRootProvider from '@/components/MuiRootProvider';
import { useCampaignParser, useFileManager } from '@/hooks';
import { type DemoDataResponse } from '@/client/api';
import { toast } from 'react-hot-toast';
import { Box } from '@mui/material';
import { SectionContainer } from '@/components/Layout/CommonStyled';

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
    <MuiRootProvider>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6 }}>
        <SectionContainer sx={{ maxWidth: 960, mx: 'auto', p: 0 }}>
          <Box sx={{ p: { xs: 2, sm: 4 } }}>
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
          </Box>

          {/* Results Section */}
          {campaignParser.parsedData && (
            <ResultsSection
              parsedData={campaignParser.parsedData}
              entities={campaignParser.entities}
              onEntityDiscard={campaignParser.discardEntity}
              onEntityUpdate={campaignParser.updateEntity}
              onEntityMerge={campaignParser.mergeEntities}
            />
          )}
        </SectionContainer>
      </Box>
    </MuiRootProvider>
  );
}
