import { z } from 'zod';
import { generateFieldsFromSchema } from './formGenerator';

describe('generateFieldsFromSchema', () => {
    it('should return empty array for schema without shape', () => {
        const schema = z.string();
        const result = generateFieldsFromSchema(schema);
        expect(result).toEqual([]);
    });

    it('should skip id and kind fields', () => {
        const schema = z.object({
            id: z.string(),
            kind: z.string(),
            name: z.string(),
        });
        const result = generateFieldsFromSchema(schema);
        expect(result).toHaveLength(1);
        expect(result[0].key).toBe('name');
    });

    it('should infer text field type for basic strings', () => {
        const schema = z.object({
            name: z.string(),
        });
        const result = generateFieldsFromSchema(schema);
        expect(result[0]).toEqual({
            key: 'name',
            type: 'text',
            label: 'Name',
            required: true,
            placeholder: 'Enter name...',
            options: undefined,
        });
    });

    it('should infer textarea type for specific field names', () => {
        const schema = z.object({
            summary: z.string(),
            notes: z.string(),
            synopsis: z.string(),
        });
        const result = generateFieldsFromSchema(schema);
        expect(result[0].type).toBe('textarea');
        expect(result[1].type).toBe('textarea');
        expect(result[2].type).toBe('textarea');
        expect(result[0].placeholder).toBe('Enter summary...');
    });

    it('should infer number field type', () => {
        const schema = z.object({
            age: z.number(),
        });
        const result = generateFieldsFromSchema(schema);
        expect(result[0]).toEqual({
            key: 'age',
            type: 'number',
            label: 'Age',
            required: true,
            placeholder: '0',
            options: undefined,
        });
    });

    it('should infer boolean field type', () => {
        const schema = z.object({
            isActive: z.boolean(),
        });
        const result = generateFieldsFromSchema(schema);
        expect(result[0]).toEqual({
            key: 'isActive',
            type: 'boolean',
            label: 'IsActive',
            required: true,
            placeholder: undefined,
            options: undefined,
        });
    });

    it('should infer array field type', () => {
        const schema = z.object({
            tags: z.array(z.string()),
        });
        const result = generateFieldsFromSchema(schema);
        expect(result[0]).toEqual({
            key: 'tags',
            type: 'array',
            label: 'Tags',
            required: true,
            placeholder: 'Add tags...',
            options: undefined,
        });
    });

    it('should infer select field type for enums', () => {
        const schema = z.object({
            status: z.enum(['active', 'inactive', 'pending']),
        });
        const result = generateFieldsFromSchema(schema);
        expect(result[0]).toEqual({
            key: 'status',
            type: 'select',
            label: 'Status',
            required: true,
            placeholder: 'Enter status...',
            options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'pending', label: 'Pending' },
            ],
        });
    });

    it('should handle optional fields', () => {
        const schema = z.object({
            name: z.string(),
            nickname: z.string().optional(),
        });
        const result = generateFieldsFromSchema(schema);
        expect(result[0].required).toBe(true);
        expect(result[1].required).toBe(false);
    });

    it('should handle nullable fields', () => {
        const schema = z.object({
            description: z.string().nullable(),
        });
        const result = generateFieldsFromSchema(schema);
        expect(result[0].required).toBe(false);
    });

    it('should handle fields with default values', () => {
        const schema = z.object({
            count: z.number().default(0),
        });
        const result = generateFieldsFromSchema(schema);
        expect(result[0].required).toBe(false);
    });

    it('should handle wrapped optional enum fields', () => {
        const schema = z.object({
            priority: z.enum(['low', 'medium', 'high']).optional(),
        });
        const result = generateFieldsFromSchema(schema);
        expect(result[0]).toEqual({
            key: 'priority',
            type: 'select',
            label: 'Priority',
            required: false,
            placeholder: 'Enter priority...',
            options: [
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
            ],
        });
    });

    it('should format labels with underscores correctly', () => {
        const schema = z.object({
            first_name: z.string(),
            last_name_suffix: z.string(),
        });
        const result = generateFieldsFromSchema(schema);
        expect(result[0].label).toBe('First Name');
        expect(result[1].label).toBe('Last Name Suffix');
    });

    it('should handle complex schema with multiple field types', () => {
        const schema = z.object({
            name: z.string(),
            age: z.number().optional(),
            isActive: z.boolean(),
            tags: z.array(z.string()),
            status: z.enum(['active', 'inactive']),
            summary: z.string().nullable(),
        });
        const result = generateFieldsFromSchema(schema);
        expect(result).toHaveLength(6);
        expect(result.map(f => f.type)).toEqual(['text', 'number', 'boolean', 'array', 'select', 'textarea']);
        expect(result.map(f => f.required)).toEqual([true, false, true, true, true, false]);
    });

    it('should handle unknown types gracefully', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn');
        const schema = z.object({
            customField: z.unknown(),
        });
        const result = generateFieldsFromSchema(schema);
        // Should skip unknown types and return empty array for this field
        expect(result).toHaveLength(0);
        expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("Skipping field 'customField' due to parsing error:"), expect.any(Error));
    });
});