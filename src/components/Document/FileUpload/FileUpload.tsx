import { useCallback, useState } from 'react';
import { HelpTooltip, HelpContent } from '@/components/Layout/Help';

type FileUploadProps = {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  error: string | null;
  allowedExtensions: readonly string[];
};

export const FileUpload = ({
  onFileSelect,
  selectedFile,
  error,
  allowedExtensions,
}: FileUploadProps) => {
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const file = event.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((event: React.DragEvent): void => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent): void => {
    event.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent): void => {
      event.preventDefault();
      setDragOver(false);

      const files = Array.from(event.dataTransfer.files);
      if (files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  return (
    <>
      <div
        className={`upload-area ${dragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type='file'
          role='button'
          id='file-input'
          data-testid='file-input'
          accept={allowedExtensions.join(',')}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor='file-input' style={{ cursor: 'pointer' }}>
          {selectedFile ? (
            <div>
              <p>Selected: {selectedFile.name}</p>
              <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
            </div>
          ) : (
            <div>
              <div className='flex items-center justify-center space-x-2 mb-2'>
                <p>Click to select a file or drag and drop</p>
                <HelpTooltip
                  content={HelpContent.fileUpload}
                  title='File Upload Help'
                  position='top'
                />
              </div>
              <p>Supported formats: {allowedExtensions.join(', ')}</p>
            </div>
          )}
        </label>
      </div>

      {error && <div className='error'>{error}</div>}
    </>
  );
};
