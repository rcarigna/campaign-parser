import axios from 'axios';
import { type SerializedParsedDocumentWithEntities, type AnyEntity } from '@/types';

export type DemoDataResponse = SerializedParsedDocumentWithEntities & {
    rawMarkdown: string;
};

/**
 * Upload and parse a document via the /api/parse endpoint
 */
export const uploadDocument = async (file: File): Promise<SerializedParsedDocumentWithEntities> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post<SerializedParsedDocumentWithEntities>('/api/parse', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (err: unknown) {
        const errorMessage = axios.isAxiosError(err)
            ? err.response?.data?.error || 'Failed to parse document'
            : 'An unexpected error occurred';

        throw new Error(errorMessage);
    }
};

/**
 * Load demo data from the example session notes
 */
export const loadDemoData = async (): Promise<DemoDataResponse> => {
    try {
        const response = await axios.get<DemoDataResponse>('/api/demo');
        return response.data;
    } catch (err: unknown) {
        const errorMessage = axios.isAxiosError(err)
            ? err.response?.data?.error || 'Failed to load demo data'
            : 'An unexpected error occurred';

        throw new Error(errorMessage);
    }
};

/**
 * Export entities to Obsidian format via the /api/export endpoint
 */
export const exportEntities = async (entities: AnyEntity[]): Promise<Blob> => {
    try {
        const response = await axios.post('/api/export',
            { entities },
            {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        return response.data;
    } catch (err: unknown) {
        const errorMessage = axios.isAxiosError(err)
            ? err.response?.data?.error || 'Failed to export entities'
            : 'An unexpected error occurred';

        throw new Error(errorMessage);
    }
};