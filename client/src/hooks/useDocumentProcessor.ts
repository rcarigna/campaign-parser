import { useState, useCallback } from 'react';
import { uploadDocument } from '../services';
import { type SerializedParsedDocument } from '../types/constants';

type UseDocumentProcessorReturn = {
    parsedData: SerializedParsedDocument | null;
    loading: boolean;
    error: string | null;
    processDocument: (file: File) => Promise<void>;
    clearResults: () => void;
    clearError: () => void;
};

export const useDocumentProcessor = (): UseDocumentProcessorReturn => {
    const [parsedData, setParsedData] = useState<SerializedParsedDocument | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const processDocument = useCallback(async (file: File): Promise<void> => {
        setLoading(true);
        setError(null);
        setParsedData(null);

        try {
            const result = await uploadDocument(file);
            setParsedData(result);
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(errorMessage);
            console.error('Document processing error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearResults = useCallback((): void => {
        setParsedData(null);
        setError(null);
    }, []);

    const clearError = useCallback((): void => {
        setError(null);
    }, []);

    return {
        parsedData,
        loading,
        error,
        processDocument,
        clearResults,
        clearError,
    };
};