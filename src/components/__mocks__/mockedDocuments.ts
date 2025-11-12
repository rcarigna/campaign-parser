import { DocumentType } from '@/types';

export const mockMarkdownData = {
    filename: 'test.md',
    type: DocumentType.MARKDOWN,
    content: {
        raw: '# Test Header\n\nThis is test content.',
        html: '<h1>Test Header</h1><p>This is test content.</p>',
        text: 'Test Header\n\nThis is test content.',
        frontmatter: {},
        headings: [],
        links: [],
        images: [],
    },
    metadata: {
        size: 1024,
        lastModified: '2024-01-01T00:00:00.000Z',
        mimeType: 'text/markdown',
    },
    entities: [],
};

export const mockWordData = {
    filename: 'test.docx',
    type: DocumentType.WORD_DOCUMENT,
    content: {
        html: '<p>Word document content</p>',
        text: 'Word document content',
        messages: [],
        warnings: [],
        errors: [],
    },
    metadata: {
        size: 2048,
        lastModified: '2024-01-01T00:00:00.000Z',
        mimeType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
    entities: [],
};