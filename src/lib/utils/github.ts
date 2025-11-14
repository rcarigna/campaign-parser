import { EntityKind } from '@/types';
import type { FieldMetadata } from '@/types';
import { getEntityLabel } from '@/lib/utils/entity';

/**
 * GitHub repository information
 */
const GITHUB_REPO_OWNER = 'rcarigna';
const GITHUB_REPO_NAME = 'campaign-parser';


/**
 * Generates a GitHub issue URL for schema suggestions
 */
export const generateSchemaIssueUrl = (params: {
  entityKind?: EntityKind;
  fieldName?: string;
  currentBehavior?: string;
  proposedChange?: string;
}): string => {
  const { entityKind, fieldName, currentBehavior, proposedChange } = params;

  const baseUrl = `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues/new`;
  const templateParam = 'template=schema_suggestion.md';

  // Build query parameters
  const queryParams: string[] = [templateParam];

  // Add title
  const titleParts: string[] = ['[Schema]'];
  if (entityKind) {
    titleParts.push(getEntityLabel(entityKind));
  }
  if (fieldName) {
    titleParts.push(`- ${fieldName}`);
  }
  const title = titleParts.join(' ');
  queryParams.push(`title=${encodeURIComponent(title)}`);

  // Add entity type
  if (entityKind) {
    queryParams.push(`entity-type=${encodeURIComponent(getEntityLabel(entityKind))}`);
  }

  // Add field name
  if (fieldName) {
    queryParams.push(`field-name=${encodeURIComponent(fieldName)}`);
  }

  // Add current behavior
  if (currentBehavior) {
    queryParams.push(`current-schema=${encodeURIComponent(currentBehavior)}`);
  }

  // Add proposed change
  if (proposedChange) {
    queryParams.push(`proposed-change=${encodeURIComponent(proposedChange)}`);
  }

  return `${baseUrl}?${queryParams.join('&')}`;
};

/**
 * Generates current schema description for a field
 */
export const getFieldDescription = (field: FieldMetadata): string => {
  const parts: string[] = [
    `Field: ${field.key}`,
    `Type: ${field.type}`,
    `Required: ${field.required ? 'Yes' : 'No'}`,
  ];

  if (field.options && field.options.length > 0) {
    const values = field.options.map((opt) => opt.value).join(', ');
    parts.push(`Values: ${values}`);
  }

  if (field.placeholder) {
    parts.push(`Example: ${field.placeholder}`);
  }

  return parts.join('\n');
};

/**
 * Generates a GitHub issue URL for suggesting a new field
 */
export const generateNewFieldIssueUrl = (entityKind: EntityKind): string => {
  return generateSchemaIssueUrl({
    entityKind,
    proposedChange: `Add a new field to ${getEntityLabel(entityKind)} schema`,
  });
};

/**
 * Generates a GitHub issue URL for field modification
 */
export const generateFieldModificationIssueUrl = (
  entityKind: EntityKind,
  field: FieldMetadata
): string => {
  const currentBehavior = getFieldDescription(field);

  return generateSchemaIssueUrl({
    entityKind,
    fieldName: field.key,
    currentBehavior,
    proposedChange: `Suggest improvements for the "${field.key}" field`,
  });
};

/**
 * Generates a GitHub issue URL for general schema enhancement
 */
export const generateSchemaEnhancementIssueUrl = (
  entityKind: EntityKind,
  currentSchema?: FieldMetadata[]
): string => {
  return generateSchemaIssueUrl({
    entityKind,
    proposedChange: `Suggest enhancements to the ${getEntityLabel(entityKind)} schema`,
    currentBehavior: currentSchema ? currentSchema.map(getFieldDescription).join(';') : undefined,
  });
};
