import fs from 'fs';
import path from 'path';
import { parseDocument } from './documentParser';
import { DocumentType, AllowedMimeType } from '@obsidian-parser/shared';

describe('Document Parser', () => {
	test('should be defined', () => {
		expect(parseDocument).toBeDefined();
		expect(typeof parseDocument).toBe('function');
	});

	test('should throw error for invalid file input', async () => {
		const invalidFile = {} as Express.Multer.File;
		await expect(parseDocument(invalidFile)).rejects.toThrow();
	});

	it('should parse a real markdown file correctly', async () => {
		// Read the test data file
		const testDataPath = path.join(__dirname, '../../../test_data/session_summary_1.md');
		const fileContent = fs.readFileSync(testDataPath);

		const mockFile: Express.Multer.File = {
			fieldname: 'document',
			originalname: 'session_summary_1.md',
			encoding: '7bit',
			mimetype: AllowedMimeType.MARKDOWN,
			buffer: fileContent,
			size: fileContent.length,
			destination: '',
			filename: 'session_summary_1.md',
			path: '',
			stream: {} as any,
		};

		const result = await parseDocument(mockFile);

		// Verify the structure
		expect(result).toHaveProperty('filename', 'session_summary_1.md');
		expect(result).toHaveProperty('type', DocumentType.MARKDOWN);
		expect(result).toHaveProperty('content');
		expect(result).toHaveProperty('metadata');

		// Verify markdown content parsing
		expect(result.content).toHaveProperty('raw');
		expect(result.content).toHaveProperty('html');
		expect(result.content).toHaveProperty('text');
		expect(result.content).toHaveProperty('frontmatter');
		expect(result.content).toHaveProperty('headings');
		expect(result.content).toHaveProperty('links');
		expect(result.content).toHaveProperty('images');

		// Verify specific content from the D&D session
		expect(result.content.text).toContain('Yawning Portal');
		expect(result.content.text).toContain('Volothamp Geddarm');
		expect(result.content.text).toContain('Floon Blagmaar');

		// Verify headings are extracted (for markdown content)
		if (result.type === DocumentType.MARKDOWN) {
			const markdownContent = result.content as any; // Type assertion for markdown content
			expect(markdownContent.headings.length).toBeGreaterThan(0);
			expect(markdownContent.headings.some((h: any) => h.text.includes('A Friend in Need'))).toBe(true);
		}

		// Verify metadata
		expect(result.metadata).toHaveProperty('size');
		expect(result.metadata).toHaveProperty('mimeType', AllowedMimeType.MARKDOWN);
		expect(result.metadata).toHaveProperty('lastModified');
		expect(result.metadata.size).toBeGreaterThan(0);
	});

	it('should throw error for unsupported file type', async () => {
		const mockFile: Express.Multer.File = {
			fieldname: 'document',
			originalname: 'test.pdf',
			encoding: '7bit',
			mimetype: 'application/pdf',
			buffer: Buffer.from('test content'),
			size: 12,
			destination: '',
			filename: 'test.pdf',
			path: '',
			stream: {} as any,
		};

		await expect(parseDocument(mockFile)).rejects.toThrow('Unsupported file type: application/pdf');
	});
});