'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { loadDemoData, type DemoDataResponse } from '@/client/api';

type WelcomeSectionProps = {
  onDemoDataLoaded: (data: DemoDataResponse) => void;
  isVisible: boolean;
};

export const WelcomeSection = ({
  onDemoDataLoaded,
  isVisible,
}: WelcomeSectionProps) => {
  const [loadingDemo, setLoadingDemo] = useState(false);

  const handleLoadDemo = async () => {
    setLoadingDemo(true);
    try {
      const demoData = await loadDemoData();
      onDemoDataLoaded(demoData);
      toast.success('Demo data loaded successfully!');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load demo';
      toast.error(message);
      console.error('Demo load error:', error);
    } finally {
      setLoadingDemo(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-8 text-center mb-6'>
      <div className='text-6xl mb-4'>📜</div>
      <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
        Welcome to Campaign Parser
      </h2>
      <p className='text-gray-600 max-w-2xl mx-auto mb-6'>
        Get started by uploading a campaign document or try the demo below. The
        parser will automatically identify and extract entities like NPCs,
        locations, items, and quests, making it easy to manage your tabletop RPG
        campaigns.
      </p>

      {/* Entity Types Grid */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6'>
        <div className='p-4'>
          <div className='text-2xl mb-2'>👤</div>
          <div className='text-sm font-medium text-gray-700'>NPCs</div>
        </div>
        <div className='p-4'>
          <div className='text-2xl mb-2'>🗺️</div>
          <div className='text-sm font-medium text-gray-700'>Locations</div>
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

      {/* Demo Section */}
      <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-4 mb-4'>
        <h3 className='text-lg font-semibold text-gray-800 mb-2'>
          🎭 Try the Demo
        </h3>
        <p className='text-gray-600 text-sm mb-4'>
          See how the parser works with an example D&D session note that
          includes NPCs, locations, and quests.
        </p>
        <button
          onClick={handleLoadDemo}
          disabled={loadingDemo}
          className='px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2 mx-auto'
        >
          {loadingDemo ? (
            <>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
              Loading Demo...
            </>
          ) : (
            <>
              <span>🚀</span>
              Load Demo Session
            </>
          )}
        </button>
      </div>
    </div>
  );
};
