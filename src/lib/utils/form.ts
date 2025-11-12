import { FieldType, TERMINAL_FIELD_TYPES, FieldMetadata } from '@/types';
import { z } from 'zod';



// Recursively unwrap schema wrappers to find the terminal type
const unwrapToTerminalType = (schema: z.ZodTypeAny): {
    terminalSchema: z.ZodTypeAny;
    isOptional: boolean;
    depth: number
} => {
    let current = schema;
    let optional = false;
    let depth = 0;
    const maxDepth = 10; // Prevent infinite recursion

    while (depth < maxDepth) {
        const typeName = (current as z.ZodTypeAny)._def?.type;

        if (typeName === 'optional' || typeName === 'nullable') {
            optional = true;
            current = (current as z.ZodOptional<z.ZodTypeAny> | z.ZodNullable<z.ZodTypeAny>)._def.innerType;
            depth++;
        } else if (typeName === 'default') {
            optional = true; // Defaults make fields effectively optional
            current = (current as z.ZodDefault<z.ZodTypeAny>)._def.innerType;
            depth++;

        } else {
            // Found terminal type
            break;
        }
    }

    return {
        terminalSchema: current,
        isOptional: optional,
        depth
    };
};

const isOptional = (schema: z.ZodTypeAny): boolean => {
    const { isOptional: optional } = unwrapToTerminalType(schema);
    return optional;
};

export const inferFieldType = (fieldKey: string, schema: z.ZodTypeAny): FieldType => {
    const { terminalSchema } = unwrapToTerminalType(schema);
    const typeName = (terminalSchema as z.ZodTypeAny)._def?.type;

    switch (typeName) {
        case 'string':
            if (fieldKey.includes('summary') || fieldKey.includes('notes') || fieldKey.includes('synopsis')) {
                return 'textarea';
            }
            return 'text';
        case 'boolean':
            return 'boolean';
        case 'number':
        case 'bigint':
            return 'number';
        case 'array':
            return 'array';
        case 'enum':
            return 'select';
        default:
            // Unknown or unsupported type
            throw new Error(`Unsupported terminal type: ${typeName}`);
    }
};

const getEnumOptions = (schema: z.ZodTypeAny): Array<{ value: string; label: string }> | undefined => {
    const { terminalSchema } = unwrapToTerminalType(schema);

    if (terminalSchema instanceof z.ZodEnum) {
        const enumValues = terminalSchema.options || [];
        return enumValues.map((value) => ({
            value: String(value),
            label: formatLabel(String(value))
        }));
    }

    return undefined;
};

// Format field name to human-readable label
const formatLabel = (text: string): string => {
    return text
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// Generate placeholder text
const generatePlaceholder = (fieldKey: string, fieldType: FieldType): string | undefined => {
    if (fieldType === 'array') {
        return `Add ${formatLabel(fieldKey).toLowerCase()}...`;
    }
    if (fieldType === 'textarea') {
        return `Enter ${formatLabel(fieldKey).toLowerCase()}...`;
    }
    if (fieldType === 'number') {
        return '0';
    }
    if (fieldType === 'boolean') {
        return undefined; // No placeholder for checkboxes
    }
    return `Enter ${formatLabel(fieldKey).toLowerCase()}...`;
};

// Helper to determine if we can parse a field to a terminal type
const canParseToTerminalType = (fieldKey: string, schema: z.ZodTypeAny): boolean => {
    try {
        const fieldType = inferFieldType(fieldKey, schema);
        return TERMINAL_FIELD_TYPES.includes(fieldType);
    } catch (error) {
        console.warn(`Skipping field '${fieldKey}' due to parsing error:`, error);
        return false;
    }
};

// Main function to generate fields from any Zod schema using reduce pattern
export const generateFieldsFromSchema = (schema: z.ZodTypeAny): FieldMetadata[] => {
    const shape = (schema as z.ZodObject).shape;

    if (!shape) {
        return [];
    }

    return Object.entries(shape)
        .filter(([key]) => key !== 'id' && key !== 'kind') // Skip technical fields
        .reduce<FieldMetadata[]>((fields, [fieldKey, fieldSchema]) => {
            // Only process fields we can successfully parse to terminal types
            if (!canParseToTerminalType(fieldKey, fieldSchema as z.ZodTypeAny)) {
                return fields; // Skip this field, don't accumulate it
            }

            try {
                const fieldType = inferFieldType(fieldKey, fieldSchema as z.ZodTypeAny);
                const required = !isOptional(fieldSchema as z.ZodTypeAny);
                const options = getEnumOptions(fieldSchema as z.ZodTypeAny);
                const label = formatLabel(fieldKey);
                const placeholder = generatePlaceholder(fieldKey, fieldType);

                // Only accumulate if we successfully parsed everything
                const field: FieldMetadata = {
                    key: fieldKey,
                    type: fieldType,
                    label,
                    required,
                    placeholder,
                    options,
                };

                return [...fields, field];
            } catch (error) {
                // If parsing fails for any reason, skip this field
                console.warn(`Skipping field '${fieldKey}' due to parsing error:`, error);
                return fields;
            }
        }, []);
};