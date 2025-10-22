import axios from 'axios';
import { type ParsedDocument } from '../types/constants';

export const uploadDocument = async (file: File): Promise<ParsedDocument> => {
    const formData = new FormData();
    formData.append('document', file);

    try {
        const response = await axios.post<ParsedDocument>('/api/parse', formData, {
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