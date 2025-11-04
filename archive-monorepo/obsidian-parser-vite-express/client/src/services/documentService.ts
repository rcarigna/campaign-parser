import axios from 'axios';
import { type SerializedParsedDocumentWithEntities } from '../types/constants';

export const uploadDocument = async (file: File): Promise<SerializedParsedDocumentWithEntities> => {
    const formData = new FormData();
    formData.append('document', file);

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