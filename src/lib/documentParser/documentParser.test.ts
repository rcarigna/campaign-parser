import { parseDocument } from './documentParser';
import { DocumentType, AllowedMimeType, MarkdownContent, WordDocumentContent } from '@/types';
import mammoth from 'mammoth';
import { marked } from 'marked';

// Mock external dependencies
jest.mock('mammoth');

const mockMammoth = mammoth as jest.Mocked<typeof mammoth>;
const mockMarked = marked as jest.MockedFunction<typeof marked>;

describe('documentParser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('parseDocument', () => {
        it('should parse Word document successfully', async () => {
            const mockBuffer = Buffer.from('mock word content');
            const mockHtml = '<p>Test content</p>';

            mockMammoth.convertToHtml.mockResolvedValue({
                value: mockHtml,
                messages: [
                    { type: 'warning', message: 'Test warning' },
                    { type: 'error', message: 'Test error', error: new Error('Test error') }
                ]
            });

            const file = {
                originalname: 'test.docx',
                mimetype: AllowedMimeType.DOCX,
                size: 1024,
                buffer: mockBuffer
            };

            const result = await parseDocument(file);

            expect(result.filename).toBe('test.docx');
            expect(result.type).toBe(DocumentType.WORD_DOCUMENT);
            expect(result.content.html).toBe(mockHtml);
            expect(result.content.text).toBe('Test content');
            expect(result.metadata.size).toBe(1024);
            expect(result.metadata.mimeType).toBe(AllowedMimeType.DOCX);
        });

        it('should parse DOC file as Word document', async () => {
            const mockBuffer = Buffer.from('mock word content');

            mockMammoth.convertToHtml.mockResolvedValue({
                value: '<p>Content</p>',
                messages: []
            });

            const file = {
                originalname: 'test.doc',
                mimetype: AllowedMimeType.DOC,
                size: 512,
                buffer: mockBuffer
            };

            const result = await parseDocument(file);
            expect(result.type).toBe(DocumentType.WORD_DOCUMENT);
        });

        it('should parse Markdown document successfully', async () => {
            const markdownContent = '# Heading\n\nSome content with [link](http://example.com) and ![image](image.png)';
            const mockBuffer = Buffer.from(markdownContent);
            const mockHtml = '<h1>Heading</h1><p>Some content</p>';

            mockMarked.mockResolvedValue(mockHtml);

            const file = {
                originalname: 'test.md',
                mimetype: AllowedMimeType.MARKDOWN,
                size: 256,
                buffer: mockBuffer
            };

            const result = await parseDocument(file);

            expect(result.filename).toBe('test.md');
            expect(result.type).toBe(DocumentType.MARKDOWN);
            expect((result.content as MarkdownContent).raw).toBe(markdownContent);
            expect(result.content.html).toBe(mockHtml);
            expect((result.content as MarkdownContent).headings).toEqual([
                { level: 1, text: 'Heading', id: 'heading' }
            ]);
            expect((result.content as MarkdownContent).links).toEqual([
                { text: 'link', url: 'http://example.com', type: 'inline' },
                { text: 'image', url: 'image.png', type: 'inline' }
            ]);
            expect((result.content as MarkdownContent).images).toEqual([
                { alt: 'image', url: 'image.png', title: undefined }
            ]);
        });

        it('should parse markdown file by extension even with text/plain mimetype', async () => {
            const markdownContent = '# Test';
            const mockBuffer = Buffer.from(markdownContent);

            mockMarked.mockResolvedValue('<h1>Test</h1>');

            const file = {
                originalname: 'test.md',
                mimetype: 'text/plain',
                size: 10,
                buffer: mockBuffer
            };

            const result = await parseDocument(file);
            expect(result.type).toBe(DocumentType.MARKDOWN);
        });

        it('should parse frontmatter in markdown correctly', async () => {
            const markdownWithFrontmatter = `---
title: Test Document
date: 2024-01-01
author: John Doe
---

# Content
This is the main content.`;

            const mockBuffer = Buffer.from(markdownWithFrontmatter);
            mockMarked.mockResolvedValue('<h1>Content</h1><p>This is the main content.</p>');

            const file = {
                originalname: 'test.md',
                mimetype: AllowedMimeType.MARKDOWN,
                size: 100,
                buffer: mockBuffer
            };

            const result = await parseDocument(file);

            expect((result.content as MarkdownContent).frontmatter).toEqual({
                title: 'Test Document',
                date: '2024-01-01',
                author: 'John Doe'
            });
            expect(result.content.text).toContain('# Content');
            expect(result.content.text).not.toContain('---');
        });

        it('should handle frontmatter with indentation issues', async () => {
            const indentedFrontmatter = `---
    title: Indented Title
    tags: test
---

Content here`;

            const mockBuffer = Buffer.from(indentedFrontmatter);
            mockMarked.mockResolvedValue('<p>Content here</p>');

            const file = {
                originalname: 'test.md',
                mimetype: AllowedMimeType.MARKDOWN,
                size: 50,
                buffer: mockBuffer
            };

            const result = await parseDocument(file);

            expect((result.content as MarkdownContent).frontmatter).toEqual({
                title: 'Indented Title',
                tags: 'test'
            });
        });

        it('should handle dates in frontmatter', async () => {
            const frontmatterWithDate = `---
title: Test
created: 2024-01-15T10:30:00Z
---

Content`;

            const mockBuffer = Buffer.from(frontmatterWithDate);
            mockMarked.mockResolvedValue('<p>Content</p>');

            const file = {
                originalname: 'test.md',
                mimetype: AllowedMimeType.MARKDOWN,
                size: 50,
                buffer: mockBuffer
            };

            const result = await parseDocument(file);

            expect((result.content as MarkdownContent).frontmatter.created).toBe('2024-01-15');
        });

        it('should handle markdown without frontmatter', async () => {
            const plainMarkdown = '# Just a heading\n\nSome content';
            const mockBuffer = Buffer.from(plainMarkdown);
            mockMarked.mockResolvedValue('<h1>Just a heading</h1><p>Some content</p>');

            const file = {
                originalname: 'simple.md',
                mimetype: AllowedMimeType.MARKDOWN,
                size: 30,
                buffer: mockBuffer
            };

            const result = await parseDocument(file);

            expect((result.content as MarkdownContent).frontmatter).toEqual({});
            expect((result.content as MarkdownContent).text).toBe(plainMarkdown);
        });

        it('should extract multiple headings with different levels', async () => {
            const markdownContent = `# H1 Heading
## H2 Heading
### H3 Heading with Special Characters!
#### H4 Heading`;

            const mockBuffer = Buffer.from(markdownContent);
            mockMarked.mockResolvedValue('<h1>H1</h1>');

            const file = {
                originalname: 'headings.md',
                mimetype: AllowedMimeType.MARKDOWN,
                size: 100,
                buffer: mockBuffer
            };

            const result = await parseDocument(file);

            expect((result.content as MarkdownContent).headings).toEqual([
                { level: 1, text: 'H1 Heading', id: 'h1-heading' },
                { level: 2, text: 'H2 Heading', id: 'h2-heading' },
                { level: 3, text: 'H3 Heading with Special Characters!', id: 'h3-heading-with-special-characters' },
                { level: 4, text: 'H4 Heading', id: 'h4-heading' }
            ]);
        });

        it('should extract inline and reference links', async () => {
            const markdownContent = `
[Inline link](https://example.com)
[Link with title](https://example.com "Title")
[Reference link][ref1]
[Another ref][ref2]
`;

            const mockBuffer = Buffer.from(markdownContent);
            mockMarked.mockResolvedValue('<p>Links</p>');

            const file = {
                originalname: 'links.md',
                mimetype: AllowedMimeType.MARKDOWN,
                size: 100,
                buffer: mockBuffer
            };

            const result = await parseDocument(file);

            expect((result.content as MarkdownContent).links).toEqual([
                { text: 'Inline link', url: 'https://example.com', type: 'inline' },
                { text: 'Link with title', url: 'https://example.com "Title"', type: 'inline' },
                { text: 'Reference link', url: '[reference: ref1]', type: 'reference' },
                { text: 'Another ref', url: '[reference: ref2]', type: 'reference' }
            ]);
        });

        it('should extract images with and without titles', async () => {
            const markdownContent = `
![Alt text](image.jpg)
![Alt with title](image.png "Image Title")
![](no-alt.gif)
`;

            const mockBuffer = Buffer.from(markdownContent);
            mockMarked.mockResolvedValue('<p>Images</p>');

            const file = {
                originalname: 'images.md',
                mimetype: AllowedMimeType.MARKDOWN,
                size: 100,
                buffer: mockBuffer
            };

            const result = await parseDocument(file);

            expect((result.content as MarkdownContent).images).toEqual([
                { alt: 'Alt text', url: 'image.jpg', title: undefined },
                { alt: 'Alt with title', url: 'image.png', title: 'Image Title' },
                { alt: '', url: 'no-alt.gif', title: undefined }
            ]);
        });

        it('should throw error for unsupported file type', async () => {
            const file = {
                originalname: 'test.pdf',
                mimetype: 'application/pdf',
                size: 1024,
                buffer: Buffer.from('pdf content')
            };

            await expect(parseDocument(file)).rejects.toThrow('Failed to parse test.pdf: Unsupported file type: application/pdf');
        });

        it('should handle mammoth parsing errors', async () => {
            const mockBuffer = Buffer.from('corrupt word file');

            mockMammoth.convertToHtml.mockRejectedValue(new Error('Mammoth parsing failed'));

            const file = {
                originalname: 'corrupt.docx',
                mimetype: AllowedMimeType.DOCX,
                size: 100,
                buffer: mockBuffer
            };

            await expect(parseDocument(file)).rejects.toThrow('Failed to parse corrupt.docx: Mammoth parsing failed');
        });

        it('should handle marked parsing errors', async () => {
            const mockBuffer = Buffer.from('markdown content');

            mockMarked.mockRejectedValue(new Error('Marked parsing failed'));

            const file = {
                originalname: 'bad.md',
                mimetype: AllowedMimeType.MARKDOWN,
                size: 50,
                buffer: mockBuffer
            };

            await expect(parseDocument(file)).rejects.toThrow('Failed to parse bad.md: Marked parsing failed');
        });

        it('should handle corrupted frontmatter gracefully', async () => {
            const corruptedFrontmatter = `---
invalid: yaml: content: here
malformed
---

# Content`;

            const mockBuffer = Buffer.from(corruptedFrontmatter);
            mockMarked.mockResolvedValue('<h1>Content</h1>');

            const file = {
                originalname: 'corrupt-frontmatter.md',
                mimetype: AllowedMimeType.MARKDOWN,
                size: 100,
                buffer: mockBuffer
            };

            const result = await parseDocument(file);

            expect((result.content as MarkdownContent).frontmatter).toEqual({});
            expect((result.content as MarkdownContent).text).toBe(corruptedFrontmatter);
        });

        it('should set correct lastModified timestamp', async () => {
            const beforeTime = new Date();

            mockMarked.mockResolvedValue('<p>Content</p>');

            const file = {
                originalname: 'timestamp.md',
                mimetype: AllowedMimeType.MARKDOWN,
                size: 100,
                buffer: Buffer.from('# Test')
            };

            const result = await parseDocument(file);
            const afterTime = new Date();

            expect(result.metadata.lastModified.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
            expect(result.metadata.lastModified.getTime()).toBeLessThanOrEqual(afterTime.getTime());
        });

        it('should filter warnings and errors from mammoth messages', async () => {
            const mockBuffer = Buffer.from('word content');

            mockMammoth.convertToHtml.mockResolvedValue({
                value: '<p>Content</p>',
                messages: [
                    { type: 'warning', message: 'Warning 1' },
                    { type: 'error', message: 'Error 1', error: new Error('Error 1') },
                    { type: 'warning', message: 'Warning 2' }
                ]
            });

            const file = {
                originalname: 'messages.docx',
                mimetype: AllowedMimeType.DOCX,
                size: 100,
                buffer: mockBuffer
            };

            const result = await parseDocument(file);

            expect((result.content as WordDocumentContent).warnings).toHaveLength(2);
            expect((result.content as WordDocumentContent).errors).toHaveLength(1);
            expect((result.content as WordDocumentContent).messages).toHaveLength(3);
        });
    });
});
