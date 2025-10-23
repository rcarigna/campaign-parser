import fs from 'fs';
import path from 'path';
import { parseDocument } from './documentParser';
import { DocumentType, AllowedMimeType, MarkdownContent } from '@obsidian-parser/shared';

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

		const content = result.content as MarkdownContent;
		// Verify markdown content parsing
		expect(content).toHaveProperty('raw');
		expect(content).toHaveProperty('html');
		expect(content).toHaveProperty('text');
		expect(content).toHaveProperty('frontmatter');
		expect(content.frontmatter).toEqual({});
		expect(content).toHaveProperty('headings');
		expect(content.headings).toEqual([{
			"id": "1-a-friend-in-need-part-1",
			"level": 2,
			"text": "1.   A Friend in Need, Part 1:",
		},
		{
			"id": "synopsis",
			"level": 3,
			"text": "Synopsis:",
		},
		{
			"id": "detailed-description",
			"level": 3,
			"text": "Detailed Description:",
		}]);
		expect(content).toHaveProperty('links');
		expect(content).toHaveProperty('images');

		// Verify specific content from the D&D session
		expect(content.text).toContain('Yawning Portal');
		expect(content.text).toContain('Volothamp Geddarm');
		expect(content.text).toContain('Floon Blagmaar');

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

	it('should document the markdown content object structure', async () => {
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
		const content = result.content as MarkdownContent;

		/*
		 * MARKDOWN CONTENT OBJECT STRUCTURE DOCUMENTATION
		 * ==============================================
		 * 
		 * For the D&D session summary file (session_summary_1.md):
		 * 
		 * ParsedDocument {
		 *   filename: "session_summary_1.md"
		 *   type: "markdown" (DocumentType.MARKDOWN)
		 *   content: MarkdownContent {
		 *     raw: "Original markdown text (7,220 chars)"
		 *     html: "Converted HTML (7,321 chars)"  
		 *     text: "Plain text without frontmatter (7,220 chars)"
		 *     frontmatter: {} (empty - no YAML frontmatter in this file)
		 *     headings: [
		 *       { level: 2, text: "1.   A Friend in Need, Part 1:", id: "1-a-friend-in-need-part-1" }
		 *       { level: 3, text: "Synopsis:", id: "synopsis" }
		 *       { level: 3, text: "Detailed Description:", id: "detailed-description" }
		 *     ]
		 *     links: [] (empty - no markdown links in this file)
		 *     images: [] (empty - no markdown images in this file)
		 *   }
		 *   metadata: {
		 *     size: 7246 (bytes)
		 *     mimeType: "text/markdown"
		 *     lastModified: Date (when parsed)
		 *   }
		 * }
		 * 
		 * Key D&D Content Extracted:
		 * - Characters: Cat Amcathra, Teddy, Hastur, Lainadan, Era
		 * - Locations: Yawning Portal, Waterdeep, Undermountain
		 * - NPCs: Durnan, Bonnie, Yagra, Volothamp Geddarm, Floon Blagmaar
		 */

		// Log the complete structure for documentation
		console.log('\n=== MARKDOWN CONTENT OBJECT STRUCTURE ===');
		console.log('Full parsed result keys:', Object.keys(result));
		console.log('\nContent object keys:', Object.keys(content));

		console.log('\n--- CONTENT PROPERTIES ---');
		console.log('raw (first 200 chars):', content.raw.substring(0, 200) + '...');
		console.log('text (first 200 chars):', content.text.substring(0, 200) + '...');
		console.log('html (first 200 chars):', content.html.substring(0, 200) + '...');

		console.log('\n--- FRONTMATTER ---');
		console.log('frontmatter:', JSON.stringify(content.frontmatter, null, 2));

		console.log('\n--- HEADINGS ---');
		console.log('headings count:', content.headings.length);
		console.log('headings structure:', JSON.stringify(content.headings, null, 2));

		console.log('\n--- LINKS ---');
		console.log('links count:', content.links.length);
		console.log('links structure:', JSON.stringify(content.links, null, 2));

		console.log('\n--- IMAGES ---');
		console.log('images count:', content.images.length);
		console.log('images structure:', JSON.stringify(content.images, null, 2));

		console.log('\n--- METADATA ---');
		console.log('metadata:', JSON.stringify({
			size: result.metadata.size,
			mimeType: result.metadata.mimeType,
			lastModified: result.metadata.lastModified.toISOString()
		}, null, 2));

		// Document the type structure
		const documentedStructure = {
			filename: result.filename,
			type: result.type,
			content: {
				raw: `${content.raw.length} characters`,
				html: `${content.html.length} characters`,
				text: `${content.text.length} characters`,
				frontmatter: content.frontmatter,
				headings: content.headings.map(h => ({
					level: h.level,
					text: h.text,
					id: h.id
				})),
				links: content.links.map(l => ({
					text: l.text,
					url: l.url,
					type: l.type
				})),
				images: content.images.map(i => ({
					alt: i.alt,
					url: i.url,
					title: i.title
				}))
			},
			metadata: {
				size: result.metadata.size,
				mimeType: result.metadata.mimeType,
				lastModified: 'Date object'
			}
		};

		console.log('\n=== DOCUMENTED STRUCTURE SUMMARY ===');
		console.log(JSON.stringify(documentedStructure, null, 2));

		// Verify the structure exists
		expect(content).toHaveProperty('raw');
		expect(content).toHaveProperty('html');
		expect(content).toHaveProperty('text');
		expect(content).toHaveProperty('frontmatter');
		expect(content).toHaveProperty('headings');
		expect(content).toHaveProperty('links');
		expect(content).toHaveProperty('images');
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