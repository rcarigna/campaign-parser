'use client';

export const PersistentWelcome = () => {
  return (
    <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-8 text-center mb-6'>
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
    </div>
  );
};
