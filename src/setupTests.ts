// Jest setup file for Next.js application
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
    }),
    useSearchParams: () => ({
        get: jest.fn(),
    }),
    usePathname: () => '/',
}));

// Mock Next.js image component
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: unknown) => props,
}));

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock File API for file upload tests
Object.defineProperty(window, 'File', {
    value: class MockFile {
        name: string;
        size: number;
        type: string;
        lastModified: number;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(bits: any[], name: string, options: any = {}) {
            this.name = name;
            this.size = bits.reduce((acc, bit) => acc + (bit?.length || 0), 0);
            this.type = options.type || '';
            this.lastModified = options.lastModified || Date.now();
        }

        arrayBuffer() {
            return Promise.resolve(new ArrayBuffer(this.size));
        }

        text() {
            return Promise.resolve('mock file content');
        }
    }
});

// Mock FileReader for file processing tests
Object.defineProperty(window, 'FileReader', {
    value: class MockFileReader {
        result: string | ArrayBuffer | null = null;
        error: Error | null = null;
        readyState: number = 0;

        onload: ((event: { target: MockFileReader }) => void) | null = null;
        onerror: ((event: { target: MockFileReader }) => void) | null = null;
        onloadend: ((event: { target: MockFileReader }) => void) | null = null;

        readAsText(): void {
            this.readyState = 2;
            this.result = 'mock file content';
            if (this.onload) {
                this.onload({ target: this });
            }
            if (this.onloadend) {
                this.onloadend({ target: this });
            }
        }

        readAsArrayBuffer(): void {
            this.readyState = 2;
            this.result = new ArrayBuffer(8);
            if (this.onload) {
                this.onload({ target: this });
            }
            if (this.onloadend) {
                this.onloadend({ target: this });
            }
        }

        abort(): void {
            this.readyState = 2;
        }
    }
});