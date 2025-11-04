import { renderHook, act, waitFor } from '@testing-library/react';
import { useFileManager } from './useFileManager';
import {
    MAX_FILE_SIZE_KB,
} from '@/types';

const createMockFile = (
    name: string,
    type: string,
    size: number
): File => {
    const file = new File(['test content'], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
};

describe('useFileManager', () => {
    it('should initialize with default values', () => {
        const { result } = renderHook(() => useFileManager());

        expect(result.current.selectedFile).toBeNull();
        expect(result.current.error).toBeNull();
    });

    it('should select a valid file', () => {
        const { result } = renderHook(() => useFileManager());
        const validFile = createMockFile('test.md', 'text/markdown', 1024);

        act(() => {
            result.current.selectFile(validFile);
        });

        expect(result.current.selectedFile).toBe(validFile);
        expect(result.current.error).toBeNull();
    });

    it('should reject file with invalid extension', async () => {
        const { result } = renderHook(() => useFileManager());
        const invalidFile = createMockFile('test.txt', 'text/csv', 1024);

        act(() => {
            result.current.selectFile(invalidFile);
        });

        await waitFor(() => expect(result.current.selectedFile).toBeNull());
        expect(result.current.error).toContain('Please select a file with one of these extensions');
    });

    it('should reject file that exceeds size limit', () => {
        const { result } = renderHook(() => useFileManager());
        const oversizedFile = createMockFile(
            'test.md',
            'text/markdown',
            (MAX_FILE_SIZE_KB + 1) * 1024
        );

        act(() => {
            result.current.selectFile(oversizedFile);
        });

        expect(result.current.selectedFile).toBeNull();
        expect(result.current.error).toContain('File size must be less than');
    });

    it('should clear selected file and error', () => {
        const { result } = renderHook(() => useFileManager());
        const validFile = createMockFile('test.md', 'text/markdown', 1024);

        act(() => {
            result.current.selectFile(validFile);
        });

        act(() => {
            result.current.clearFile();
        });

        expect(result.current.selectedFile).toBeNull();
        expect(result.current.error).toBeNull();
    });

    it('should clear only error', () => {
        const { result } = renderHook(() => useFileManager());
        const invalidFile = createMockFile('test.txt', 'text/csv', 1024);

        act(() => {
            result.current.selectFile(invalidFile);
        });

        act(() => {
            result.current.clearError();
        });

        expect(result.current.error).toBeNull();
        expect(result.current.selectedFile).toBeNull();
    });

    it('should validate file by extension when mime type is not allowed', () => {
        const { result } = renderHook(() => useFileManager());
        const fileWithValidExtension = createMockFile(
            'test.md',
            'application/octet-stream',
            1024
        );

        act(() => {
            result.current.selectFile(fileWithValidExtension);
        });

        expect(result.current.selectedFile).toBe(fileWithValidExtension);
        expect(result.current.error).toBeNull();
    });
});