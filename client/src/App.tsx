import React, { useState, useCallback } from 'react';
import axios from 'axios';
import './App.css';

// Use type instead of interface as per guidelines
type ParsedDocument = {
  filename: string;
  type: 'word_document' | 'markdown';
  content: unknown;
  metadata: {
    size: number;
    lastModified: string;
    mimeType: string;
  };
};

// Constants extracted as per guidelines
const ALLOWED_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/markdown',
  'text/plain',
] as const;

const ALLOWED_EXTENSIONS = ['.doc', '.docx', '.md'] as const;
const MAX_FILE_SIZE_KB = 10 * 1024; // 10MB in KB

// Arrow function component as per guidelines
const App = (): JSX.Element => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = useCallback((file: File): void => {
    const isAllowedMimeType = ALLOWED_MIME_TYPES.includes(file.type as any);
    const isAllowedExtension = ALLOWED_EXTENSIONS.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );
    const isFileSizeValid = file.size <= MAX_FILE_SIZE_KB * 1024;

    if (!isAllowedMimeType && !isAllowedExtension) {
      setError(
        `Please select a file with one of these extensions: ${ALLOWED_EXTENSIONS.join(
          ', '
        )}`
      );
      return;
    }

    if (!isFileSizeValid) {
      setError(`File size must be less than ${MAX_FILE_SIZE_KB / 1024}MB`);
      return;
    }

    setSelectedFile(file);
    setError(null);
    setParsedData(null);
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const file = event.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
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
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleUpload = useCallback(async (): Promise<void> => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('document', selectedFile);

    try {
      const response = await axios.post<ParsedDocument>(
        '/api/parse',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setParsedData(response.data);
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.error || 'Failed to parse document'
        : 'An unexpected error occurred';

      setError(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedFile]);

  const resetForm = useCallback((): void => {
    setSelectedFile(null);
    setParsedData(null);
    setError(null);
  }, []);

  return (
    <div className='App'>
      <header>
        <h1>Document Parser</h1>
        <p>
          Upload DOC/DOCX or Markdown files to see their JSON representation
        </p>
      </header>

      <main>
        <div
          className={`upload-area ${dragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type='file'
            id='file-input'
            accept={ALLOWED_EXTENSIONS.join(',')}
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
                <p>Click to select a file or drag and drop</p>
                <p>Supported formats: {ALLOWED_EXTENSIONS.join(', ')}</p>
              </div>
            )}
          </label>
        </div>

        {error && <div className='error'>{error}</div>}

        <div className='actions'>
          {selectedFile && (
            <>
              <button
                onClick={handleUpload}
                disabled={loading}
                className='upload-btn'
              >
                {loading ? 'Parsing...' : 'Parse Document'}
              </button>
              <button onClick={resetForm} className='reset-btn'>
                Reset
              </button>
            </>
          )}
        </div>

        {parsedData && (
          <div className='results'>
            <h2>Parsed JSON Output</h2>
            <div className='json-output'>
              <pre>{JSON.stringify(parsedData, null, 2)}</pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
