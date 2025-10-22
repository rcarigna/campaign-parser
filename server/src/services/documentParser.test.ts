import { parseDocument } from './documentParser';

describe('Document Parser', () => {
	test('should be defined', () => {
		expect(parseDocument).toBeDefined();
		expect(typeof parseDocument).toBe('function');
	});

	test('should throw error for invalid file input', async () => {
		const invalidFile = {} as Express.Multer.File;
		await expect(parseDocument(invalidFile)).rejects.toThrow();
	});
});