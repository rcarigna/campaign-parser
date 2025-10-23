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

    const validateFile = useCallback((file: File): void => {
        console.log('Validating file:', file);
        const isAllowedMimeType = ALLOWED_MIME_TYPES.includes(file.type as any);
        const isAllowedExtension = ALLOWED_EXTENSIONS.some((ext) =>
            file.name.toLowerCase().endsWith(ext)
        );
        const isFileSizeValid = file.size <= MAX_FILE_SIZE_KB * 1024;

        console.log(`isAllowedMimeType: ${isAllowedMimeType}, isAllowedExtension: ${isAllowedExtension}, isFileSizeValid: ${isFileSizeValid}`);
        if (!isAllowedMimeType && !isAllowedExtension) {
            throw new Error(`Please select a file with one of these extensions: ${ALLOWED_EXTENSIONS.join(
                ', '
            )}`);
        }

        if (!isFileSizeValid) {
            throw new Error(`File size must be less than ${MAX_FILE_SIZE_KB / 1024}MB`);
        }
    }, []);

    const selectFile = useCallback(
        (file: File): void => {
            try {
                validateFile(file);
                setSelectedFile(file);
                setError(null);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Invalid file';
                setError(errorMessage);
                setSelectedFile(null);
            }
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