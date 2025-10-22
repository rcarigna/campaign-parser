import { useState, useCallback } from 'react';
import {
    ALLOWED_MIME_TYPES,
    ALLOWED_EXTENSIONS,
    MAX_FILE_SIZE_KB,
} from '../types/constants';

type UseFileManagerReturn = {
    selectedFile: File | null;
    error: string | null;
    selectFile: (file: File) => void;
    clearFile: () => void;
    clearError: () => void;
};

export const useFileManager = (): UseFileManagerReturn => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const validateFile = useCallback((file: File): string | null => {
        const isAllowedMimeType = ALLOWED_MIME_TYPES.includes(file.type as any);
        const isAllowedExtension = ALLOWED_EXTENSIONS.some((ext) =>
            file.name.toLowerCase().endsWith(ext)
        );
        const isFileSizeValid = file.size <= MAX_FILE_SIZE_KB * 1024;

        if (!isAllowedMimeType && !isAllowedExtension) {
            return `Please select a file with one of these extensions: ${ALLOWED_EXTENSIONS.join(
                ', '
            )}`;
        }

        if (!isFileSizeValid) {
            return `File size must be less than ${MAX_FILE_SIZE_KB / 1024}MB`;
        }

        return null;
    }, []);

    const selectFile = useCallback(
        (file: File): void => {
            const validationError = validateFile(file);

            if (validationError) {
                setError(validationError);
                setSelectedFile(null);
                return;
            }

            setSelectedFile(file);
            setError(null);
        },
        [validateFile]
    );

    const clearFile = useCallback((): void => {
        setSelectedFile(null);
        setError(null);
    }, []);

    const clearError = useCallback((): void => {
        setError(null);
    }, []);

    return {
        selectedFile,
        error,
        selectFile,
        clearFile,
        clearError,
    };
};