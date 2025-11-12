import toast from 'react-hot-toast';
import { exportEntities } from '@/client/api';
import { defaultMockEntities, mockParsedDocument } from '../../__mocks__/mockedEntities';

export { mockParsedDocument };

export const mockToast = toast as jest.Mocked<typeof toast>;
export const mockExportEntities = exportEntities as jest.MockedFunction<typeof exportEntities>;

export const mockOnEntityDiscard = jest.fn();
export const mockOnEntityUpdate = jest.fn();

export const getEntityViewerProps = (overrides = {}) => ({
    entities: defaultMockEntities,
    onEntityDiscard: mockOnEntityDiscard,
    onEntityUpdate: mockOnEntityUpdate,
    mockParsedDocument,
    ...overrides,
});

export const setupEntityViewerTest = (
    renderFn: (props: ReturnType<typeof getEntityViewerProps>) => void,
    overrides = {}
) => {
    const props = getEntityViewerProps(overrides);
    renderFn(props);
    return {
        props,
        mockToast,
        mockExportEntities,
        mockOnEntityDiscard,
        mockOnEntityUpdate,
    };
};
