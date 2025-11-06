'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { loadDemoData, type DemoDataResponse } from '@/client/api';

type WelcomeSectionProps = {
  onDemoDataLoaded: (data: DemoDataResponse) => void;
};

export const WelcomeSection = ({ onDemoDataLoaded }: WelcomeSectionProps) => {
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

  return (
    <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-6 text-center mb-6'>
      <h3 className='text-xl font-semibold text-gray-800 mb-3'>🎭 Try the Demo</h3>
      <p className='text-gray-600 text-sm mb-4'>
        See how the parser works with an example D&D session note that includes
        NPCs, locations, and quests.
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
  );
};
