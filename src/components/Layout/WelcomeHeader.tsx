export const WelcomeHeader = () => {
  return (
    <div className='text-center mb-8'>
      <div className='text-6xl mb-4'>📜</div>
      <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
        Welcome to Campaign Parser
      </h2>
      <p className='text-gray-600 max-w-2xl mx-auto mb-6'>
        Upload campaign documents (.docx, .md) or try the demo to automatically
        identify and extract entities like NPCs, locations, items, and quests,
        making it easy to manage your tabletop RPG campaigns.
      </p>
    </div>
  );
};
