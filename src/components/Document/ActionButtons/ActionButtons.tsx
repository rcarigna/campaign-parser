export type ActionButtonsProps = {
  selectedFile: File | null;
  loading: boolean;
  onProcess: (file: File) => Promise<void>;
  onReset: () => void;
};

export const ActionButtons = ({
  selectedFile,
  loading,
  onProcess,
  onReset,
}: ActionButtonsProps) => {
  const handleProcess = () => {
    if (selectedFile) {
      onProcess(selectedFile);
    }
  };

  if (!selectedFile) {
    return <div className='actions'></div>;
  }

  return (
    <div className='actions'>
      <button onClick={handleProcess} disabled={loading} className='upload-btn'>
        {loading ? 'Parsing...' : 'Parse Document'}
      </button>
      <button onClick={onReset} className='reset-btn'>
        Reset
      </button>
    </div>
  );
};
